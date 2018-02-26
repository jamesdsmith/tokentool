var TaskView = function (model) {
    this.model = model;
    this.addTaskEvent = new Event(this);
    this.selectTaskEvent = new Event(this);
    this.unselectTaskEvent = new Event(this);
    this.completeTaskEvent = new Event(this);
    this.deleteTaskEvent = new Event(this);

    this.init();
};

TaskView.prototype = {
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
		offscreen.width = tokenWidth.value;
		offscreen.height = tokenHeight.value;
		this.offscreenCtx = offscreen.getContext('2d');
		this.finalFrame = document.createElement('canvas');


		var keys = Object.keys(frameData);
		for (var i = 0; i < keys.length; i++) {
			var im = document.createElement('img');
			im.id = keys[i];
			im.src = frameData[keys[i]].filename;
			dropdownContent.appendChild(im);
		}
        return this;
    },

    setupHandlers: function () {
        // this.addTaskButtonHandler = this.addTaskButton.bind(this);
        // this.selectOrUnselectTaskHandler = this.selectOrUnselectTask.bind(this);
        // this.completeTaskButtonHandler = this.completeTaskButton.bind(this);
        // this.deleteTaskButtonHandler = this.deleteTaskButton.bind(this);

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

		window.addEventListener('resize', resizeCanvas);
		window.addEventListener('load', resizeCanvas);
		window.addEventListener('mousemove', onMouseMove);
		canvas.addEventListener('mousedown', onMouseDown);
		window.addEventListener('mouseup', onMouseUp);
		solidBg.addEventListener('change', render);
		transparency.addEventListener('input', render);
		document.getElementById('scaleUp').addEventListener('click', scaleUp);
		document.getElementById('scaleDown').addEventListener('click', scaleDown);
		scaleValue.addEventListener('change', scaleChange);
		tokenWidth.addEventListener('input', widthChange);
		tokenHeight.addEventListener('input', heightChange);
		sizeSelect.addEventListener('change', sizeChange);
		saveBtn.addEventListener('click', saveImg);
		uploadBtn.addEventListener('click', uploadImg);
		uploadBg.addEventListener('click', clickUploadBg);
		fileField.addEventListener('change', chooseFile);
		image.addEventListener('load', render);
		document.getElementById('loadUrlBtn').addEventListener('click', loadUrl);
		urlText.addEventListener('keyup', handleUrlTextEnter)
		uploadBg.addEventListener('drop', handleFileDrop);
		uploadBg.addEventListener('dragover', fileHoverStart);
		uploadBg.addEventListener('dragenter', fileHoverStart);
		uploadBg.addEventListener('dragleave', fileHoverEnd);
		uploadBg.addEventListener('dragend', fileHoverEnd);
		document.getElementById('dropbtn').addEventListener('click', openMenu);
		window.addEventListener('click', handleWindowClick);
		var items = Array.from(document.getElementById("dropdown-content").children);
		var i;
		for (i = 0; i < items.length; i++) {
			var item = items[i];
			item.addEventListener('click', selectBorder);
		}
		border.addEventListener('load', redrawFrame);
		mask.addEventListener('load', redrawFrame);
		frameColor.jscolor.onFineChange = redrawFrame;
		bgColor.jscolor.onFineChange = redrawFrame;
		redrawFrame();
        return this;
    },

	show: function() {
		this.render();
	},

	updateFrame: function() {
		finalFrame = document.createElement('canvas');
		finalFrame.width = border.width;
		finalFrame.height = border.height;
		var ctx = finalFrame.getContext('2d');
		ctx.rect(0, 0, border.width, border.height);
		ctx.fillStyle = getColor(frameColor);
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
		var w = canvas.width;
		var h = canvas.height;
		var scaleX = tokenWidth.value / finalFrame.width;
		var scaleY = tokenHeight.value / finalFrame.height;
		var brw = finalFrame.width * scaleX;
		var brh = finalFrame.height * scaleY;
		var imw = image.width*imscale;
		var imh = image.height*imscale;

		// Draw the main canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(image, w/2 - imw/2 + imX, h/2 - imh/2 + imY, imw, imh);
		context.drawImage(finalFrame, w/2 - brw/2, h/2 - brh/2, brw, brh);

		// Initially draw preview to an offscreen canvas
		w = tokenWidth.value;
		h = tokenHeight.value;
		ps = w / brw;
		offscreenCtx.clearRect(0, 0, w, h);
		if (solidBg.checked) {
			offscreenCtx.fillStyle = getColor(bgColor);
			offscreenCtx.rect(0, 0, w, h);
			offscreenCtx.fill();
			offscreenCtx.globalCompositeOperation = 'destination-atop';
			offscreenCtx.drawImage(mask, 0, 0, w, h);
		}
		offscreenCtx.globalCompositeOperation = 'source-over';
		offscreenCtx.drawImage(image, w/2 - imw*ps/2 + imX*ps, h/2 - imh*ps/2 + imY*ps, imw*ps, imh*ps);
		offscreenCtx.globalCompositeOperation = 'destination-in';
		offscreenCtx.drawImage(mask, 0, 0, w, h);

		offscreenCtx.globalCompositeOperation = 'source-over';
		offscreenCtx.drawImage(finalFrame, 0, 0, w, h);

		// Draw the preview frame
		prevctx.clearRect(0, 0, w, h);
		prevctx.globalAlpha = transparency.value / 100;
		prevctx.drawImage(offscreen, 0, 0, preview.width, preview.height);
	}
};

