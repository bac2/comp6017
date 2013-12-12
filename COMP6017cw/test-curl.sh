# Get all questions
echo "Get all questions:"
curl -D- -X GET http://localhost:1337/question/ --max-time 2
echo "Some array of questions expected"
echo ""

# Delete all questions
echo "Delete all questions:"
curl -D- -X DELETE http://localhost:1337/question/  --max-time 2
echo "204 No Content expected"
echo ""
echo "#############################"
echo "### ADD ONE QUESTION      ###"
echo "#############################"
# Add a new question
echo "Add a new question:"
curl -D- -X POST http://localhost:1337/question/ -H "Content-Type: application/json" -d '{"question":{"title":"How many cats in Japan?", "body":"Please help"}}' --max-time 1
echo "Expected Location header and 201 created"
echo ""

echo "#############################"
echo "### GET SOME EMPTY URLS   ###"
echo "#############################"
# Get a specific question
echo "Get a specific question:"
curl -D- -X GET http://localhost:1337/question/1  --max-time 1
echo "One question returned only"
echo ""

# Get the answers to a question
echo "Get answers to a question:"
curl -D- -X GET http://localhost:1337/question/1/answer --max-time 1
echo "[] expected"
echo ""

# Get the comments on a question
echo "Get the comments on a question:"
curl -D- -X GET http://localhost:1337/question/1/comment --max-time 1
echo "[] expected"
echo ""

# Get a specific comment on a question
echo "Get a specific comment on a question:"
curl -D- -X GET http://localhost:1337/question/1/comment/1 --max-time 1
echo "404 expected"
echo ""

# Get a specific answer to a question
echo "Get a specific answer to a question:"
curl -D- -X GET http://localhost:1337/question/1/answer/1 --max-time 1
echo "404 expected"
echo ""

# Get all comments to an answer
echo "Get all comments to an answer:"
curl -D- -X GET http://localhost:1337/question/1/answer/1/comment --max-time 1
echo "404 expected"
echo ""

# Get a specific comment on an answer
echo "Get a specific comment on a question:"
curl -D- -X GET http://localhost:1337/question/1/answer/1/comment/1 --max-time 1
echo "404 expected"
echo ""

echo "#############################"
echo "### ADD SOME CONTENT	###"
echo "#############################"

# Add a new answer to a question
echo "Add a new answer to a question:"
curl -D- -X POST http://localhost:1337/question/1/answer -H "Content-Type: application/json" -d '{"answer":{"answer":"Several hundred"}}' --max-time 1
echo "Expected Location header and 201 created"
echo ""

# Add a new comment to a question
echo "Add a new comment to a question:"
curl -D- -X POST http://localhost:1337/question/1/comment -H "Content-Type: application/json" -d '{"comment":{"comment":"Good question..."}}' --max-time 1
echo "Expected Location header and 201 created"
echo ""

# Add a new comment on an answer
echo "Add a new comment to an answer:"
curl -D- -X POST http://localhost:1337/question/1/answer/1/comment -H "Content-Type: application/json" -d '{"comment":{"comment":"Good answer..."}}' --max-time 1
echo "Expected Location header and 201 created"
echo ""

echo "#############################"
echo "### GET SOME FULL URLS	###"
echo "#############################"

# Get a specific question
echo "Get a specific question:"
curl -D- -X GET http://localhost:1337/question/1  --max-time 1
echo "One question returned only"
echo ""

# Get the answers to a question
echo "Get answers to a question:"
curl -D- -X GET http://localhost:1337/question/1/answer --max-time 1
echo "One item array expected"
echo ""

# Get the comments on a question
echo "Get the comments on a question:"
curl -D- -X GET http://localhost:1337/question/1/comment --max-time 1
echo "One item array expected"
echo ""

# Get a specific comment on a question
echo "Get a specific comment on a question:"
curl -D- -X GET http://localhost:1337/question/1/comment/1 --max-time 1
echo "Single object (no array) expected"
echo ""

