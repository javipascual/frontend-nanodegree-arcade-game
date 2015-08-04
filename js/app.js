const NENEMIES = 4;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.pos = [0, 0];
    this.dir = [0, 0];
    this.speed = 10;
}

Player.prototype.update = function() {
    this.pos[0] += this.dir[0]*this.speed;
    this.pos[1] += this.dir[1]*this.speed;
    this.dir = [0,0];
}

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.pos[0], this.pos[1]);
}

Player.prototype.handleInput = function(key) {

  switch(key) {
    case 'left':
        this.dir = [-1, 0];
        break;
    case 'up':
        this.dir = [0, -1];
        break;
    case 'right':
        this.dir = [1, 0];
        break;
    case 'down':
        this.dir = [0, 1];
        break;
  }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

player = new Player();
allEnemies = [];
console.log("init pos = " + player.pos);

for (var i = 0; i < NENEMIES; i++)
    allEnemies.push(new Enemy());

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
