module RES {

    export interface ProcessHost {

        resourceConfig: ResourceConfig;

        execute: (processor: Processor, resource: ResourceInfo) => PromiseLike<ResourceInfo>;

        save: (rexource: ResourceInfo, data: any) => void;

        get: (resource: ResourceInfo) => any;

        isSupport: (resource: ResourceInfo) => boolean;

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
                    host.save(resource, texture);
                    reslove(resource);
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
            return Promise.resolve();
        }

    }


}