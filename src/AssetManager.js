/*
* AssetManager Class for Adobe Animate Spritesheet workflow
* GAME2050 Game Programming I
* Sean Morrow
*/

class AssetManager {

    constructor(stage) {
        this._stage = stage;
        // array of spritesheet objects
        this._spriteSheets = [];
        // counters
        this._sheetsTotal = 0;
        this._sheetsLoaded = 0;
        // LoadQueue object
        this._preloader = new createjs.LoadQueue();
        // construct custom event object and initialize it
        this._eventAllLoaded = new createjs.Event("allAssetsLoaded");
    }

    // ------------------------------------------------------ event handlers
    _onLoaded(e) {
        console.log("asset loaded: " + e.item.src + " type: " + e.item.type);

        // what type of asset was loaded?
        switch(e.item.type) {
            case createjs.Types.JAVASCRIPT:
                // have loaded javascript that loads a spritesheet via external JS file (created by Animate)
                // we have a spritesheet to load (if not already)
                this._sheetsTotal++;
                // capture the currently loaded spritesheet
                let id = e.item.id;
                let loadingSheet = window[id]._SpriteSheet;
                // kill global variables on the window - save the global scope!
                window[id] = null;

                // listening for spritesheet to be loaded if not already
                if (!loadingSheet.complete) {
                    loadingSheet.on("complete", (e) => {
                        console.log("asset loaded: " + loadingSheet._images[0].src + " type: spritesheet");
                        // store spritesheet object for later retrieval
                        this._spriteSheets[id] = loadingSheet;
                        this._sheetsLoaded++;
                    }, this, true);
                } else {
                    console.log("asset loaded: " + loadingSheet._images[0].src + " type: spritesheet");
                    this._spriteSheets[id] = loadingSheet;
                    this._sheetsLoaded++;
                }
                break;
        }
    }

    // called if there is an error loading the spriteSheet (usually due to a 404)
    _onError(e) {
        console.log("ASSETMANAGER ERROR > Error Loading asset");
    }

    _onComplete(e) {
        // kill event listeners
        this._preloader.removeAllEventListeners();

        // all js / sound assets loaded but spritesheets aren't loaded yet
        if (this._sheetsLoaded < this._sheetsTotal) {
            // listen for when it is loaded
            createjs.Ticker.on("tick", (e) => {
                if (this._sheetsLoaded >= this._sheetsTotal) {
                    e.remove();
                    console.log(">> all assets loaded");
                    // dispatch event that all assets are loaded
                    this._stage.dispatchEvent(this._eventAllLoaded);
                }
            }, this);
        } else {
            console.log(">> all assets loaded");
            this._stage.dispatchEvent(this._eventAllLoaded);
        }
    }

	// ------------------------------------------------------ public methods
    getSprite(spriteSheetID) {
        // construct sprite object to animate the frames (I call this a clip)
        let sprite = new createjs.Sprite(this._spriteSheets[spriteSheetID]);
        sprite.x = 0;
        sprite.y = 0;
        sprite.currentFrame = 0;
        return sprite;
    }

	getSpriteSheet(spriteSheetID) {
		return this._spriteSheets[spriteSheetID];
	}

    loadAssets(manifest) {
        // register different plugins for sound playback in browsers when available
        createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashAudioPlugin]);
        // if browser doesn't suppot the ogg it will attempt to look for an mp3
        createjs.Sound.alternateExtensions = ["mp3","wav"];
        // registers the PreloadJS object with SoundJS - will automatically have access to all sound assets
        this._preloader.installPlugin(createjs.Sound);

        // best solution is to use createjs on method which is an abstraction on addEventListener
        // third argument let's you pass in the scope of this
        this._preloader.on("fileload", this._onLoaded, this);
        this._preloader.on("error", this._onError, this);
        this._preloader.on("complete", this._onComplete, this);

        this._preloader.setMaxConnections(1);
        // load first spritesheet to start preloading process
        this._preloader.loadManifest(manifest);
    }
}