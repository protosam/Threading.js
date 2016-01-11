function send(func, payload){
	data = {
		function: func,
		payload: payload
	}
	jsdata = JSON.stringify(data)
	this.postMessage(jsdata);
	return this;
}


function ajax(url, callback, data, type) {
	var data_array, data_string, idx, req, value;
	if (data == null) {
		data = {};
	}
	if (callback == null) {
		callback = function() {};
	}
	if (type == null) {
		//default to a GET request
		type = 'GET';
	}
	data_array = [];
	for (idx in data) {
		value = data[idx];
		data_array.push("" + idx + "=" + value);
	}
	data_string = data_array.join("&");
	req = new XMLHttpRequest();
	req.open(type, url, false);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	req.onreadystatechange = function() {
		if (req.readyState === 4 && req.status === 200) {
			return callback(req.responseText);
		}
	};
	req.send(data_string);

	return JSON.parse(req);
}


// the listener will automatically call functions by name
self.addEventListener("message", function(event) {
	// convert the payload to an object from it's JSON form
	data = JSON.parse(event.data)

	if (data.payload  === "undefined"){
		// make a call to a function without a payload
		self[data.function]()
	}else{
		// make the call to the function and give it a payload
		self[data.function](data.payload)
	}
}, false);
