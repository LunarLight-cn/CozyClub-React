DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (username, password_hash) VALUES ('testuser', '$2a$12$GwFi/j.3Z.Wvj/v.3Z.Wv.u/3Z.Wv.3Z.Wv.3Z.Wv.3Z.Wv.3Z.W');