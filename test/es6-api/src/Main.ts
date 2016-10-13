/**
 * 新版 RES API
 */

@RES.mapConfig<"resource" | "resource_ios">("resource-new.json", () => "resource")
class Main extends egret.DisplayObjectContainer {

    private sky: egret.Bitmap;

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        let reportrer = {

            onProgress: (current, total) => {
                console.log(current, total);
            }
        }

        RES.loadConfig()
            .then(() => RES.loadGroup("preload", 0, reportrer))
            .then(() => this.createGameScene())
            .then(() => sleep(1000))
            .then(() => RES.destroyRes("preload"))
            // .then(() => {
            //     RES.createGroup("tempGroup", ["sheet_json"]);
            //     return RES.loadGroup("tempGroup")
            // })
            .then(() => RES.getResAsync("sheet_json"))
            .then(() => sleep(1000))
            .then(() => {
                let spritesheet: egret.SpriteSheet = RES.getRes("sheet_json");
                this.sky.texture = spritesheet.getTexture("bg_jpg");
            }).catch((e) => {
                console.warn(e);
                console.log (e.stack)
                // throw e;
            });
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