class Enemy{

    constructor(stage,player,assetManager){
        //is the enemy active
        this._active = false;        
        //is the enemy dead
        this._killed = false;

        //the player and bullet objects used for collision detecting
        this._player = player;
        this._playerSprite = player.sprite;

        //type of enemy
        this._type = null;

        //how many points the enemy has
        this._points = null;

        //did the enemy hit the player (squares and rectangles only)
        this._didHit = null;

        //reference to stage object
        this._stage = stage;
        
        //which line is the enemy starting on
        this._line = null;
        //animation variables
        this._alive = null;
        this._damaged = null;
        this._dead = null;
        this._start = null;
        this._charge = null;
        //health variable
        this._health = null;
        //can this enemy block bullets?
        this._canBlock = null;
        //which way the enemy moves
        this._position = null;
        //how fast this enemy moves
        this._speed = null;

        //sound variables
        this._spawnSound = null;
        this._deadSound = null;

        //event listener variable
        this._deadEvent = null;


        //grab the clip and add to the stage
        this._sprite = assetManager.getSprite("spritesheet");
        

        //if the sprite goes off screen, it should be terminated automatically
        this._sprite.on("stageExit", this._offScreenKillMe, this);
        

        //construct custom events
        this._eventCircleKilled = new createjs.Event("circleKilled",true);
        this._eventSquareKilled = new createjs.Event("squareKilled",true);
        this._eventStarKilled = new createjs.Event("starKilled",true);
        this._eventRectangleKilled = new createjs.Event("rectangleKilled",true);
        this._eventHexagonKilled = new createjs.Event("hexagonKilled",true);
        this._eventEnemyHit = new createjs.Event("enemyHit",true);
        this._eventPlayerHit = new createjs.Event("playerHit",true);
    }
    //-------------------------------------------------------- gets/sets methods
    get active() {
        return this._active;
    }

    set active(value) {
        this._active = value;
    }

    get points(){
        return this._points;
    }

    //-------------------------------------------------------- public methods
    createEnemy(type){
        //get the type of enemy and then launch it
        if (type == "Circle"){
            this._type = "Circle";
            this._points = 100;
            this._didHit = null;
            this._alive = "Circle";
            this._dead = "CircleDead";
            this._health = 1;
            this._canBlock = false;
            this._position = "Right";
            this._speed = 7;
            this._spawnSound = "circleSpawnSound";
            this._deadSound = "circleDeadSound";
            this._deadEvent = this._eventCircleKilled;
            this._line = this.generateLine(); 
        } else if (type == "Square"){
            this._type = "Square";
            this._points = 50;
            this._didHit = false;
            this._alive = "Square";
            this._dead = "SquareDead";
            this._health = 1;
            this._canBlock = true;
            this._position = "Right";
            this._speed = 7;
            this._spawnSound = "squareSpawnSound";
            this._deadEvent = this._eventSquareKilled;
            this._line = this.generateLine();
        } else if (type == "Star"){
            this._type = "Star";
            this._points = 300;
            this._didHit = null;
            this._alive = "Star";
            this._damaged = "StarHit";
            this._dead = "StarDead";
            this._health = 2;
            this._canBlock = false;
            this._position = "Right";
            this._speed = 15;
            this._spawnSound = "starSpawnSound";
            this._deadSound = "starDeadSound";
            this._deadEvent = this._eventStarKilled;
            this._line = this.generateLine();
        } else if (type == "Rectangle"){
            this._type = "Rectangle";
            this._points = 200;
            this._didHit = false;
            this._alive = "Rectangle";
            this._dead = "RectangleDead";
            this._health = 1;
            this._canBlock = true;
            this._position = "Right";
            this._speed = 5;
            this._spawnSound = "rectangleSpawnSound";
            this._deadEvent = this._eventRectangleKilled;
            this._line = this.generateLine();
        } else if (type == "Hexagon"){
            this._type = "Hexagon";
            this._points = 500;
            this._didHit = null;
            this._start = "HexagonIn";
            this._charge = "HexagonCharge";
            this._alive = "HexagonLaunch";
            this._dead = "HexagonExplosion";
            this._health = 1;
            this._canBlock = false;
            this._position = "Left";
            this._speed = 20;
            this._spawnSound = "hexagonSpawnSound";
            this._deadSound = "hexagonDeadSound";
            this._deadEvent = this._eventHexagonKilled;
            this._line = this.generateLine();
        }
        //the variables are in place, send the enemy!
        this.setupMe();
    }

    generateLine(){
        return Math.floor(Math.random()*11) + 1;
    }

    hitMe(){
        //the enemy is hit, lose some health
        this._health--;

        //check if the enemy is dead
        if (this._health == 0){
            //enemy is dead, kill them
            this.killMe();
        } else{
            //the enemy isn't dead, they're damaged
            this._sprite.gotoAndPlay(this._damaged); 
        }


    }

    killMe(){
        if (!this._killed){
            //enemy is dead
            this._killed = true;
            this._active = false;
            this._sprite.mover.stopMe();
            this._sprite.gotoAndPlay(this._dead);
            this._sprite.on("animationend",this._onKilled, this);
        }
    }

