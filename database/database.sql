CREATE TABLE question(
  id INTEGER PRIMARY KEY,
  question TEXT,
  vote INTEGER
);

CREATE TABLE answer(
  id INTEGER PRIMARY KEY,
  question_id INTEGER,
  answer TEXT,
  vote INTEGER,
  FOREIGN KEY(question_id) REFERENCES question(id)
);

CREATE TABLE question_comment(
  id INTEGER PRIMARY KEY,
  question_id INTEGER,
  comment TEXT,
  vote INTEGER,
  FOREIGN KEY(question_id) REFERENCES question(id)
);

CREATE TABLE answer_comment(
  id INTEGER PRIMARY KEY,
  answer_id INTEGER,
  comment TEXT,
  vote INTEGER,
  FOREIGN KEY(answer_id) REFERENCES answer(id)
);