let testSpriteSheet = async () => {

    // RES.getResAsync("xxxxx")
    // RES.getResByUrl("resource/assets/bg.jpg", (value) => { console.log(value) }, this);
    // RES.getResByUrl("resource/assets/bg.jpg", (value) => { console.log(value) }, this);
    RES.createGroup("group1", ["assets/sheet/sheet.json#off"]);
    await RES.loadGroup("group1");
    await RES.loadGroup("group1");
    await RES.getResAsync("assets/sheet/sheet.json#off");
    await RES.getResAsync("assets/sheet/sheet.json#on");
}

let testAutoSpriteSheet = async () => {

    let texture = await RES.getResAsync("assets/bitmap/bg.jpg");
    let stage = egret.MainContext.instance.stage;
    let bitmap = new egret.Bitmap();
    bitmap.texture = texture;
    this.addChild(bitmap);

}
