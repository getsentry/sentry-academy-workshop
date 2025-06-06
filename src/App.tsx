import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { AuthProvider } from './contexts/AuthContext';
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

// Create Sentry-wrapped Routes component
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

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

const NotFoundPage = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    const error = new Error(`Route not found: ${location.pathname}`);
    Sentry.captureException(error, {
      tags: {
        route: location.pathname,
        type: 'routing_error'
      }
    });
  }, [location]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-2">The page you're looking for doesn't exist.</p>
      <p className="text-sm text-gray-600">Attempted path: {location.pathname}</p>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <SentryRoutes>
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

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </SentryRoutes>
      </Router>
    </AuthProvider>
  );
};

export default App;