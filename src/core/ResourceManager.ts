module RES {

    const __tempCache = {};

    export var host: ProcessHost = {

        get resourceConfig() {
            return manager.config;
        },

        load: (r: ResourceInfo, processor: Processor | undefined, cache: boolean = true) => {
            if (!processor) {
                processor = host.isSupport(r);
            }
            if (!processor) {
                throw 'error';
            }
            return processor.onLoadStart(host, r)
                .then(data => {
                    if (cache) {
                        host.save(r, data);
                    }
                }
                )
        },

        unload(r: ResourceInfo, cache: boolean = true) {
            let processor = host.isSupport(r);
            if (processor) {
                return processor.onRemoveStart(host, r)
                    .then(() => {
                        if (cache) {
                            host.remove(r);
                        }
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
            let type = resource.type;

            let map = {
                "image": ImageProcessor,
                "json": JsonProcessor,
                "text": TextProcessor,
                "xml": XMLProcessor,
                "sheet": SheetProcessor
            }

            return map[type];
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

        export function load(resources: ResourceInfo[] | ResourceInfo, reporter?: PromiseTaskReporter): Promise<void> {
            return queue.load(resources, reporter);
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


    }


}