# Get a specific answer to a question
echo "Get a specific answer to a question:"
curl -D- -X GET http://localhost:1337/question/1/answer/1 --max-time 1
echo "Single object (no array) expected"
echo ""

# Get all comments to an answer
echo "Get all comments to an answer:"
curl -D- -X GET http://localhost:1337/question/1/answer/1/comment --max-time 1
echo "One item array expected"
echo ""

echo "Get a specific comment on a question:"
curl -D- -X GET http://localhost:1337/question/1/answer/1/comment/1 --max-time 1
echo "Single object (no array) expected"
echo ""

echo "#############################"
echo "### PUT SOME CONTENT      ###"
echo "#############################"

echo "PUT an update to a question"
curl -D- --header "Content-Type: application/json" -X PUT http://localhost:1337/question/1/ --data '{"question":{"body":"I really like cats"}}' --max-time 1
echo "Expected 200 OK"
echo ""

echo "GET the update to a question"
curl -D- -X GET http://localhost:1337/question/1  --max-time 1
echo "Expected body of \"I really like cats\""
echo ""

echo "PUT an update to an answer"
curl -D- --header "Content-Type: application/json" -X PUT http://localhost:1337/question/1/answer/1 --data '{"answer":{"vote":"3000"}}' --max-time 1
echo "Expected 200 OK"
echo ""

echo "GET the update to the answer"
curl -D- -X GET http://localhost:1337/question/1/answer/1  --max-time 1
echo "Expected votes of 3000"
echo ""

echo "#############################"
echo "### CHECK FOR 304s       ###"
echo "#############################"

echo "Get question 1 if modified since 2012"
curl -D- --header "If-Modified-Since: Sun, 01 Jan 2012 00:00:00 GMT" -X GET http://localhost:1337/question/1/ --max-time 1
echo "Expected single object as normal"
echo ""

echo "Get question 1 if modified since 2015"
curl -D- --header "If-Modified-Since: Thu, 01 Jan 2015 00:00:00 GMT" -X GET http://localhost:1337/question/1/ --max-time 1
echo "Expected 304 (Nothing has changed since 2015 !!)"
echo ""

echo "Get all questions if modified since 2012"
curl -D- --header "If-Modified-Since: Sun, 01 Jan 2012 00:00:00 GMT" -X GET http://localhost:1337/question/ --max-time 1
echo "Expected array as normal"
echo ""

echo "Get all questions if modified since 2015"
curl -D- --header "If-Modified-Since: Thu, 01 Jan 2015 00:00:00 GMT" -X GET http://localhost:1337/question/ --max-time 1
echo "Expected 304 (Nothing has changed since 2015 !!)"
echo ""


echo "#############################"
echo "### TEST HEADS            ###"
echo "#############################"
# Get a specific question
echo "Get a specific question:"
curl -I http://localhost:1337/question/1  --max-time 1
echo "Expected no body"
echo ""

# Get the answers to a question
echo "Get answers to a question:"
curl -I http://localhost:1337/question/1/answer --max-time 1
echo "Expected no body"
echo ""

# Get the comments on a question
echo "Get the comments on a question:"
curl -I http://localhost:1337/question/1/comment --max-time 1
echo "Expected no body"
echo ""

# Get a specific comment on a question
echo "Get a specific comment on a question:"
curl -I http://localhost:1337/question/1/comment/1 --max-time 1
echo "Expected no body"
echo ""

# Get a specific answer to a question
echo "Get a specific answer to a question:"
curl -I http://localhost:1337/question/1/answer/1 --max-time 1
echo "Expected no body"
echo ""

# Get all comments to an answer
echo "Get a specific comments to an answer:"
curl -I http://localhost:1337/question/1/answer/1/comment --max-time 1
echo "Expected no body"
echo ""

# Get a specific comment on an answer
echo "Get a specific comment on a question:"
curl -I http://localhost:1337/question/1/answer/1/comment/1 --max-time 1
echo "Expected no body"
echo ""
