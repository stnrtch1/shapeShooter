class Mover {
    
    constructor(sprite, stage) {
        // construct custom event object for object moving off stage
        this._eventStageExit = new createjs.Event("stageExit", true);
        // private property variables
        this._speed = 2;
        this._sprite = sprite;
        this._direction = Mover.LEFT;
        this._moving = false;
        this._stage = stage;

        // sprite not animating on construction
        sprite.stop();
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
        this._sprite.play();
        this._moving = true;
    }

    stopMe() {
        this._sprite.stop();
        this._moving = false;
    }

    update() {
        if (this._moving) {

            // reference sprite object for cleaner code below
            let sprite = this._sprite;

            // get current width of sprite on this frame
            // we only need to concern ourselves with width in terms of off stage since we rotate sprite up, down, left, and right
            let width = sprite.getBounds().width;
            //console.log(sprite.getBounds().x);
            //console.log(sprite.y);

            if (this._direction == Mover.LEFT) {
                //dispatch event if object passes canvas 
                if (sprite.x < -width) {
                    sprite.x = this._stage.canvas.width;
                    sprite.dispatchEvent(this._eventStageExit);
                }
                
                // moving left
                sprite.scaleX = 1;
                sprite.rotation = 0;
                sprite.x = sprite.x - this._speed;

            } else if (this._direction == Mover.RIGHT) {
                //dispatch event if object passes canvas 
                if (sprite.x > (this._stage.canvas.width + width)) {
                    sprite.x = -width;
                    sprite.dispatchEvent(this._eventStageExit);
                }
                // moving right
                sprite.scaleX = 1;
                sprite.rotation = 0;
                sprite.x = sprite.x + this._speed;
                

            } else if (this._direction == Mover.UP) {
                //dispatch event if object passes canvas 
                if (sprite.y < -width) {
                    sprite.y = this._stage.canvas.height;
                    sprite.dispatchEvent(this._eventStageExit);
                } 
                // moving up
                sprite.scaleX = 1;
                sprite.rotation = 0;
                sprite.y = sprite.y - this._speed;
                

            } else if (this._direction == Mover.DOWN) {
                //dispatch event if object passes canvas 
                if (sprite.y > (this._stage.canvas.height + width)) {
                    sprite.y = -width;
                    sprite.dispatchEvent(this._eventStageExit);
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
Mover.LEFT = 1;
Mover.RIGHT = 2;
Mover.UP = 3;
Mover.DOWN = 4;