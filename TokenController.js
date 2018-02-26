var TokenController = function (model, view) {
    this.model = model;
    this.view = view;

	this.mouseDown = false;
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
        this.addTaskHandler = this.addTask.bind(this);
        this.selectTaskHandler = this.selectTask.bind(this);
        this.unselectTaskHandler = this.unselectTask.bind(this);
        this.completeTaskHandler = this.completeTask.bind(this);
        this.deleteTaskHandler = this.deleteTask.bind(this);
        return this;
    },

    enable: function () {
        this.view.addTaskEvent.attach(this.addTaskHandler);
        this.view.completeTaskEvent.attach(this.completeTaskHandler);
        this.view.deleteTaskEvent.attach(this.deleteTaskHandler);
        this.view.selectTaskEvent.attach(this.selectTaskHandler);
        this.view.unselectTaskEvent.attach(this.unselectTaskHandler);
        return this;
    },
};
