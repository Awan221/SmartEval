import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Avatar, 
  Grid, 
  Divider, 
  Alert,
  CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      profile_picture: null,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('Prénom requis'),
      last_name: Yup.string().required('Nom requis'),
      email: Yup.string().email('Email invalide').required('Email requis'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        const formData = new FormData();
        formData.append('first_name', values.first_name);
        formData.append('last_name', values.last_name);
        
        if (values.profile_picture) {
          formData.append('profile_picture', values.profile_picture);
        }
        
        await updateProfile(formData);
        setSuccess(true);
      } catch (err) {
        setError(err.detail || 'Erreur lors de la mise à jour du profil.');
      } finally {
        setLoading(false);
      }
    },
  });
  
  const handleFileChange = (event) => {
    formik.setFieldValue('profile_picture', event.currentTarget.files[0]);
  };
  
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mon profil
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profil mis à jour avec succès.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={user?.profile_picture}
              alt={`${user?.first_name} ${user?.last_name}`}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            
            <Button
              variant="outlined"
              component="label"
              sx={{ mb: 2 }}
            >
              Changer la photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            
            <Typography variant="body2" color="text.secondary">
              {formik.values.profile_picture ? formik.values.profile_picture.name : 'Aucun fichier sélectionné'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Informations personnelles
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="first_name"
                    name="first_name"
                    label="Prénom"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                    helperText={formik.touched.first_name && formik.errors.first_name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="last_name"
                    name="last_name"
                    label="Nom"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                    helperText={formik.touched.last_name && formik.errors.last_name}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    disabled
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="role"
                    name="role"
                    label="Rôle"
                    value={user?.role === 'professor' ? 'Professeur' : user?.role === 'student' ? 'Étudiant' : user?.role}
                    disabled
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}