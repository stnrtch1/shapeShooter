class PlayerMover {
    
    //this mover will be used for the player exclusively
    //the main point is that the player sprite will always
    //be playing, but not moving

    constructor(sprite, stage) {
        // private property variables
        this._speed = 2;
        this._sprite = sprite;
        this._direction = PlayerMover.LEFT;
        this._moving = false;
        this._stage = stage;

        //start the sprite up right away
        this._sprite.play();
    }
    
    // --------------------------------------------------- get/set methods
    set speed(value) {
        this._speed = value;
    }
    get speed() {
        return this._speed;
    }
    
    set direction(value) {
        this._direction = value;
    }
    get direction() {
        return this._direction;
    }

    get moving(){
        return this._moving;   
    }
    
    // --------------------------------------------------- public methods
    startMe() {
        //CHANGE HERE -- this now just changes if the player is moving or not
        this._moving = true;
    }

    stopMe() {
        //CHANGE HERE -- the sprite still plays, it just doesn't move now
        this._moving = false;
    }

    update() {
        if (this._moving) {

            // reference sprite object for cleaner code below
            let sprite = this._sprite;

            if (this._direction == PlayerMover.LEFT) {
                //check if at the edge of screen
                if (sprite.x == 40){
                    return;
                }
                // moving left
                sprite.scaleX = 1;
                sprite.rotation = 0;
                sprite.x = sprite.x - this._speed;

            } else if (this._direction == PlayerMover.RIGHT) {
                //check if at the edge of screen
                if (sprite.x == 1160){
                    return;
                }
                // moving right
                sprite.scaleX = 1;
                sprite.rotation = 0;
                sprite.x = sprite.x + this._speed;
                

            } else if (this._direction == PlayerMover.UP) {
                //check if at the edge of screen
                if (sprite.y == 130){
                    return;
                }
                // moving up
                sprite.scaleX = 1;
                sprite.rotation = 0;
                sprite.y = sprite.y - this._speed;
                

            } else if (this._direction == PlayerMover.DOWN) {
                //check if at the edge of screen
                if (sprite.y == 680){
                    return;
                }
                // moving down
                sprite.scaleX = 1;
                sprite.rotation = 0;
                sprite.y = sprite.y + this._speed;
                
            }
        }
    }
}

// a better way to hack class constants - works because class is syntatical candy for a function
PlayerMover.LEFT = 1;
PlayerMover.RIGHT = 2;
PlayerMover.UP = 3;
PlayerMover.DOWN = 4;