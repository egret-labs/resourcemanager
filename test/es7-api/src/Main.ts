/**
 * 新版 RES API
 */

function sleep(time): Promise<void> {
    return new Promise<void>((reslove, reject) => {
        setTimeout(reslove, time);
    });
}

@RES.mapConfig("resource-new.json", () => "resource", () => 'todo')
class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, async event => { 
            // 通过类型推断，TypeScript 无需开发者手动声明 event 为 egret.TouchEvent
            // 并因此告知开发者，不存在 localx 这个属性，应为 localX
            console.log (event.localx)
            let reportrer = {
                onProgress: (current, total) => {
                    console.log(current, total);
                }
            }
            // 使用 async / await 语法处理资源加载，无需复杂的事件侦听函数或者回调函数嵌套
            await RES.loadConfig();
            await RES.loadGroup("preload", 0, reportrer);
            // 通过类型推断，无需开发者手动为 sky 声明为 egret.Bitmap 类型
            let sky = this.createBitmapByName("assets/bg.jpg");
            this.createGameScene();
            await sleep(1000);
            let spriteSheet: egret.SpriteSheet = await RES.getResAsync("sheet_json");
            sky.texture = spriteSheet.getTexture("bg_jpg");
        }, this);
    }

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


