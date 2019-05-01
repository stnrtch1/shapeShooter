// Shape Shooter
// Austin Ritchie

(function(){

    // game variables
    let stage = null;
    let canvas = null;

    //frame rate of game
    const FRAME_RATE = 30;

    // game objects
    let assetManager = null;
    let background = null;
    let player = null;
    let introCaption = null;
    let gameOverCaption = null;
    let scoreCaption = null;
    let scoreTotal = null;
    
    
    //score of the game
    let score = 0;

    //maximum enemies that the screen can have
    const MAX_ENEMIES = 75;
    let enemies = [];

    //the EnemyManager
    let enemyManager = null;

    //timers used to spawn enemies
    let circleTimer = null;
    let squareTimer = null;
    let starTimer = null;
    let rectangleTimer = null;
    let hexagonTimer = null;
    let circleDelay = 2000;
    let squareDelay = 5000;
    let starDelay = 7000;
    let rectangleDelay = 15000;
    let hexagonDelay = 12000;
    let TIMERDECREASE = 0;

    let stopTimers = false;

    //timer to add in more enemy types
    let newEnemyTimer = null;
    let NEWENEMYDELAY = 15000;
    let enemyTypes = 1;


    //maximum amount of bullets the player can have
    const MAX_BULLETS = 25;
    let bullets = [];

    // key booleans
    let keyDown = false;
    let keyUp = false;
    let keyLeft = false;
    let keyRight = false;

    //---------------------------------------------------- private methods
    function monitorKeys(){
        //check if any keys are pressed
        if (keyLeft){
            player.moveMe(PlayerMover.LEFT);
        } else if (keyUp){
            player.moveMe(PlayerMover.UP);
        } else if (keyRight){
            player.moveMe(PlayerMover.RIGHT);
        } else if (keyDown){
            player.moveMe(PlayerMover.DOWN);
        } else{
            //if no keys are pressed, stop the player
            player.stopMe();
        }
        
    }

    //---------------------------------------------------- event handlers
    function onKeyDown(e){
        //this method needs to know what key is pressed and then start moving the snake
        //console.log("key pressed down " + e.keyCode);
        if (e.keyCode == 37){
            keyLeft = true;
        } else if (e.keyCode == 38){
            keyUp = true;
            player.upEnter();
        } else if (e.keyCode == 39){
            keyRight = true;
        } else if (e.keyCode == 40){
            keyDown = true;
            player.downEnter();
        } 
        
    } 

    function onKeyUp(e){
        if (e.keyCode == 37){
            keyLeft = false;
        } else if (e.keyCode == 38){
            keyUp = false;
            player.upExit();
        } else if (e.keyCode == 39){
            keyRight = false;
        } else if (e.keyCode == 40){
            keyDown = false;
            player.downExit();
        } else if (e.keyCode == 32){
            //if the player is killed, don't fire any bullets
            if (!player.killed){
                //fire a bullet!
                for (let i=0; i<bullets.length;i++){
                    //well, first find a bullet that isn't active
                    let newBullet = bullets[i];
                    if (newBullet.active === false){
                        newBullet.active = true;
                        newBullet.fireMe(player.getX(),player.getY());
                        createjs.Sound.play("fireSound");
                        break;
                    }

                }
            }
        }
    }


    function onReady(e){
        console.log(">> Getting the shapes ready");
        e.remove();

        //create background from canvas
        background = assetManager.getSprite("spritesheet");
        background.gotoAndStop("Background");
        stage.addChild(background);

        //create title screen
        introCaption = assetManager.getSprite("spritesheet");
        introCaption.gotoAndStop("IntroCaption");
        introCaption.x = 110;
        introCaption.y = 90;
        stage.addChild(introCaption);

        //create score counter title
        scoreCaption = assetManager.getSprite("spritesheet");
        scoreCaption.gotoAndStop("ScoreCaption");
        scoreCaption.x = 1000;
        scoreCaption.y = 0;
        stage.addChild(scoreCaption);

        scoreTotal = new createjs.BitmapText("0", assetManager.getSpriteSheet("spritesheet"));
        scoreTotal.x = 1000;
        scoreTotal.y = 50;
        stage.addChild(scoreTotal);

        //game over screen
        gameOverCaption = assetManager.getSprite("spritesheet");
        gameOverCaption.gotoAndStop("GameOverCaption");
        gameOverCaption.x = 400;
        gameOverCaption.y = 250;

        //construct game object sprites
        player = new Player(stage,assetManager);
        player.resetMe();

        //bullet object pooling - make a whole bunch of reusuable bullets
        for (let i=0; i<MAX_BULLETS; i++){
            bullets.push(new Bullet(stage,player,assetManager));
        }

        //enemy object pooling
        for (let i=0; i<MAX_ENEMIES; i++){
            enemies.push(new Enemy(stage,player,assetManager));
        }

        //construct enemyManager
        enemyManager = new EnemyManager(enemies);
        //enemyManager.resetMe();

        //listen for start of game and game over 
        background.on("click", onStartGame);
        stage.on("playerKilled", onGameOver);

        //listen for enemy deaths
        stage.on("circleKilled", () => addPoints("Circle"));
        stage.on("squareKilled", () => addPoints("Square"));
        stage.on("starKilled", () => addPoints("Star"));
        stage.on("rectangleKilled", () => addPoints("Rectangle"));
        stage.on("hexagonKilled", () => addPoints("Hexagon"));

        //startup the ticker
        createjs.Ticker.framerate = FRAME_RATE;
        createjs.Ticker.on("tick", onTick);

        console.log(">> The game is good to go!");
    }

    function onStartGame(e){
        stage.removeChild(introCaption);

        //remove the click listener
        e.remove();

        //initalize the snake object
        player.setupMe();        

        //initalize key booleans
        keyDown = false;
        keyUp = false;
        keyLeft = false;
        keyRight = false;

        //setup event listeners for keyboard keys
        document.onkeydown = onKeyDown;
        document.onkeyup = onKeyUp;

        //enemyManager.startGame();

        //setup the circle timer here, since the circle is always in play
        circleTimer = window.setInterval(()=>{
            //find an inactive enemy and make it a circle
            for (let i=0; i<enemies.length;i++){
                let newEnemy = enemies[i];
                if (newEnemy.active === false){
                    newEnemy.active = true;
                    newEnemy.createEnemy("Circle");
                    break;
                }
            }
        }, circleDelay);
        //set a timer for adding new enemies into the game
        newEnemyTimer = window.setInterval(newEnemy,NEWENEMYDELAY);
    }

    function newEnemy(){
        //add a new enemy into the game
        enemyTypes++;
        if (enemyTypes == 2){
            squareTimer = window.setInterval(()=>{
                for (let i=0; i<enemies.length;i++){
                    let newEnemy = enemies[i];
                    if (newEnemy.active === false){
                        newEnemy.active = true;
                        newEnemy.createEnemy("Square");
                        break;
                    }
                }
            }, squareDelay); 
        }
        
        if(enemyTypes == 3){
            starTimer = window.setInterval(()=>{
                for (let i=0; i<enemies.length;i++){
                    let newEnemy = enemies[i];
                    if (newEnemy.active === false){
                        newEnemy.active = true;
                        newEnemy.createEnemy("Star");
                        break;
                    }
                }
            }, starDelay);
        }

        if(enemyTypes == 4){
            rectangleTimer = window.setInterval(()=>{
                for (let i=0; i<enemies.length;i++){
                    let newEnemy = enemies[i];
                    if (newEnemy.active === false){
                        newEnemy.active = true;
                        newEnemy.createEnemy("Rectangle");
                        break;
                    }
                }
            }, rectangleDelay); 
        }

        if(enemyTypes == 5){
            hexagonTimer = window.setInterval(()=>{
                for (let i=0; i<enemies.length;i++){
                    let newEnemy = enemies[i];
                    if (newEnemy.active === false){
                        newEnemy.active = true;
                        newEnemy.createEnemy("Hexagon");
                        break;
                    }
                }
            }, hexagonDelay);

            //this is the last enemy to add, so remove the new enemy timer
            window.clearInterval(newEnemyTimer);
        } 
    }

    function onGameOver(){
        //show game over screen
        stage.addChild(gameOverCaption);

        stopTimers = true;
        delayTimers();

        //setup reset game listener
        background.on("click", onResetGame);

        //remove the key event listeners
        document.onkeydown = null;
        document.onkeyup = null;
    }

    function onResetGame(e){
        e.remove();
        //reset the start game listener
        background.on("click", onStartGame);

        //reset the player
        player.resetMe();

        //set the score back to 0
        score = 0;
        scoreTotal.text = String(score);
        //set enemyTypes back to 1
        enemyTypes = 1;

        stopTimers = false;

        //bring back the intro screen
        stage.removeChild(gameOverCaption);
        stage.addChild(introCaption);
    }

    function addPoints(enemy){
        //add points to the total
        if (enemy == "Circle"){
            score = score + 100;
        } else if(enemy == "Square"){
            score = score + 50;
        } else if(enemy == "Star"){
            score = score + 300;
        } else if(enemy == "Rectangle"){
            score = score + 200;
        } else if(enemy == "Hexagon"){
            score = score + 500;
        }

        //for every 3000 points the player earns, the enemies spawn a little faster
        if ((score % 3000) === 0){
            TIMERDECREASE = TIMERDECREASE + 100;
            delayTimers();
        }

        //set the text of the score
        scoreTotal.text = String(score);

    }

    function delayTimers(){
        if(stopTimers){
            //the game is over, clear all timers
            window.clearInterval(newEnemyTimer);
            window.clearInterval(circleTimer);
            window.clearInterval(squareTimer);
            window.clearInterval(starTimer);
            window.clearInterval(rectangleTimer);
            window.clearInterval(hexagonTimer);
            //reset the delays as well
            circleDelay = 2000;
            squareDelay = 5000;
            starDelay = 7000;
            rectangleDelay = 15000;
            hexagonDelay = 12000;
            TIMERDECREASE = 0;
        }else{
            //reset all the timers to use a faster time
            //but, keep have a minimum time for each enemy
            if (circleDelay > 1000){
                circleDelay = circleDelay - TIMERDECREASE;
                window.clearInterval(circleTimer);
                circleTimer = window.setInterval(()=>{
                    //find an inactive enemy and make it a circle
                    for (let i=0; i<enemies.length;i++){
                        let newEnemy = enemies[i];
                        if (newEnemy.active === false){
                            newEnemy.active = true;
                            newEnemy.createEnemy("Circle");
                            break;
                        }
                    }
                }, circleDelay);
            }
            if(squareDelay > 2000){
                squareDelay = squareDelay - TIMERDECREASE;
                window.clearInterval(squareTimer);
                squareTimer = window.setInterval(()=>{
                    for (let i=0; i<enemies.length;i++){
                        let newEnemy = enemies[i];
                        if (newEnemy.active === false){
                            newEnemy.active = true;
                            newEnemy.createEnemy("Square");
                            break;
                        }
                    }
                }, squareDelay);
            }
            if(starDelay > 3000){
                starDelay = starDelay - TIMERDECREASE;
                window.clearInterval(starTimer);
                starTimer = window.setInterval(()=>{
                    for (let i=0; i<enemies.length;i++){
                        let newEnemy = enemies[i];
                        if (newEnemy.active === false){
                            newEnemy.active = true;
                            newEnemy.createEnemy("Star");
                            break;
                        }
                    }
                }, starDelay);
            }
            if(rectangleDelay > 5000){
                rectangleDelay = rectangleDelay - TIMERDECREASE;
                window.clearInterval(rectangleTimer);
                rectangleTimer = window.setInterval(()=>{
                    for (let i=0; i<enemies.length;i++){
                        let newEnemy = enemies[i];
                        if (newEnemy.active === false){
                            newEnemy.active = true;
                            newEnemy.createEnemy("Rectangle");
                            break;
                        }
                    }
                }, rectangleDelay);
            }
            if(hexagonDelay > 5000){
                hexagonDelay = hexagonDelay - TIMERDECREASE;
                window.clearInterval(hexagonTimer);
                hexagonTimer = window.setInterval(()=>{
                    for (let i=0; i<enemies.length;i++){
                        let newEnemy = enemies[i];
                        if (newEnemy.active === false){
                            newEnemy.active = true;
                            newEnemy.createEnemy("Hexagon");
                            break;
                        }
                    }
                }, hexagonDelay);
            }
        }
        
    }

    function onTick(){
        //FPS Counter
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        //game loop stuff
        monitorKeys();
        player.updateMe(); 
        
        //update all bullet object that are active
        for( let bullet of bullets){
            if(bullet.active){
                bullet.updateMe();
            }
        }

        //update all enemies that are active
        for (let enemy of enemies){
            if(enemy.active){
                enemy.updateBullets(bullets);
                enemy.updateMe();
                
            } 
        }

        //update the stage
        stage.update(); 
    }

    

    //---------------------------------------------------- main method
    function main(){
        console.log(">> initializing the game");

        //get reference to canvas
        canvas = document.getElementById("myCanvas");

        //set canvas dimensions
        canvas.width = 1200;
        canvas.height = 700;

        //create stage object
        stage = new createjs.StageGL(canvas, {antialias: true});
        //stage.setClearColor("#CCCCCC");

        //construct preloader object to load spritesheet and sound assets
        assetManager = new AssetManager(stage);
        stage.on("allAssetsLoaded", onReady);

        //load the assets
        assetManager.loadAssets(manifest);

    }

    main();

})();