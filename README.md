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


GET /question/\<id\>/comments - List all comments for a question

POST /question/\<id\>/comments - Add a comment

GET /question/\<id\>/comments/\<id\> - Get a specific comment on a specific question

PUT /question/\<id\>/comments/\<id\> - Edit a comment

DELETE /question/\<id\>/comments/\<id\> - Delete a comment

SAME FOR ANSWERS


POST /question/\<id\>/answers - Submit an answer to the question

GET /question/\<id\>/answers/\<id\> - Display a specific answer

PUT /question/\<id\>/answers/\<id\> - Edit an answer

DELETE /question/\<id\>/answers/\<id\> - Remove an answer

