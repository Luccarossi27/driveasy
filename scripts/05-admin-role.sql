-- Add admin role to users table and create admins management

-- Update the role constraint to include admin
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('instructor', 'student', 'admin'));

-- Create index for admin users
CREATE INDEX IF NOT EXISTS idx_users_admin ON users(id) WHERE role = 'admin';