    setupMe(){
        //setup the enemy
        this._killed = false;
        this._sprite.mover = new Mover(this._sprite,this._stage);
        
        //set the position based on line number and position
        if (this._line == 1){
            this._sprite.y = 400;
        } else if (this._line == 2){
            this._sprite.y = 350;
        } else if (this._line == 3){
            this._sprite.y = 450;
        } else if (this._line == 4){
            this._sprite.y = 300;
        } else if (this._line == 5){
            this._sprite.y = 500;
        } else if (this._line == 6){
            this._sprite.y = 250;
        } else if (this._line == 7){
            this._sprite.y = 550;
        } else if (this._line == 8){
            this._sprite.y = 200;
        } else if (this._line == 9){
            this._sprite.y = 600;
        } else if (this._line == 10){
            this._sprite.y = 150;
        } else if (this._line == 11){
            this._sprite.y = 650;
        }

        if (this._position == "Right"){
            this._sprite.x = 1200;
            this._sprite.mover.direction = Mover.LEFT;
        } else{
            this._sprite.x = 30;
            this._sprite.mover.direction = Mover.RIGHT;
        } 

        //check if it's a hexagon being played and send it to it's setup
        if (this._type == "Hexagon"){
            this.hexagonSetup();
        }else{
            this._sprite.gotoAndPlay(this._alive);
            this._sprite.mover.speed = this._speed;
            this._sprite.mover.startMe();
            
            createjs.Sound.play(this._spawnSound);
            //add the enemy to the stage
            this._stage.addChild(this._sprite);
        }
        
          

    }

    hexagonSetup(){
        //this function is for setting up the hexagon only
        this._sprite.gotoAndPlay(this._charge);

        //add the enemy to the stage
        this._stage.addChild(this._sprite);

        this._sprite.on("animationend",(e) => {
            e.remove();
            this._sprite.gotoAndPlay(this._alive);
            this._sprite.mover.speed = this._speed;
            this._sprite.mover.startMe();

            createjs.Sound.play(this._spawnSound);

        } ,this);
        
        
    }

    updateMe(){
        this._sprite.mover.update();

        //check if sprite has hit the player
        // let point = this._playerSprite.globalToLocal(this._sprite.x,this._sprite.y);
        // if (this._playerSprite.hitTest(point.x,point.y)){
        //     //send out the event
        //     this._playerSprite.dispatchEvent(this._eventPlayerHit);

        // }
        let a = this._playerSprite.x - this._sprite.x;
        let b = this._playerSprite.y - this._sprite.y;
        let c = Math.sqrt((a*a) + (b*b));
        if ((this._type == "Circle" || this._type == "Square" || this._type == "Star") && (c <= 48)){
            //send out the event
            this._playerSprite.dispatchEvent(this._eventPlayerHit);
            this._didHit = true;
        } else if (this._type == "Rectangle" && (c <= 70)){
            this._playerSprite.dispatchEvent(this._eventPlayerHit);
            this._didHit = true;
        } else if (this._type == "Hexagon" && (c <= 25)){
            this._playerSprite.dispatchEvent(this._eventPlayerHit);
        }
        
    }

    updateBullets(bullets){
        for(let bullet of bullets){
            if (bullet.active){
                let bulletSprite = bullet.sprite;
                let a = bulletSprite.x - this._sprite.x;
                let b = bulletSprite.y - this._sprite.y;
                let c = Math.sqrt((a*a) + (b*b));
                if ((this._type == "Circle" || this._type == "Square" || this._type == "Star") && (c <= 40)){
                    if (!this._canBlock){
                        this.hitMe();
                        this._stage.dispatchEvent(this._deadEvent);
                        createjs.Sound.play(this._deadSound);
                    }
                    //set the bullet to false to prevent clipping
                    bullet.active = false;
                    bullet.killMe();
                    break;
                } else if (this._type == "Rectangle" && (c <= 60)){
                    if (!this._canBlock){
                        this.hitMe();
                        this._stage.dispatchEvent(this._deadEvent);
                        createjs.Sound.play(this._deadSound);
                    }
                    bullet.active = false;
                    bullet.killMe();
                    break;
                } else if (this._type == "Hexagon" && (c <= 25)){
                    if (!this._canBlock){
                        this.hitMe();
                        this._stage.dispatchEvent(this._deadEvent);
                        createjs.Sound.play(this._deadSound);
                    }
                    bullet.active = false;
                    bullet.killMe();
                    break;
                }
                
            }
            
        }
        
    }



    //-------------------------------------------------------------event listeners
    _onKilled(e){
        //cleanup the sprite
        this._sprite.stop();
        e.remove();
    }

    _offScreenKillMe(){
        //the enemy left the screen
        this._sprite.mover.stopMe();
        this._active = false;
        this._type = null;
        this._stage.removeChild(this._sprite);
        //if a square or rectangle did not hit the player, reward some points for it
        if ((this._type == "Square" || this._type == "Rectangle") && this._didHit == false && this._player.killed != true){
            this._stage.dispatchEvent(this._deadEvent);
        }
        
    }


}