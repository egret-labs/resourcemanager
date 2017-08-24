class Main extends egret.DisplayObjectContainer {

    private sky: egret.Bitmap;

    public constructor() {

        super();
        RES.FEATURE_FLAG.LOADING_STATE = 1;
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

    }

    private onAddToStage(event: egret.Event) {


        let testNull = () => {



            egret.setTimeout(() => {
                egret.setTimeout(() => {
                    let loader = new egret.URLLoader();
                    loader.load(new egret.URLRequest("http://www.baidu.com"))
                }, this, 500)
                RES.createGroup("x", ["123412312"]);
                RES.loadGroup("x");

            }, this, 500)




        };

        let testBitmapFont = () =>
            RES.getResAsync("assets/font/font.fnt").then(value => {
                console.log(value)
                var text = new egret.BitmapText();
                text.font = value;
                this.addChild(text);
                text.text = "0";
            });
        ;

        let testGroupWithURL = async () => {
            let data = await RES.getResAsync("assets/sheet/sheet.json");
            // RES.createGroup("group1", ["assets/bg.jpg"])
        }


        let testLoadResByUrl = () =>
            RES.getResByUrl("resource/assets/bg.jpg", (value) => { console.log(value) }, this);


        let testSoundByUrl = () =>
            RES.getResAsync("assets/sound/sound_go.mp3").then((value) => {
                console.log(value)
                console.log('sound play')
                var sound: egret.Sound = value;
                sound.play();
            })

        let testCreateAndDestoryResource = () => {
            let reporter = {

                onProgress: (current, total) => {
                }
            }

            return RES.loadGroup("preload", 0, reporter)
                .then(() => this.createGameScene())
                .then(() => sleep(1000))
                .then(() => RES.destroyRes("preload"))

                .then(() => sleep(1000))
                // .then(() => RES.destroyRes("assets/bg.jpg"))
                .then(() => RES.loadGroup("preload", 0, reporter).then(() => {
                    alert(111)
                    this.sky.y = 1;
                    // this.sky.texture = RES.getRes("assets/bg.jpg")
                }))
        }

        let testAnimationByUrl = () =>
            RES.getResAsync("assets/movieclip/movieclip.json").then((value) => {
                var mcDataFactory: egret.MovieClipDataFactory = value;
                var attack = new egret.MovieClip(mcDataFactory.generateMovieClipData("test"));
                this.addChild(attack);
                attack.x = 50;
                attack.y = 150;
                attack.gotoAndPlay(1, -1);
            });


        let testPVR = () =>
            RES.getResAsync("assets/pvr/0.pvr")
                .then(value => {
                    console.log(value)
                });

        let testMerge = async () => {
            await RES.getResAsync("111.mergeJson");
            let data = await RES.getResAsync("skeleton_json");
            console.log(data)
        }



        RES.setConfigURL("resource-bundles/config.res.js")
        RES.loadConfig()
            .then(testLoadZip)
        // .then(testGroupIsLoaded)
        // .then(testNull)
        // .then(testCreateAndDestoryResource)
        // .then(testLoadResByUrl)
        // .then(testBitmapFont)
        // .then(testNetworkDelay)
        // .then(testSpriteSheet)
        // .then(testAutoSpriteSheet)
        // .then(testGroupWithURL)
        // .then(testSoundByUrl)
        // .then(testAnimationByUrl)
        // .then(testPVR)
        // .then(testDestroy)
        // .then(testMerge)
        // .catch((e) => {
        //     console.warn(e);
        //     console.warn(e.stack)
        //     // throw e;
        // });
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        var sky: egret.Bitmap = createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        this.sky = sky;

    }
}


function sleep(time): Promise<void> {
    return new Promise<void>((reslove, reject) => {
        setTimeout(reslove, time);
    });

}

function createBitmapByName(name: string): egret.Bitmap {
    var result = new egret.Bitmap();
    var texture: egret.Texture = RES.getRes(name);
    result.texture = texture;
    return result;
}