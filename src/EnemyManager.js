class EnemyManager{

    /*
    The EnemyManager class focuses on handling enemies and everything
    that deals with them so Game.js doesn't get too big
    */
    constructor(enemies){
        //the enemies array
        this._enemies = enemies;

        //how many enemy types are active
        this._enemyTypes = 1;

        //timer to add in more enemy types
        this._newEnemyTimer = null;
        this._NEWENEMYDELAY = 15000;
        
        //timers used to spawn enemies
        this._circleTimer = null;
        this._squareTimer = null;
        this._starTimer = null;
        this._rectangleTimer = null;
        this._hexagonTimer = null;
        this._circleDelay = 2000;
        this._squareDelay = 5000;
        this._starDelay = 7000;
        this._rectangleDelay = 15000;
        this._hexagonDelay = 12000;
        this._TIMERDECREASE = 0;

        
    }

    //-------------------------------------------------------------- reset/setup/end methods
    resetGame(){
        //reset the enemyTypes and enemy timers/delays
        this._enemyTypes = 1;

        this._circleTimer = null;
        this._squareTimer = null;
        this._starTimer = null;
        this._rectangleTimer = null;
        this._hexagonTimer = null;
        this._circleDelay = 2000;
        this._squareDelay = 5000;
        this._starDelay = 7000;
        this._rectangleDelay = 15000;
        this._hexagonDelay = 12000;
        this._TIMERDECREASE = 0;
    }

    startGame(){
        //setup the circle timer to begin with
        this._circleTimer = window.setInterval(()=>{
            //find an inactive enemy and make it a circle
            for (let i=0; i<this._enemies.length;i++){
                let newEnemy = this._enemies[i];
                if (newEnemy.active === false){
                    newEnemy.active = true;
                    newEnemy.createEnemy("Circle");
                    break;
                }
            }
        }, this._circleDelay);

        //setup the timer for adding new enemies into the game
        this._newEnemyTimer = window.setInterval(this.newEnemy,this._NEWENEMYDELAY);
    }

    endGame(){
        //the game is over, remove all timers
        window.clearInterval(this._newEnemyTimer);
        window.clearInterval(this._circleTimer);
        window.clearInterval(this._squareTimer);
        window.clearInterval(this._starTimer);
        window.clearInterval(this._rectangleTimer);
        window.clearInterval(this._hexagonTimer);
    }

    //-------------------------------------------------------------- public methods
    newEnemy(){
        //add a new enemy into the game
        this._enemyTypes++;
        if (this._enemyTypes == 2){
            this._squareTimer = window.setInterval(()=>{
                for (let i=0; i<this._enemies.length;i++){
                    let newEnemy = this._enemies[i];
                    if (newEnemy.active === false){
                        newEnemy.active = true;
                        newEnemy.createEnemy("Square");
                        break;
                    }
                }
            }, this._squareDelay); 
        }
        
        if(this._enemyTypes == 3){
            this._starTimer = window.setInterval(()=>{
                for (let i=0; i<this._enemies.length;i++){
                    let newEnemy = this._enemies[i];
                    if (newEnemy.active === false){
                        newEnemy.active = true;
                        newEnemy.createEnemy("Star");
                        break;
                    }
                }
            }, this._starDelay);
        }

        if(this._enemyTypes == 4){
            this._rectangleTimer = window.setInterval(()=>{
                for (let i=0; i<this._enemies.length;i++){
                    let newEnemy = this._enemies[i];
                    if (newEnemy.active === false){
                        newEnemy.active = true;
                        newEnemy.createEnemy("Rectangle");
                        break;
                    }
                }
            }, this._rectangleDelay); 
        }

        if(this._enemyTypes == 5){
            this._hexagonTimer = this._window.setInterval(()=>{
                for (let i=0; i<this._enemies.length;i++){
                    let newEnemy = this._enemies[i];
                    if (newEnemy.active === false){
                        newEnemy.active = true;
                        newEnemy.createEnemy("Hexagon");
                        break;
                    }
                }
            }, this._hexagonDelay);
 
            //this is the last enemy to add, so remove the new enemy timer
            window.clearInterval(this._newEnemyTimer);
        }  
    }

    increaseSpawn(){
        this._TIMERDECREASE = this._TIMERDECREASE + 100;
        //check if the timer exists, before increasing it
        if(this._circleTimer != null){
            if (this._circleDelay > 1000){
                this._circleDelay = this._circleDelay - this._TIMERDECREASE;
                window.clearInterval(this._circleTimer);
                this._circleTimer = window.setInterval(()=>{
                    //find an inactive enemy and make it a circle
                    for (let i=0; i<this._enemies.length;i++){
                        let newEnemy = this._enemies[i];
                        if (newEnemy.active === false){
                            newEnemy.active = true;
                            newEnemy.createEnemy("Circle");
                            break;
                        }
                    }
                }, this._circleDelay);
            }
            
        }

        if(this._squareTimer != null){
            if(this._squareDelay > 2000){
                this._squareDelay = this._squareDelay - this._TIMERDECREASE;
                window.clearInterval(this._squareTimer);
                this._squareTimer = window.setInterval(()=>{
                    for (let i=0; i<this._enemies.length;i++){
                        let newEnemy = this._enemies[i];
                        if (newEnemy.active === false){
                            newEnemy.active = true;
                            newEnemy.createEnemy("Square");
                            break;
                        }
                    }
                }, this._squareDelay);
            }
        }

        if (this._starTimer != null){
            if(this._starDelay > 3000){
                this._starDelay = this._starDelay - this._TIMERDECREASE;
                window.clearInterval(this._starTimer);
                this._starTimer = window.setInterval(()=>{
                    for (let i=0; i<this._enemies.length;i++){
                        let newEnemy = this._enemies[i];
                        if (newEnemy.active === false){
                            newEnemy.active = true;
                            newEnemy.createEnemy("Star");
                            break;
                        }
                    }
                }, this._starDelay);
            }
        }

        if (this._rectangleTimer != null){
            if(this._rectangleDelay > 5000){
                this._rectangleDelay = this._rectangleDelay - this._TIMERDECREASE;
                window.clearInterval(this._rectangleTimer);
                this._rectangleTimer = window.setInterval(()=>{
                    for (let i=0; i<this._enemies.length;i++){
                        let newEnemy = this._enemies[i];
                        if (newEnemy.active === false){
                            newEnemy.active = true;
                            newEnemy.createEnemy("Rectangle");
                            break;
                        }
                    }
                }, this._rectangleDelay);
            }
        }
        
        if (this._hexagonTimer != null){
            if(this._hexagonDelay > 5000){
                this._hexagonDelay = this._hexagonDelay - this._TIMERDECREASE;
                window.clearInterval(this._hexagonTimer);
                this._hexagonTimer = window.setInterval(()=>{
                    for (let i=0; i<this._enemies.length;i++){
                        let newEnemy = this._enemies[i];
                        if (newEnemy.active === false){
                            newEnemy.active = true;
                            newEnemy.createEnemy("Hexagon");
                            break;
                        }
                    }
                }, this._hexagonDelay);
            }
        }
        

    }


}