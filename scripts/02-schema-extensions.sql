-- Add new tables for invitations and instructor documentation

-- Instructor Documentation Table
CREATE TABLE IF NOT EXISTS instructor_documentation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL,
  licence_number VARCHAR(255),
  licence_expiry DATE,
  vehicle_registration VARCHAR(20),
  vehicle_insurance_expiry DATE,
  dbs_certificate_expiry DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
  UNIQUE(instructor_id)
);

-- Student Invitations Table
CREATE TABLE IF NOT EXISTS student_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined
  invitation_code VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days',
  accepted_at TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);

-- Instructor Codes Table (for unique instructor identification)
CREATE TABLE IF NOT EXISTS instructor_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE, -- e.g., MIKE-HARRISON-42
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);

-- Student Join Requests Table (when student uses instructor code)
CREATE TABLE IF NOT EXISTS student_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  instructor_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
  UNIQUE(student_id, instructor_id)
);

-- Lesson Packages Table (for custom packages)
CREATE TABLE IF NOT EXISTS lesson_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  hours INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  savings DECIMAL(10, 2) DEFAULT 0,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);

-- Add instructor_code column to instructors table if it doesn't exist
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS instructor_code VARCHAR(50) UNIQUE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invitations_instructor ON student_invitations(instructor_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_student ON student_join_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_instructor ON student_join_requests(instructor_id);
CREATE INDEX IF NOT EXISTS idx_packages_instructor ON lesson_packages(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_codes_code ON instructor_codes(code);
