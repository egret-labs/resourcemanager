module RES {


    async function promisify(loader: egret.ImageLoader | egret.HttpRequest): Promise<any> {

        return new Promise((reslove, reject) => {
            let onSuccess = () => {
                let texture = loader['data'] ? loader['data'] : loader['response'];
                reslove(texture);
            }

            let onError = () => {
                reject();
            }
            loader.addEventListener(egret.Event.COMPLETE, onSuccess, this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
        })
    }


    export function getRelativePath(url: string, file: string): string {
        url = url.split("\\").join("/");

        var params = url.match(/#.*|\?.*/);
        var paramUrl = "";
        if (params) {
            paramUrl = params[0];
        }

        var index: number = url.lastIndexOf("/");
        if (index != -1) {
            url = url.substring(0, index + 1) + file;
        }
        else {
            url = file;
        }
        return url + paramUrl;
    }


    export interface ProcessHost {

        resourceConfig: ResourceConfig;

        load: (resource: ResourceInfo, processor?: Processor) => Promise<any>;

        unload: (resource: ResourceInfo) => Promise<any>

        save: (rexource: ResourceInfo, data: any) => void;

        get: (resource: ResourceInfo) => any;

        remove: (resource: ResourceInfo) => void;

        /**
         * @internal
         */
        isSupport: (resource: ResourceInfo) => Processor | undefined;

    }

    export interface Processor {

        onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;

        onRemoveStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;


    }

    export var ImageProcessor: Processor = {

        async onLoadStart(host, resource) {
            var loader = new egret.ImageLoader();
            loader.load("resource/" + resource.url);
            var bitmapData = await promisify(loader);
            var texture: egret.Texture = new egret.Texture();
            texture._setBitmapData(bitmapData);
            // var config: any = resItem.data;
            // if (config && config["scale9grid"]) {
            //     var str: string = config["scale9grid"];
            //     var list: Array<string> = str.split(",");
            //     texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
            // }
            return texture;
        },

        onRemoveStart(host, resource) {

            let texture = host.get(resource);
            texture.dispose();
            return Promise.resolve();
        }

    }

    export var TextProcessor: Processor = {

        async onLoadStart(host, resource) {

            var request: egret.HttpRequest = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open("resource/" + resource.url, "get");
            request.send();
            let text = await promisify(request);
            return text;

        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }

    export var JsonProcessor: Processor = {

        async onLoadStart(host, resource) {
            let text = await host.load(resource, TextProcessor);
            let data = JSON.parse(text);
            return data;
        },

        onRemoveStart(host, request) {
            return Promise.resolve();
        }

    }

    export var XMLProcessor: Processor = {

        async onLoadStart(host, resource) {
            let text = await host.load(resource, TextProcessor);
            let data = egret.XML.parse(text);
            return data;
        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }

    export var SheetProcessor: Processor = {

        async onLoadStart(host, resource): Promise<any> {

            let data = await host.load(resource, JsonProcessor);
            let imageUrl = getRelativePath(resource.url, data.file);
            host.resourceConfig.addResourceData({ name: imageUrl, type: "image", url: imageUrl });
            let r = host.resourceConfig.getResource(imageUrl);
            if (!r) {
                throw 'error';
            }
            var texture: egret.Texture = await host.load(r);


            var frames: any = data.frames;
            if (!frames) {
                throw 'error';
            }
            var spriteSheet: egret.SpriteSheet = new egret.SpriteSheet(texture);
            for (var subkey in frames) {
                var config: any = frames[subkey];
                var texture: egret.Texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                // if (config["scale9grid"]) {
                //     var str: string = config["scale9grid"];
                //     var list: Array<string> = str.split(",");
                //     texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                // }
                //     if (name) {
                //         this.addSubkey(subkey, name);
                //     }
            }
            console.log(spriteSheet)
            return spriteSheet;


            return Promise.resolve();
        },


        onRemoveStart(host, resource): Promise<any> {
            return Promise.resolve();
        }

    }
}