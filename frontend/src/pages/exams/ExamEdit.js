import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Alert,
  CircularProgress,
  fetchExam
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import ExamForm from '../../components/professor/ExamForm';
import { getExam, updateExam } from '../../services/exams';

export default function ExamEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
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
  
  const handleSubmit = async (examData) => {
    try {
      setSaving(true);
      await updateExam(id, examData);
      navigate(`/exams/${id}`);
    } catch (error) {
      console.error('Error updating exam:', error);
      setError('Erreur lors de la mise à jour de l\'examen.');
    } finally {
      setSaving(false);
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
          Modifier l'examen
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        {saving ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ExamForm 
            initialValues={exam} 
            onSubmit={handleSubmit} 
            buttonText="Enregistrer les modifications" 
          />
        )}
      </Paper>
    </Layout>
  );
}