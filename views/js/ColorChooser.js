	function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
	  
      function drawColorSquare(canvas, color, imageObj) {		
		document.getElementById("colorTextfield").style.backgroundColor = color;
		console.debug(color);
      }
	  
      function initColorChooser() {
		console.debug("initializing...");
        var padding = 0;
        var canvas = document.getElementById('colorCanvas');
        var context = canvas.getContext('2d');
        var mouseDown = false;
		var imageObj = document.getElementById("colorGradient");

        context.strokeStyle = '#444';
        context.lineWidth = 2;

        canvas.addEventListener('mousedown', function() {
          mouseDown = true;
        }, false);

        canvas.addEventListener('mouseup', function() {
          mouseDown = false;
        }, false);

        canvas.addEventListener('mousemove', function(evt) {
          var mousePos = getMousePos(canvas, evt);
          var color = undefined;

          if(mouseDown && mousePos !== null && mousePos.x > padding && mousePos.x < padding + imageObj.width && mousePos.y > padding && mousePos.y < padding + imageObj.height) {

            // color picker image is 256x256 and is offset by 10px
            // from top and bottom
            var imageData = context.getImageData(padding, padding, imageObj.width, imageObj.width);
            var data = imageData.data;
            var x = mousePos.x - padding;
            var y = mousePos.y - padding;
            var red = data[((imageObj.width * y) + x) * 4];
            var green = data[((imageObj.width * y) + x) * 4 + 1];
            var blue = data[((imageObj.width * y) + x) * 4 + 2];
            var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
            drawColorSquare(canvas, color, imageObj);
          }
        }, false);

        context.drawImage(imageObj, 0,0);
		console.debug("Drew image...");
        //drawColorSquare(canvas, 'white', imageObj);
      }

