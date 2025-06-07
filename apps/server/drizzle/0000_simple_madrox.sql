CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`slug` text(100) NOT NULL,
	`description` text,
	`icon` text(50),
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT '"2025-06-07T01:28:43.738Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_id` text NOT NULL,
	`enrollment_id` text NOT NULL,
	`certificate_url` text,
	`issued_at` integer DEFAULT '"2025-06-07T01:28:43.738Z"' NOT NULL,
	`expires_at` integer
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`description` text NOT NULL,
	`instructor_id` text NOT NULL,
	`thumbnail` text,
	`category` text(100) NOT NULL,
	`tags` text,
	`level` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`duration` text(50),
	`price` real DEFAULT 0,
	`rating` real DEFAULT 0,
	`review_count` integer DEFAULT 0 NOT NULL,
	`enrollment_count` integer DEFAULT 0 NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`prerequisites` text,
	`learning_objectives` text,
	`created_at` integer DEFAULT '"2025-06-07T01:28:43.737Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-07T01:28:43.737Z"' NOT NULL,
	`published_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_slug_unique` ON `courses` (`slug`);--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_id` text NOT NULL,
	`enrolled_at` integer DEFAULT '"2025-06-07T01:28:43.738Z"' NOT NULL,
	`completed_at` integer,
	`last_accessed_at` integer,
	`progress` integer DEFAULT 0 NOT NULL,
	`certificate_id` text
);
--> statement-breakpoint
CREATE TABLE `lesson_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`enrollment_id` text NOT NULL,
	`completed_at` integer,
	`time_spent` integer DEFAULT 0 NOT NULL,
	`last_position` integer DEFAULT 0,
	`notes` text,
	`created_at` integer DEFAULT '"2025-06-07T01:28:43.738Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-07T01:28:43.738Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`title` text(255) NOT NULL,
	`slug` text(255) NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`content` text,
	`video_url` text,
	`duration` text(50),
	`order` integer NOT NULL,
	`is_free` integer DEFAULT false NOT NULL,
	`resources` text,
	`created_at` integer DEFAULT '"2025-06-07T01:28:43.738Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-07T01:28:43.738Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` integer DEFAULT '"2025-06-07T01:28:43.738Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-07T01:28:43.738Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text(255) NOT NULL,
	`name` text(255) NOT NULL,
	`role` text DEFAULT 'student' NOT NULL,
	`avatar_url` text,
	`bio` text,
	`created_at` integer DEFAULT '"2025-06-07T01:28:43.736Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-07T01:28:43.736Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);