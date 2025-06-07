// @ts-nocheck
import { db, users, courses, lessons, categories } from './index';
import { createId } from '@paralleldrive/cuid2';

async function seedSimple() {
  console.log('🌱 Starting simple database seed...');
  
  const now = Date.now();
  
  try {
    // Create categories
    const categoriesData = [
      { name: 'Observability', slug: 'observability', icon: '🔍', order: 1 },
      { name: 'Error Handling', slug: 'error-handling', icon: '🐛', order: 2 },
      { name: 'Performance', slug: 'performance', icon: '⚡', order: 3 },
    ];
    
    console.log('Creating categories...');
    for (const cat of categoriesData) {
      await db.insert(categories).values({
        id: createId(),
        ...cat,
        description: `Learn about ${cat.name} best practices`,
        createdAt: now,
      });
    }
    
    // Create demo user (student)
    const demoUserId = createId();
    console.log('Creating demo user...');
    await db.insert(users).values({
      id: demoUserId,
      email: 'demo@student.com',
      name: 'Demo Student',
      role: 'student',
      bio: 'A demo student for testing enrollment functionality',
      createdAt: now,
      updatedAt: now,
    });
    
    // Create instructors
    const instructor1Id = createId();
    const instructor2Id = createId();
    
    console.log('Creating instructors...');
    await db.insert(users).values([
      {
        id: instructor1Id,
        email: 'instructor1@sentryacademy.com',
        name: 'John Instructor',
        role: 'instructor',
        bio: 'Senior Developer Advocate specializing in observability',
        avatarUrl: 'https://ui-avatars.com/api/?name=JI&background=0ea5e9&color=fff&size=128',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: instructor2Id,
        email: 'instructor2@sentryacademy.com',
        name: 'Jane Expert',
        role: 'instructor',
        bio: 'Error tracking expert with 10+ years of experience',
        avatarUrl: 'https://ui-avatars.com/api/?name=JE&background=22c55e&color=fff&size=128',
        createdAt: now,
        updatedAt: now,
      }
    ]);
    
    // Create courses
    const course1Id = createId();
    const course2Id = createId();
    const course3Id = createId();
    
    console.log('Creating courses...');
    await db.insert(courses).values([
      {
        id: course1Id,
        title: 'Fundamentals of Observability',
        slug: 'fundamentals-of-observability',
        description: 'Learn the core concepts of observability and how to implement them in your applications.',
        instructorId: instructor1Id,
        thumbnail: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
        category: 'Observability',
        tags: JSON.stringify(['monitoring', 'logs', 'metrics', 'tracing']),
        level: 'beginner',
        duration: '8 hours',
        price: 49.99,
        rating: 4.9,
        reviewCount: 128,
        enrollmentCount: 0,
        isFeatured: 1,
        status: 'published',
        prerequisites: JSON.stringify([]),
        learningObjectives: JSON.stringify([
          'Understanding observability principles',
          'Setting up monitoring systems',
          'Creating effective dashboards'
        ]),
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      },
      {
        id: course2Id,
        title: 'Advanced Error Tracking',
        slug: 'advanced-error-tracking',
        description: 'Master the art of error tracking and debugging in complex applications.',
        instructorId: instructor2Id,
        thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg',
        category: 'Error Handling',
        tags: JSON.stringify(['errors', 'debugging', 'exceptions', 'troubleshooting']),
        level: 'intermediate',
        duration: '10 hours',
        price: 79.99,
        rating: 4.8,
        reviewCount: 95,
        enrollmentCount: 0,
        isFeatured: 1,
        status: 'published',
        prerequisites: JSON.stringify(['Basic JavaScript knowledge']),
        learningObjectives: JSON.stringify([
          'Advanced error handling techniques',
          'Setting up error monitoring',
          'Debugging complex issues'
        ]),
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      },
      {
        id: course3Id,
        title: 'Performance Optimization Techniques',
        slug: 'performance-optimization-techniques',
        description: 'Learn how to identify and resolve performance bottlenecks in your applications.',
        instructorId: instructor1Id,
        thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
        category: 'Performance',
        tags: JSON.stringify(['optimization', 'profiling', 'metrics', 'bottlenecks']),
        level: 'advanced',
        duration: '12 hours',
        price: 99.99,
        rating: 4.7,
        reviewCount: 83,
        enrollmentCount: 0,
        isFeatured: 0,
        status: 'published',
        prerequisites: JSON.stringify(['Experience with web applications']),
        learningObjectives: JSON.stringify([
          'Performance monitoring strategies',
          'Identifying bottlenecks',
          'Optimization techniques'
        ]),
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      }
    ]);
    
    // Create lessons for each course
    const lessonsData = [
      // Course 1 lessons
      {
        courseId: course1Id,
        title: 'Introduction to Observability',
        slug: 'introduction-to-observability',
        description: 'Understanding the fundamentals of observability.',
        type: 'video',
        duration: '30 min',
        order: 1,
        isFree: 1,
      },
      {
        courseId: course1Id,
        title: 'Setting Up Monitoring',
        slug: 'setting-up-monitoring',
        description: 'Learn how to set up effective monitoring systems.',
        type: 'text',
        content: '# Setting Up Monitoring\n\nIn this lesson, we will cover...',
        duration: '45 min',
        order: 2,
        isFree: 0,
      },
      // Course 2 lessons
      {
        courseId: course2Id,
        title: 'Error Handling Basics',
        slug: 'error-handling-basics',
        description: 'Understanding error handling fundamentals.',
        type: 'video',
        duration: '40 min',
        order: 1,
        isFree: 1,
      },
      {
        courseId: course2Id,
        title: 'Advanced Debugging Techniques',
        slug: 'advanced-debugging-techniques',
        description: 'Master advanced debugging strategies.',
        type: 'text',
        content: '# Advanced Debugging\n\nLet\'s explore advanced debugging techniques...',
        duration: '60 min',
        order: 2,
        isFree: 0,
      },
      // Course 3 lessons
      {
        courseId: course3Id,
        title: 'Performance Fundamentals',
        slug: 'performance-fundamentals',
        description: 'Understanding performance optimization basics.',
        type: 'video',
        duration: '35 min',
        order: 1,
        isFree: 1,
      },
    ];
    
    console.log('Creating lessons...');
    for (const lesson of lessonsData) {
      await db.insert(lessons).values({
        id: createId(),
        ...lesson,
        resources: JSON.stringify([]),
        createdAt: now,
        updatedAt: now,
      });
    }
    
    console.log('✅ Simple database seed completed successfully!');
    console.log(`Demo user created: demo@student.com (ID: ${demoUserId})`);
    console.log('Created 3 courses with sample lessons');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seedSimple();