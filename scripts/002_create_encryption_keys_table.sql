-- Create table to store user encryption salts
CREATE TABLE IF NOT EXISTS user_encryption_keys (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  encryption_salt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add RLS policies
ALTER TABLE user_encryption_keys ENABLE ROW LEVEL SECURITY;

-- Users can only read their own encryption key
CREATE POLICY "Users can read own encryption key"
  ON user_encryption_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own encryption key
CREATE POLICY "Users can insert own encryption key"
  ON user_encryption_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own encryption key (not recommended, but allowed)
CREATE POLICY "Users can update own encryption key"
  ON user_encryption_keys
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_encryption_keys_user_id ON user_encryption_keys(user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_encryption_keys_updated_at
  BEFORE UPDATE ON user_encryption_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
