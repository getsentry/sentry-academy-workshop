import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  Users,
  BookOpen,
  Star,
  Award,
  Bookmark,
  Share2,
  CheckCircle,
  UserMinus
} from 'lucide-react';
import { Lesson } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import LessonList from '../components/lessons/LessonList';
import LessonContent from '../components/lessons/LessonContent';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { useEnrollment } from '../hooks/useEnrollment';

const CourseDetailPage: React.FC = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const getCourse = useCallback(() => api.courses.getById(courseId), [courseId]);
  const { data: course, loading } = useApi(getCourse);

  // Use the enrollment hook
  const { isEnrolled, enrollment, loading: enrollmentLoading, enroll, unenroll } = useEnrollment(courseId);

  // Fallback to static data if API fails or course not found
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!course) return;

    // Set the first lesson as active by default
    if (course.lessons && course.lessons.length > 0 && !activeLesson) {
      setActiveLesson(course.lessons[0]);
    }
  }, [course, activeLesson]);

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleSelectLesson = (lessonId: string) => {
    const lesson = course.lessons?.find((l: Lesson) => l.id === lessonId);
    if (lesson) {
      setActiveLesson(lesson);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would update the user's favorites in the database
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      await enroll();
      alert('Successfully enrolled in the course!');
    } catch (error) {
      alert('Failed to enroll in the course. Please try again.');
    }
  };

  const handleUnenroll = async () => {
    if (!confirm('Are you sure you want to unenroll from this course?')) {
      return;
    }

    try {
      await unenroll();
      alert('Successfully unenrolled from the course.');
    } catch (error) {
      alert('Failed to unenroll from the course. Please try again.');
    }
  };

  const renderEnrollmentButton = () => {
    if (!isAuthenticated) {
      return (
        <Button
          leftIcon={<BookOpen size={16} />}
          onClick={() => navigate('/login')}
        >
          Login to Enroll
        </Button>
      );
    }

    if (isEnrolled) {
      return (
        <div className="flex gap-3">
          <Button
            leftIcon={<BookOpen size={16} />}
            onClick={() => navigate(`/courses/${courseId}/learn`)}
          >
            Continue Learning
          </Button>
          <Button
            variant="outline"
            leftIcon={<UserMinus size={16} />}
            onClick={handleUnenroll}
            disabled={enrollmentLoading}
          >
            {enrollmentLoading ? 'Processing...' : 'Unenroll'}
          </Button>
        </div>
      );
    }

    return (
      <Button
        leftIcon={<BookOpen size={16} />}
        onClick={handleEnroll}
        disabled={enrollmentLoading}
      >
        {enrollmentLoading ? 'Enrolling...' : 'Enroll Now'}
      </Button>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/courses')}>
            Browse All Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="primary">{course.category}</Badge>
              <Badge
                variant={getLevelBadgeVariant(course.level)}
                className="flex items-center"
              >
                <Award className="h-3 w-3 mr-1" />
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </Badge>
              {isEnrolled && (
                <Badge variant="success" className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enrolled
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>

            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration}
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {course.lessons?.length || 0} lessons
              </div>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current mr-1" />
                <span>{course.rating}</span>
                <span className="text-gray-600 ml-1">({course.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{course.enrollmentCount} students</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {renderEnrollmentButton()}

              <Button
                variant="outline"
                leftIcon={<Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />}
                onClick={toggleBookmark}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>

              <Button
                variant="ghost"
                leftIcon={<Share2 size={16} />}
              >
                Share
              </Button>
            </div>

            {/* Progress bar for enrolled users */}
            {isEnrolled && enrollment && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-900">Course Progress</span>
                  <span className="text-sm text-blue-700">{enrollment.progress || 0}% complete</span>
                </div>
                <div className="bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${enrollment.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Preview section */}
          <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video mb-8 flex items-center justify-center">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8">
                <BookOpen className="h-16 w-16 text-white opacity-50 mx-auto mb-4" />
                <p className="text-white text-lg">Preview this course content</p>
              </div>
            )}
          </div>

          {/* Lesson Content */}
          {activeLesson && (
            <LessonContent lesson={activeLesson} />
          )}

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold mb-4">About this course</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>

            {course.learningObjectives && course.learningObjectives.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2">What you'll learn</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                  {course.learningObjectives.map((objective: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {course.prerequisites && course.prerequisites.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2">Prerequisites</h3>
                <ul className="space-y-2 text-gray-700">
                  {course.prerequisites.map((prereq: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {prereq}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Instructor</h2>
              <Button variant="outline" size="sm">View Profile</Button>
            </div>

            <div className="flex items-center">
              <img
                src={course.instructorAvatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"}
                alt={course.instructor}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold text-lg">{course.instructor}</h3>
                <p className="text-gray-600">Senior Software Engineer & Instructor</p>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.enrollmentCount} students</span>
                </div>
              </div>
            </div>

            {course.instructorBio && (
              <p className="mt-4 text-gray-700">{course.instructorBio}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 sticky top-6">
            <LessonList
              lessons={course.lessons || []}
              activeLessonId={activeLesson?.id}
              completedLessons={[]}
              onSelectLesson={handleSelectLesson}
            />

            <div className="p-6 border-t border-gray-100">
              {renderEnrollmentButton()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;