// Utility functions for debugging API requests and responses

/**
 * Log detailed information about a form submission
 */
export const logFormSubmission = (formData) => {
  console.group("Form Submission Data")
  console.log("Form entries:")

  // Log each form entry
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: File (${value.name}, ${value.type}, ${value.size} bytes)`)
    } else {
      console.log(`${key}: ${value}`)
    }
  }

  console.groupEnd()
}

/**
 * Log API error details
 */
export const logApiError = (error) => {
  console.group("API Error")

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log("Status:", error.response.status)
    console.log("Headers:", error.response.headers)
    console.log("Data:", error.response.data)
  } else if (error.request) {
    // The request was made but no response was received
    console.log("No response received:", error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error message:", error.message)
  }

  console.log("Error config:", error.config)
  console.groupEnd()
}

