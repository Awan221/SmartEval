import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { fr } from "date-fns/locale"

// Context
import { AuthProvider } from "./context/AuthContext"

// Components
import PrivateRoute from "./components/common/PrivateRoute"

// Pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Dashboard from "./pages/dashboard/Dashboard"
import ExamList from "./pages/exams/ExamList"
import ExamDetail from "./pages/exams/ExamDetail"
import ExamCreate from "./pages/exams/ExamCreate"
import ExamEdit from "./pages/exams/ExamEdit"
import SubmissionList from "./pages/submissions/SubmissionList"
import SubmissionDetail from "./pages/submissions/SubmissionDetail"
import StudentSubmissionList from "./pages/submissions/StudentSubmissionList"
import Profile from "./pages/profile/Profile"
import Reports from "./pages/reports/Reports"
import NotFound from "./pages/common/NotFound"
import Unauthorized from "./pages/common/Unauthorized"
import HomePage from "./components/home/HomePage"

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Private routes */}
              {/* Cette ligne n'est plus nécessaire car nous avons une page d'accueil */}
              {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Exam routes */}
              <Route
                path="/exams"
                element={
                  <PrivateRoute>
                    <ExamList />
                  </PrivateRoute>
                }
              />

              <Route
                path="/exams/:id"
                element={
                  <PrivateRoute>
                    <ExamDetail />
                  </PrivateRoute>
                }
              />

              <Route
                path="/exams/create"
                element={
                  <PrivateRoute roles={["professor"]}>
                    <ExamCreate />
                  </PrivateRoute>
                }
              />

              <Route
                path="/exams/:id/edit"
                element={
                  <PrivateRoute roles={["professor"]}>
                    <ExamEdit />
                  </PrivateRoute>
                }
              />

              {/* Submission routes */}
              <Route
                path="/submissions"
                element={
                  <PrivateRoute roles={["professor"]}>
                    <SubmissionList />
                  </PrivateRoute>
                }
              />

              <Route
                path="/submissions/:id"
                element={
                  <PrivateRoute roles={["professor"]}>
                    <SubmissionDetail />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-submissions"
                element={
                  <PrivateRoute roles={["student"]}>
                    <StudentSubmissionList />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-submissions/:id"
                element={
                  <PrivateRoute roles={["student"]}>
                    <SubmissionDetail />
                  </PrivateRoute>
                }
              />

              {/* Reports route */}
              <Route
                path="/reports"
                element={
                  <PrivateRoute roles={["professor"]}>
                    <Reports />
                  </PrivateRoute>
                }
              />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
