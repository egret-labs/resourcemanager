/**
 * 新版 RES API
 */

@RES.mapConfig<"resource" | "resource_ios">("resource-new.json", () => "resource")
class Main_New_API extends egret.DisplayObjectContainer {

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
            .then(() => {
                this.createGameScene();
                return Promise.resolve();
            })
            .then(() => sleep(1000))
            .then(() => {
                RES.destroyRes("preload");
            });

        //  setTimeout(() => {
        //         
        //         RES.getResAsync("sheet_json", () => {
        //             let spritesheet: egret.SpriteSheet = RES.getRes("sheet_json");
        //             this.sky.texture = spritesheet.getTexture("bg_jpg");
        //         }, this);
        //         // RES.createGroup("tempGroup", ["sheet_json"]);
        //         // RES.loadGroup("tempGroup")
        //     }, 1000);
    }




    // /**
    //  * preload资源组加载完成
    //  * Preload resource group is loaded
    //  */
    // private onResourceLoadComplete(event: RES.ResourceEvent): void {
    //     if (event.groupName == "tempGroup") {
    //         let spritesheet: egret.SpriteSheet = RES.getRes("sheet_json");
    //         this.sky.texture = spritesheet.getTexture("bg_jpg");

    //     }
    // }

    private sky: egret.Bitmap;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        var sky: egret.Bitmap = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        this.sky = sky;



    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        var result = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}


function sleep(time): Promise<void> {
    return new Promise<void>((reslove, reject) => {
        setTimeout(reslove, time);
    });

}