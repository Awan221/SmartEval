import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { 
  Assignment as AssignmentIcon, 
  School as SchoolIcon, 
  Assessment as AssessmentIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import { getExams } from '../../services/exams';
import { getSubmissions } from '../../services/submissions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Dashboard() {
  const { user, isProfessor, isStudent } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
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
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const renderProfessorDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5" component="div">
                Examens
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ mb: 1 }}>
              {exams.length}
            </Typography>
            <Typography color="text.secondary">
              examens créés
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate('/exams')}>
              Voir tous les examens
            </Button>
          </CardActions>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5" component="div">
                Soumissions
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ mb: 1 }}>
              {submissions.length}
            </Typography>
            <Typography color="text.secondary">
              soumissions reçues
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate('/submissions')}>
              Voir toutes les soumissions
            </Button>
          </CardActions>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5" component="div">
                Rapports
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Accédez aux statistiques et analyses des performances des étudiants.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate('/reports')}>
              Voir les rapports
            </Button>
          </CardActions>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dernières soumissions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : submissions.length > 0 ? (
            <List>
              {submissions.slice(0, 5).map((submission) => (
                <ListItem
                  key={submission.id}
                  button
                  onClick={() => navigate(`/submissions/${submission.id}`)}
                  divider
                >
                  <ListItemText
                    primary={`${submission.student_name} - ${submission.exam_title}`}
                    secondary={`Soumis le ${format(new Date(submission.submitted_at), 'PPP à HH:mm', { locale: fr })} - Statut: ${submission.status}`}
                  />
                  {submission.total_score !== null && (
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {submission.total_score}/20
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 2 }}>
              Aucune soumission pour le moment.
            </Typography>
          )}
          
          {submissions.length > 5 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/submissions')}>
                Voir toutes les soumissions
              </Button>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
  
  const renderStudentDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5" component="div">
                Examens disponibles
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ mb: 1 }}>
              {exams.length}
            </Typography>
            <Typography color="text.secondary">
              examens à compléter
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate('/exams')}>
              Voir les examens
            </Button>
          </CardActions>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5" component="div">
                Mes soumissions
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ mb: 1 }}>
              {submissions.length}
            </Typography>
            <Typography color="text.secondary">
              soumissions effectuées
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate('/my-submissions')}>
              Voir mes soumissions
            </Button>
          </CardActions>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Examens à venir
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : exams.length > 0 ? (
            <List>
              {exams.slice(0, 5).map((exam) => (
                <ListItem
                  key={exam.id}
                  button
                  onClick={() => navigate(`/exams/${exam.id}`)}
                  divider
                >
                  <ListItemText
                    primary={exam.title}
                    secondary={`Professeur: ${exam.professor_name} - ${exam.deadline ? `Date limite: ${format(new Date(exam.deadline), 'PPP à HH:mm', { locale: fr })}` : 'Pas de date limite'}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 2 }}>
              Aucun examen disponible pour le moment.
            </Typography>
          )}
          
          {exams.length > 5 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/exams')}>
                Voir tous les examens
              </Button>
            </Box>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mes dernières soumissions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : submissions.length > 0 ? (
            <List>
              {submissions.slice(0, 5).map((submission) => (
                <ListItem
                  key={submission.id}
                  button
                  onClick={() => navigate(`/my-submissions/${submission.id}`)}
                  divider
                >
                  <ListItemText
                    primary={submission.exam_title}
                    secondary={`Soumis le ${format(new Date(submission.submitted_at), 'PPP à HH:mm', { locale: fr })} - Statut: ${submission.status}`}
                  />
                  {submission.total_score !== null && (
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {submission.total_score}/20
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 2 }}>
              Vous n'avez pas encore soumis de réponse.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
  
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tableau de bord
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Bienvenue, {user?.first_name} {user?.last_name}
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : isProfessor ? (
        renderProfessorDashboard()
      ) : isStudent ? (
        renderStudentDashboard()
      ) : (
        <Typography>Rôle non reconnu</Typography>
      )}
    </Layout>
  );
}