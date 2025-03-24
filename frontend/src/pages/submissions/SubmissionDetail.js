import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  Button, 
  Divider, 
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Alert,
  List,
  ListItem,
  //fetchSubmission
 // ListItemText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import { getSubmission, evaluateSubmission } from '../../services/submissions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function SubmissionDetail() {
  const { id } = useParams();
  const { isProfessor } = useAuth();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log('Fetching submission:', id);
    fetchSubmission();
  }, [id]);
  
  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const data = await getSubmission(id);
      setSubmission(data);
    } catch (error) {
      console.error('Error fetching submission:', error);
      setError('Erreur lors du chargement de la soumission.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEvaluate = async () => {
    try {
      console.log('Evaluating submission:', id);
      setEvaluating(true);
      await evaluateSubmission(id);
      // Refresh the submission data
      fetchSubmission();
    } catch (error) {
      console.error('Error evaluating submission:', error);
      setError('Erreur lors de l\'évaluation de la soumission.');
    } finally {
      setEvaluating(false);
    }
  };
  
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'evaluating':
        return 'warning';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'evaluating':
        return 'Évaluation en cours';
      case 'completed':
        return 'Évaluation terminée';
      case 'failed':
        return 'Échec de l\'évaluation';
      default:
        return status;
    }
  };
  
  if (loading) {
    return (
      <div>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      </Layout>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
      <Layout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </Layout>
      </div>
    );
  }
  
  if (!submission) {
    return (
      <div>
      <Layout>
        <Alert severity="warning">
          Soumission non trouvée.
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Retour
        </Button>
      </Layout>
      </div>
    );
  }
  
  return (
    <div>
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Détails de la soumission
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Retour
          </Button>
          
          {isProfessor && submission.status !== 'completed' && (
            <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEvaluate}
              disabled={evaluating || submission.status === 'evaluating'}
            >
              {evaluating ? <CircularProgress size={24} /> : 'Évaluer'}
            </Button>
            </div>
          )}
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Examen
              </Typography>
              <Typography variant="body1">
                {submission.exam_title}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Étudiant
              </Typography>
              <Typography variant="body1">
                {submission.student_name}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Date de soumission
              </Typography>
              <Typography variant="body1">
                {format(new Date(submission.submitted_at), 'PPP à HH:mm', { locale: fr })}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Statut
              </Typography>
              <Chip
                label={getStatusLabel(submission.status)}
                color={getStatusColor(submission.status)}
                sx={{ mt: 0.5 }}
              />
            </Box>
            
            {submission.total_score !== null && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Note finale
                </Typography>
                <Typography variant="h4" color="primary" sx={{ mt: 0.5 }}>
                  {submission.total_score}/20
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fichier soumis
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 1, mb: 3 }}>
              <Document
                file={submission.file}
                onLoadSuccess={onDocumentLoadSuccess}
                error={
                  <Alert severity="error">
                    Impossible de charger le fichier PDF.
                  </Alert>
                }
                loading={
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                    </Box>
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
            
            {submission.answers && submission.answers.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Évaluation détaillée
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {submission.answers.map((answer) => (
                    <ListItem key={answer.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 0, mb: 3 }}>
                      <Card sx={{ width: '100%' }}>
                        <CardHeader
                          title={`Question ${answer.question_text.length > 50 ? answer.question_text.substring(0, 50) + '...' : answer.question_text}`}
                          subheader={answer.score !== null ? `Note: ${answer.score}/20` : 'Non évalué'}
                        />
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Feedback:
                          </Typography>
                          <Typography variant="body2">
                            {answer.feedback || 'Aucun feedback disponible.'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
    </div>
  );
}