var scale = 15; // cell size 

var CellType = {
	EMPTY : 0,
	SNAKE: 1,
	FOOD: 2,
}

/*
*	Field of the game
*	drawn on a canvas, it seperates it with cell size of scale*scale
*/
class Field {
	constructor(canvasName) {
		// canvas from html
		this.canvas = document.getElementById(canvasName);
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		// js canva struct
		this.ctx = this.canvas.getContext('2d');
		// windows sizes
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		// 2d array representing the field 
		this.map = [];
		// map cell numbers
		this.numRows = 0;
		this.numCols = 0;

		// init field
		this.init();
	}

	removeCellsOfType(type) {
		this.map.forEach(function(row) {
			row.forEach(function(col) {
				if(col.content === type) {
					col.content = CellType.EMPTY;
				}
			}, this); // this is given to the function so it can call this.drawSnake
		}, this);
	}

	genNewFood() {
		this.removeCellsOfType(CellType.FOOD);
		var x = null;
		var y = null;
		var i = 0;
		while(i < 1000) {
			x = Math.floor(Math.random() * (field.numCols-2));
			y = Math.floor(Math.random() * (field.numRows-2));
			if(field.isEmpty(x,y)) {
				break;
			}
			i++;
		}
		this.map[y][x] = new Cell(x*scale, y*scale, x, y, CellType.FOOD);
	}

	findFood() {
		var found = false;
		this.map.forEach(function(row) {
			row.forEach(function(col) {
				if(col.content == CellType.FOOD) {
					found = true;
				}
			}, this); // this is given to the function so it can call this.drawSnake
		}, this);
		return found;
	}

	placeSnake(col, row) {
		var old_head = snake.head;
		this.removeCellsOfType(CellType.SNAKE);

		// console.log("col = " + col);
		// console.log("row = " + row);
		// console.log("numRows = " + this.numRows);
		// console.log("numCols = " + this.numCols);
		var no_animation = false;
		if(row >= this.numRows) {
			no_animation = true;
			row = 0;
		}
		if(row < 0) {
			no_animation = true;
			row = this.numRows-1;
		}
		if(col >= this.numCols) {
			no_animation = true;
			col = 0;
		}
		if(col < 0) {
			no_animation = true;
			col = this.numCols-1;
		}
		var new_head = new Cell(col*scale, row*scale, col, row, CellType.SNAKE);
		//todo animation
		//if(!no_animation && old_head != null) this.animate(old_head, new_head); // dont do animation when going out of map

		this.map[row][col] = new_head;
		// add tail to map
		snake.tail.forEach(function(part) {
			this.map[part.mapY][part.mapX] = new Cell(part.x, part.y, part.mapX, part.mapY, CellType.SNAKE);
		}, this);

		// Todo move snake parts
		return this.map[row][col];
	}

	// animate the transition of a snake moving from cellA to cellB
	// cellA and cellB are neighbours
	async animate(cellA, cellB) {
		var anim_speed = 1;
		// get direction of movement
		var dir = null;
		if(cellB.mapX > cellA.mapX) {
			dir = 'right';
		} else if(cellB.mapX < cellA.mapX) {
			dir = 'left';
		} else if(cellB.mapY < cellA.mapY) {
			dir = 'down';
		} else if(cellB.mapY > cellA.mapY) {
			dir = 'up';
		}
		if(dir === null) { // error
			console.log('Fault at animation');
			return false; 
		}
			var move = 0;
			var cond = null;
			// until rect arriced in cellB
			if(dir == 'left' || dir == 'up') {
				move = -anim_speed;
			} else {
				move = anim_speed;
			}
				this.ctx.clearRect(cellA.x, cellA.y, scale, scale);
				if(dir == 'left' || dir == 'right') {
					cond = (cellA.x == cellB.x);
					
				} else {
					cond = (cellA.y == cellB.y);
					cellA.y += move;
				}
				var counter = 0;
				while(!cond) {
					if (dir == 'left' || dir == 'right') {
						cellA.x += move;
					} else {
						cellA.y += move;
					}
					// draw head
					this.ctx.beginPath();
					this.ctx.rect(cellA.x, cellA.y, scale, scale);
					this.ctx.fillStyle = "white"; // TODO snake color
					this.ctx.fill();
					this.ctx.closePath();
				}
				
			
		}
	



