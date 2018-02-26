
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

    this.addTaskEvent = new Event(this);
    this.removeTaskEvent = new Event(this);
    this.setTasksAsCompletedEvent = new Event(this);
    this.deleteTasksEvent = new Event(this);
};

TokenModel.prototype = {

    addTask: function (task) {
        this.tasks.push({
            taskName: task,
            taskStatus: 'uncompleted'
        });
        this.addTaskEvent.notify();
    },

    getTasks: function () {
        return this.tasks;
    },

    setSelectedTask: function (taskIndex) {
        this.selectedTasks.push(taskIndex);
    },

    unselectTask: function (taskIndex) {
        this.selectedTasks.splice(taskIndex, 1);
    },

    setTasksAsCompleted: function () {
        var selectedTasks = this.selectedTasks;
        for (var index in selectedTasks) {
            this.tasks[selectedTasks[index]].taskStatus = 'completed';
        }

        this.setTasksAsCompletedEvent.notify();
        this.selectedTasks = [];
    },


    deleteTasks: function () {
        var selectedTasks = this.selectedTasks.sort();

        for (var i = selectedTasks.length - 1; i >= 0; i--) {
            this.tasks.splice(this.selectedTasks[i], 1);
        }

        // clear the selected tasks
        this.selectedTasks = [];
        this.deleteTasksEvent.notify();
    }
};
