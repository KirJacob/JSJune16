//***** SeaWar *****//
function createArray(number){
	var array = new Array(number);
	for (var i = 0; i <= (number - 1); i++){
		array[ i ] = new Array(number);
	}
	for (j = 0; j <= (number - 1); j++){
		for (k = 0; k <=(number - 1); k++){
			array[ j ][ k ] = new cell(array, j, k, false, false, 0);
		}
	}
	return array;
}

function cell(array,xpos,ypos,isShip, isOpened,number){
	this.xpos = xpos;
	this.ypos = ypos;
	this.isShip = isShip;
	this.isOpened = isOpened;
	this.number = number;

	this.print = function print(){
		console.log("(x=" + this.xpos+ ": y=" + this.ypos + ":isShip=" + this.isShip + ":number=" + this.number + ")");
	}
	this.north = function north(){
		if (xpos != 0)
			return array[xpos - 1][ypos];
		else return array[xpos][ypos];
	}
 	this.south = function south(){
		if (xpos != 9)
			return array[xpos + 1][ypos];
		else return array[xpos][ypos];
 	}
 	this.west = function west(){
		if (ypos != 0)
			return array[xpos][ypos - 1];
		else return array[xpos][ypos];
 	}
 	this.east = function east(){
		if (ypos != 9)
			return array[xpos][ypos + 1];
		else return array[xpos][ypos];
 	}
 	this.isShipNear = function isShipNear(){
		var result = false;
		if ((this.north().isShip)||(this.south().isShip)||(this.west().isShip)||(this.east().isShip))
			result = true;
		if ((this.north().east().isShip)||(this.south().west().isShip)||(this.west().north().isShip)||(this.east().south().isShip))
			result = true;
		return result;
 	}
 	this.openCells = function openCells(){
 		var cell = this;
 		if (!cell.north().isOpened)
 			cell.north().isOpened = true;
 		if (!cell.south().isOpened)
 			cell.south().isOpened = true;
 		if (!cell.west().isOpened)
 			cell.west().isOpened = true;
 		if (!cell.east().isOpened)
 			cell.east().isOpened = true;
 		if (!cell.north().west().isOpened)
 			cell.north().west().isOpened = true;
 		if (!cell.west().south().isOpened)
 			cell.west().south().isOpened = true;
 		if (!cell.south().east().isOpened)
 			cell.south().east().isOpened = true;
 		if (!cell.east().north().isOpened)
 			cell.east().north().isOpened = true;
 	}
}

function ship(shipId){
	this.shipId = shipId;
	this.cellsArray = [];
	this.addCell = function addCell(cellAdded){
		this.cellsArray.push(cellAdded);
	}
	this.size = function size(){
		return this.cellsArray.length;
	}
	this.openCellsAround = function openCellsAround(){
		for (var cellNum in this.cellsArray){
			this.cellsArray[cellNum].openCells();
			console.log("HERE IS THE SHIP");
			this.cellsArray[cellNum].print();

		}
	}
}

function isInside(size, direction, xpos, ypos){
	var result = true;
 	//check with field borders
	switch(direction){
		case 1:
			if ((xpos + size - 1) > 9) result = false;
			break;
		case 2:
			if ((ypos + size - 1) > 9) result = false;
			break;
		case 3:
			if ((xpos - size  + 1) < 0) result = false;
			break;
		case 4:
			if ((ypos - size + 1) < 0) result = false;
			break;
		default:
		break;
	}
	return result;
}

function checkPosDirection(size, direction, xpos, ypos){
	var result = true;
	//check with field borders
	if (!isInside(size, direction, xpos, ypos))
		result = false;
	//check with other ships
	if (result)
		for (var i = 0; i < size; i ++){
			if (cellGet(array, i, direction, xpos, ypos).isShip) result = false;
			if (cellGet(array, i, direction, xpos, ypos).isShipNear()) result = false;
		}
	return result;
}

function cellGet(array, step, direction, xc, yc) {
	switch (direction){
		case 1: 
			return array[xc + step][yc];
			break;
		case 2: 
			return array[xc][yc+step];
			break;
		case 3: 
			return array[xc - step][yc];
			break;
		case 4: 
			return array[xc][yc-step];
			break;
		default:
		break;
 	}
}

function setShip(array, size, direction, xpos, ypos){
	for (var i = 0; i < size; i++){
		cellGet(array, i, direction, xpos, ypos).isShip = true;
		cellGet(array, i, direction, xpos, ypos).number = size;
 }
}

function openCellsAfterKill(){
	currentShip.size();
	ships.push(currentShip);
	currentShip.openCellsAround();
}

