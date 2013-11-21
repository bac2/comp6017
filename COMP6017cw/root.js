var	utils = require("./utils.js");

var root = function (req, res) {
    utils.restful(req, res, {
        get: function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            var obj = {'_links': {'question':'/question'}};
            res.end(JSON.stringify(obj) + "\n");
        }
    });
};

exports.root = root;