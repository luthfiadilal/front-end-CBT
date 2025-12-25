import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

import NotFound from './pages/NotFound';
import Users from './pages/teacher/Users';
import Kriteria from './pages/teacher/Kriteria';
import CreateQuestion from './pages/teacher/CreateQuestion';
import QuestionList from './pages/teacher/QuestionList';
import ExamList from './pages/teacher/ExamList';
import ExamForm from './pages/teacher/ExamForm';

// Student Pages
import StudentExamList from './pages/student/StudentExamList';
import TakeExam from './pages/student/TakeExam';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />



            {/* Teacher Routes */}
            <Route
              path="/teacher/users"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Users />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/kriteria"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Kriteria />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/questions/create"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateQuestion />
                  </MainLayout>
                </ProtectedRoute>

              }
            />
            <Route
              path="/teacher/questions/edit/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateQuestion />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/questions"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <QuestionList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Exam Management Routes */}
            <Route
              path="/teacher/exams"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ExamList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/exams/create"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ExamForm />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/exams/edit/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ExamForm />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="teacher/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/latihan"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StudentExamList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/latihan/take/:examId"
              element={
                <ProtectedRoute>
                  <TakeExam />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </AuthProvider>
    </Router >
  );
}

export default App;
