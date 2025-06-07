import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './useAuth';

interface UseEnrollmentResult {
  isEnrolled: boolean;
  enrollment: any | null;
  loading: boolean;
  enroll: () => Promise<void>;
  unenroll: () => Promise<void>;
  checkEnrollmentStatus: () => Promise<void>;
}

export const useEnrollment = (courseId: string): UseEnrollmentResult => {
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkEnrollmentStatus = async () => {
    if (!user?.id || !courseId) {
      setIsEnrolled(false);
      setEnrollment(null);
      return;
    }

    try {
      const userEnrollments = await api.enrollments.getUserEnrollments(user.id);
      const courseEnrollment = userEnrollments.find(
        (enrollment) => enrollment.courseId === courseId
      );

      if (courseEnrollment) {
        setIsEnrolled(true);
        setEnrollment(courseEnrollment);
      } else {
        setIsEnrolled(false);
        setEnrollment(null);
      }
    } catch (error) {
      console.error('Failed to check enrollment status:', error);
      setIsEnrolled(false);
      setEnrollment(null);
    }
  };

  const enroll = async () => {
    if (!user?.id || !courseId) {
      throw new Error('User must be logged in to enroll');
    }

    setLoading(true);
    try {
      const newEnrollment = await api.enrollments.create(courseId, user.id);
      setIsEnrolled(true);
      setEnrollment(newEnrollment);
    } catch (error) {
      console.error('Failed to enroll:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unenroll = async () => {
    if (!enrollment?.id) {
      throw new Error('No enrollment found to remove');
    }

    setLoading(true);
    try {
      await api.enrollments.delete(enrollment.id);
      setIsEnrolled(false);
      setEnrollment(null);
    } catch (error) {
      console.error('Failed to unenroll:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkEnrollmentStatus();
  }, [user?.id, courseId]);

  return {
    isEnrolled,
    enrollment,
    loading,
    enroll,
    unenroll,
    checkEnrollmentStatus,
  };
};