-- Instructor documents verification system
-- Run this migration to add document verification tables

-- Document types enum-like table for reference
CREATE TABLE IF NOT EXISTS document_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  required BOOLEAN DEFAULT true
);

-- Insert required document types
INSERT INTO document_types (id, name, description, required) VALUES
  ('drivers_license', 'Driving License', 'Valid UK driving license', true),
  ('adi_license', 'ADI License Number', 'Approved Driving Instructor license number', true),
  ('enhanced_dbs', 'Enhanced DBS Certificate', 'Enhanced Disclosure and Barring Service certificate', true),
  ('right_to_work', 'Right to Work Document', 'UK settlement, visa, or other proof of right to work in UK', true),
  ('vehicle_registration', 'Vehicle Registration (V5C)', 'Vehicle registration document', true),
  ('insurance_certificate', 'Insurance Certificate', 'Valid driving instructor insurance', true)
ON CONFLICT (id) DO NOTHING;

-- Instructor documents table
CREATE TABLE IF NOT EXISTS instructor_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Instructor verification status
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'approved', 'rejected'));
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS car_type TEXT CHECK (car_type IN ('manual', 'automatic', 'both'));
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS number_plate TEXT;
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS adi_license_number TEXT;

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_instructor_documents_instructor ON instructor_documents(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_documents_status ON instructor_documents(status);
CREATE INDEX IF NOT EXISTS idx_instructors_verification_status ON instructors(verification_status);
