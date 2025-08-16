# Molly's Touch - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account and project

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Supabase Setup

1. Create a new Supabase project
2. Go to Authentication > Settings and enable Email auth
3. Create the following table in your database:

```sql
-- Create the profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  discord TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- IMPORTANT: Allow checking username existence during signup
CREATE POLICY "Allow username check during signup" ON public.profiles
  FOR SELECT USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, phone_number, address, discord)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'phone_number', NEW.raw_user_meta_data->>'address', NEW.raw_user_meta_data->>'discord');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

## Features

- **Authentication**: Login/Signup with Supabase
- **Theme Toggle**: Switch between light and dark modes
- **Responsive Design**: Mobile-first approach
- **Luxury UI**: Gold and white/black color scheme
- **Profile Management**: User profiles with bookings support

## Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   ├── services/            # Business logic services
│   ├── stores/              # Svelte stores
│   └── supabase.ts         # Supabase client
├── routes/                  # Page components
└── app.css                 # Global styles
```

## Customization

- Colors: Modify the gold color palette in `tailwind.config.js`
- Styling: Update `src/app.css` for global styles
