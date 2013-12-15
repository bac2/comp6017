/*jslint devel: true, node: true, nomen: true, unparam: true, sloppy: true */

var utils = require("./utils.js");

var root = function (req, res) {
    utils.restful(req, res, {

        get: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            req.models.answer_comment.find({ answer_id : req.params.aid }, function (err, comments) {
                var c,
                    array = [],
                    since_date;
                if (comments.length === 0) {
                    res.status(404);
                    res.end();
                }
                if (err) {
                    res.status(500);
                    res.end();
                    console.error(err);
                }
                if (req.header("if-modified-since")) {
                    since_date = new Date(req.header("if-modified-since"));
                    for (c = 0; c < comments.length; c = c + 1) {
                        if (comments[c].last_modified < since_date) {
                            res.status(304);
                            res.end();
                        }
                    }
                }
                for (c = 0; c < comments.length; c = c + 1) {
                    comments[c]._links = {answer: "/question/" + req.params.qid + "/answer/" + req.params.aid + "/"};
                    array.push(comments[c]);
                }
                res.write(JSON.stringify(array) + "\n");
                res.end();
            });
        },

        post: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            var comment = req.body.comment;
            req.models.answer_comment.create([
                {
                    answer_id: req.params.aid,
                    comment: comment.comment,
                    last_modified: new Date()
                }
            ], function (err, items) {
                var i,
                    item;
                if (err) {
                    res.status(400);
                    res.end();
                    console.error(err);
                }
                for (i = 0; i < items.length; i = i + 1) {
                    item = items[i];
                    res.status(201);
                    res.setHeader("Location", "/question/" + req.params.qid + "/answer/" + req.params.aid + "/comment/" + item.id);
                    res.end();
                }
            });
        },

        'delete': function (req, res) {
            req.models.answer_comment.find({answer_id: req.params.aid}).remove(function (err) {
                if (err) {
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
            req.models.answer_comment.get(req.params.cid, function (err, comment) {
                var since_date;
                if (err) {
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
                comment._links = {answer: "/question/" + req.params.qid + "/answer/" + req.params.aid + "/"};
                res.write(JSON.stringify(comment) + "\n");
                res.end();
            });
        },

        put: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            req.models.answer_comment.get(req.params.cid, function (err, comments) {
                var comment = req.body.comment;
                if (comment.comment) {
                    comments.comment = comment.comment;
                }
                comments.last_modified = new Date();
                comments.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.status(400);
                        res.end();
                    }
                    res.status(200);
                    res.end();
                });
            });
        },

        'delete': function (req, res) {
            req.models.answer_comment.find({id: req.params.aid, answer_id: req.params.aid}).remove(function (err) {
                if (err) {
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