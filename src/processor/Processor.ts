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


    export interface ProcessHost {

        resourceConfig: ResourceConfig;

        load: (processor: Processor, resource: ResourceInfo) => PromiseLike<any>;

        unload: (resource: ResourceInfo) => PromiseLike<any>

        save: (rexource: ResourceInfo, data: any) => void;

        get: (resource: ResourceInfo) => any;

        remove: (resource: ResourceInfo) => void;

        /**
         * @internal
         */
        isSupport: (resource: ResourceInfo) => Processor | undefined;

    }

    export interface Processor {

        onLoadStart(host: ProcessHost, resource: ResourceInfo): PromiseLike<any>;

        onRemoveStart(host: ProcessHost, resource: ResourceInfo): PromiseLike<any>;


    }

    export var ImageProcessor: Processor = {

        async onLoadStart(host, resource) {
            var loader = new egret.ImageLoader();
            loader.load(resource.url);
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
            request.open(resource.url, "get");
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
            let text = await host.load(TextProcessor, resource);
            let data = JSON.parse(text);
            return data;
        },

        onRemoveStart(host, request) {
            return Promise.resolve();
        }

    }

    export var XMLProcessor: Processor = {

        async onLoadStart(host, resource) {
            let text = await host.load(TextProcessor, resource);
            let data = egret.XML.parse(text);
            return data;
        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }
}