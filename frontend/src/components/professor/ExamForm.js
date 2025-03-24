"use client"
//import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
  Divider,
  FormHelperText,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { fr } from "date-fns/locale"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useDropzone } from "react-dropzone"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { createExam } from "./examservice"
import { SafeUnmountProvider, useSafeOperation } from "./safe-unmount-provider"

// Wrap the main component with SafeUnmountProvider
const ExamFormWrapper = (props) => (
  <SafeUnmountProvider>
    <ExamFormInner {...props} />
  </SafeUnmountProvider>
)

const ExamFormInner = ({ initialValues, onSubmit, buttonText = "Enregistrer" }) => {
  const [questions, setQuestions] = useState(initialValues?.questions || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  //const navigate = useNavigate()


  // Use our safe operation hook
  const safeOperation = useSafeOperation()

  const validationSchema = Yup.object({
    title: Yup.string().required("Le titre est requis"),
    description: Yup.string(),
    format: Yup.string().required("Le format est requis"),
    deadline: Yup.date().nullable(),
    // Conditionally require content based on format
    content: Yup.string().when("format", {
      is: (val) => ["text", "markdown", "latex"].includes(val),
      then: () => Yup.string().required("Le contenu est requis"),
      otherwise: () => Yup.string().notRequired(),
    }),
    // Conditionally require file based on format
    file: Yup.mixed().when("format", {
      is: "pdf",
      then: () => (initialValues?.file ? Yup.mixed().notRequired() : Yup.mixed().required("Un fichier PDF est requis")),
      otherwise: () => Yup.mixed().notRequired(),
    }),
  })

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      content: initialValues?.content || "",
      format: initialValues?.format || "text",
      file: null,
      deadline: initialValues?.deadline ? new Date(initialValues.deadline) : null,
      is_published: initialValues?.is_published || false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        setError(null)

        // Combine form values with questions
        const examData = { ...values, questions }

        // Use our service to create the exam
        await createExam(examData)

        // Use safeOperation to update state only if component is still mounted
        safeOperation(() => {
          setSuccess(true)
          setLoading(false)

          // Call the parent component's onSubmit if provided
          if (onSubmit) {
            onSubmit(examData)
          }
//          navigate("../../pages/exams/ExamList")
        })
      } catch (err) {
        console.error("Error submitting form:", err)

        // Use safeOperation to update state only if component is still mounted
        safeOperation(() => {
          setError(err.response?.data || "Une erreur est survenue lors de la création de l'examen")
          setLoading(false)
        })
      }
    },
  })

  // Clean up any pending state updates when component unmounts
  useEffect(() => {
    return () => {
      // This empty cleanup function ensures React doesn't try to update state after unmount
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("file", acceptedFiles[0])
    },
  })

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        points: 1,
        order: questions.length,
        model_answer: "",
      },
    ])
  }

  const removeQuestion = (index) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    // Update order for remaining questions
    newQuestions.forEach((q, i) => {
      q.order = i
    })
    setQuestions(newQuestions)
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const handleCloseSnackbar = () => {
    setSuccess(false)
  }

  return (
    <div>
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === "string" ? error : "Une erreur est survenue. Veuillez vérifier vos données."}
        </Alert>
      )}

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Examen créé avec succès"
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Titre"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={2}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="format-label">Format</InputLabel>
            <Select
              labelId="format-label"
              id="format"
              name="format"
              value={formik.values.format}
              onChange={(e) => {
                // Clear content if switching to PDF
                if (e.target.value === "pdf") {
                  formik.setFieldValue("content", "")
                }
                // Clear file if switching from PDF
                if (formik.values.format === "pdf") {
                  formik.setFieldValue("file", null)
                }
                formik.handleChange(e)
              }}
              label="Format"
            >
              <MenuItem value="text">Texte</MenuItem>
              <MenuItem value="markdown">Markdown</MenuItem>
              <MenuItem value="latex">LaTeX</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
            <DateTimePicker
              label="Date limite"
              value={formik.values.deadline}
              onChange={(value) => formik.setFieldValue("deadline", value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: formik.touched.deadline && Boolean(formik.errors.deadline),
                  helperText: formik.touched.deadline && formik.errors.deadline,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {["text", "markdown", "latex"].includes(formik.values.format) && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="content"
              name="content"
              label="Contenu"
              multiline
              rows={10}
              value={formik.values.content}
              onChange={formik.handleChange}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content}
            />
          </Grid>
        )}

        {formik.values.format === "pdf" && (
          <Grid item xs={12}>
            <Paper
              {...getRootProps()}
              sx={{
                p: 2,
                border: "2px dashed #ccc",
                borderRadius: 2,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              {formik.values.file ? (
                <Typography>{formik.values.file.name}</Typography>
              ) : initialValues?.file ? (
                <Typography>Fichier actuel: {initialValues.file.split("/").pop()}</Typography>
              ) : (
                <Typography>Glissez et déposez un fichier PDF ici, ou cliquez pour sélectionner un fichier</Typography>
              )}
            </Paper>
            {formik.touched.file && formik.errors.file && <FormHelperText error>{formik.errors.file}</FormHelperText>}
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Questions</Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addQuestion}>
              Ajouter une question
            </Button>
          </Box>

          {questions.map((question, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="subtitle1">Question {index + 1}</Typography>
                    <IconButton color="error" onClick={() => removeQuestion(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Texte de la question"
                    multiline
                    rows={3}
                    value={question.text}
                    onChange={(e) => updateQuestion(index, "text", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Points"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    value={question.points}
                    onChange={(e) => updateQuestion(index, "points", Number.parseInt(e.target.value, 10))}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Réponse modèle"
                    multiline
                    rows={3}
                    value={question.model_answer}
                    onChange={(e) => updateQuestion(index, "model_answer", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2 }}>
            {loading ? <CircularProgress size={24} /> : buttonText}
          </Button>
        </Grid>
      </Grid>
    </Box>
    </div>
  )
}

// Export the wrapped component
export default ExamFormWrapper

