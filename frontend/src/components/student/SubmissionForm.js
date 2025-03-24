import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';

const SubmissionForm = ({ examId, onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema: Yup.object({
      file: Yup.mixed()
        .required('Un fichier est requis')
        .test(
          'fileFormat',
          'Seuls les fichiers PDF sont acceptés',
          (value) => value && value.type === 'application/pdf'
        ),
    }),
    onSubmit: (values) => {
      onSubmit({
        examId,
        file: values.file,
      });
    },
  });
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    onDrop: (acceptedFiles) => {
      formik.setFieldValue('file', acceptedFiles[0]);
    },
  });
  
  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          border: '2px dashed #ccc',
          borderRadius: 2,
          textAlign: 'center',
          cursor: 'pointer',
          mb: 3,
        }}
      >
        <input {...getInputProps()} />
        {formik.values.file ? (
          <Typography>{formik.values.file.name}</Typography>
        ) : (
          <Typography>Glissez et déposez votre fichier PDF ici, ou cliquez pour sélectionner un fichier</Typography>
        )}
      </Paper>
      {formik.touched.file && formik.errors.file && (
        <FormHelperText error>{formik.errors.file}</FormHelperText>
      )}
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !formik.values.file}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Soumettre'}
      </Button>
    </Box>
  );
};

export default SubmissionForm;