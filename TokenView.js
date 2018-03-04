var TokenView = function (model) {
    this.model = model;
    this.mouseMoveEvent = new Event(this);
    this.mouseUpEvent = new Event(this);
    this.mouseDownEvent = new Event(this);
	this.scaleUpEvent = new Event(this);
	this.scaleDownEvent = new Event(this);
	this.scaleChangeEvent = new Event(this);
	this.tokenSizeChangeEvent = new Event(this);
	this.selectBorderEvent = new Event(this);

    this.init();
};

TokenView.prototype = {
    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable();
    },

    createChildren: function () {
        // cache the document objects
		// @TODO: Clean this up some, we are caching a lot of stuff
		this.canvas = document.getElementById('canvas');
		this.context = canvas.getContext('2d');
		this.border = document.getElementById('border');
		this.mask = document.getElementById('mask');
		this.image = document.getElementById('image');
		this.solidBg = document.getElementById('solidBackground');
		this.transparency = document.getElementById('transparency');
		this.tokenWidth = document.getElementById('tokenWidth');
		this.tokenHeight = document.getElementById('tokenHeight');
		this.sizeSelect = document.getElementById('sizeSelect');
		this.uploadBtn = document.getElementById('uploadBtn');
		this.saveBtn = document.getElementById('saveBtn');
		this.uploadBg = document.getElementById('uploadBg');
		this.uploadDialog = document.getElementById('uploadDialog');
		this.fileField = document.getElementById('fileField');
		this.urlText = document.getElementById('urlText');
		this.dropArea = document.getElementById('dropArea');
		this.frameColor = document.getElementById('frameColor');
		this.bgColor = document.getElementById('bgColor');
		this.dropdownContent = document.getElementById('dropdown-content');
		this.scaleValue = document.getElementById('scaleValue');
		this.preview = document.getElementById('preview');
		this.prevctx = preview.getContext('2d');
		this.offscreen = document.createElement('canvas');
		this.offscreen.width = this.tokenWidth.value;
		this.offscreen.height = this.tokenHeight.value;
		this.offscreenCtx = this.offscreen.getContext('2d');
		this.finalFrame = document.createElement('canvas');

		var keys = Object.keys(this.model.frameData);
		for (var i = 0; i < keys.length; i++) {
			var im = document.createElement('img');
			im.id = keys[i];
			im.src = this.model.frameData[keys[i]].filename;
			this.dropdownContent.appendChild(im);
		}
        return this;
    },

    setupHandlers: function () {
		this.renderHandler = this.render.bind(this);
		this.resizeCanvasHandler = this.resizeCanvas.bind(this);
		this.windowClickHandler = this.windowClick.bind(this);
		this.mouseMoveHandler = this.mouseMove.bind(this);
		this.mouseUpHandler = this.mouseUp.bind(this);
		this.mouseDownHandler = this.mouseDown.bind(this);
		this.selectBorderHandler = this.selectBorder.bind(this);
		this.redrawFrameHandler = this.redrawFrame.bind(this);
		this.openMenuHandler = this.openMenu.bind(this);
		this.showFileDialogHandler = this.showFileDialog.bind(this);
		this.hideFileDialogHandler = this.hideFileDialog.bind(this);
		this.clickUploadBgHandler = this.clickUploadBg.bind(this);
		this.scaleUpHandler = this.scaleUp.bind(this);
		this.scaleDownHandler = this.scaleDown.bind(this);
		this.scaleChangeHandler = this.scaleChange.bind(this);
		this.updateScaleHandler = this.updateScale.bind(this);
		this.widthChangeHandler = this.widthChange.bind(this);
		this.heightChangeHandler = this.heightChange.bind(this);
		this.sizeChangeHandler = this.sizeChange.bind(this);
		this.saveImageHandler = this.saveImage.bind(this);
		this.chooseFileHandler = this.chooseFile.bind(this);
		this.fileDropHandler = this.fileDrop.bind(this);
		this.fileHoverStartHandler = this.fileHoverStart.bind(this);
		this.fileHoverEndHandler = this.fileHoverEnd.bind(this);

        return this;
    },

    enable: function () {
		window.addEventListener('resize', this.resizeCanvasHandler);
		// @TODO: Investigate if this is causing the flicker at startup
		window.addEventListener('load', this.resizeCanvasHandler);
		window.addEventListener('mousemove', this.mouseMoveHandler);
		this.canvas.addEventListener('mousedown', this.mouseDownHandler);
		window.addEventListener('mouseup', this.mouseUpHandler);
		this.solidBg.addEventListener('change', this.renderHandler);
		this.transparency.addEventListener('input', this.renderHandler);
		this.image.addEventListener('load', this.renderHandler);
		document.getElementById('scaleUp').addEventListener('click', this.scaleUpHandler);
		document.getElementById('scaleDown').addEventListener('click', this.scaleDownHandler);
		this.scaleValue.addEventListener('change', this.scaleChangeHandler);
		this.tokenWidth.addEventListener('input', this.widthChangeHandler);
		this.tokenHeight.addEventListener('input', this.heightChangeHandler);
		this.sizeSelect.addEventListener('change', this.sizeChangeHandler);
		this.saveBtn.addEventListener('click', this.saveImageHandler);
		this.uploadBtn.addEventListener('click', this.showFileDialogHandler);
		this.uploadBg.addEventListener('click', this.clickUploadBgHandler);
		this.fileField.addEventListener('change', this.chooseFileHandler);
		this.uploadBg.addEventListener('drop', this.fileDropHandler);
		this.uploadBg.addEventListener('dragover', this.fileHoverStartHandler);
		this.uploadBg.addEventListener('dragenter', this.fileHoverStartHandler);
		this.uploadBg.addEventListener('dragleave', this.fileHoverEndHandler);
		this.uploadBg.addEventListener('dragend', this.fileHoverEndHandler);
		document.getElementById('dropbtn').addEventListener('click', this.openMenuHandler);
		window.addEventListener('click', this.windowClickHandler);
		var items = Array.from(document.getElementById("dropdown-content").children);
		var i;
		for (i = 0; i < items.length; i++) {
			var item = items[i];
			item.addEventListener('click', this.selectBorderHandler);
		}
		border.addEventListener('load', this.redrawFrameHandler);
		mask.addEventListener('load', this.redrawFrameHandler);
		frameColor.jscolor.onFineChange = this.redrawFrameHandler;
		bgColor.jscolor.onFineChange = this.redrawFrameHandler;
		this.redrawFrame();

		// Event Dispatcher
		this.model.dataChangedEvent.attach(this.renderHandler);
		this.model.scaleChangeEvent.attach(this.updateScaleHandler);

        return this;
    },

	show: function() {
		this.render();
	},

	// User Interface Events
	// These events get sent off to the controller, which updates the model and
	// potentially updates the view as well
	windowClick: function(e) {
		if (!e.target.matches('.dropbtn-click')) {
			document.getElementById("droplabel").classList.remove("show");
			document.getElementById("droparrow").classList.remove("show");
			var dropdowns = document.getElementsByClassName("dropdown-content");
			var i;
			for (i = 0; i < dropdowns.length; i++) {
				var openDropdown = dropdowns[i];
				if (openDropdown.classList.contains('show')) {
					openDropdown.classList.remove('show');
				}
			}
		}
	},

	mouseMove: function(e) {
		this.mouseMoveEvent.notify({ pageX: e.pageX, pageY: e.pageY });
		// Consume the event if it is not some type of input/control
		if (!e.target.type) {
			e = e || window.event;
			pauseEvent(e);
		}
	},

	mouseUp: function() {
		this.mouseUpEvent.notify();
	},

	mouseDown: function(e) {
		this.mouseDownEvent.notify({ pageX: e.pageX, pageY: e.pageY });
		e = e || window.event;
		pauseEvent(e);
	},

	// Scaling image UI
	scaleUp: function() {
		this.scaleUpEvent.notify();
	},

	scaleDown: function() {
		this.scaleDownEvent.notify();
	},

	scaleChange: function() {
		this.scaleChangeEvent.notify({ value: parseFloat(scaleValue.value) });
	},

	updateScale: function() {
		this.scaleValue.value = this.model.imscale.toFixed(2);
		this.render();
	},

	// Changing the token size UI
	sizeChange: function() {
		this.tokenSizeChangeEvent.notify({
			width: this.sizeSelect.value,
			height: this.sizeSelect.value
		});
	},

	widthChange: function() {
		this.tokenSizeChangeEvent.notify({
			width: this.tokenWidth.value,
			height: this.tokenWidth.value
		});
	},

	heightChange: function() {
		this.tokenSizeChangeEvent.notify({
			width: this.tokenHeight.value,
			height: this.tokenHeight.value
		});
	},

	selectBorder: function(e) {
		this.selectBorderEvent.notify({
			id: e.target.id
		});
	},

	changeTokenSize: function(width, height) {
		this.tokenWidth.value = width;
		this.tokenHeight.value = height;
		this.offscreen.width = width;
		this.offscreen.height = height;
		this.render();
	},

	// Dropdown border selection menu
	openMenu: function() {
		document.getElementById("droplabel").classList.toggle("show");
		document.getElementById("droparrow").classList.toggle("show");
		document.getElementById("dropdown-content").classList.toggle("show");
	},

	changeBorder: function() {
		this.border.src = this.model.frameData[this.model.borderId].filename;
		this.mask.src = this.model.frameData[this.model.borderId].maskname;
		document.getElementById("dropimg").src = border.src;
		this.redrawFrame();
	},

	// Upload File Dialog
	showFileDialog: function() {
		this.uploadBg.hidden = false;
	},

	hideFileDialog: function() {
		this.uploadBg.hidden = true;
		this.fileField.value = ""
		this.urlText.value = ""
	},

	clickUploadBg: function(e) {
		if (e.target == this.uploadBg) {
			this.hideFileDialog();
		}
	},

	// File Input/Output
	fileDrop: function(e) {
		pauseEvent(e);
		// If dropped items aren't files, reject them
		var dt = e.dataTransfer;
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
				this.image.src = dt.files[i].name;
			}  
		}
		this.hideFileDialog();
		this.fileHoverEnd();
	},

	chooseFile: function(e) {
		var tgt = e.target || window.event.srcElement, files = tgt.files;
		if (FileReader && files && files.length) {
			this.readImageFile(files[0]);
		}
		else {
			// TODO: Fill in error handling here
			// fallback -- perhaps submit the input to an iframe and temporarily store
			// them on the server until the user's session ends.
		}
		this.hideFileDialog();
	},

	fileHoverStart: function(e) {
		pauseEvent(e);
		this.dropArea.classList.add('is-dragover');
	},

	fileHoverEnd: function() {
		this.dropArea.classList.remove('is-dragover');
	},

	readImageFile: function(f) {
		var r = new FileReader();
		r.onload = function() {
			this.image.src = r.result;
		}.bind(this);
		r.readAsDataURL(f);
	},

	saveImage: function() {
		var a = document.createElement('a');
		var img = this.offscreen.toDataURL("image/png");
		a.download = "token.png";
		a.href = img;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	},

	// Rendering functions
	resizeCanvas: function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.render(); 
	},

	redrawFrame: function() {
		this.updateFrame();
		this.render();
	},

	updateFrame: function() {
		this.finalFrame.width = border.width;
		this.finalFrame.height = border.height;
		var ctx = this.finalFrame.getContext('2d');
		ctx.clearRect(0, 0, this.finalFrame.width, this.finalFrame.height);
		ctx.rect(0, 0, border.width, border.height);
		ctx.fillStyle = this.getColor(frameColor);
		ctx.fill();
		ctx.globalCompositeOperation = "multiply";
		ctx.drawImage(border, 0, 0, border.width, border.height);
		ctx.globalCompositeOperation = "destination-in";
		ctx.drawImage(border, 0, 0, border.width, border.height);
		ctx.globalCompositeOperation = "source-over";
	},

	getColor: function(elem) {
		return elem.jscolor.toRGBString();
	},

	render: function() {
		var w = this.canvas.width;
		var h = this.canvas.height;
		var scaleX = this.tokenWidth.value / this.finalFrame.width;
		var scaleY = this.tokenHeight.value / this.finalFrame.height;
		var brw = this.finalFrame.width * scaleX;
		var brh = this.finalFrame.height * scaleY;
		var imw = this.image.width * this.model.imscale;
		var imh = this.image.height * this.model.imscale;

		// Draw the main canvas
		this.context.clearRect(0, 0, canvas.width, canvas.height);
		this.context.drawImage(this.image, w/2 - imw/2 + this.model.imX, h/2 - imh/2 + this.model.imY, imw, imh);
		this.context.drawImage(this.finalFrame, w/2 - brw/2, h/2 - brh/2, brw, brh);

		// Initially draw preview to an offscreen canvas
		w = this.tokenWidth.value;
		h = this.tokenHeight.value;
		var ps = w / brw;
		this.offscreenCtx.clearRect(0, 0, w, h);
		if (this.solidBg.checked) {
			this.offscreenCtx.fillStyle = this.getColor(this.bgColor);
			this.offscreenCtx.rect(0, 0, w, h);
			this.offscreenCtx.fill();
			this.offscreenCtx.globalCompositeOperation = 'destination-atop';
			this.offscreenCtx.drawImage(this.mask, 0, 0, w, h);
		}
		this.offscreenCtx.globalCompositeOperation = 'source-over';
		this.offscreenCtx.drawImage(this.image, w/2 - imw*ps/2 + this.model.imX*ps, h/2 - imh*ps/2 + this.model.imY*ps, imw*ps, imh*ps);
		this.offscreenCtx.globalCompositeOperation = 'destination-in';
		this.offscreenCtx.drawImage(this.mask, 0, 0, w, h);

		this.offscreenCtx.globalCompositeOperation = 'source-over';
		this.offscreenCtx.drawImage(this.finalFrame, 0, 0, w, h);

		// Draw the preview frame
		this.prevctx.clearRect(0, 0, w, h);
		this.prevctx.globalAlpha = this.transparency.value / 100;
		this.prevctx.drawImage(this.offscreen, 0, 0, this.preview.width, this.preview.height);
	}
};

