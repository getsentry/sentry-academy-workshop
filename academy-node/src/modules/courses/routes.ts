import express from 'express';
import { db } from '../../../db';
import { courses, lessons, users, categories } from '../../../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import * as Sentry from '@sentry/node';

const { logger } = Sentry;

export const courseRoutes = express.Router();

// Get all courses
courseRoutes.get('/courses', async (req, res) => {
  try {
    const { category, level, featured } = req.query;

    // TRACE: Most detailed logging for request parameters
    logger.trace('Incoming request parameters', {
      query: req.query,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });

    const conditions = [];
    if (category) conditions.push(eq(courses.category, category as string));
    if (level)
      conditions.push(
        eq(courses.level, level as 'beginner' | 'intermediate' | 'advanced')
      );
    if (featured === 'true') conditions.push(eq(courses.isFeatured, true));

    // DEBUG: Detailed information about query construction
    logger.debug('Building course query', {
      category,
      level,
      featured,
      conditions: conditions.length
    });

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    console.log('Building query with conditions:', conditions.length);

    const courseList = await db
      .select({
        id: courses.id,
        title: courses.title,
        slug: courses.slug,
        description: courses.description,
        instructor: users.name,
        instructorId: courses.instructorId,
        thumbnail: courses.thumbnail,
        category: courses.category,
        tags: courses.tags,
        level: courses.level,
        duration: courses.duration,
        price: courses.price,
        rating: courses.rating,
        reviewCount: courses.reviewCount,
        enrollmentCount: courses.enrollmentCount,
        isFeatured: courses.isFeatured,
        createdAt: courses.createdAt,
        publishedAt: courses.publishedAt,
      })
      .from(courses)
      .leftJoin(users, eq(courses.instructorId, users.id))
      .where(whereClause)
      .orderBy(desc(courses.createdAt));

    // INFO: General information about successful operation
    logger.info('Courses retrieved successfully', {
      count: courseList.length,
      filters: { category, level, featured }
    });

    res.json(courseList);
  } catch (error) {
    // ERROR: Error logging with context
    logger.error('Failed to retrieve courses', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ error: 'Failed to retrieve courses' });
  }
});

// Get categories - MOVED BEFORE /:id route to prevent conflicts
courseRoutes.get('/courses/categories', async (req, res) => {
  try {
    const categoryList = await db
      .select()
      .from(categories)
      .orderBy(categories.order, categories.name);

    res.json(categoryList);
  } catch (error) {
    console.error('Database error in categories route:', error);
    res
      .status(500)
      .json({ error: 'Failed to retrieve categories from database' });
  }
});

// Get single course by ID
courseRoutes.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // DEBUG: Detailed information about course retrieval
    logger.debug('Fetching course details', {
      courseId: id,
      timestamp: new Date().toISOString()
    });

    const course = await db
      .select({
        id: courses.id,
        title: courses.title,
        slug: courses.slug,
        description: courses.description,
        instructor: users.name,
        instructorId: courses.instructorId,
        instructorBio: users.bio,
        instructorAvatar: users.avatarUrl,
        thumbnail: courses.thumbnail,
        category: courses.category,
        tags: courses.tags,
        level: courses.level,
        duration: courses.duration,
        price: courses.price,
        rating: courses.rating,
        reviewCount: courses.reviewCount,
        enrollmentCount: courses.enrollmentCount,
        isFeatured: courses.isFeatured,
        prerequisites: courses.prerequisites,
        learningObjectives: courses.learningObjectives,
        createdAt: courses.createdAt,
        publishedAt: courses.publishedAt,
      })
      .from(courses)
      .leftJoin(users, eq(courses.instructorId, users.id))
      .where(eq(courses.id, id))
      .limit(1);

    if (!course.length) {
      // WARN: Non-critical issue - course not found
      logger.warn('Course not found', {
        courseId: id,
        timestamp: new Date().toISOString()
      });
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    // Get lessons for this course
    const courseLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, id))
      .orderBy(lessons.order);

    // INFO: Successful course retrieval
    logger.info('Course retrieved successfully', {
      courseId: id,
      lessonCount: courseLessons.length
    });

    res.json({
      ...course[0],
      lessons: courseLessons,
    });
  } catch (error) {
    // ERROR: Error logging with context
    logger.error('Failed to retrieve course', {
      courseId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ error: 'Failed to retrieve course' });
  }
});

// Create a new course (for instructors/admins)
courseRoutes.post('/courses', async (req, res) => {
  try {
    const { body } = req;
    const courseId = createId();
    const slug = body.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // DEBUG: Detailed information about course creation
    logger.debug('Creating new course', {
      courseId,
      title: body.title,
      instructorId: body.instructorId
    });

    const newCourse = await db
      .insert(courses)
      .values({
        id: courseId,
        title: body.title,
        slug,
        description: body.description,
        instructorId: body.instructorId,
        thumbnail: body.thumbnail,
        category: body.category,
        tags: body.tags || [],
        level: body.level,
        duration: body.duration,
        price: body.price || '0',
        prerequisites: body.prerequisites || [],
        learningObjectives: body.learningObjectives || [],
      })
      .returning();

    // INFO: Successful course creation
    logger.info('Course created successfully', {
      courseId: newCourse[0].id,
      title: newCourse[0].title
    });

    res.status(201).json(newCourse[0]);
  } catch (error) {
    // FATAL: Critical error in course creation
    logger.fatal('Critical error creating course', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      requestBody: req.body
    });
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course
courseRoutes.put('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    // DEBUG: Detailed information about update operation
    logger.debug('Updating course', {
      courseId: id,
      updateFields: Object.keys(body)
    });

    const updatedCourse = await db
      .update(courses)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id))
      .returning();

    if (!updatedCourse.length) {
      // WARN: Non-critical issue - course not found for update
      logger.warn('Course not found for update', {
        courseId: id,
        timestamp: new Date().toISOString()
      });
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    // INFO: Successful course update
    logger.info('Course updated successfully', {
      courseId: id,
      updatedFields: Object.keys(body)
    });

    res.json(updatedCourse[0]);
  } catch (error) {
    // ERROR: Error logging with context
    logger.error('Failed to update course', {
      courseId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      updateData: req.body
    });
    res.status(500).json({ error: 'Failed to update course' });
  }
});
