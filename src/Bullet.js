class Bullet{
    constructor(stage,player,assetManager){
        //is the bullet active - in this case, no, not yet
        this._active = false;

        //reference to the player object
        this._player = player;

        //reference to stage object
        this._stage = stage;

        //grab the bullet and add it to the stage
        this._sprite = assetManager.getSprite("spritesheet");
        this._sprite.mover = new Mover(this._sprite,stage);
        

        //construct custom events
        

        //listen for when the bullet exits the stage
        this._sprite.on("stageExit", this._bulletGone, this);
    }

    //---------------------------------------------- get/set methods
    get active() {
        return this._active;
    }

    set active(value) {
        this._active = value;
    }
    
    get sprite() {
        return this._sprite;
    }

    //------------------------------------------------------------ public methods
    fireMe(x,y){
        if(this._active){
            this._sprite.gotoAndPlay("Bullet");
            this._sprite.x = x + 25;
            this._sprite.y = y;
            this._sprite.mover.speed = 15;
            this._sprite.mover.direction = Mover.RIGHT;
            this._sprite.mover.startMe();
            //add the bullet to the stage
            this._stage.addChild(this._sprite);
            
        }
        
    }

    killMe(){
        this._sprite.mover.stopMe();
        createjs.Sound.play("bulletHitSound");
        this._sprite.gotoAndPlay("BulletDeflect");
        this._sprite.on("animationend",this._bulletHit,this);
    }

    updateMe(){
        this._sprite.mover.update();
    }

    //------------------------------------------------------------ event handlers
    _bulletGone(){
        this._sprite.mover.stopMe();
        //put the bullet back in the pool
        this._active = false;
        this._stage.removeChild(this._sprite);
    }

    _bulletHit(e){
        e.remove();
        this._active = false;
        this._stage.removeChild(this._sprite);
    }


}