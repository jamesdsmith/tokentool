var TokenView = function (model) {
    this.model = model;
    this.addTaskEvent = new Event(this);
    this.selectTaskEvent = new Event(this);
    this.unselectTaskEvent = new Event(this);
    this.completeTaskEvent = new Event(this);
    this.deleteTaskEvent = new Event(this);

    this.init();
};

TokenView.prototype = {
    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable();
    },

    createChildren: function () {
        // cache the document object
        // this.$container = $('.js-container');
        // this.$addTaskButton = this.$container.find('.js-add-task-button');
        // this.$taskTextBox = this.$container.find('.js-task-textbox');
        // this.$tasksContainer = this.$container.find('.js-tasks-container');

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
		this.windowClickHandler = this.windowClick.bind(this);
		this.selectBorderHandler = this.selectBorder.bind(this);
		this.redrawFrameHandler = this.redrawFrame.bind(this);
		this.openMenuHandler = this.openMenu.bind(this);

        /**
        Handlers from Event Dispatcher
        */
        // this.addTaskHandler = this.addTask.bind(this);
        // this.clearTaskTextBoxHandler = this.clearTaskTextBox.bind(this);
        // this.setTasksAsCompletedHandler = this.setTasksAsCompleted.bind(this);
        // this.deleteTasksHandler = this.deleteTasks.bind(this);

        return this;
    },

    enable: function () {
        // this.$addTaskButton.click(this.addTaskButtonHandler);
        // this.$container.on('click', '.js-task', this.selectOrUnselectTaskHandler);
        // this.$container.on('click', '.js-complete-task-button', this.completeTaskButtonHandler);
        // this.$container.on('click', '.js-delete-task-button', this.deleteTaskButtonHandler);

        /**
         * Event Dispatcher
         */
        // this.model.addTaskEvent.attach(this.addTaskHandler);
        // this.model.addTaskEvent.attach(this.clearTaskTextBoxHandler);
        // this.model.setTasksAsCompletedEvent.attach(this.setTasksAsCompletedHandler);
        // this.model.deleteTasksEvent.attach(this.deleteTasksHandler);

		// window.addEventListener('resize', resizeCanvas);
		// window.addEventListener('load', resizeCanvas);
		// window.addEventListener('mousemove', onMouseMove);
		// canvas.addEventListener('mousedown', onMouseDown);
		// window.addEventListener('mouseup', onMouseUp);
		// solidBg.addEventListener('change', render);
		// transparency.addEventListener('input', render);
		// document.getElementById('scaleUp').addEventListener('click', scaleUp);
		// document.getElementById('scaleDown').addEventListener('click', scaleDown);
		// scaleValue.addEventListener('change', scaleChange);
		// tokenWidth.addEventListener('input', widthChange);
		// tokenHeight.addEventListener('input', heightChange);
		// sizeSelect.addEventListener('change', sizeChange);
		// saveBtn.addEventListener('click', saveImg);
		// uploadBtn.addEventListener('click', uploadImg);
		// uploadBg.addEventListener('click', clickUploadBg);
		// fileField.addEventListener('change', chooseFile);
		// image.addEventListener('load', render);
		// document.getElementById('loadUrlBtn').addEventListener('click', loadUrl);
		// urlText.addEventListener('keyup', handleUrlTextEnter)
		// uploadBg.addEventListener('drop', handleFileDrop);
		// uploadBg.addEventListener('dragover', fileHoverStart);
		// uploadBg.addEventListener('dragenter', fileHoverStart);
		// uploadBg.addEventListener('dragleave', fileHoverEnd);
		// uploadBg.addEventListener('dragend', fileHoverEnd);
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
        return this;
    },

	show: function() {
		this.render();
	},

	// @TODO: Move this to Controller?
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

	// @TODO: Move this to model?
	// Dropdown border selection menu
	openMenu: function() {
		document.getElementById("droplabel").classList.toggle("show");
		document.getElementById("droparrow").classList.toggle("show");
		document.getElementById("dropdown-content").classList.toggle("show");
	},

	selectBorder: function(e) {
		this.border.src = this.model.frameData[e.target.id].filename;
		this.mask.src = this.model.frameData[e.target.id].maskname;
		document.getElementById("dropimg").src = border.src;
		this.redrawFrame();
	},

	redrawFrame: function() {
		this.updateFrame();
		this.render();
	},

	updateFrame: function() {
		this.finalFrame = document.createElement('canvas');
		console.log(this.finalFrame);
		this.finalFrame.width = border.width;
		this.finalFrame.height = border.height;
		var ctx = this.finalFrame.getContext('2d');
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
		this.offscreenCtx.drawImage(this.image, w/2 - imw*ps/2 + this.imX*ps, h/2 - imh*ps/2 + this.imY*ps, imw*ps, imh*ps);
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

