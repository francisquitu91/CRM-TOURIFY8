/*
  # Create calendar events table

  1. New Tables
    - `calendar_events`
      - `id` (serial, primary key)
      - `type` (text)
      - `title` (text)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `description` (text, nullable)
      - `related` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `calendar_events` table
    - Add policy for all users to read and write data
*/

CREATE TABLE IF NOT EXISTS calendar_events (
  id serial PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('tarea', 'ingreso', 'gasto', 'reunion')),
  title text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  description text,
  related text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on calendar_events"
  ON calendar_events
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);