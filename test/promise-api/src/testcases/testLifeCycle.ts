let testLifeCycle = () => {
    let mc;
    let stage = egret.MainContext.instance.stage;
    const url = "assets/movieclip/movieclip.json";

    return RES.getResAsync(url).then(() => {

        RES.destroyRes(url);

        let mcFactory: egret.MovieClipDataFactory = RES.getRes(url);

        console.log(mcFactory)

        // mc = new egret.MovieClip(mcFactory.generateMovieClipData("test"));
        // stage.addChild(mc);
        // mc.x = 50;
        // mc.y = 150;
        // mc.gotoAndPlay(1, -1);

    });
}