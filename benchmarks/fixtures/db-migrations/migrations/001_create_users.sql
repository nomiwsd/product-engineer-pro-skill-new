CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  fullname text NOT NULL,
  legacy_flag boolean,
  old_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
