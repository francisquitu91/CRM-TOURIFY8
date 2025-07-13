/*
  # Create goals table

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `assigned_to` (text)
      - `due_date` (date)
      - `completed` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `goals` table
    - Add policy for all users to read and write data
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  assigned_to text NOT NULL DEFAULT 'Sin Asignar',
  due_date date NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on goals"
  ON goals
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);