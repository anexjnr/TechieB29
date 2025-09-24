-- SQL schema generated to mirror prisma/schema.prisma
-- Run this file with: psql <connection_string> -f prisma/init.sql

-- Enable uuid generation (pgcrypto) for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Role enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
    CREATE TYPE role AS ENUM ('ADMIN', 'EDITOR', 'HR');
  END IF;
END$$;

-- Assets table
CREATE TABLE IF NOT EXISTS asset (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  filename text NOT NULL,
  mime text NOT NULL,
  data bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_user (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role role NOT NULL DEFAULT 'ADMIN',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- About
CREATE TABLE IF NOT EXISTS about (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  heading text NOT NULL,
  content text NOT NULL,
  image_id text REFERENCES asset(id) ON DELETE SET NULL,
  enabled boolean NOT NULL DEFAULT true
);

-- Services
CREATE TABLE IF NOT EXISTS service (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  description text NOT NULL,
  icon text,
  enabled boolean NOT NULL DEFAULT true
);

-- Projects
CREATE TABLE IF NOT EXISTS project (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  description text NOT NULL,
  image_id text REFERENCES asset(id) ON DELETE SET NULL,
  enabled boolean NOT NULL DEFAULT true
);

-- News
CREATE TABLE IF NOT EXISTS news (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_id text REFERENCES asset(id) ON DELETE SET NULL,
  date timestamptz NOT NULL DEFAULT now(),
  enabled boolean NOT NULL DEFAULT true
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonial (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  author text NOT NULL,
  role text,
  quote text NOT NULL,
  avatar_id text REFERENCES asset(id) ON DELETE SET NULL,
  enabled boolean NOT NULL DEFAULT true
);

-- Jobs
CREATE TABLE IF NOT EXISTS job (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  location text,
  type text,
  description text NOT NULL,
  enabled boolean NOT NULL DEFAULT true
);

-- Sections
CREATE TABLE IF NOT EXISTS section (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key text NOT NULL UNIQUE,
  heading text,
  content text,
  image_id text REFERENCES asset(id) ON DELETE SET NULL,
  enabled boolean NOT NULL DEFAULT true,
  "order" integer
);

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_news_date ON news (date DESC);

-- Contact inquiries
CREATE TABLE IF NOT EXISTS contact_inquiry (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text,
  email text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Job applications
CREATE TABLE IF NOT EXISTS application (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text,
  email text,
  position text,
  resume_asset_id text REFERENCES asset(id) ON DELETE SET NULL,
  applied_at timestamptz NOT NULL DEFAULT now()
);

-- Policies / legal docs
CREATE TABLE IF NOT EXISTS policy_document (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  content text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Serve steps (How We Serve workflow)
CREATE TABLE IF NOT EXISTS serve_step (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  description text NOT NULL,
  "order" integer
);

-- Scheduled posts (News scheduling)
CREATE TABLE IF NOT EXISTS scheduled_post (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  news_id text REFERENCES news(id) ON DELETE CASCADE,
  publish_at timestamptz,
  status text DEFAULT 'scheduled'
);

-- End of schema
