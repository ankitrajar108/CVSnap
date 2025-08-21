-- SQL script to create the contact table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS contact (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS contact_created_at_idx ON contact(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_status_idx ON contact(status);
CREATE INDEX IF NOT EXISTS contact_email_idx ON contact(email);

-- Enable RLS (Row Level Security)
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts" ON contact;
DROP POLICY IF EXISTS "Admin can read all contacts" ON contact;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON contact;
DROP POLICY IF EXISTS "Allow authenticated reads" ON contact;

-- Create policy to allow inserts from anyone (for contact form)
CREATE POLICY "Allow anonymous inserts" ON contact
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Create policy to allow inserts from authenticated users too
CREATE POLICY "Allow authenticated inserts" ON contact
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all contacts
CREATE POLICY "Allow authenticated reads" ON contact
  FOR SELECT
  TO authenticated 
  USING (true);

-- Create policy to allow authenticated users to update contacts (for admin)
CREATE POLICY "Allow authenticated updates" ON contact
  FOR UPDATE
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON contact TO anon;
GRANT ALL ON contact TO authenticated;
