var rotation = 0;
var radius = 10;
var topRotation = 0.5;
var moveEnabled = true;

document.onkeydown = checkKey;
function checkKey(e) {
	if(moveEnabled == true){
		e = e || window.event;
		
		//e
		if (e.keyCode == '69') {
			camera.position.z += 1;
		}
		//f
		if (e.keyCode == '70') {
			Pipette();
		}
		//q
		if (e.keyCode == '81') {
			camera.position.z -= 1;
		}
		//a
		if (e.keyCode == '65') {
			rotation += -0.04;
		}
		//d
		if (e.keyCode == '68') {
			rotation += 0.04;
		}
		//w
		if (e.keyCode == '87') {
			radius -= 0.5;
		}
		//s
		if (e.keyCode == '83') {
			radius += 0.5;
		}
		//left
		if (e.keyCode == '100'){
			moveAllBlocks([0,-1,0]);
		}
		//up
		if (e.keyCode == '105'){
			moveAllBlocks([0,0,1]);
		}
		//right
		if (e.keyCode == '102'){
			moveAllBlocks([0,1,0]);
		}
		//down
		if (e.keyCode == '99'){
			moveAllBlocks([0,0,-1]);
		}
		//vor
		if (e.keyCode == '98'){
			moveAllBlocks([1,0,0]);
		}
		//zurück
		if (e.keyCode == '104'){
			moveAllBlocks([-1,0,0]);
		}
		//console.debug(e.keyCode);
		CalcRotation();
		camera.lookAt(center);
	}
}

function CalcRotation(){
	nradius = Math.cos(topRotation) * radius;
	camera.position.x = Math.cos(rotation) * nradius;
	camera.position.y = Math.sin(rotation) * nradius;
	camera.position.z = Math.sin(topRotation) * radius;
}

function disableMove(){
	moveEnabled = false;
}

function enableMove(){
	moveEnabled = true;
}

//MouseControls
var oldPos = [0,0];
var deltaPos = [0,0];
var cameraMoving = false;
var time = false;

function CamMove(e){
	if(e.which == 1){
		time = true;
		window.setTimeout("startMove()", 160);
	}
}

function startMove(e){
	if(time == true){
		cameraMoving = true;
		document.body.style.cursor = "move";
		time = false;
	}else{
		cameraMoving = false;
	}
}

function CamStopMove(e){
	if(e.which == 1){
		if(cameraMoving == false){
			ClickCheck(e);	
		}
		cameraMoving = false;
		time = false;
		document.body.style.cursor = "default";
	}
}

function CalcDeltaPos(e){
	var x = e.clientX || e.pageX; 
    var y = e.clientY || e.pageY;
	deltaPos[0] = oldPos[0] - x;
	deltaPos[1] = oldPos[1] - y;
	oldPos = [x,y];
	
	if(cameraMoving == true){
		topRotation -= deltaPos[1]/200;
		if(topRotation > 1.5){
			topRotation = 1.5;
		}else if(topRotation < -1.5){
			topRotation = -1.5;
		}
		rotation += deltaPos[0]/200;
		CalcRotation();
		camera.lookAt(center);
	}
}