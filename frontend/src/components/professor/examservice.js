// This file handles API communication for exams
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Helper function to create form data from exam object
const createExamFormData = (examData) => {
  const formData = new FormData()

  // Add basic exam fields
  formData.append("title", examData.title)
  formData.append("description", examData.description)
  formData.append("format", examData.format)

  // Only add content if it's not a PDF
  if (["text", "markdown", "latex"].includes(examData.format)) {
    formData.append("content", examData.content)
  }

  // Add deadline if it exists
  if (examData.deadline) {
    formData.append("deadline", examData.deadline.toISOString())
  }

  // Add file if it exists and format is PDF
  if (examData.format === "pdf" && examData.file) {
    formData.append("file", examData.file)
  }

  return formData
}

export const createExam = async (examData) => {
  try {
    // First create the exam
    const formData = createExamFormData(examData)

    // Log the form data for debugging
    console.log("Sending exam data:", Object.fromEntries(formData.entries()))

    const response = await axios.post(`${API_URL}/exams/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })

    console.log("Exam created successfully:", response.data)

    // If we have questions and the exam was created successfully
    if (examData.questions && examData.questions.length > 0 && response.data.id) {
      // Create each question separately
      const examId = response.data.id
      console.log(`Creating ${examData.questions.length} questions for exam ID ${examId}`)

      const questionPromises = examData.questions.map((question) =>
        axios.post(
          `${API_URL}/questions/`,
          {
            ...question,
            exam: examId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        ),
      )

      // Wait for all questions to be created
      await Promise.all(questionPromises)
      console.log("All questions created successfully")
    }

    return response.data
  } catch (error) {
    console.error("Error creating exam:", error.response?.data || error.message)
    throw error
  }
}

