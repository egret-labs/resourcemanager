module RES {

    const __tempCache = {};

    export function profile() {
        console.log(FileSystem.data);
        console.log(__tempCache);
        //todo 
        let totalImageSize = 0;
        for (var key in __tempCache) {
            let img = __tempCache[key]
            if (img instanceof egret.Texture) {
                totalImageSize += img._bitmapWidth * img._bitmapHeight * 4;
            }
        }
        console.log("gpu size : " + (totalImageSize / 1024).toFixed(3) + "kb");
    }

    export var host: ProcessHost = {

        get resourceConfig() {
            return manager.config;
        },

        load: (r: ResourceInfo, processor: Processor | undefined, cache: boolean = true) => {
            if (!processor) {
                processor = host.isSupport(r);
            }
            if (!processor) {
                throw new ResourceManagerError(2001, r.type);
            }
            return processor.onLoadStart(host, r)
                .then(data => {
                    if (cache) {
                        host.save(r, data);
                    }
                    return data;
                }
                )
        },

        unload(r: ResourceInfo, cache: boolean = true) {
            let processor = host.isSupport(r);
            if (processor) {
                return processor.onRemoveStart(host, r)
                    .then(result => {
                        if (cache) {
                            host.remove(r);
                        }
                        return result;
                    }
                    )
            }
            else {
                return Promise.resolve();
            }
        },



        save(resource: ResourceInfo, data: any) {
            __tempCache[resource.url] = data;
        },


        get(resource: ResourceInfo) {
            return __tempCache[resource.url];
        },

        remove(resource: ResourceInfo) {
            delete __tempCache[resource.url];
        },

        isSupport(resource: ResourceInfo) {
            return RES.processor.isSupport(resource);
        }
    }


    export namespace manager {

        export var config = new ResourceConfig();

        var queue = new PromiseQueue();

        export function init(): Promise<void> {
            return host.load(configItem).then((data) => {
                config.parseConfig(data, "resource");
            }).catch(e => Promise.reject({ code: 1002 }));
        }

        export function load(resources: ResourceInfo[] | ResourceInfo, reporter?: PromiseTaskReporter): Promise<ResourceInfo[] | ResourceInfo> {
            return queue.load(resources, reporter);
        }

        export function destory() {
            //todo 销毁整个 ResourceManager上下文全部内容
        }


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

        getSubResource?(host: ProcessHost, resource: ResourceInfo, data: any, subkey: string): any;


    }

    export class ResourceManagerError extends Error {



        static errorMessage = {

            2001: "不支持指定解析类型:{0}，请编写自定义 Processor ，更多内容请参见 http://www.egret.com //todo"

        }

        constructor(code: number, replacer?: string) {
            super();
            this.name = code.toString();
            this.message = ResourceManagerError.errorMessage[code].replace("{0}", replacer);
        }
    }


}

