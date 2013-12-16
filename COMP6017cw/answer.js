/*jslint devel: true, node: true, nomen: true, unparam: true, sloppy: true */

var utils = require(__dirname + "/utils.js");

var root = function (req, res) {
    utils.restful(req, res, {

        get: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            req.models.question.get(req.params.qid, function (err, question) {
                if (err) {
                    res.status(404);
                    res.end();
                    return;
                }
            });
            req.models.answer.find({ question_id : req.params.qid }, [ "vote", "Z" ], function (err, answers) {
                var a,
                    array = [],
                    since_date,
                    reply = false;
                if (err) {
                    console.error(err);
                    res.status(500);
                    res.end();
                }
                if (req.header("if-modified-since")) {
                    since_date = new Date(req.header("if-modified-since"));
                    for (a = 0; a < answers.length; a = a + 1) {
                        if (answers[a].last_modified < since_date) {
                            reply = true;
                        }
                    }
                    if (!reply) {
                        res.status(304);
                        res.end();
                    }
                }

                for (a = 0; a < answers.length; a = a + 1) {
                    answers[a]._links = {question: "/question/" + answers[a].question_id + "/", comment: "/question/" + answers[a].question_id + "/answer/" + answers[a].id + "/comment"};
                    array.push(answers[a]);
                }
                res.write(JSON.stringify(array) + "\n");
                res.end();
            });
        },

        post: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            var content_type = req.header('content-type'),
                answer;
            if (content_type.toLowerCase() !== 'application/json') {
                res.status(415);
                res.end();
                return;
            }
            answer = req.body.answer;
            req.models.answer.create([
                {
                    answer: answer.answer,
                    vote: 0,
                    question_id: req.params.qid,
                    last_modified: new Date()
                }
            ], function (err, items) {
                var i,
                    item;
                if (err) {
                    console.error(err);
                    res.status(400);
                    res.end();
                }
                for (i = 0; i < items.length; i = i + 1) {
                    item = items[i];
                    res.status(201);
                    res.setHeader("Location", "/question/" + item.question_id + "/answer/" + item.id);
                    res.end();
                }
            });
        },

        'delete': function (req, res) {
            req.models.answer.find({ question_id: req.params.qid }).remove(function (err) {
                if (err) {
                    console.error(err);
                    res.status(400);
                    res.end();
                }
                res.status(204);
                res.end();
            });
        },

        head: function (req, res) {
            this.handlers.get(req, res);
        }

    });
};

var answer = function (req, res) {
    utils.restful(req, res, {

        get: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            req.models.answer.find({ id : req.params.aid, question_id : req.params.qid }, function (err, answer) {
                var since_date;
                if (err) {
                    console.error(err);
                    res.status(404);
                    res.end();
                }
                if (answer.length === 0) {
                    res.status(404);
                    res.end();
                } else {
                    answer = answer[0];
                }
                if (req.header("if-modified-since")) {
                    since_date = new Date(req.header("if-modified-since"));
                    if (answer.last_modified < since_date) {
                        res.status(304);
                        res.end();
                    }
                }
                answer._links = {question: "/question/" + answer.question_id + "/", comment: "/question/" + answer.question_id + "/answer/" + answer.id + "/comment/"};
                res.write(JSON.stringify(answer) + "\n");
                res.end();
            });
        },

        put: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            var content_type = req.header('content-type');
            if (content_type.toLowerCase() !== 'application/json') {
                res.status(415);
                res.end();
                return;
            }
            req.models.answer.get(req.params.aid, function (err, answers) {
                var answer = req.body.answer;
                if (err) {
                    console.error(err);
                }
                if (answer.answer) {
                    answers.answer = answer.answer;
                }
                if (answer.vote) {
                    answers.vote = answer.vote;
                }
                answers.last_modified = new Date();
                answers.save(function (err) {
                    if (err) {
                        console.error(err);
                        res.status(400);
                        res.end();
                    }
                    res.status(200);
                    res.end();
                });
            });
        },

        'delete': function (req, res) {
            req.models.answer.get(req.params.aid, function (err, answer) {
                if (err) {
                    console.error(err);
                    res.status(404);
                    res.end();
                    return;
                }
                answer.remove(function (err) {
                    if (err) {
                        console.error(err);
                        res.status(500);
                        res.end();
                        return;
                    }
                    res.status(204);
                    res.end();
                });
            });
        },

        head: function (req, res) {
            this.handlers.get(req, res);
        }

    });
};

exports.root = root;
exports.answer = answer;