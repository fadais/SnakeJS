
function Snake(name) {

	this.head = null;
	// momentum
	this.momentumX = 1; // starts with moving right
	this.momentumY = 0;

	// num of tail parts
	this.numTail = 0;
	// tail of the snake, containing all the coordinates of the tail parts
	this.tail = []; 
	// name
	this.name = name;
	// TODO color random 

	this.init = function() {
		this.head = field.placeSnake(0,0); // place snake at top
	}

	this.move = function() {
		var x = this.head.mapX;
		var y = this.head.mapY;
		if(this.numTail > 0) {
			// move every tail nach hinten
			for(var i = this.numTail-1; i > 0; i--) {
				this.tail[i] = this.tail[i-1];
			}
			this.tail[0] = new Cell(x*scale, y*scale, x, y, CellType.SNAKE);
		}
		var newX = x + this.momentumX;
		var newY = y + this.momentumY;

		field.checkForCollision(newX, newY);


		this.head = field.placeSnake(newX, newY);
	}

	this.addTail = function(cell) {
		this.tail.push(cell);
		this.numTail++;
	}

	this.moveUp = function() {
		if(this.momentumY == 0 || this.numTail == 0) {
			this.momentumX = 0;
			this.momentumY = -1;
		}
	}
	this.moveDown = function() {
		if(this.momentumY == 0 || this.numTail == 0) {
			this.momentumX = 0;
			this.momentumY = 1;
		}
	}
	this.moveLeft = function() {
		if(this.momentumX == 0 || this.numTail == 0) {
			this.momentumX = -1;
			this.momentumY = 0;
		}
	}
	this.moveRight = function() {
		if(this.momentumX == 0 || this.numTail == 0) {
			this.momentumX = 1;
			this.momentumY = 0;
		}
	}
}

