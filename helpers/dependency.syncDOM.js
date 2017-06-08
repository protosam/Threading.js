self["syncDOM"] = function(selector, slavenode){
	self["dom_diff_watcher"] = {
		dd: new diffDOM(),
		selector: selector,
		dom_last_state: document.querySelector(selector).cloneNode(true),
		dom_diff: [],
		slavenode: slavenode,
		check_state: function(){
			current_state = document.querySelector(this.selector).cloneNode(true);
			this.dom_diff = this.dd.diff(this.dom_last_state, current_state);
			if(this.dom_diff.length > 0){
				this.dom_last_state = current_state;
				self[this.slavenode].syncDOMUpdates(this.selector, this.dom_diff);
			}
		},
		timeout: null
	};
	if(typeof(slavenode) != 'undefined' && 'slavenode' in self["dom_diff_watcher"] && typeof(self["dom_diff_watcher"].slavenode) != 'undefined'){
		self["dom_diff_watcher"].timeout = setInterval(function(){ self["dom_diff_watcher"].check_state(); }, 35);
	}
}

self["setDOM"] = function(selector, contents){
	document.querySelector(selector).innerHTML = JSON.parse(contents);
	self["dom_diff_watcher"].dom_last_state = document.querySelector(selector).cloneNode(true);
}

self["syncDOMUpdates"] = function(selector, diff){
	if(!("dom_diff_watcher" in self)){
		syncDOM(selector);
	}
	self["dom_diff_watcher"].dd.apply(document.querySelector(selector), diff);
	self["dom_diff_watcher"].dom_last_state = document.querySelector(selector).cloneNode(true);
}
