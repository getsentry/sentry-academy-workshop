import { pgTable, text, varchar, timestamp, boolean, integer, decimal, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { sqliteTable, text as sqliteText, integer as sqliteInteger, real } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

const isSqlite = process.env.DATABASE_URL?.startsWith('sqlite:');

// Enums for PostgreSQL
export const userRoleEnum = pgEnum('user_role', ['student', 'instructor', 'admin']);
export const courseLevelEnum = pgEnum('course_level', ['beginner', 'intermediate', 'advanced']);
export const courseStatusEnum = pgEnum('course_status', ['draft', 'published', 'archived']);
export const lessonTypeEnum = pgEnum('lesson_type', ['video', 'text', 'quiz', 'assignment']);

// SQLite table definitions
const sqliteUsers = sqliteTable('users', {
  id: sqliteText('id').primaryKey().$defaultFn(() => createId()),
  email: sqliteText('email', { length: 255 }).notNull().unique(),
  name: sqliteText('name', { length: 255 }).notNull(),
  role: sqliteText('role').notNull().default('student'), // 'student', 'instructor', 'admin'
  avatarUrl: sqliteText('avatar_url'),
  bio: sqliteText('bio'),
  createdAt: sqliteInteger('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
  updatedAt: sqliteInteger('updated_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

const sqliteCourses = sqliteTable('courses', {
  id: sqliteText('id').primaryKey().$defaultFn(() => createId()),
  title: sqliteText('title', { length: 255 }).notNull(),
  slug: sqliteText('slug', { length: 255 }).notNull().unique(),
  description: sqliteText('description').notNull(),
  instructorId: sqliteText('instructor_id').notNull(),
  thumbnail: sqliteText('thumbnail'),
  category: sqliteText('category', { length: 100 }).notNull(),
  tags: sqliteText('tags'), // JSON string
  level: sqliteText('level').notNull(), // 'beginner', 'intermediate', 'advanced'
  status: sqliteText('status').notNull().default('draft'), // 'draft', 'published', 'archived'
  duration: sqliteText('duration', { length: 50 }),
  price: real('price').default(0),
  rating: real('rating').default(0),
  reviewCount: sqliteInteger('review_count').notNull().default(0),
  enrollmentCount: sqliteInteger('enrollment_count').notNull().default(0),
  isFeatured: sqliteInteger('is_featured', { mode: 'boolean' }).notNull().default(false),
  prerequisites: sqliteText('prerequisites'), // JSON string
  learningObjectives: sqliteText('learning_objectives'), // JSON string
  createdAt: sqliteInteger('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
  updatedAt: sqliteInteger('updated_at', { mode: 'timestamp' }).notNull().default(new Date()),
  publishedAt: sqliteInteger('published_at', { mode: 'timestamp' }),
});

const sqliteLessons = sqliteTable('lessons', {
  id: sqliteText('id').primaryKey().$defaultFn(() => createId()),
  courseId: sqliteText('course_id').notNull(),
  title: sqliteText('title', { length: 255 }).notNull(),
  slug: sqliteText('slug', { length: 255 }).notNull(),
  description: sqliteText('description'),
  type: sqliteText('type').notNull(), // 'video', 'text', 'quiz', 'assignment'
  content: sqliteText('content'),
  videoUrl: sqliteText('video_url'),
  duration: sqliteText('duration', { length: 50 }),
  order: sqliteInteger('order').notNull(),
  isFree: sqliteInteger('is_free', { mode: 'boolean' }).notNull().default(false),
  resources: sqliteText('resources'), // JSON string
  createdAt: sqliteInteger('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
  updatedAt: sqliteInteger('updated_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

const sqliteEnrollments = sqliteTable('enrollments', {
  id: sqliteText('id').primaryKey().$defaultFn(() => createId()),
  userId: sqliteText('user_id').notNull(),
  courseId: sqliteText('course_id').notNull(),
  enrolledAt: sqliteInteger('enrolled_at', { mode: 'timestamp' }).notNull().default(new Date()),
  completedAt: sqliteInteger('completed_at', { mode: 'timestamp' }),
  lastAccessedAt: sqliteInteger('last_accessed_at', { mode: 'timestamp' }),
  progress: sqliteInteger('progress').notNull().default(0),
  certificateId: sqliteText('certificate_id'),
});

const sqliteLessonProgress = sqliteTable('lesson_progress', {
  id: sqliteText('id').primaryKey().$defaultFn(() => createId()),
  userId: sqliteText('user_id').notNull(),
  lessonId: sqliteText('lesson_id').notNull(),
  enrollmentId: sqliteText('enrollment_id').notNull(),
  completedAt: sqliteInteger('completed_at', { mode: 'timestamp' }),
  timeSpent: sqliteInteger('time_spent').notNull().default(0),
  lastPosition: sqliteInteger('last_position').default(0),
  notes: sqliteText('notes'),
  createdAt: sqliteInteger('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
  updatedAt: sqliteInteger('updated_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

const sqliteReviews = sqliteTable('reviews', {
  id: sqliteText('id').primaryKey().$defaultFn(() => createId()),
  userId: sqliteText('user_id').notNull(),
  courseId: sqliteText('course_id').notNull(),
  rating: sqliteInteger('rating').notNull(),
  comment: sqliteText('comment'),
  createdAt: sqliteInteger('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
  updatedAt: sqliteInteger('updated_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

const sqliteCategories = sqliteTable('categories', {
  id: sqliteText('id').primaryKey().$defaultFn(() => createId()),
  name: sqliteText('name', { length: 100 }).notNull().unique(),
  slug: sqliteText('slug', { length: 100 }).notNull().unique(),
  description: sqliteText('description'),
  icon: sqliteText('icon', { length: 50 }),
  order: sqliteInteger('order').notNull().default(0),
  createdAt: sqliteInteger('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

const sqliteCertificates = sqliteTable('certificates', {
  id: sqliteText('id').primaryKey().$defaultFn(() => createId()),
  userId: sqliteText('user_id').notNull(),
  courseId: sqliteText('course_id').notNull(),
  enrollmentId: sqliteText('enrollment_id').notNull(),
  certificateUrl: sqliteText('certificate_url'),
  issuedAt: sqliteInteger('issued_at', { mode: 'timestamp' }).notNull().default(new Date()),
  expiresAt: sqliteInteger('expires_at', { mode: 'timestamp' }),
});

// PostgreSQL table definitions (existing)
const pgUsers = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('student'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const pgCourses = pgTable('courses', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  instructorId: text('instructor_id').notNull().references(() => pgUsers.id),
  thumbnail: text('thumbnail'),
  category: varchar('category', { length: 100 }).notNull(),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  level: courseLevelEnum('level').notNull(),
  status: courseStatusEnum('status').notNull().default('draft'),
  duration: varchar('duration', { length: 50 }),
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

const pgLessons = pgTable('lessons', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  courseId: text('course_id').notNull().references(() => pgCourses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  type: lessonTypeEnum('type').notNull(),
  content: text('content'),
  videoUrl: text('video_url'),
  duration: varchar('duration', { length: 50 }),
  order: integer('order').notNull(),
  isFree: boolean('is_free').notNull().default(false),
  resources: jsonb('resources').$type<{ title: string; url: string; type: string }[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const pgEnrollments = pgTable('enrollments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => pgUsers.id),
  courseId: text('course_id').notNull().references(() => pgCourses.id),
  enrolledAt: timestamp('enrolled_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  lastAccessedAt: timestamp('last_accessed_at'),
  progress: integer('progress').notNull().default(0),
  certificateId: text('certificate_id'),
});

const pgLessonProgress = pgTable('lesson_progress', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => pgUsers.id),
  lessonId: text('lesson_id').notNull().references(() => pgLessons.id),
  enrollmentId: text('enrollment_id').notNull().references(() => pgEnrollments.id),
  completedAt: timestamp('completed_at'),
  timeSpent: integer('time_spent').notNull().default(0),
  lastPosition: integer('last_position').default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const pgReviews = pgTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => pgUsers.id),
  courseId: text('course_id').notNull().references(() => pgCourses.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const pgCategories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

const pgCertificates = pgTable('certificates', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => pgUsers.id),
  courseId: text('course_id').notNull().references(() => pgCourses.id),
  enrollmentId: text('enrollment_id').notNull().references(() => pgEnrollments.id),
  certificateUrl: text('certificate_url'),
  issuedAt: timestamp('issued_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
});

// Export the appropriate tables based on database type
export const users = isSqlite ? sqliteUsers : pgUsers;
export const courses = isSqlite ? sqliteCourses : pgCourses;
export const lessons = isSqlite ? sqliteLessons : pgLessons;
export const enrollments = isSqlite ? sqliteEnrollments : pgEnrollments;
export const lessonProgress = isSqlite ? sqliteLessonProgress : pgLessonProgress;
export const reviews = isSqlite ? sqliteReviews : pgReviews;
export const categories = isSqlite ? sqliteCategories : pgCategories;
export const certificates = isSqlite ? sqliteCertificates : pgCertificates;