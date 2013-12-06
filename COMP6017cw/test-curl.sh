# Get all questions
echo "Get all questions:"
curl -D- -X GET http://localhost:1337/question/ --max-time 2

# Delete all questions
echo "Delete all questions:"
curl -D- -X DELETE http://localhost:1337/question/  --max-time 2

# Add a new question
echo "Add a new question:"
curl -D- -X POST http://localhost:1337/question/ -H "Content-Type: application/json" -d '{"question":{"title":"How many cats in Japan?", "body":"Please help"}}' --max-time 1

# Get a specific question
echo "Get a specific question:"
curl -D- -X GET http://localhost:1337/question/1  --max-time 1

# Get the answers to a question
echo "Get answers to a question:"
curl -D- -X GET http://localhost:1337/question/1/answer --max-time 1

# Get the comments on a question
echo "Get the comments on a question:"
curl -D- -X GET http://localhost:1337/question/1/comment --max-time 1

# Get a specific answer to a question
echo "Get a specific answer to a question:"
curl -D- -X GET http://localhost:1337/question/1/answer/1 --max-time 1

# Get a specific comment on a question
echo "Get a specific comment on a question:"
curl -D- -X GET http://localhost:1337/question/1/answer/1/comment --max-time 1

# Add a new answer to a question
echo "Add a new answer to a question:"
curl -D- -X POST http://localhost:1337/question/1/answer -H "Content-Type: application/json" -d '{"answer":{"answer":"Several hundred"}}' --max-time 1

# Add a new comment to a question
echo "Add a new comment to a question:"
curl -D- -X POST http://localhost:1337/question/1/comment -H "Content-Type: application/json" -d '{"comment":{"comment":"Good question..."}}' --max-time 1

# Add a new comment on an answer
echo "Add a new comment to an answer:"
curl -D- -X POST http://localhost:1337/question/1/answer/1/comment -H "Content-Type: application/json" -d '{"comment":{"comment":"Good answer..."}}' --max-time 1

