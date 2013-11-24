CREATE TABLE question(
  id INTEGER PRIMARY KEY,
  title TEXT,
  body TEXT, 
  vote INTEGER
);

CREATE TABLE answer(
  id INTEGER PRIMARY KEY,
  question_id INTEGER,
  body TEXT,
  vote INTEGER,
  FOREIGN KEY(question_id) REFERENCES question(id)
);

CREATE TABLE question_comment(
  id INTEGER PRIMARY KEY,
  question_id INTEGER,
  body TEXT,
  FOREIGN KEY(question_id) REFERENCES question(id)
);

CREATE TABLE answer_comment(
  id INTEGER PRIMARY KEY,
  answer_id INTEGER,
  body TEXT,
  FOREIGN KEY(answer_id) REFERENCES answer(id)
);
