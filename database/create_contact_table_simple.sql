-- Alternative SQL script for contact table (without RLS complications)
-- Run this in your Supabase SQL Editor if the main script doesn't work

-- Drop the table if it exists (to start fresh)
DROP TABLE IF EXISTS contact;

-- Create the contact table
CREATE TABLE contact (
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
CREATE INDEX contact_created_at_idx ON contact(created_at DESC);
CREATE INDEX contact_status_idx ON contact(status);
CREATE INDEX contact_email_idx ON contact(email);

-- DISABLE RLS completely (simpler approach)
ALTER TABLE contact DISABLE ROW LEVEL SECURITY;

-- Grant full permissions to anonymous and authenticated users
GRANT ALL ON contact TO anon;
GRANT ALL ON contact TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
