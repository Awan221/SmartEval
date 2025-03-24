import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  Divider, 
  CircularProgress,
  Alert,
  Grid,
  fetchExam
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import { getExam } from '../../services/exams';
import SubmissionForm from '../../components/student/SubmissionForm';
import { createSubmission } from '../../services/submissions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Markdown from 'markdown-to-jsx';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ExamDetail() {
  const { id } = useParams();
  const { isProfessor, isStudent } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  
  useEffect(() => {
    fetchExam();
  }, [id]);
  
  const fetchExam = async () => {
    try {
      setLoading(true);
      const data = await getExam(id);
      setExam(data);
    } catch (error) {
      console.error('Error fetching exam:', error);
      setError('Erreur lors du chargement de l\'examen.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (submissionData) => {
    try {
      setSubmitting(true);
      await createSubmission(submissionData);
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/my-submissions');
      }, 2000);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Erreur lors de la soumission de votre réponse.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  
  const renderExamContent = () => {
    if (exam.format === 'text') {
      return (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {exam.content}
        </Typography>
      );
    } else if (exam.format === 'markdown') {
      return (
        <Box sx={{ '& img': { maxWidth: '100%' } }}>
          <Markdown>{exam.content}</Markdown>
        </Box>
      );
    } else if (exam.format === 'latex') {
      // For simplicity, we're just rendering LaTeX as plain text
      // In a real app, you would use a LaTeX renderer like KaTeX or MathJax
      return (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {exam.content}
        </Typography>
      );
    } else if (exam.format === 'pdf' && exam.file) {
      return (
        <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 1 }}>
          <Document
            file={exam.file}
            onLoadSuccess={onDocumentLoadSuccess}
            error={
              <Alert severity="error">
                Impossible de charger le fichier PDF.
              </Alert>
            }
            loading={
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            }
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={600}
              />
            ))}
          </Document>
        </Box>
      );
    } else {
      return (
        <Alert severity="warning">
          Aucun contenu disponible pour cet examen.
        </Alert>
      );
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </Layout>
    );
  }
  
  if (!exam) {
    return (
      <Layout>
        <Alert severity="warning">
          Examen non trouvé.
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Retour
        </Button>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {exam.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Retour
          </Button>
          
          {isProfessor && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/exams/${id}/edit`)}
            >
              Modifier
            </Button>
          )}
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contenu de l'examen
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {renderExamContent()}
            
            {exam.questions && exam.questions.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Questions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {exam.questions.map((question, index) => (
                  <Box key={question.id} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Question {index + 1} ({question.points} points)
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {question.text}
                    </Typography>
                    <Divider />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Professeur
              </Typography>
              <Typography variant="body1">
                {exam.professor_name}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Format
              </Typography>
              <Chip
                label={exam.format === 'text' ? 'Texte' :
                       exam.format === 'markdown' ? 'Markdown' :
                       exam.format === 'latex' ? 'LaTeX' : 'PDF'}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Date de création
              </Typography>
              <Typography variant="body1">
                {format(new Date(exam.created_at), 'PPP', { locale: fr })}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Date limite
              </Typography>
              <Typography variant="body1">
                {exam.deadline
                  ? format(new Date(exam.deadline), 'PPP à HH:mm', { locale: fr })
                  : 'Pas de date limite'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Nombre de questions
              </Typography>
              <Typography variant="body1">
                {exam.questions ? exam.questions.length : 0}
              </Typography>
            </Box>
          </Paper>
          
          {isStudent && exam.is_published && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Soumettre une réponse
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {submitSuccess ? (
                <Alert severity="success">
                  Votre réponse a été soumise avec succès. Vous allez être redirigé vers vos soumissions.
                </Alert>
              ) : (
                <>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Téléchargez votre fichier PDF contenant vos réponses à toutes les questions.
                  </Typography>
                  
                  <SubmissionForm
                    examId={exam.id}
                    onSubmit={handleSubmit}
                    loading={submitting}
                  />
                </>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}