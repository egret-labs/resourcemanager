module RES.processor {



    export function isSupport(resource: ResourceInfo) {
        return _map[resource.type];
    }

    export function map(type: string, processor: Processor) {
        _map[type] = processor;
    }

    async function promisify(loader: egret.ImageLoader | egret.HttpRequest | egret.Sound, resource: ResourceInfo): Promise<any> {

        return new Promise((reslove, reject) => {
            let onSuccess = () => {
                let texture = loader['data'] ? loader['data'] : loader['response'];
                reslove(texture);
            }

            let onError = () => {
                let e = { code: 1001, message: `文件加载失败:'${resource.url}'` }
                reject(e);
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

        var index = url.lastIndexOf("/");
        if (index != -1) {
            url = url.substring(0, index + 1) + file;
        }
        else {
            url = file;
        }
        return url + paramUrl;
    }
    export var ImageProcessor: Processor = {

        async onLoadStart(host, resource) {
            var loader = new egret.ImageLoader();
            let prefix = resource.extra ? "" : resourceRoot;
            loader.load(prefix + resource.url);
            var bitmapData = await promisify(loader, resource);
            var texture = new egret.Texture();
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

    export var BinaryProcessor: Processor = {

        async onLoadStart(host, resource) {

            var request: egret.HttpRequest = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
            let prefix = resource.extra ? "" : resourceRoot;
            request.open(prefix + resource.url, "get");
            request.send();
            let arraybuffer = await promisify(request, resource);
            return arraybuffer;

        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }

    }

    export var TextProcessor: Processor = {

        async onLoadStart(host, resource) {

            var request: egret.HttpRequest = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            let prefix = resource.extra ? "" : resourceRoot;
            request.open(prefix + resource.url, "get");
            request.send();
            let text = await promisify(request, resource);
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

    export var CommonJSProcessor: Processor = {

        async onLoadStart(host, resource) {
            let text = await host.load(resource, TextProcessor);
            let f = new Function('require', 'exports', text);
            var require = function () { };
            var exports = {};
            f(require, exports);
            return exports;
        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }

    }

    export var SheetProcessor: Processor = {

        async onLoadStart(host, resource): Promise<any> {

            let data = await host.load(resource, JsonProcessor);
            let imageUrl = getRelativePath(resource.url, data.file);
            //todo 
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
            var spriteSheet = new egret.SpriteSheet(texture);
            for (var subkey in frames) {
                var config: any = frames[subkey];
                var texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                // if (config["scale9grid"]) {
                //     var str: string = config["scale9grid"];
                //     var list: Array<string> = str.split(",");
                //     texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                // }
                //     if (name) {
                //         this.addSubkey(subkey, name);
                //     }
            }
            return spriteSheet;
        },


        getSubResource(host, resource, data: egret.SpriteSheet, subkey) {
            return data.getTexture(subkey);
        },


        onRemoveStart(host, resource): Promise<any> {
            return Promise.resolve();
        }

    }


    export var FontProcessor: Processor = {


        async onLoadStart(host, resource): Promise<any> {


            let getTexturePath = function (url: string, fntText: string): string {

                var file: string = "";
                var lines = fntText.split("\n");
                var pngLine = lines[2];
                var index: number = pngLine.indexOf("file=\"");
                if (index != -1) {
                    pngLine = pngLine.substring(index + 6);
                    index = pngLine.indexOf("\"");
                    file = pngLine.substring(0, index);
                }

                url = url.split("\\").join("/");
                var index: number = url.lastIndexOf("/");
                if (index != -1) {
                    url = url.substring(0, index + 1) + file;
                }
                else {
                    url = file;
                }
                return url;
            }


            let data = await host.load(resource, TextProcessor);
            let imageUrl = "";
            let config;
            try {
                config = JSON.parse(data);
                imageUrl = getRelativePath(resource.url, config.file);
            }
            catch (e) {
                config = data;
                imageUrl = this.getTexturePath(resource.url, data);
            }
            let r = host.resourceConfig.getResource(imageUrl);
            if (r) {
                var texture: egret.Texture = await host.load(r);
                var font = new egret.BitmapFont(texture, config);
                return font;
            }
            else {
                return null;
            }
        },





        onRemoveStart(host, resource): Promise<any> {
            return Promise.resolve();
        }


    }


    export var SoundProcessor: Processor = {
        async onLoadStart(host, resource) {
            let prefix = resource.extra ? "" : "resource/";
            var sound: egret.Sound = new egret.Sound();
            sound.load(prefix + resource.url);
            await promisify(sound, resource);
            return sound;
        },
        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }

    var _map = {
        "image": ImageProcessor,
        "json": JsonProcessor,
        "text": TextProcessor,
        "xml": XMLProcessor,
        "sheet": SheetProcessor,
        "font": FontProcessor,
        "bin": BinaryProcessor,
        "commonjs": CommonJSProcessor,
        "sound": SoundProcessor
    }
}