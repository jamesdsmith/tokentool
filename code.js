document.addEventListener('DOMContentLoaded', function(){
	var frameData = {
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
	var uploadBtn = document.getElementById('uploadBtn');
	var saveBtn = document.getElementById('saveBtn');
	var uploadBg = document.getElementById('uploadBg');
	var uploadDialog = document.getElementById('uploadDialog');
	var fileField = document.getElementById('fileField');
	var urlText = document.getElementById('urlText');
	var dropArea = document.getElementById('dropArea');
	var frameColor = document.getElementById('frameColor');
	var bgColor = document.getElementById('bgColor');
	var dropdownContent = document.getElementById('dropdown-content');
	var scaleValue = document.getElementById('scaleValue');

	var preview = document.getElementById('preview');
	var prevctx = preview.getContext('2d');
	var offscreen = document.createElement('canvas');
	offscreen.width = tokenWidth.value;
	offscreen.height = tokenHeight.value;
	var offscreenCtx = offscreen.getContext('2d');
	
	var finalFrame = document.createElement('canvas');
	var finalFrameColor = "rgb(255, 255, 255)"

	var mouseDown = false;
	var mouseX = 0;
	var mouseY = 0;

	var imX = 0;
	var imY = 0;

	var imscale = 1.0;
	var scaleX = 1.0;
	var scaleY = 1.0;

	var keys = Object.keys(frameData);
	for (var i = 0; i < keys.length; i++) {
		var im = document.createElement('img');
		im.id = keys[i];
		im.src = frameData[keys[i]].filename;
		dropdownContent.appendChild(im);
	}
	// <img src="images/frame-round-thick-sharp.png" />
	// <img src="images/frame-round-thin-soft.png" />

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
	urlText.addEventListener('keyup', function(e) {
		e.preventDefault();
		if (e.keyCode == 13) {
			document.getElementById('loadUrlBtn').click();
		}
	})
	uploadBg.addEventListener('drop', function(e) {
		e.preventDefault();
		// If dropped items aren't files, reject them
		var dt = e.dataTransfer;
		if (dt.items) {
			// Use DataTransferItemList interface to access the file(s)
			for (var i=0; i < dt.items.length; i++) {
				if (dt.items[i].kind == "file") {
					readImageFile(dt.items[i].getAsFile());
				}
			}
		} else {
			// Use DataTransfer interface to access the file(s)
			for (var i=0; i < dt.files.length; i++) {
				image.src = dt.files[i].name;
			}  
		}
		hideFileDialog();
		fileHoverEnd(e);
	});
	uploadBg.addEventListener('dragover', function(e) {
		e.preventDefault();
		fileHoverStart(e);
	});
	uploadBg.addEventListener('dragenter', fileHoverStart);
	uploadBg.addEventListener('dragleave', fileHoverEnd);
	uploadBg.addEventListener('dragend', fileHoverEnd);
	document.getElementById('dropbtn').addEventListener('click', openMenu);
	window.onclick = function(e) {
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
	}
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
	// frameColor.addEventListener('input', redrawFrame);
	// bgColor.addEventListener('input', render);

	function redrawFrame(v) {
		updateFrame();
		render();
	}

	function openMenu() {
		document.getElementById("droplabel").classList.toggle("show");
		document.getElementById("droparrow").classList.toggle("show");
		document.getElementById("dropdown-content").classList.toggle("show");
	}

	function selectBorder(e) {
		border.src = frameData[e.target.id].filename;
		mask.src = frameData[e.target.id].maskname;
		document.getElementById("dropimg").src = border.src;
		updateFrame();
		render();
	}

	function fileHoverStart(e) {
		dropArea.classList.add('is-dragover');
	}

	function fileHoverEnd(e) {
		dropArea.classList.remove('is-dragover');
	}

	function readImageFile(f) {
		var r = new FileReader();
		r.onload = function() {
			image.src = r.result;
		};
		r.readAsDataURL(f);
	}

	function showFileDialog() {
		uploadBg.hidden = false;
	}

	function hideFileDialog() {
		uploadBg.hidden = true;
		fileField.value = ""
		urlText.value = ""
	}

	function loadUrl() {
		if (urlText.value != "") {
			image.src = urlText.value;
			hideFileDialog();
		}
	}

	function chooseFile(e) {
		var tgt = e.target || window.event.srcElement, files = tgt.files;
		if (FileReader && files && files.length) {
			readImageFile(files[0]);
		}
		else {
			// TODO: Fill in error handling here
			// fallback -- perhaps submit the input to an iframe and temporarily store
			// them on the server until the user's session ends.
		}
		hideFileDialog();
	}

	function clickUploadBg(e) {
		if (e.target == this) {
			hideFileDialog();
		}
	}

	function uploadImg() {
		showFileDialog();
	}

	function saveImg() {
		var a = document.createElement('a');
		var img = offscreen.toDataURL("image/png");
		a.download = "token.png";
		a.href = img;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	function sizeChange() {
		tokenWidth.value = sizeSelect.value;
		tokenHeight.value = sizeSelect.value;
		offscreen.width = tokenWidth.value;
		offscreen.height = tokenHeight.value;
		render();
	}

	function widthChange() {
		tokenHeight.value = tokenWidth.value;
		offscreen.width = tokenWidth.value;
		offscreen.height = tokenHeight.value;
		render();
	}

	function heightChange() {
		tokenWidth.value = tokenHeight.value;
		offscreen.width = tokenWidth.value;
		offscreen.height = tokenHeight.value;
		render();
	}

	function scaleUp() {
		imscale += 0.1;
		scaleValue.value = imscale.toFixed(2);
		render();
	}

	function scaleDown() {
		imscale -= 0.1;
		scaleValue.value = imscale.toFixed(2);
		if (imscale < 0) {
			imscale = 0;
		}
		render();
	}

	function scaleChange() {
		imscale = parseFloat(scaleValue.value);
		scaleValue.value = imscale.toFixed(2);
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

	function updateFrame() {
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
	}

	function getColor(elem) {
		return elem.jscolor.toRGBString();
	}

	function render() {
		var w = canvas.width;
		var h = canvas.height;
		scaleX = tokenWidth.value / finalFrame.width;
		scaleY = tokenHeight.value / finalFrame.height;
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
});
