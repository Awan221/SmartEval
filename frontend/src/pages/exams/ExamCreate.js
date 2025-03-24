import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import ExamForm from '../../components/professor/ExamForm';
import { createExam } from '../../services/exams';

export default function ExamCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (examData) => {
    try {
      setLoading(true);
      const newExam = await createExam(examData);
      navigate(`/exams/${newExam.id}`);
    } catch (error) {
      console.error('Error creating exam:', error);
      setError('Erreur lors de la création de l\'examen.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Créer un nouvel examen
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ExamForm onSubmit={handleSubmit} buttonText="Créer l'examen" />
        )}
      </Paper>
    </Layout>
  );
}