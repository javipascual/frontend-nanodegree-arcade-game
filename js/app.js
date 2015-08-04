const NENEMIES = 4;

// Entity (superclass of enemies and player)
var Entity = function(sprite, pos, speed) {
    this.sprite = sprite;
    this.pos = pos;
    this.speed = speed;

    this.dir = [0, 0];
}

Entity.prototype.update = function(dt) {
  if (this.dir[0]!=0 || this.dir[1]!=0) {
    this.pos[0] += this.dir[0]*this.speed;
    this.pos[1] += this.dir[1]*this.speed;
    this.dir = [0,0];
  }
}

Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.pos[0], this.pos[1]);
}


// Enemies
var Enemy = function(sprite, pos, speed) {
    Entity.call(this, sprite, pos, speed);
}

Enemy.prototype = Object.create(Entity.prototype);


// Player
var Player = function(sprite, pos, speed) {
    Entity.call(this, sprite, pos, speed);
}

Player.prototype = Object.create(Entity.prototype);

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

player = new Player('images/char-boy.png', [0, 0], 10);
allEnemies = [];

for (var i = 0; i < NENEMIES; i++)
    allEnemies.push(new Enemy('images/enemy-bug.png', [(i+1)*100,i*100], 6));

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
