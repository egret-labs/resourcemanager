function testNetworkDelay() {


    var SheetProcessor: RES.processor.Processor = {

        onLoadStart(host, resource): Promise<any> {

            return host.load(resource, RES.processor.JsonProcessor).then((data) => {
                let imagePath = RES.processor.getRelativePath(resource.name, data.file);
                let r = host.resourceConfig['getResource'](imagePath);
                if (!r) {
                    throw new RES.ResourceManagerError(1001, imagePath);
                }
                console.log("aaaa")
                return sleep(3000).then(() => {
                    console.log("bbbb")
                    return host.load(r).then((texture: egret.Texture) => {
                        var frames: any = data.frames;
                        var spriteSheet = new egret.SpriteSheet(texture);
                        for (var subkey in frames) {
                            var config: any = frames[subkey];
                            var texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                        }
                        return spriteSheet;
                    })
                })


            })

        },


        getData(host, resource, key, subkey) {
            let data: egret.SpriteSheet = host.get(resource);
            if (data) {
                return data.getTexture(subkey);
            }
            else {
                console.error("missing resource :" + resource.name);
                return null;
            }
        },


        onRemoveStart(host, resource): Promise<any> {
            return Promise.resolve();
        }

    }


    RES.processor.map("sheet", SheetProcessor);


    sleep(1000).then(() => {
        let texture = RES.getRes("assets/sheet/sheet1.json#off");
        console.assert(!texture, "由于有3秒延迟，而此时只经过了1秒，所以尚未获取到 texture")
    })

    return RES.getResAsync("assets/sheet/sheet1.json")
        .then((value: egret.SpriteSheet) => {
            let texture = RES.getRes("assets/sheet/sheet1.json#off");
            console.assert(texture instanceof egret.Texture, "获取到texture")

            RES.processor.map("sheet", RES.processor.SheetProcessor);
        });




}