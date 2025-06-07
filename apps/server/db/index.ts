import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import pool from '../db-config';

export const db = drizzle(pool, { schema });

export const {
  users,
  courses,
  lessons,
  enrollments,
  lessonProgress,
  reviews,
  categories,
  certificates,
  userRoleEnum,
  courseLevelEnum,
  courseStatusEnum,
  lessonTypeEnum
} = schema;