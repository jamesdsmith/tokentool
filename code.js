document.addEventListener('DOMContentLoaded', function(){
    var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var border = document.getElementById('border');
	var mask = document.getElementById('mask');
	var image = document.getElementById('image');
	var solidBg = document.getElementById('solidBackground');

    var preview = document.getElementById('preview');
	var prevctx = preview.getContext('2d');
	
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
	window.addEventListener('mouseup', onMouseUp);
	solidBg.addEventListener('change', drawStuff);
	document.getElementById('scaleUp').addEventListener('click', scaleUp);
	document.getElementById('scaleDown').addEventListener('click', scaleDown);

	function scaleUp() {
		imscale += 0.1;
		drawStuff();
	}

	function scaleDown() {
		imscale -= 0.1;
		if (imscale < 0) {
			imscale = 0;
		}
		drawStuff();
	}

    function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		drawStuff(); 
    }

	function onMouseDown(e) {
		mouseDown = true;
		mouseX = e.pageX;
		mouseY = e.pageY;
		e = e || window.event;
		pauseEvent(e);
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
			e = e || window.event;
			pauseEvent(e);
		}
	}

	function pauseEvent(e){
		if(e.stopPropagation) e.stopPropagation();
		if(e.preventDefault) e.preventDefault();
		e.cancelBubble=true;
		e.returnValue=false;
		return false;
	}

    function drawStuff() {
		var w = canvas.width;
		var h = canvas.height;
		var brw = border.width;
		var brh = border.height;
		var imw = image.width*imscale;
		var imh = image.height*imscale;

		context.clearRect(0, 0, canvas.width, canvas.height);
		//context.beginPath();
		context.drawImage(image, w/2 - imw/2 + imX, h/2 - imh/2 + imY, imw, imh);
		context.drawImage(border, w/2 - brw/2, h/2 - brh/2, brw, brh);
		//context.stroke();

		// Draw preview frame
		w = preview.width;
		h = preview.height;
		ps = w / brw
		prevctx.clearRect(0, 0, w, h);
		prevctx.drawImage(mask, 0, 0, w, h);
		prevctx.globalCompositeOperation = 'source-in';
		prevctx.drawImage(image, w/2 - imw*ps/2 + imX*ps, h/2 - imh*ps/2 + imY*ps, imw*ps, imh*ps);
		if (solidBg.checked) {
			prevctx.globalCompositeOperation = 'destination-over';
			prevctx.drawImage(mask, 0, 0, w, h);
		}
		prevctx.globalCompositeOperation = 'source-over';
		prevctx.drawImage(border, 0, 0, w, h);
    }
});