	// checks after every move of the snake if there was a collision and reacts properly 
	checkForCollision(x, y) {
		if(x < 0 || x >= this.numCols || y < 0 || y >= this.numRows) {
			return;
		}
		var content = this.map[y][x].content; 
		// keine Kollision
		if(content === CellType.EMPTY) return;
		// Food
		if(content === CellType.FOOD) {
			// tail wächst new food
			snake.addTail(new Cell(x*scale, y*scale, x, y, CellType.SNAKE));
			this.genNewFood();
			this.updateScore();
		}
		// Snake
		if(content === CellType.SNAKE) {
			console.log('asd');
			lost = true;
			// Game Over
		}
	}

	updateScore() {
		var score = parseInt(document.getElementById("score").innerHTML) + 1;

		console.log("score: " + score);
		document.getElementById("score").innerHTML = score;
	}

	countSnakeParts() {
		var count = 0;
		this.map.forEach(function(row) {
			row.forEach(function(col) {
				if(col.content === CellType.SNAKE) {
					count++;
				}
			}); 
		});
		return count;
	}

	drawFood(x, y) {
		// draw
		this.ctx.beginPath();
		this.ctx.rect(x, y, scale, scale);
		this.ctx.fillStyle = "RED"; // TODO snake color
		this.ctx.fill();
		this.ctx.closePath();

		return true;
	}


	// draw snake at position x,y (note that x,y arent pixel coordinates but field ones)
	drawSnake(x, y) {
		// // check if snake reached the edge
		// if(this.width - posX < scale || this.height - posY < scale) {
		// 	return false;
		// }
		var head = snake.head;
		var tail = snake.tail;

		// draw head
		this.ctx.beginPath();
		this.ctx.rect(head.x, head.y, scale, scale);
		this.ctx.fillStyle = "white"; // TODO snake color
		this.ctx.fill();
		this.ctx.closePath();

		tail.forEach(function(part) {
			// draw body
			this.ctx.beginPath();
			this.ctx.rect(part.x, part.y, scale, scale);
			this.ctx.fillStyle = "white"; // TODO snake color
			this.ctx.fill();
			this.ctx.closePath();
		}, this);


		return true;
	}

	draw() {
		this.clear(); // clear first
		this.map.forEach(function(row) {
			row.forEach(function(col) {
				switch(col.content) {
					case CellType.SNAKE: 
						this.drawSnake();
						break;
					case CellType.FOOD:
						this.drawFood(col.x, col.y);
						break;
					default: // Empty
						break;
				}
			}, this); // this is given to the function so it can call this.drawSnake
		}, this);
	}

	// check if cell is empty
	isEmpty(x,y) {
		if(this.map[y][x].content === CellType.EMPTY) {
			return true;
		}
		return false;
	}


	// init field -> return false if error, else true
	init() {
		// calc number of rows and cols
		this.numRows = Math.floor(this.height / scale);
		this.numCols = Math.floor(this.width / scale);

		// check
		if(this.numRows === 0 || this.numCols === 0) {
			alert("Darstellung auf dem Gerät nicht möglich!");
			return false;
		}
		// init empty field
		for(var i = 0; i < this.numRows; i++) {
			var row = [];
			for(var j = 0; j < this.numCols; j++) {
				var cell = new Cell(j * scale, i * scale, j, i, CellType.EMPTY);
				row.push(cell);
			}
			this.map.push(row);
		}

		// place food
		// generate random number
		this.food = new Cell()

	}

	clear() {
		this.ctx.clearRect(0,0, this.width, this.height);
	}

}


function Cell(x, y, mapX, mapY, content) {
	this.x = x; // pixel coordinates
	this.y = y;
	this.mapX =  mapX; // map coordiantes
	this.mapY = mapY;
	// content of cell, CellType
	this.content = content;
}