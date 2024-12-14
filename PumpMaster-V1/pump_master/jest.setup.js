const { TextEncoder, TextDecoder } = require("node:util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.Request = class Request {
	constructor(url, options) {
		this.url = url;
		this.options = options;
	}
};

global.Response = class Response {
	constructor(body, options = {}) {
		this.body = body;
		this.options = options;
	}

	ok = true;
	status = 200;
	statusText = "OK";

	json() {
		return Promise.resolve(this.body);
	}

	text() {
		return Promise.resolve(String(this.body));
	}
};
