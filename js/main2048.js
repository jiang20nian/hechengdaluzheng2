var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;


$(document).ready(function (){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){
	
	if (documentWidth > 500) {
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}
	
	$("#gridContainer").css("width", gridContainerWidth - 2 * cellSpace);
	$("#gridContainer").css("height", gridContainerWidth - 2 * cellSpace);
	$("#gridContainer").css("padding", cellSpace);
	$("#gridContainer").css("border-radius", 0.02 * gridContainerWidth);
	
	$(".grid-cell").css("width", cellSideLength);
	$(".grid-cell").css("height", cellSideLength);
	$(".grid-cell").css("border-radius", 0.02 * cellSideLength);
}


function newgame(){
	//初始化棋盘
	init();
	//随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for (var i = 0; i < 4; i ++) {
		for (var j = 0; j < 4; j ++) {
			var gridCell = $("#gridCell" + i + j);
//			console.log(gridCell);
			gridCell.css("top", getPosTop(i, j));
			gridCell.css("left", getPosLeft(i, j));
		}
	}
//		二维数组初始化
		for (var i =0; i < 4; i ++) {
			board[i] = new Array();
			hasConflicted[i] = new Array();
			for (var j = 0; j < 4; j ++) {
				board[i][j] = 0;
				hasConflicted[i][j] = false;
			}
		}
		
		updateBoardView();
		
		score = 0;
		
}

function updateBoardView(){
	
	$(".number-cell").remove();
	for (var i = 0; i < 4; i ++) {
		for (var j = 0; j < 4; j ++) {
			$("#gridContainer").append("<div class='number-cell' id='numberCell" + i + j + "' " + "></div>");
			var theNumberCell = $("#numberCell" + i + j);
			
			if (!board[i][j]) {
				theNumberCell.css("width", "0px");
				theNumberCell.css("height", "0px");
				theNumberCell.css("top", getPosTop(i, j) + cellSideLength / 2);
				theNumberCell.css("left", getPosLeft(i, j) + cellSideLength / 2);
			} else{
				theNumberCell.css("width", cellSideLength);
				theNumberCell.css("height", cellSideLength);
				theNumberCell.css("top", getPosTop(i, j));
				theNumberCell.css("left", getPosLeft(i, j));
				theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
				theNumberCell.css("color", getNumberColor(board[i][j]));
				theNumberCell.text(getNumberText(board[i][j]));
			}
			hasConflicted[i][j] = false;
		}
		
	}
	
	$(".number-cell").css("line-height", cellSideLength + "px");
	$(".number-cell").css("font-size", 0.3 * cellSideLength + "px");
}

function generateOneNumber(){
	
	if (nospace(board)) {
		return false;
	}
	
//	随机一个位置
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));
	
	var times = 0;
	while(times < 50){
		if (!board[randx][randy]) {
			break;
		}
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));
		
		times ++;
	}
	if (times == 50) {
		for (var i = 0; i < 4; i ++) {
			for (var j = 0; j < 4; j ++) {
				if (!board[i][j]) {
					randx = i;
					randy = j;
				}
			}
		}
	}
//	随机一个数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;
	
//	在随机位置显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx, randy, randNumber);
	
	
	return true;
	
}

$(document).keydown(function(event){

	event = event || window.event;
	switch(event.keyCode){
		case 37://left
			event.preventDefault();
			if(moveLeft()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		case 38://up
			event.preventDefault();
			if(moveUp()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		case 39://right
			event.preventDefault();
			if(moveRight()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		case 40://down
			event.preventDefault();
			if(moveDown()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		default:
			break;
	}
});

document.addEventListener("touchstart", function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener("touchmove", function(event){
	event.preventDefault();
});

document.addEventListener("touchend", function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	
	var deltax = endx - startx;
	var deltay = endy - starty;
	
	if (Math.abs(deltax) < 0.2 * documentWidth && Math.abs(deltay) <  0.2 * documentWidth) {
		return;
	}
	
	//x
	if (Math.abs(deltax) >= Math.abs(deltay)) {
		if (deltax > 0) {
			//right
			if(moveRight()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}else{
			//left
			if(moveLeft()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}
	}else{
		if (deltay > 0) {
			//down
			if(moveDown()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}else{
			//up
			if(moveUp()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}
	}
});


function isGameOver(){
	if (nospace(board) && nomove(board)) {
		gameover();
	}
}

function gameover(){
	alert("您别太爱了！");
}




function moveLeft(){
	
	if (!canMoveLeft(board)) {
		return false;
	}
	
	for (var i = 0; i < 4; i ++) {
		for (var j = 1; j < 4; j ++) {
			if (board[i][j]) {
				
				for (var k = 0; k < j; k ++) {
					if (!board[i][k] && noBlockHorizontal(i, k, j, board)) {
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						
						score += board[i][k];
						updateScore(score);
						
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	
	setTimeout("updateBoardView()", 200);
	
	return true;
}

function moveUp(){
	
	if (!canMoveUp(board)) {
		return false;
	}
	
	for (var j = 0; j < 4; j ++) {
		 for (var i = 1; i < 4; i ++){
			if (board[i][j]) {
				
				for (var k = 0; k < i; k ++) {
					if (!board[k][j] && noBlockVertical(j, k, i, board)) {
						
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
						
						showMoveAnimation(i, j, k, j);
						
						board[k][j] += board[i][j];
						board[i][j] = 0;
						
						score += board[k][j];
						updateScore(score);
						
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveRight(){
	
	if (!canMoveRight(board)) {
		return false;
	}
	
	for (var i = 0; i < 4; i ++) {
		for (var j = 2; j >= 0; j --) {
			if (board[i][j]) {
				
				for (var k = 3; k > j; k --) {
					if (!board[i][k] && noBlockHorizontal(i, j, k, board)) {
						
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
						
						showMoveAnimation(i, j, i, k);
						
						board[i][k] += board[i][j];
						board[i][j] = 0;
						
						score += board[i][k];
						updateScore(score);
						
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveDown(){
	
	if (!canMoveDown(board)) {
		return false;
	}
	
	for (var j = 0; j < 4; j ++) {
		for (var i = 2; i >= 0; i --) {
			if (board[i][j]) {
				
				for (var k = 3; k > i; k --) {
					if (!board[k][j] && noBlockVertical(j, i, k, board)) {
						
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
						
						showMoveAnimation(i, j, k, j);
						
						board[k][j] += board[i][j];
						board[i][j] = 0;
						
						score += board[k][j];
						updateScore(score);
						
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()", 200);
	return true;
}



