var restful = function (req, res, handlers) {
	var method = req.route.method;
	if (!(method in handlers)) {
		res.set("Allow", Object.keys(handlers).join(", ").toUpperCase());
		res.send(405);
	}
	{
		handlers[method](req, res);
	}	
}

exports.restful = restful;