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
import TeacherRanking from './pages/teacher/TeacherRanking';
import StudentExamAttempts from './pages/teacher/StudentExamAttempts';

// Student Pages
import StudentExamList from './pages/student/StudentExamList';
import TakeExam from './pages/student/TakeExam';
import ExamResult from './pages/student/ExamResult';
import StudentRanking from './pages/student/StudentRanking';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Role-Based Redirect Component
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  const redirectPath = user?.role === 'siswa' ? '/student/latihan' : '/dashboard';
  return <Navigate to={redirectPath} replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    // Redirect based on user role
    const redirectPath = user?.role === 'siswa' ? '/student/latihan' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
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
                  <RoleBasedRedirect />
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
              path="/teacher/ranking"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeacherRanking />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/exam-attempts"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StudentExamAttempts />
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

            <Route
              path="/student/ranking"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StudentRanking />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/latihan/result"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ExamResult />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/latihan/result/:attemptId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ExamResult />
                  </MainLayout>
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
