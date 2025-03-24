import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PublishedWithChanges as PublishIcon,
  Unpublished as UnpublishIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import { getExams, deleteExam, publishExam, unpublishExam } from '../../services/exams';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ExamList() {
  const { isProfessor } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  
  useEffect(() => {
    fetchExams();
  }, []);
  
  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await getExams();
      setExams(response.results || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (exam) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!examToDelete) return;
    
    try {
      await deleteExam(examToDelete.id);
      setExams(exams.filter(exam => exam.id !== examToDelete.id));
      setDeleteDialogOpen(false);
      setExamToDelete(null);
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setExamToDelete(null);
  };
  
  const handlePublishToggle = async (exam) => {
    try {
      if (exam.is_published) {
        await unpublishExam(exam.id);
      } else {
        await publishExam(exam.id);
      }
      
      // Update the exam in the list
      setExams(exams.map(e => 
        e.id === exam.id ? { ...e, is_published: !e.is_published } : e
      ));
    } catch (error) {
      console.error('Error toggling exam publish status:', error);
    }
  };
  
  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          {isProfessor ? 'Mes examens' : 'Examens disponibles'}
        </Typography>
        
        {isProfessor && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/exams/create')}
          >
            Créer un examen
          </Button>
        )}
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : exams.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Format</TableCell>
                {isProfessor && <TableCell>Statut</TableCell>}
                <TableCell>Date limite</TableCell>
                <TableCell>Questions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell component="th" scope="row">
                    {exam.title}
                  </TableCell>
                  <TableCell>
                    {exam.description.length > 50
                      ? `${exam.description.substring(0, 50)}...`
                      : exam.description}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={exam.format === 'text' ? 'Texte' :
                             exam.format === 'markdown' ? 'Markdown' :
                             exam.format === 'latex' ? 'LaTeX' : 'PDF'}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  {isProfessor && (
                    <TableCell>
                      <Chip
                        label={exam.is_published ? 'Publié' : 'Brouillon'}
                        color={exam.is_published ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    {exam.deadline
                      ? format(new Date(exam.deadline), 'PPP à HH:mm', { locale: fr })
                      : 'Pas de date limite'}
                  </TableCell>
                  <TableCell>{exam.question_count}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Voir">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/exams/${exam.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {isProfessor && (
                      <>
                        <Tooltip title="Modifier">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/exams/${exam.id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={exam.is_published ? 'Dépublier' : 'Publier'}>
                          <IconButton
                            color={exam.is_published ? 'warning' : 'success'}
                            onClick={() => handlePublishToggle(exam)}
                          >
                            {exam.is_published ? <UnpublishIcon /> : <PublishIcon />}
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Supprimer">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(exam)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            {isProfessor
              ? "Vous n'avez pas encore créé d'examen."
              : "Aucun examen n'est disponible pour le moment."}
          </Typography>
          
          {isProfessor && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/exams/create')}
              sx={{ mt: 2 }}
            >
              Créer votre premier examen
            </Button>
          )}
        </Paper>
      )}
      
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'examen "{examToDelete?.title}" ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}