function randomShoot(array){
	var randomX;
	var randomY;
	var result;
	var field;

	do{
		randomX = rnd(0,9);
		randomY = rnd(0,9);
		field = array[ randomX ][ randomY ];
		console.log("randomShoot:" + randomX+":"+randomY);
	}while(field.isOpened);

	field.isOpened = true;
	shootStatus = "Empty";

	if (field.number == 1){
		shootStatus = "Killed";
		currentShip = new ship(ships.length);
		currentShip.addCell(field);
		openCellsAfterKill(field);
	}

	else if (field.number > 1) {
		shootStatus ="Injured";
		fightStatus = "Injured";
		injuredCell = field;
		currentShip = new ship(ships.length);
		currentShip.addCell(field);
	}

	if (field.number != 0) console.log(shootStatus);
	result = "[" + randomX + ":" + randomY+"]";
	arrayShootHistory.push(result);
	return result;
 }

 function killShip(field){
	console.log("kill the ship");
	fightStatus = "Empty";
	var shootField;
	
	do{
		shootField = randomFieldAround(field);
		shootField.isOpened = true;
		shootField.print();
 	}while(!shootField.isShip);
 	
 	currentShip.addCell(shootField);
 	var sizeNow = currentShip.size();

 	if (shootField.number == sizeNow)
 		openCellsAfterKill(currentShip);
}

function randomFieldAround(field){
	var direction;
	var cellSet;
	var xo= field.xpos;
	var yo = field.ypos;
	var isPossible;
	var condition;
	
	do{
		condition = false;
		direction = rnd(1,4);
		isPossible = isInside(2, direction, xo, yo);
		console.log("direction"+direction + "isPos" + isPossible);
		if (isPossible){
			cellSet = cellGet(array, 1, direction, xo, yo);
			if (cellSet.isOpened) condition = true;
		} else condition = true;
	}while(condition);
	return cellSet;
}

function printOwnArray(array){
	var field = "";
	var tempStr;
	var emptyCh = "  0  ";
 for (var i = 0; i < array.length; i++){
	for (var j = 0; j < array.length; j++){
	if (array[ i ][ j ].isShip) tempStr = "  "+ array[ i ][ j ].number +"  ";
	else tempStr = emptyCh;
	
	if (array[ i ][ j ].isOpened)
		if (array[ i ][ j ].isShip) tempStr = "  X  ";
	else tempStr = "  []  ";
	field = field + tempStr;
 }
 field = field + "\n";
}
field = field + "-----------------------------------------------------";
return field;
}

function printEnemyArray(array){
	var field = "";
	var tempStr;
	var shipCh = " H ";
	var emptyCh = "  ..  ";
 for (var i = 0; i < array.length; i++){
	for (var j = 0; j < array.length; j++){
	
	if (array[ i ][ j ].isOpened){
		if (array[ i ][ j ].isShip) tempStr = "  0"+ array[ i ][ j ].number +"  ";
		else tempStr = "  00  ";
	}else{
		tempStr = emptyCh;
	}
	
	field = field + tempStr;
}
field = field + "\n";
}
field = field + "-----------------------------------------------------";
return field;
}

function rnd(from,to){
	return Math.floor(Math.random()*(to-from+1)) + from;
}

function printShip(size,direction,xpos,ypos,addBefore){
	console.log(addBefore+shipsSize[size] +  ":" + randomDirection + ":" + randomXPos + ":" + randomYPos);
}

// MAIN GAME CYCLE
// to implement
// open surround ship cells
// close Injured status when ship is killed
// implementation for 1cell ship
// implementation for 2cell ship

var array = createArray(10);
var shootStatus;
var fightStatus;
var injuredCell;
var shipsSize = [1,1,1,1,2,2,2,3,3,4];
var arrayShootHistory =[];
var ships = [];
var currentShip;


//Installing Ships for Computer
for (var size in shipsSize){
	do {
		var randomDirection = rnd(1,4);
		var randomXPos = rnd(0,9);
		var randomYPos = rnd(0,9);
	}while(!checkPosDirection(shipsSize[size], randomDirection, randomXPos, randomYPos));
	
	setShip(array,shipsSize[size],randomDirection, randomXPos, randomYPos);
}

//Shooting two times
for (var i = 1; i <= 2; i++){
	if (fightStatus != "Injured")
		console.log(randomShoot(array));
	if (fightStatus == "Injured"){
		killShip(injuredCell);
	}
}

//Printing field
console.log(printEnemyArray(array));
if (ships.length != 0){
	console.log(ships[0]);	
	console.log(ships[0].cellsArray[0]);
	ships[0].cellsArray[0].print();
}
