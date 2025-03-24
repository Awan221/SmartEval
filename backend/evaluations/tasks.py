from celery import shared_task
import logging
from django.db import transaction
from django.utils import timezone
from submissions.models import Submission, Answer
from ollama_integration.ollama import OllamaClient
from PyPDF2 import PdfReader
import io

logger = logging.getLogger(__name__)

@shared_task
def evaluate_submission(submission_id):
    """
    Evaluate a student submission using the Ollama model
    """
    try:
        submission = Submission.objects.get(id=submission_id)
        
        # Update submission status
        submission.status = Submission.EVALUATING
        submission.save()
        
        # Extract text from PDF
        try:
            pdf_content = extract_text_from_pdf(submission.file)
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            submission.status = Submission.FAILED
            submission.save()
            return False
        
        # Initialize Ollama client
        ollama_client = OllamaClient()
        
        # Get questions from the exam
        questions = submission.exam.questions.all().order_by('order')
        
        # Evaluate each question
        total_score = 0
        total_points = 0
        
        with transaction.atomic():
            for question in questions:
                # For simplicity, we assume the PDF content is organized by question order
                # In a real implementation, you would need a more sophisticated way to match
                # questions with answers in the PDF
                
                # Create or get the answer object
                answer, created = Answer.objects.get_or_create(
                    submission=submission,
                    question=question,
                    defaults={'text': 'Extracted from PDF'}
                )
                
                # Evaluate the answer
                evaluation = ollama_client.evaluate_answer(
                    question=question.text,
                    student_answer=pdf_content,  # In a real implementation, you would extract the specific answer
                    model_answer=question.model_answer
                )
                
                # Update the answer with the evaluation results
                if evaluation['score'] is not None:
                    answer.score = evaluation['score']
                    answer.feedback = evaluation['feedback']
                    answer.save()
                    
                    # Add to total score
                    weighted_score = (evaluation['score'] / 20) * question.points
                    total_score += weighted_score
                    total_points += question.points
            
            # Calculate and update the total score
            if total_points > 0:
                submission.total_score = (total_score / total_points) * 20
            else:
                submission.total_score = 0
                
            submission.status = Submission.COMPLETED
            submission.save()
        
        return True
    
    except Exception as e:
        logger.error(f"Error evaluating submission {submission_id}: {e}")
        try:
            submission = Submission.objects.get(id=submission_id)
            submission.status = Submission.FAILED
            submission.save()
        except:
            pass
        return False

def extract_text_from_pdf(pdf_file):
    """
    Extract text from a PDF file
    """
    pdf_file.seek(0)
    pdf_reader = PdfReader(io.BytesIO(pdf_file.read()))
    text = ""
    
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    
    return text