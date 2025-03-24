import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  //fetchSubmissions
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getSubmissions, evaluateSubmission } from '../../services/submissions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function SubmissionList() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState({});
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchSubmissions();
  }, []);
  
 const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getSubmissions();
      setSubmissions(response.results || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Erreur lors du chargement des soumissions.');
    } finally {
      setLoading(false);
    }
  };
  /*const fetchSubmissions = async (submissionId) => {
    try {
      setLoading(true);
      const data = await getSubmissions(submissionId);
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submission:', error);
      setError('Erreur lors du chargement de la soumission.');
    } finally {
      setLoading(false);
    }
  };*/
  
  
  const handleEvaluate = async (id) => {
    try {
      setEvaluating(prev => ({ ...prev, [id]: true }));
      await evaluateSubmission(id);
      // Refresh the submissions list
      fetchSubmissions();
    } catch (error) {
      console.error('Error evaluating submission:', error);
    } finally {
      setEvaluating(prev => ({ ...prev, [id]: false }));
    }
  };
  /*const handleEvaluate = async () => {
    try {
      console.log('Evaluating submission:', id);
      setEvaluating(true);
      await evaluateSubmission(id);
      // Refresh the submission data
      fetchSubmission(id);
    } catch (error) {
      console.error('Error evaluating submission:', error);
      setError('Erreur lors de l\'évaluation de la soumission.');
    } finally {
      setEvaluating(false);
    }
  };*/
  
  
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
  
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Soumissions des étudiants
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : submissions.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Étudiant</TableCell>
                <TableCell>Examen</TableCell>
                <TableCell>Date de soumission</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Note</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.student_name}</TableCell>
                  <TableCell>{submission.exam_title}</TableCell>
                  <TableCell>
                    {format(new Date(submission.submitted_at), 'PPP à HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(submission.status)}
                      color={getStatusColor(submission.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {submission.total_score !== null ? (
                      <Typography variant="body2" fontWeight="bold">
                        {submission.total_score}/20
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Non évalué
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Voir">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/submissions/${submission.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {submission.status !== 'completed' && (
                      <Tooltip title="Évaluer">
                        <IconButton
                          color="secondary"
                          onClick={() => handleEvaluate(submission.id)}
                          disabled={evaluating[submission.id] || submission.status === 'evaluating'}
                        >
                          {evaluating[submission.id] ? (
                            <CircularProgress size={24} />
                          ) : (
                            <RefreshIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            Aucune soumission pour le moment.
          </Typography>
        </Paper>
      )}
    </Layout>
  );
}