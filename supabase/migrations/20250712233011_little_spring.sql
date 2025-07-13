/*
  # Create prospects table

  1. New Tables
    - `prospects`
      - `id` (uuid, primary key)
      - `contact_name` (text)
      - `company` (text)
      - `phone` (text)
      - `email` (text)
      - `service` (text)
      - `status` (text)
      - `assigned_to` (text)
      - `tags` (text array)
      - `notes` (jsonb array)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `prospects` table
    - Add policy for all users to read and write data
*/

CREATE TABLE IF NOT EXISTS prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name text NOT NULL,
  company text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  service text NOT NULL,
  status text NOT NULL DEFAULT 'Nuevo',
  assigned_to text NOT NULL DEFAULT 'Sin Asignar',
  tags text[] DEFAULT '{}',
  notes jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on prospects"
  ON prospects
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);