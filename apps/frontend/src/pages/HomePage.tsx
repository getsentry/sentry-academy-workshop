import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import FeaturedCourses from '../components/courses/FeaturedCourses';
import StatisticsSection from '../components/home/StatisticsSection';
import TestimonialSection from '../components/home/TestimonialSection';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const getFeaturedCourses = useCallback(
    () => api.courses.getAll({ featured: 'true' }),
    []
  );
  
  const { data: featuredCourses, loading, error } = useApi(getFeaturedCourses);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6">
      <HeroSection />
      
      <StatisticsSection />
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-cyan mx-auto shadow-neon-cyan"></div>
          <p className="mt-4 text-cyber-text-muted">Loading courses...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-cyber-pink">Failed to load courses. Please try again later.</p>
        </div>
      ) : (
        <FeaturedCourses courses={featuredCourses || []} />
      )}
      
      <div className="py-16 bg-cyber-card rounded-xl my-12 border border-cyber-cyan/20">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-cyber-text mb-4 font-cyber text-glow-cyan">
            Start Your Learning Journey Today
          </h2>
          <p className="text-lg text-cyber-text-muted mb-8">
            Join thousands of developers who are mastering observability and software 
            development with our expert-led courses.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/courses')}
            variant="primary"
            className="animate-pulse-glow"
          >
            Browse All Courses
          </Button>
        </div>
      </div>
      
      <TestimonialSection />
      
      <div className="bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-xl my-12 text-cyber-text overflow-hidden border border-cyber-cyan/30 shadow-neon-purple relative">
        <div className="absolute inset-0 bg-cyber-dark/20"></div>
        <div className="md:flex md:items-center relative z-10">
          <div className="p-10 md:p-16 md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 font-cyber text-glow-cyan">
              Ready to advance your career with in-demand skills?
            </h2>
            <p className="text-cyber-text-muted mb-8">
              Our courses cover the latest techniques in observability, error tracking, 
              and software development best practices.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/signup')}
              className="hover:shadow-neon-cyan"
            >
              Sign up for free
            </Button>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto relative">
            <img
              src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg"
              alt="Developer coding"
              className="absolute inset-0 w-full h-full object-cover opacity-80 rounded-r-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-cyber-purple/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;