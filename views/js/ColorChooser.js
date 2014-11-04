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

        var w = canvas.width;
		var h = canvas.height;
		
		var rgb;
		
		var colour = new HSVColour(0, 125, 125);

		for(var y = 0; y < h; y++){
			var hue = y * 360 / h;
			for(var x = 0; x < w; x++){
				if(x < w/2){
					colour = new HSVColour(hue, x*100/(w/2), 100);
				}else{
					colour = new HSVColour(hue, 100, 100 -((x- w/2)*100/(w/2)));
				}
				//colour.s = x * 255 / w;
				
				rgb = colour.getRGB();
				context.strokeStyle = "rgb(" + Math.floor(rgb["r"]) + "," + Math.floor(rgb["g"]) + "," + Math.floor(rgb["b"]) + ")";
				context.fillStyle = "rgb(" + Math.floor(rgb["r"]) + "," + Math.floor(rgb["g"]) + "," + Math.floor(rgb["b"]) + ")";
				context.fillRect(x,y,1,1);
			}
			//console.debug(rgb["g"]);
		}
        //drawColorSquare(canvas, 'white', imageObj);
      }

