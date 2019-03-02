// Main JS Class for running the snake game


const loserLines = [
	'Man bist du schlecht!',
	'Uff du kannst ja gar nichts.',
	'Bitte hör auf, du bist einfach schlecht bro..',
	'Wie kann man nur so schlecht sein..',
];
// keys
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
//game speed
const speed = 10;

// game over vars
var lost = false;
var won = false;


// Help Object
function Vektor(x, y) {
	this.x = x;
	this.y = y;
}


function gameover() {
	if(lost) {
		var line = loserLines[Math.floor(Math.random() * loserLines.length)];
	}
	if(won) {
		var line = "Du hast gewonnen!";
	}
	if(alert(line)) {
		// return to page
	}

}


// init
var field = new Field("snake-field");
var snake = new Snake("snake");
snake.init();
// place first food
field.genNewFood();
// draw field 
field.draw();


// redraw the snake and food 
var update = function update() {
	snake.move();
	field.draw();
	if(lost || won) {
		clearInterval(intervalId);
		gameover();
	}
}

window.onload = function() {
	// hide jquery mobile load message
	$(".ui-loader").hide();

	// KeyBoard Listeners
	window.addEventListener('keydown', function() {
		var key = event.keyCode;
		if(key === LEFT) {
			snake.moveLeft();
		} else if(key === RIGHT) {
			snake.moveRight();
		} else if(key === DOWN) {
			snake.moveDown();
		} else if(key === UP) {
			snake.moveUp();
		}
	});
	// Mobile swipe
	// $(window).on('swipeleft', function(e) {
	// 	e.preventDefault();
	// 	snake.moveLeft();
	// });
	$(window).touchwipe( {
    	//Generic swipe handler for all directions
    		wipeUp: function() {
    			snake.moveDown();
    		},
    		wipeDown: function() {
    			snake.moveUp();
    		},
    		wipeLeft: function() {
    			snake.moveLeft();
    		},
    		wipeRight: function() {
    			snake.moveRight();
    		},
    		min_move_x: 10,
    		min_move_y: 10,
    		preventDefaultEvents: true
  	});
	$(window).on('swiperight', function(e) {
		e.preventDefault();
		snake.moveRight();
	});
	$(window).on('swipeup', function(e) {
		e.preventDefault();
		snake.moveUp();
	});
	$(window).on('swipedown', function(e) {
		e.preventDefault();
		snake.moveDown();
	});
}



// gameloop	
var intervalId = setInterval(update, 1000/speed);




