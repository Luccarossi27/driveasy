ALTER TABLE instructors ADD COLUMN IF NOT EXISTS instructor_code TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_instructors_code ON instructors(instructor_code);
