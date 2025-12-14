import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/admin/Users';
import Kriteria from './pages/admin/Kriteria';
import CreateQuestion from './pages/admin/CreateQuestion';
import QuestionList from './pages/admin/QuestionList';
import ExamList from './pages/admin/ExamList';
import ExamForm from './pages/admin/ExamForm';
import NotFound from './pages/NotFound';

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

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Users />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/kriteria"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Kriteria />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/questions/create"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateQuestion />
                  </MainLayout>
                </ProtectedRoute>

              }
            />
            <Route
              path="/admin/questions"
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
              path="/admin/exams"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ExamList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exams/create"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ExamForm />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exams/edit/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ExamForm />
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
