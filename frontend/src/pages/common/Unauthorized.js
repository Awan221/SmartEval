import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 500,
        }}
      >
        <Typography variant="h1" color="error" sx={{ mb: 2, fontWeight: 'bold' }}>
          403
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Accès refusé. Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/dashboard"
          sx={{ mt: 2 }}
        >
          Retour au tableau de bord
        </Button>
      </Paper>
    </Box>
  );
}