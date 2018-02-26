var TokenModel = function () {
	this.frameData = {
		"frame-round-flat": {
			filename: "images/frame-round-flat.png",
			maskname: "images/mask-round.png"
		},
		"frame-round-sharp": {
			filename: "images/frame-round-sharp.png",
			maskname: "images/mask-round.png"
		},
		"frame-round-soft": {
			filename: "images/frame-round-soft.png",
			maskname: "images/mask-round.png"
		},
		"frame-square-thick-flat": {
			filename: "images/frame-square-flat.png",
			maskname: "images/mask-square.png"
		},
		"frame-square-thick-sharp": {
			filename: "images/frame-square-sharp.png",
			maskname: "images/mask-square.png"
		},
		"frame-square-thick-soft": {
			filename: "images/frame-square-soft.png",
			maskname: "images/mask-square.png"
		},
	};

	this.imX = 0;
	this.imY = 0;
	this.imscale = 1.0;

    this.dataChangedEvent = new Event(this);
};

TokenModel.prototype = {
	setImagePosition: function(x, y) {
		this.imX = x;
		this.imY = y;
		this.dataChangedEvent.notify();
	},

	setImageScale: function(scale) {
		this.imscale = scale;
		this.dataChangedEvent.notify();
	},
};
