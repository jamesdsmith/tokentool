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
		this.tokenSizeChangeHandler = this.tokenSizeChange.bind(this);
		this.selectBorderHandler = this.selectBorder.bind(this);
		this.fileDropHandler = this.fileDrop.bind(this);
		this.chooseFileHandler = this.chooseFile.bind(this);
		this.saveImageHandler = this.saveImage.bind(this);
        return this;
    },

    enable: function () {
		this.view.mouseMoveEvent.attach(this.mouseMoveHandler);
		this.view.mouseUpEvent.attach(this.mouseUpHandler);
		this.view.mouseDownEvent.attach(this.mouseDownHandler);
		this.view.scaleUpEvent.attach(this.scaleUpHandler);
		this.view.scaleDownEvent.attach(this.scaleDownHandler);
		this.view.scaleChangeEvent.attach(this.scaleChangeHandler);
		this.view.tokenSizeChangeEvent.attach(this.tokenSizeChangeHandler);
		this.view.selectBorderEvent.attach(this.selectBorderHandler);
		this.view.fileDropEvent.attach(this.fileDropHandler);
		this.view.chooseFileEvent.attach(this.chooseFileHandler);
		this.view.saveImageEvent.attach(this.saveImageHandler);
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
		this.model.setImageScale(args.value);
	},

	tokenSizeChange: function(sender, args) {
		this.view.changeTokenSize(args.width, args.height);
	},

	selectBorder: function(sender, args) {
		this.model.borderId = args.id;
		this.view.changeBorder();
	},

	fileDrop: function(sender, args) {
		// If dropped items aren't files, reject them
		var dt = args.dt;
		if (dt.items) {
			// Use DataTransferItemList interface to access the file(s)
			for (var i=0; i < dt.items.length; i++) {
				if (dt.items[i].kind == "file") {
					this.readImageFile(dt.items[i].getAsFile());
				}
			}
		} else {
			// Use DataTransfer interface to access the file(s)
			for (var i=0; i < dt.files.length; i++) {
				this.view.setTokenImage(dt.files[i].name);
			}  
		}
	},

	chooseFile: function(sender, args) {
		var tgt = args.target, files = tgt.files;
		if (FileReader && files && files.length) {
			this.readImageFile(files[0]);
		}
		else {
			// TODO: Fill in error handling here
			// fallback -- perhaps submit the input to an iframe and temporarily store
			// them on the server until the user's session ends.
		}
	},

	readImageFile: function(f) {
		var r = new FileReader();
		r.onload = function() {
			this.view.setTokenImage(r.result);
		}.bind(this);
		r.readAsDataURL(f);
	},

	saveImage: function() {
		var a = document.createElement('a');
		var img = this.view.getFinalToken();
		a.download = "token.png";
		a.href = img;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	},

};
