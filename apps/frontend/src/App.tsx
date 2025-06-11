import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserStateProvider } from './contexts/UserStateContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyCoursesPage from './pages/MyCoursesPage';
import FavoritesPage from './pages/FavoritesPage';
import LessonPlansPage from './pages/LessonPlansPage';
import ProfilePage from './pages/ProfilePage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserStateProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route path="/" element={<MainLayout />}>
                <Route index element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } />

                <Route path="courses" element={
                  <ProtectedRoute>
                    <CoursesPage />
                  </ProtectedRoute>
                } />

                <Route path="courses/:courseId" element={
                  <ProtectedRoute>
                    <CourseDetailPage />
                  </ProtectedRoute>
                } />

                <Route path="my-courses" element={
                  <ProtectedRoute>
                    <MyCoursesPage />
                  </ProtectedRoute>
                } />

                <Route path="favorites" element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                } />

                <Route path="lesson-plans" element={
                  <ProtectedRoute>
                    <LessonPlansPage />
                  </ProtectedRoute>
                } />

                <Route path="profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </UserStateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;