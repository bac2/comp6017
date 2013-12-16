/*jslint devel: true, node: true, nomen: true, unparam: true, sloppy: true */

var utils = require(__dirname + "/utils.js");

var root = function (req, res) {
    utils.restful(req, res, {

        get: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            req.models.question_comment.find({ question_id : req.params.qid }, function (err, comments) {
                var c,
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
                    for (c = 0; c < comments.length; c = c + 1) {
                        if (comments[c].last_modified < since_date) {
                            reply = true;
                        }
                    }
                    if (!reply) {
                        res.status(304);
                        res.end();
                    }
                }
                for (c = 0; c < comments.length; c = c + 1) {
                    comments[c]._links = {question: "/question/" + req.params.qid + "/"};
                    array.push(comments[c]);
                }
                res.write(JSON.stringify(array) + "\n");
                res.end();
            });
        },

        post: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            var content_type = req.header('content-type'),
                comment;
            if (content_type.toLowerCase() !== 'application/json') {
                res.status(415);
                res.end();
                return;
            }
            comment = req.body.comment;
            req.models.question_comment.create([
                {
                    question_id: req.params.qid,
                    comment: comment.comment,
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
                    res.setHeader("Location", "/question/" + req.params.qid + "/comment/" + item.id);
                    res.end();
                }
            });
        },

        'delete': function (req, res) {
            req.models.question_comment.find({ question_id: req.params.qid }).remove(function (err) {
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

var comment = function (req, res) {
    utils.restful(req, res, {

        get: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            req.models.question_comment.get(req.params.cid, function (err, comment) {
                var since_date;
                if (err || !comment) {
                    console.error(err);
                    res.status(404);
                    res.end();
                    return;
                }
                if (req.header("if-modified-since")) {
                    since_date = new Date(req.header("if-modified-since"));
                    if (comment.last_modified < since_date) {
                        res.status(304);
                        res.end();
                    }
                }
                comment._links = {question: "/question/" + req.params.qid + "/"};
                res.write(JSON.stringify(comment) + "\n");
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
            req.models.question_comment.get(req.params.cid, function (err, comments) {
                var comment = req.body.comment;
                if (err) {
                    console.error(err);
                }
                if (comment.comment) {
                    comments.comment = comment.comment;
                }
                comments.last_modified = new Date();
                comments.save(function (err) {
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
            req.models.question_comment.find({id: req.params.cid, question_id: req.params.qid }).remove(function (err) {
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

exports.root = root;
exports.comment = comment;