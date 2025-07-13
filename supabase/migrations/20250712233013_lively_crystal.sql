/*
  # Create sales scripts table

  1. New Tables
    - `sales_scripts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `client_type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `sales_scripts` table
    - Add policy for all users to read and write data
*/

CREATE TABLE IF NOT EXISTS sales_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  client_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sales_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on sales_scripts"
  ON sales_scripts
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);