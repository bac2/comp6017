/*jslint node: true */
"use strict";

var restful = function (req, res, handlers) {
	var method = req.route.method;
	handlers.head = function(req, res) {
		handlers.get(req, res);
	}
	if (!(method in handlers)) {
		res.set("Allow", Object.keys(handlers).join(", ").toUpperCase());
		res.send(405);
	} 
	else
	{
		handlers[method](req, res);
	}
};

exports.restful = restful;