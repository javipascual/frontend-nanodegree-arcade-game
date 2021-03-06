"use strict";

/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var state = {
    RUN : 0,
    GAME_OVER : 1,
    SELECT_PLAYER : 2
};

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        game_state = state.SELECT_PLAYER;

    canvas.width = appGlobals.WIDTH;
    canvas.height = appGlobals.HEIGHT;
    doc.body.appendChild(canvas);
    doc.addEventListener("click", on_click);
    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    doc.addEventListener('keyup', onKey);

    playerSelector.onSelect = function(c) {
        game_state = state.RUN;
        player.sprite = c;
    };

    function onKey(e) {
        var allowedKeys = {
            13: 'enter',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        if (game_state === state.SELECT_PLAYER)
            playerSelector.handleInput(allowedKeys[e.keyCode]);
        else if (game_state === state.RUN)
            player.handleInput(allowedKeys[e.keyCode]);
    }

    function on_click() {
        if (game_state == state.GAME_OVER) {
            playerSelector.reset();
            player.restart();
            game_state = state.SELECT_PLAYER;
        }
    }

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        if (game_state == state.RUN)
            update(dt);

        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        game_state = state.SELECT_PLAYER;
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        if (game_state === state.RUN)
            updateEntities(dt);

        if (player.exploding) {
            player.explosion.update(dt);
            if (player.explosionEnded()) {
                if (player.lives<0)
                    game_state = state.GAME_OVER;
                else
                    game_state = state.RUN;

                player.reset();
            }
        }
        else
            checkCollisions();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    function collides(pos, pos2, size) {
        return (pos[0] + size > pos2[0] &&
                pos[0] < pos2[0] + size &&
                pos[1] + size > pos2[1] &&
                pos[1] < pos2[1] + size);
    }

    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            if (collides(enemy.pos, player.pos, 60))
                player.die();
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < appGlobals.NUM_ROWS; row++) {
            for (col = 0; col < appGlobals.NUM_COLS; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * appGlobals.BRICK_WIDTH, row * appGlobals.BRICK_HEIGHT);
            }
        }

        renderEntities();
        renderExtras();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        if (game_state === state.RUN) {
            allEnemies.forEach(function(enemy) {
                enemy.render();
            });

            player.render();
        }
        else if (game_state === state.SELECT_PLAYER)
            playerSelector.render();
    }

    function renderExtras() {

        // clean
        ctx.clearRect(0,0,510,40);

        // draw score
        ctx.fillStyle = "#000080";
        ctx.font = "20px emulogic";
        ctx.fillText("Score:", 0, 30);
        ctx.fillText(player.score, 140, 30);

        // draw lives
        ctx.fillText("Lives:", 300, 30);
        for (var i = 0; i<player.lives; ++i)
            ctx.drawImage(Resources.get('images/heart_small.png'), 420 + i*30,10);

        // draw messages
        if (game_state === state.GAME_OVER) {
            ctx.fillStyle = "#000080";
            ctx.font = "50px emulogic";
            ctx.fillText("GAME OVER", 25, appGlobals.HEIGHT/2);
            ctx.font = "20px emulogic";
            ctx.fillText("press click to continue", 25, appGlobals.HEIGHT/2 + 50);
        }
        else if (game_state === state.SELECT_PLAYER) {
            ctx.font = "30px emulogic";
            ctx.fillText("SELECT PLAYER", 60, appGlobals.HEIGHT/3);
        }
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/heart_small.png',
        'images/explosion-sprite-sheet.png', //from http://i-am-bryan.com/webs/wp-content/uploads/2012/12/Explosion-Sprite-Sheet.png
        'images/Selector.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
