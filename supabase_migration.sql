-- Supabase Migration: Create Profiles Table
-- Run this in your Supabase SQL editor to create the profiles table

-- Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id BIGINT PRIMARY KEY, -- This will be the character ID from GTA World
    username TEXT NOT NULL, -- First + Last name of the character
    phone_number TEXT DEFAULT '',
    routing_number TEXT DEFAULT '',
    address TEXT DEFAULT '',
    discord TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to read profiles
CREATE POLICY "Allow authenticated users to read profiles" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create a policy that allows users to insert their own profiles
CREATE POLICY "Allow users to insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy that allows users to update their own profiles
CREATE POLICY "Allow users to update profiles" ON public.profiles
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a policy that allows users to delete their own profiles
CREATE POLICY "Allow users to delete profiles" ON public.profiles
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create an index on the id field for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO public.profiles (id, username, phone_number, routing_number, address, discord) VALUES
--     (425345, 'Testttt Testiti', '', '', '', ''),
--     (5442345, 'Johnny Parker', '', '', '', ''),
--     (24523534, 'Lester Dawson', '', '', '', ''),
--     (9355356, 'Angela Rosetti', '', '', '', ''),
--     (64364344, 'Justin Sanderson', '', '', '', ''),
--     (5436635, 'Spencer Simon', '', '', '', ''),
--     (1235162, 'Richard Watts', '', '', '', '');

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT USAGE ON SEQUENCE profiles_id_seq TO authenticated;
