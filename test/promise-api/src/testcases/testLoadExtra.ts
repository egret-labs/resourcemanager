

/**
 * 加载、删除、再次加载 MovieClip
 * movieclip.json 的生命周期与 movieclip.png 的生命周期保持一致
 */
let testLoadExtra = () => {
    let stage = egret.MainContext.instance.stage;
    const url = "https://static.boomegg.cn/cdn/planet/platform/qzone/img/activity/file1468590307-fc0e5dea.png"
    egret.ImageLoader.crossOrigin = "anonymous"
    return RES.getResByUrl(url, (data) => {
        let bitmap = new egret.Bitmap();
        bitmap.texture = data;
        stage.addChild(bitmap)
    }, this)

}