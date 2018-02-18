document.addEventListener('DOMContentLoaded', function(){
    var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var border = document.getElementById('border');
	var mask = document.getElementById('mask');
	var image = document.getElementById('image');
	var solidBg = document.getElementById('solidBackground');
	var transparency = document.getElementById('transparency');
	var tokenWidth = document.getElementById('tokenWidth');
	var tokenHeight = document.getElementById('tokenHeight');
	var sizeSelect = document.getElementById('sizeSelect');
	var saveBtn = document.getElementById('save');

    var preview = document.getElementById('preview');
	var prevctx = preview.getContext('2d');
	var offscreen = document.createElement('canvas');
	offscreen.width = preview.width;
	offscreen.height = preview.height;
	var offscreenCtx = offscreen.getContext('2d');
	
	var mouseDown = false;
	var mouseX = 0;
	var mouseY = 0;

	var imX = 0;
	var imY = 0;

	var imscale = 1.0;
	var scaleX = 1.0;
	var scaleY = 1.0;

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas);
	window.addEventListener('load', resizeCanvas);
	window.addEventListener('mousemove', onMouseMove);
	canvas.addEventListener('mousedown', onMouseDown);
	window.addEventListener('mouseup', onMouseUp);
	solidBg.addEventListener('change', render);
	transparency.addEventListener('input', render);
	document.getElementById('scaleUp').addEventListener('click', scaleUp);
	document.getElementById('scaleDown').addEventListener('click', scaleDown);
	tokenWidth.addEventListener('input', widthChange);
	tokenHeight.addEventListener('input', heightChange);
	sizeSelect.addEventListener('change', sizeChange);
	saveBtn.addEventListener('click', saveImg);

	function saveImg() {
		var a = document.createElement('a');
		var img = preview.toDataURL("image/png");
		a.download = "token.png";
		a.href = img;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	function sizeChange() {
		tokenWidth.value = sizeSelect.value;
		tokenHeight.value = sizeSelect.value;
		render();
	}

	function widthChange() {
		tokenHeight.value = tokenWidth.value;
		render();
	}

	function heightChange() {
		tokenWidth.value = tokenHeight.value;
		render();
	}

	function scaleUp() {
		imscale += 0.1;
		render();
	}

	function scaleDown() {
		imscale -= 0.1;
		if (imscale < 0) {
			imscale = 0;
		}
		render();
	}

    function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		render(); 
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
			render();
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

    function render() {
		var w = canvas.width;
		var h = canvas.height;
		scaleX = tokenWidth.value / border.width;
		scaleY = tokenHeight.value / border.height;
		var brw = border.width * scaleX;
		var brh = border.height * scaleY;
		var imw = image.width*imscale;
		var imh = image.height*imscale;


		// Draw the main canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(image, w/2 - imw/2 + imX, h/2 - imh/2 + imY, imw, imh);
		context.drawImage(border, w/2 - brw/2, h/2 - brh/2, brw, brh);

		// Initially draw preview to an offscreen canvas
		w = preview.width;
		h = preview.height;
		ps = w / brw;
		offscreenCtx.clearRect(0, 0, w, h);
		offscreenCtx.drawImage(mask, 0, 0, w, h);
		offscreenCtx.globalCompositeOperation = 'source-in';
		offscreenCtx.drawImage(image, w/2 - imw*ps/2 + imX*ps, h/2 - imh*ps/2 + imY*ps, imw*ps, imh*ps);
		if (solidBg.checked) {
			offscreenCtx.globalCompositeOperation = 'destination-over';
			offscreenCtx.drawImage(mask, 0, 0, w, h);
		}
		offscreenCtx.globalCompositeOperation = 'source-over';
		offscreenCtx.drawImage(border, 0, 0, w, h);

		// Draw the preview frame
		prevctx.clearRect(0, 0, w, h);
		prevctx.globalAlpha = transparency.value / 100;
		prevctx.drawImage(offscreen, 0, 0);
    }
});
