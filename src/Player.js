class Player{

    constructor(stage,assetManager){
        //private variables
        //is the player dead
        this._killed = false;
        //did the player get hit
        this._hit = false;
        //how many hits the player has
        this._health = 3;
        //how many lives the player has
        this._lives = 3;
        //used for telling what animation to play
        this._status = "";
        //booleans to keep track of up and down animations 
        this._goingUp = false;
        this._goingDown = false;
        //invulnerbility timer variable
        this._invulnerbleTimer = null;
        this._invulnerbleLength = 3000;
        this._invulnerble = false;

        //the stage and assetManager objects, mainly used for creating bullets
        this._stage = stage;
        this._assetManager = assetManager;

        //grab the clip for player and add to the stage
        this._sprite = assetManager.getSprite("spritesheet");
        this._sprite.mover = new PlayerMover(this._sprite,stage);
        

        //construct custom events
        this._eventPlayerKilled = new createjs.Event("playerKilled",true);
        this._eventPlayerGameOver = new createjs.Event("playerGameOver",true);

        //if the player is hit, listen for the event
        this._sprite.on("playerHit", this.hitMe, this);
       
    }

    //------------------------------------------- get/set methods
    getX(){
        return this._sprite.x;
    }

    getY(){
        return this._sprite.y;
    }

    get sprite() {
        return this._sprite;
    }

    get killed() {
        return this._killed;
    }

    get lives(){
        return this._lives;
    }
    //------------------------------------------- public methods
    setupMe() {
        //setup the player
        this._killed = false;
        this._status = "";
        this._health = 3;
        
        this._sprite.gotoAndPlay(this._status + "Idle");
        this._sprite.x = 600;
        this._sprite.y = 350;
        this._sprite.mover.speed = 10;

        this._stage.addChild(this._sprite);

        
    }

    resetMe(){
        //reset the lives counter
        this._lives = 3;
    }

    moveMe(direction){
        //check if the player is dead, if yes, do not move
        if (!this._killed){
            //change the player's direction
            this._sprite.mover.direction = direction;
            this._sprite.mover.startMe();
        }
        
    }

    killMe(){
        if (!this._killed){
            createjs.Sound.play("playerDeadSound");
            //the player is dead
            //OH THE HUMANITY!!
            this._killed = true;
            this._lives = this._lives - 1;
            this._sprite.mover.stopMe();
            this._sprite.gotoAndPlay("PlayerDead");
            this._sprite.on("animationend",this._onKilled, this);
        }
    }

    hitMe(){
        //check if the player is killed or not
        if (!this._killed){
            //check if the player is invulnerble, and disable hit if so
            if (!this._invulnerble){
                createjs.Sound.play("playerHurtSound");
                this._invulnerble = true;
                //the player got hit
                this._health = this._health - 1;
                //startup the invulnerbility timer to prevent multiple hits
                this._invulnerbleTimer = window.setInterval(()=>this._invulnerbleClear(), this._invulnerbleLength);
                //create the invulnerble effects
                this.invulnerbleMe();
                //console.log("Player Health: " + this._health);
                if (this._health == 2){
                    this._sprite.gotoAndPlay("Hit1");
                    this._sprite.on("animationend",(e)=>{
                        e.remove();
                        this._sprite.gotoAndPlay(this._status + "Idle");
                    });
                    this._status = "Hit1";
                } else if (this._health == 1){
                    this._sprite.gotoAndPlay("Hit2");
                    this._sprite.on("animationend",(e)=>{
                        e.remove();
                        this._sprite.gotoAndPlay(this._status + "Idle");
                    });
                    this._status = "Hit2";
                } else if (this._health == 0){
                    this.killMe();
                }
            }
        }
        
    }

    invulnerbleMe(){
        this._sprite.alpha = 0.5;
    }

    stopMe(){
        //stop the sprite
        this._sprite.mover.stopMe();
    }

    updateMe(){
        this._sprite.mover.update();
    }

    //------------------------------------------- movement methods
    upEnter(){
        //check if the player is dead, if yes, do not move
        if (!this._killed){
            //make going up set to true, so this code only runs once
            if (!this._goingUp){
                this._goingUp = true;
                this._sprite.gotoAndPlay(this._status + "UpEnter");
                this._sprite.on("animationend",(e) => {
                e.remove();
                this._sprite.gotoAndPlay(this._status + "Up");
                });
            }
        }
        
        
    }

    upExit(){
        if (!this._killed){
            //set going up back to false
            this._goingUp = false;
            this._sprite.gotoAndPlay(this._status + "UpExit");
            this._sprite.on("animationend",(e) => {
                e.remove();
                this._sprite.gotoAndPlay(this._status + "Idle");
            });
        }
        
    }

    downEnter(){
        if (!this._killed){
            //make going down set to true, so this code only runs once
            if (!this._goingDown){
                this._goingDown = true;
                this._sprite.gotoAndPlay(this._status + "DownEnter");
                this._sprite.on("animationend",(e) => {
                    e.remove();
                    this._sprite.gotoAndPlay(this._status + "Down");
                });
            }
        }
        
        
    }

    downExit(){
        if (!this._killed){
            //set going down back to false
            this._goingDown = false;
            this._sprite.gotoAndPlay(this._status + "DownExit");
            this._sprite.on("animationend",(e) => {
                e.remove();
                this._sprite.gotoAndPlay(this._status + "Idle");
            });
        }
        
    }

    //------------------------------------------- event handlers
    _invulnerbleClear(){
        //kill the invulnerbility timer
        window.clearInterval(this._invulnerbleTimer);
        this._invulnerble = false;
        this._sprite.alpha = 1;
        
    }

    _onKilled(e){
        //cleanup the event listener and respawn the player, IF they have the lives
        e.remove();
        //console.log("Lives Left: " + this._lives);
        if (this._lives != 0){
           //reset the player
           this._stage.dispatchEvent(this._eventPlayerKilled);
           this.setupMe();
           return;
        } else{
            this._stage.removeChild(this._sprite);
            //tell the stage that the game is over
            this._stage.dispatchEvent(this._eventPlayerGameOver);
        }

    }
}