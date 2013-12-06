PRAGMA foreign_keys = ON;

CREATE TABLE question(
  id INTEGER PRIMARY KEY,
  title TEXT,
  body TEXT, 
  vote INTEGER,
  last_modified DATE
);

CREATE TABLE answer(
  id INTEGER PRIMARY KEY,
  question_id INTEGER,
  answer TEXT,
  vote INTEGER,
  last_modified DATE,
  FOREIGN KEY(question_id) REFERENCES question(id) ON DELETE CASCADE
);

CREATE TABLE question_comment(
  id INTEGER PRIMARY KEY,
  question_id INTEGER,
  comment TEXT,
  last_modified DATE,
  FOREIGN KEY(question_id) REFERENCES question(id) ON DELETE CASCADE
);

CREATE TABLE answer_comment(
  id INTEGER PRIMARY KEY,
  answer_id INTEGER,
  comment TEXT,
  last_modified DATE,
  FOREIGN KEY(answer_id) REFERENCES answer(id) ON DELETE CASCADE
);
