comp6017
========

A repository for COMP6017 C/W Web service 

URLS
====
GET /question - Gets all questions

POST /question - create a new question

DELETE /question - Delete all questions

GET /question/\<id\> - Get a specific question id

PUT /question/\<id\> - Edit a question

DELETE /question/\<id\> - Remove a question


GET /question/\<id\>/comment - List all comments for a question

POST /question/\<id\>/comment - Add a comment

GET /question/\<id\>/comment/\<id\> - Get a specific comment on a specific question

PUT /question/\<id\>/comment/\<id\> - Edit a comment

DELETE /question/\<id\>/comment/\<id\> - Delete a comment

SAME FOR ANSWERS


POST /question/\<id\>/answer - Submit an answer to the question

GET /question/\<id\>/answer/\<id\> - Display a specific answer

PUT /question/\<id\>/answer/\<id\> - Edit an answer

DELETE /question/\<id\>/answer/\<id\> - Remove an answer

