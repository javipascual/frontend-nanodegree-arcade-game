// Entity (superclass of enemies and player)

var AnimEntity = function(sprite, frames, size, dtFrame) {
    this.sprite = sprite;
    this.pos = undefined;
    this.step = 0;
    this.size = size;
    this.cols = frames;
    this.dtPerFrame = dtFrame;
    this.dt = 0;
}

AnimEntity.prototype.render = function() {
    var x = this.step%(this.cols-1)*this.size;
    ctx.drawImage(Resources.get(this.sprite), x, 0,
                  this.size, this.size,
                  this.pos[0], this.pos[1],
                  this.size, this.size);
}

AnimEntity.prototype.update = function(dt) {
  this.dt += dt;

  if (this.dt>this.dtPerFrame) {
      this.step = this.step+1;
      this.dt = 0;
  }
}

AnimEntity.prototype.reset = function() {
  this.dt = 0;
  this.step = 0;
}

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
    this.speed = Math.random() * (appGlobals.MAX_SPEED - appGlobals.MIN_SPEED) + appGlobals.MIN_SPEED;
    this.pos[1] = Math.random() * (appGlobals.MAX_POS - appGlobals.MIN_POS) + appGlobals.MIN_POS;
}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.update = function(dt) {
    this.pos[0] += this.speed;
    if (this.pos[0] > appGlobals.WIDTH) {
        this.pos[0] = 0;
        this.speed = Math.random() * (appGlobals.MAX_SPEED - appGlobals.MIN_SPEED) + appGlobals.MIN_SPEED;
        this.pos[1] = Math.random() * (appGlobals.MAX_POS - appGlobals.MIN_POS) + appGlobals.MIN_POS;
    }
}

// Player
var Player = function(sprite, pos) {
    Entity.call(this, sprite, [appGlobals.BRICK_WIDTH*2, appGlobals.BRICK_HEIGHT*5]);
    this.dir = [0,0];

    this.lives = appGlobals.MAX_LIVES;
    this.score = 0;

    this.explosion = new AnimEntity('images/explosion-sprite-sheet.png', 5, 120, 0.08);
    this.exploding = false;
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.render = function() {
    if (this.exploding)
        this.explosion.render();
    else
        Entity.prototype.render.call(this);
}

Player.prototype.update = function(dt) {

    if (this.pos[0]+this.dir[0]>=0 && this.pos[0]+this.dir[0]<appGlobals.WIDTH)
        this.pos[0] += this.dir[0];

    if (this.pos[1]+this.dir[1]>=appGlobals.BRICK_HEIGHT && this.pos[1]+this.dir[1]<appGlobals.HEIGHT-202)
        this.pos[1] += this.dir[1];

    if (this.pos[1]+this.dir[1]<appGlobals.BRICK_HEIGHT) {
        this.score++;
        this.reset();
    }

    this.dir = [0,0];
}
Player.prototype.explosionEnded = function() {
    return this.explosion.step === this.explosion.cols;
}

Player.prototype.die = function() {
    this.exploding = true;
    this.lives--;
    this.explosion.pos = this.pos;
}

Player.prototype.reset = function() {
    this.pos = [appGlobals.BRICK_WIDTH*2, appGlobals.BRICK_HEIGHT*5];
    this.exploding = false;
    this.explosion.reset();
}

Player.prototype.handleInput = function(key) {

  switch(key) {
    case 'left':
        this.dir = [-appGlobals.BRICK_WIDTH, 0];
        break;
    case 'up':
        this.dir = [0, -appGlobals.BRICK_HEIGHT];
        break;
    case 'right':
        this.dir = [appGlobals.BRICK_WIDTH, 0];
        break;
    case 'down':
        this.dir = [0, appGlobals.BRICK_HEIGHT];
        break;
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player('images/char-boy.png');
var allEnemies = [];

for (var i = 0; i < appGlobals.NENEMIES; i++)
    allEnemies.push(new Enemy('images/enemy-bug.png', [0,(i+1)*appGlobals.BRICK_HEIGHT]));

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
