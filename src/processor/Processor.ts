module RES {


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

        onLoadStart(host, resource) {

            let executor = (reslove, reject) => {

                let onSuccess = () => {
                    let texture = loader.data;
                    reslove(texture);
                }

                let onError = () => {
                    reject();
                }


                var loader = new egret.ImageLoader();
                loader.addEventListener(egret.Event.COMPLETE, onSuccess, this);
                loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
                loader.load(resource.url);
            }

            return new Promise(executor);
        },

        onRemoveStart(host, resource) {

            let texture = host.get(resource);
            // texture.webGLTexture.dispose();
            return Promise.resolve();
        }

    }

    export var TextProcessor: Processor = {

        onLoadStart(host, resource) {

            return new Promise((reslove, reject) => {


                let onSuccess = () => {
                    let text = request.response;
                    reslove(text);
                };

                let onError = () => {
                    reject();
                }

                var request: egret.HttpRequest = new egret.HttpRequest();
                request.addEventListener(egret.Event.COMPLETE, onSuccess, this);
                request.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
                request.responseType = egret.HttpResponseType.TEXT;
                request.open(resource.url, "get");
                request.send();

            })
        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }

    export var JsonProcessor: Processor = {

        onLoadStart(host, resource) {
            return new Promise((reslove, reject) => {
                host.load(TextProcessor, resource).then((text) => {
                    let data = JSON.parse(text);
                    reslove(data);
                })
            })
        },

        onRemoveStart(host, request) {
            return Promise.resolve();
        }

    }

    export var XMLProcessor: Processor = {

        onLoadStart(host, resource) {
            return new Promise((reslove, reject) => {
                host.load(TextProcessor, resource).then((text) => {
                    var xml = egret.XML.parse(text);
                    reslove(xml);
                })
            });

        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }
}