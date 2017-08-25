

/**
 * 加载、删除、再次加载 MovieClip
 * movieclip.json 的生命周期与 movieclip.png 的生命周期保持一致
 */
let testMovieClip = () => {

    let mc;
    let stage = egret.MainContext.instance.stage;

    return RES.getResAsync("assets/movieclip/movieclip.json")
        .then((value) => {
            let mcDataFactory: egret.MovieClipDataFactory = value;
            mc = new egret.MovieClip(mcDataFactory.generateMovieClipData("test"));
            stage.addChild(mc);
            mc.x = 50;
            mc.y = 150;
            mc.gotoAndPlay(1, -1);
            console.log(RES.getRes("assets/movieclip/movieclip.png"))
            return RES.destroyRes("assets/movieclip/movieclip.json")
        }).then(() => {
            stage.removeChild(mc);
            console.log(RES.getRes("assets/movieclip/movieclip.png"))
            return RES.getResAsync("assets/movieclip/movieclip.json")
        }).then((value) => {
            console.log(RES.getRes("assets/movieclip/movieclip.png"))
            let mcDataFactory: egret.MovieClipDataFactory = value;
            mc = new egret.MovieClip(mcDataFactory.generateMovieClipData("test"));
            stage.addChild(mc);
            mc.x = 50;
            mc.y = 150;
            mc.gotoAndPlay(1, -1);
        })
}
