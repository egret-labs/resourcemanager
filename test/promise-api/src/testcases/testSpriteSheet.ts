namespace test.spritesheet {


    /**
     * 测试多次加载对应同一个 MergeResult 的资源，只会加载一次 MergeResult
     */
    export async function testLoadDuplicate() {
        RES.createGroup("group1", ["assets/sheet/sheet.json#off"]);
        await RES.loadGroup("group1");
        await RES.loadGroup("group1");
        await RES.getResAsync("assets/sheet/sheet.json#off");
        await RES.getResAsync("assets/sheet/sheet.json#on");
    }

    export async function testLoadDuplicate2() {

        let texture = await RES.getResAsync("assets/bitmap/bg.jpg");
        let stage = egret.MainContext.instance.stage;
        let bitmap = new egret.Bitmap();
        bitmap.texture = texture;
        stage.addChild(bitmap);

    }


    /**
     * 测试如果把资源合并进 SpriteSheet ，仍然可以使用之前的资源加载方式进行加载，业务逻辑无需修改
     */
    export async function testAutoSpriteSheet() {
        let texture = await RES.getResAsync("assets/bitmap/bg.jpg");
        let stage = egret.MainContext.instance.stage;
        let bitmap = new egret.Bitmap();
        bitmap.texture = texture;
        stage.addChild(bitmap);

    }
}



