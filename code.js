document.addEventListener('DOMContentLoaded', function(){
    var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var border = document.getElementById('border');
	var mask = document.getElementById('mask');
	var image = document.getElementById('image');
	
	var mouseDown = false;
	var mouseX = 0;
	var mouseY = 0;

	var imX = 0;
	var imY = 0;

	var imscale = 1.0;

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas);
	window.addEventListener('load', resizeCanvas);
	window.addEventListener('mousemove', onMouseMove);
	canvas.addEventListener('mousedown', onMouseDown);
	canvas.addEventListener('mouseup', onMouseUp);

    function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		drawStuff(); 
    }

	function onMouseDown(e) {
		mouseDown = true;
		mouseX = e.pageX;
		mouseY = e.pageY;
	}

	function onMouseUp(e) {
		mouseDown = false;
	}

	function onMouseMove(e) {
		if (mouseDown) {
			var deltaX = e.pageX - mouseX;
			var deltaY = e.pageY - mouseY;
			mouseX = e.pageX;
			mouseY = e.pageY;
			imX += deltaX;
			imY += deltaY;
			drawStuff();
		}
	}

    function drawStuff() {
		// do your drawing stuff here
		context.clearRect(0, 0, canvas.width, canvas.height);

		var w = canvas.width;
		var h = canvas.height;
		var brw = border.width;
		var brh = border.height;
		var imw = image.width*imscale;
		var imh = image.height*imscale;

		var gco = context.globalContextOperation
		//context.beginPath();
		//context.drawImage(mask, w/2 - brw/2, h/2 - brh/2, mask.width, mask.height);
		//context.globalCompositeOperation = 'source-in';
		context.drawImage(image, w/2 - imw/2 + imX, h/2 - imh/2 + imY, imw, imh);
		//context.globalCompositeOperation = 'source-over';
		context.drawImage(border, w/2 - brw/2, h/2 - brh/2, brw, brh);
		//context.stroke();
    }
});
