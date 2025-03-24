import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Layout from '../../components/common/Layout';
import { getExams } from '../../services/exams';
import { getSubmissions } from '../../services/submissions';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Reports() {
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedExam, setSelectedExam] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch exams
      const examsResponse = await getExams();
      setExams(examsResponse.results || []);
      
      // Fetch submissions
      const submissionsResponse = await getSubmissions();
      setSubmissions(submissionsResponse.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };
  
  const getFilteredSubmissions = () => {
    if (selectedExam === 'all') {
      return submissions;
    }
    return submissions.filter(submission => submission.exam === parseInt(selectedExam));
  };
  
  const getScoreDistribution = () => {
    const filteredSubmissions = getFilteredSubmissions();
    const distribution = {
      '0-5': 0,
      '5-10': 0,
      '10-15': 0,
      '15-20': 0,
    };
    
    filteredSubmissions.forEach(submission => {
      if (submission.total_score !== null) {
        if (submission.total_score < 5) {
          distribution['0-5']++;
        } else if (submission.total_score < 10) {
          distribution['5-10']++;
        } else if (submission.total_score < 15) {
          distribution['10-15']++;
        } else {
          distribution['15-20']++;
        }
      }
    });
    
    return [
      { name: '0-5', value: distribution['0-5'] },
      { name: '5-10', value: distribution['5-10'] },
      { name: '10-15', value: distribution['10-15'] },
      { name: '15-20', value: distribution['15-20'] },
    ];
  };
  
  const getStatusDistribution = () => {
    const filteredSubmissions = getFilteredSubmissions();
    const distribution = {
      pending: 0,
      evaluating: 0,
      completed: 0,
      failed: 0,
    };
    
    filteredSubmissions.forEach(submission => {
      distribution[submission.status]++;
    });
    
    return [
      { name: 'En attente', value: distribution.pending },
      { name: 'En cours', value: distribution.evaluating },
      { name: 'Terminé', value: distribution.completed },
      { name: 'Échoué', value: distribution.failed },
    ];
  };
  
  const getAverageScores = () => {
    const filteredSubmissions = getFilteredSubmissions();
    const examScores = {};
    
    filteredSubmissions.forEach(submission => {
      if (submission.total_score !== null) {
        if (!examScores[submission.exam_title]) {
          examScores[submission.exam_title] = {
            total: 0,
            count: 0,
          };
        }
        examScores[submission.exam_title].total += submission.total_score;
        examScores[submission.exam_title].count++;
      }
    });
    
    return Object.keys(examScores).map(examTitle => ({
      name: examTitle,
      average: examScores[examTitle].total / examScores[examTitle].count,
    }));
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
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Rapports et Statistiques
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="exam-select-label">Examen</InputLabel>
            <Select
              labelId="exam-select-label"
              id="exam-select"
              value={selectedExam}
              label="Examen"
              onChange={handleExamChange}
            >
              <MenuItem value="all">Tous les examens</MenuItem>
              {exams.map((exam) => (
                <MenuItem key={exam.id} value={exam.id}>
                  {exam.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Résumé
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Nombre de soumissions
              </Typography>
              <Typography variant="h3" color="primary">
                {getFilteredSubmissions().length}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Soumissions évaluées
              </Typography>
              <Typography variant="h3" color="primary">
                {getFilteredSubmissions().filter(s => s.status === 'completed').length}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Note moyenne
              </Typography>
              <Typography variant="h3" color="primary">
                {getFilteredSubmissions().filter(s => s.total_score !== null).length > 0
                  ? (getFilteredSubmissions()
                      .filter(s => s.total_score !== null)
                      .reduce((acc, s) => acc + s.total_score, 0) / 
                      getFilteredSubmissions().filter(s => s.total_score !== null).length
                    ).toFixed(2)
                  : 'N/A'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Typography variant="h6" gutterBottom>
          Distribution des notes
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getScoreDistribution()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Nombre d'étudiants" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getScoreDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getScoreDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
        
        <Typography variant="h6" gutterBottom>
          Statut des soumissions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getStatusDistribution()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Nombre de soumissions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStatusDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {getStatusDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
        
        {selectedExam === 'all' && (
          <>
            <Typography variant="h6" gutterBottom>
              Notes moyennes par examen
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data= {getAverageScores()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 20]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" name="Note moyenne" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </Paper>
    </Layout>
  );
}