module RES {

    const __tempCache = {};

    export var host: ProcessHost = {

        get resourceConfig() {
            return manager.config;
        },

        load: (resourceInfo: ResourceInfo, processor: Processor | undefined) => {
            if (!processor) {
                processor = host.isSupport(resourceInfo);
            }
            if (!processor) {
                throw 'error';
            }
            return processor.onLoadStart(host, resourceInfo)
        },

        unload(resource: ResourceInfo) {
            let processor = host.isSupport(resource);
            if (processor) {
                return processor.onRemoveStart(host, resource);
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


}

