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
		this.scaleUpHandler = this.scaleUp.bind(this);
		this.scaleDownHandler = this.scaleDown.bind(this);
		this.scaleChangeHandler = this.scaleChange.bind(this);
        return this;
    },

    enable: function () {
		this.view.mouseMoveEvent.attach(this.mouseMoveHandler);
		this.view.mouseUpEvent.attach(this.mouseUpHandler);
		this.view.mouseDownEvent.attach(this.mouseDownHandler);
		this.view.scaleUpEvent.attach(this.scaleUpHandler);
		this.view.scaleDownEvent.attach(this.scaleDownHandler);
		this.view.scaleChangeEvent.attach(this.scaleChangeHandler);
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

	scaleUp: function() {
		this.model.setImageScale(this.model.imscale + 0.1);
	},

	scaleDown: function() {
		this.model.setImageScale(this.model.imscale - 0.1);
	},

	scaleChange: function(sender, args) {
		this.model.setImageScale(parseFloat(args.value));
	},
};
