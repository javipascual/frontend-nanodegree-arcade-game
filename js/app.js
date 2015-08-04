const NENEMIES = 4;
const MAX_SPEED = 7;
const MIN_SPEED = 3;

const MAX_POS = 606*0.6;
const MIN_POS = 606*0.1;

// Entity (superclass of enemies and player)
var Entity = function(sprite, pos) {
    this.sprite = sprite;
    this.pos = pos;
    this.dir = [0, 0];
}

Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.pos[0], this.pos[1]);
}


// Enemies
var Enemy = function(sprite, pos, speed) {
    Entity.call(this, sprite, pos);
    this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
    this.pos[1] = Math.random() * (MAX_POS - MIN_POS) + MIN_POS;
}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.update = function(dt) {
    this.pos[0] += this.speed;
    if (this.pos[0] > 505) {
        this.pos[0] = 0;
        this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        this.pos[1] = Math.random() * (MAX_POS - MIN_POS) + MIN_POS;
    }
}

// Player
var Player = function(sprite, pos) {
    Entity.call(this, sprite, pos);
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.update = function(dt) {
  if (this.dir[0]!=0 || this.dir[1]!=0) {
    this.pos[0] += this.dir[0]*this.speed;
    this.pos[1] += this.dir[1]*this.speed;
    this.dir = [0,0];
  }
}

Player.prototype.handleInput = function(key) {

  switch(key) {
    case 'left':
        this.dir = [-101, 0];
        break;
    case 'up':
        this.dir = [0, -83];
        break;
    case 'right':
        this.dir = [101, 0];
        break;
    case 'down':
        this.dir = [0, 83];
        break;
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

player = new Player('images/char-boy.png', [101*2, 83*5]);
allEnemies = [];

for (var i = 0; i < NENEMIES; i++)
    allEnemies.push(new Enemy('images/enemy-bug.png', [0,(i+1)*83]));

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
