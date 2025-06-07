import * as schema from './schema';
import { db } from '../db-config';

export { db };

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