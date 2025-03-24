import json
import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self, base_url=None, model=None):
        self.base_url = base_url or settings.OLLAMA_BASE_URL
        self.model = model or settings.OLLAMA_MODEL
        self.generate_endpoint = f"{self.base_url}/api/generate"
    
    def generate(self, prompt, system_prompt=None, temperature=0.7, max_tokens=2048):
        """
        Generate a response from the Ollama model, handling streaming output.
        """
        payload = {
            "model": self.model,
            "prompt": prompt,
            "temperature": temperature,
            "max_tokens": max_tokens,
            }
        if system_prompt:
            payload["system"] = system_prompt
        
        try:
            response = requests.post(self.generate_endpoint, json=payload, stream=True)
            response.raise_for_status()
            
            full_response = ""
            for line in response.iter_lines():
                if line:
                    try:
                        data = json.loads(line.decode("utf-8"))
                        if "response" in data:
                            full_response += data["response"]  # Concaténer le texte généré
                    except json.JSONDecodeError as e:
                        logger.error(f"Erreur de parsing JSON : {e}")

            return {"response": full_response}
    
        except requests.exceptions.RequestException as e:
            logger.error(f"Error calling Ollama API: {e}")
            raise
        

    def evaluate_answer(self, question, student_answer, model_answer=None):
        """
        Evaluate a student's answer using the Ollama model
        """
        system_prompt = """
        Tu es un assistant spécialisé dans l'évaluation des exercices de bases de données. 
        Ta tâche est d'évaluer la réponse d'un étudiant à une question sur les bases de données.
        Analyse la réponse de l'étudiant en fonction de la question posée.
        Si une réponse modèle est fournie, compare la réponse de l'étudiant avec celle-ci.
        
        Attribue une note sur 20 en fonction de la pertinence, de l'exactitude et de la complétude de la réponse.
        Fournis également un feedback détaillé expliquant les points forts et les points faibles de la réponse.
        
        Ton évaluation doit être structurée comme suit:
        - Note: [note sur 20]
        - Feedback: [feedback détaillé]
        """
    
        prompt = f"Question: {question},"
    
        if model_answer:
            prompt += f"Réponse modèle: {model_answer},"
    
        prompt += f"Réponse de l'étudiant: {student_answer},"
        prompt += "Évalue cette réponse et attribue une note sur 20."
    
        response = self.generate(prompt, system_prompt=system_prompt)
    
        # Parse la response
        response_text = response.get('response', '')

        # Extraire la note
        score_line = next((line for line in response_text.split('\n') if line.startswith('Note:')), None)
        score = None
        if score_line:
            try:
                score_text = score_line.replace('Note', '').strip()
                score = float(score_text.split('/')[0].strip())
            except (ValueError, IndexError):
                logger.warning(f"Could not parse score from: {score_line}")
    
        # Extraire le feedback
        feedback_start = response_text.find('Feedback')
        feedback = response_text[feedback_start:].replace('Feedback', '').strip() if feedback_start != -1 else response_text
    
        return {
            'score': score,
            'feedback': feedback,
            'raw_response': response_text
     }
