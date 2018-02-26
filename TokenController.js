var TokenController = function (model, view) {
    this.model = model;
    this.view = view;

	this.isMouseDown = false;
	this.mouseX = 0;
	this.mouseY = 0;

    this.init();
};

TokenController.prototype = {
    init: function () {
        this.setupHandlers()
            .enable();
    },

    setupHandlers: function () {
		this.mouseMoveHandler = this.mouseMove.bind(this);
		this.mouseUpHandler = this.mouseUp.bind(this);
		this.mouseDownHandler = this.mouseDown.bind(this);
        return this;
    },

    enable: function () {
		this.view.mouseMoveEvent.attach(this.mouseMoveHandler);
		this.view.mouseUpEvent.attach(this.mouseUpHandler);
		this.view.mouseDownEvent.attach(this.mouseDownHandler);
        return this;
    },

	mouseMove: function(sender, args) {
		if (this.isMouseDown) {
			var deltaX = args.pageX - this.mouseX;
			var deltaY = args.pageY - this.mouseY;
			this.mouseX = args.pageX;
			this.mouseY = args.pageY;
			var imX = this.model.imX + deltaX;
			var imY = this.model.imY + deltaY;
			this.model.setImagePosition(imX, imY);
		}
	},

	mouseUp: function() {
		this.isMouseDown = false;
	},

	mouseDown: function(sender, args) {
		this.isMouseDown = true;
		this.mouseX = args.pageX;
		this.mouseY = args.pageY;
	},
};
