import { pgTable, text, varchar, timestamp, boolean, integer, decimal, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'instructor', 'admin']);
export const courseLevelEnum = pgEnum('course_level', ['beginner', 'intermediate', 'advanced']);
export const courseStatusEnum = pgEnum('course_status', ['draft', 'published', 'archived']);
export const lessonTypeEnum = pgEnum('lesson_type', ['video', 'text', 'quiz', 'assignment']);

// Users table (mock auth for now)
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('student'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Courses table
export const courses = pgTable('courses', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  instructorId: text('instructor_id').notNull().references(() => users.id),
  thumbnail: text('thumbnail'),
  category: varchar('category', { length: 100 }).notNull(),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  level: courseLevelEnum('level').notNull(),
  status: courseStatusEnum('status').notNull().default('draft'),
  duration: varchar('duration', { length: 50 }), // e.g., "8 hours"
  price: decimal('price', { precision: 10, scale: 2 }).default('0'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount: integer('review_count').notNull().default(0),
  enrollmentCount: integer('enrollment_count').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  prerequisites: jsonb('prerequisites').$type<string[]>().default([]),
  learningObjectives: jsonb('learning_objectives').$type<string[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  publishedAt: timestamp('published_at'),
});

// Lessons table
export const lessons = pgTable('lessons', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  type: lessonTypeEnum('type').notNull(),
  content: text('content'), // For text lessons
  videoUrl: text('video_url'), // For video lessons
  duration: varchar('duration', { length: 50 }), // e.g., "45 min"
  order: integer('order').notNull(),
  isFree: boolean('is_free').notNull().default(false),
  resources: jsonb('resources').$type<{ title: string; url: string; type: string }[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Enrollments table
export const enrollments = pgTable('enrollments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id),
  courseId: text('course_id').notNull().references(() => courses.id),
  enrolledAt: timestamp('enrolled_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  lastAccessedAt: timestamp('last_accessed_at'),
  progress: integer('progress').notNull().default(0), // Percentage 0-100
  certificateId: text('certificate_id'),
});

// Progress tracking table
export const lessonProgress = pgTable('lesson_progress', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id),
  lessonId: text('lesson_id').notNull().references(() => lessons.id),
  enrollmentId: text('enrollment_id').notNull().references(() => enrollments.id),
  completedAt: timestamp('completed_at'),
  timeSpent: integer('time_spent').notNull().default(0), // in seconds
  lastPosition: integer('last_position').default(0), // for video resume
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Reviews table
export const reviews = pgTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id),
  courseId: text('course_id').notNull().references(() => courses.id),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Categories table (for organized course browsing)
export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }), // Icon name or emoji
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Certificates table
export const certificates = pgTable('certificates', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id),
  courseId: text('course_id').notNull().references(() => courses.id),
  enrollmentId: text('enrollment_id').notNull().references(() => enrollments.id),
  certificateUrl: text('certificate_url'),
  issuedAt: timestamp('issued_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
});