"use client"

import { useState } from "react"
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material"
import axios from "axios"
import { SafeUnmountProvider, useSafeOperation } from "./safe-unmount-provider"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Wrap the component with SafeUnmountProvider
const EvaluateButtonWrapper = (props) => (
  <SafeUnmountProvider>
    <EvaluateButton {...props} />
  </SafeUnmountProvider>
)

const EvaluateButton = ({ submissionId, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Use our safe operation hook
  const safeOperation = useSafeOperation()

  const handleEvaluate = async () => {
    try {
      setLoading(true)
      setError(null)

      await axios.post(
        `${API_URL}/submissions/${submissionId}/evaluate/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      )

      // Use safeOperation to update state only if component is still mounted
      safeOperation(() => {
        setSuccess(true)
        setLoading(false)

        if (onSuccess) {
          onSuccess()
        }
      })
    } catch (err) {
      console.error("Error evaluating submission:", err)

      // Use safeOperation to update state only if component is still mounted
      safeOperation(() => {
        setError(err.response?.data || "Une erreur est survenue lors de l'évaluation")
        setLoading(false)
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSuccess(false)
    setError(null)
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleEvaluate}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? "Évaluation en cours..." : "Évaluer"}
      </Button>

      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {typeof error === "string" ? error : "Une erreur est survenue lors de l'évaluation"}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Évaluation démarrée avec succès"
      />
    </>
  )
}

export default EvaluateButtonWrapper
