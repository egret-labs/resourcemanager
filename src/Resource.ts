//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module RES {

    var __tempCache = {};

    export var host: ProcessHost = {



        get resourceConfig() {
            return RES['configInstance']
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

    /**
     * @language en_US
     * Conduct mapping injection with class definition as the value.
     * @param type Injection type.
     * @param analyzerClass Injection type classes need to be resolved.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/Resource.ts
     */
    /**
     * @language zh_CN
     * 以类定义为值进行映射注入。
     * @param type 注入的类型。
     * @param analyzerClass 注入类型需要解析的类。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/Resource.ts
     */
    export function registerAnalyzer(type: string, analyzerClass: any) {
        instance.registerAnalyzer(type, analyzerClass);
    }

    /**
     * @language en_US
     * Load configuration file and parse.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 加载配置文件并解析。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function loadConfig(url?: string, resourceRoot?: string): PromiseLike<void> {

        return instance.loadConfig();
    }
    /**
     * @language en_US
     * Load a set of resources according to the group name.
     * @param name Group name to load the resource group.
     * @param priority Load priority can be negative, the default value is 0.
     * <br>A low priority group must wait for the high priority group to complete the end of the load to start, and the same priority group will be loaded at the same time.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 根据组名加载一组资源。
     * @param name 要加载资源组的组名。
     * @param priority 加载优先级,可以为负数,默认值为 0。
     * <br>低优先级的组必须等待高优先级组完全加载结束才能开始，同一优先级的组会同时加载。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): PromiseLike<void> {
        return instance.loadGroup(name, priority, reporter);
    }
    /**
     * @language en_US
     * Check whether a resource group has been loaded.
     * @param name Group name。
     * @returns Is loading or not.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 检查某个资源组是否已经加载完成。
     * @param name 组名。
     * @returns 是否正在加载。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function isGroupLoaded(name: string): boolean {
        return instance.isGroupLoaded(name);
    }
    /**
     * @language en_US
     * A list of groups of loading is obtained according to the group name.
     * @param name Group name.
     * @returns The resource item array of group.
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 根据组名获取组加载项列表。
     * @param name 组名。
     * @returns 加载项列表。
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function getGroupByName(name: string): Array<ResourceItem> {
        return instance.getGroupByName(name).map(r => ResourceItem.convertToResItem(r));
    }
    /**
     * @language en_US
     * Create a custom load resource group, note that this method is valid only after the resource configuration file is loaded.
     * <br>You can monitor the ResourceEvent.CONFIG_COMPLETE event to verify that the configuration is complete.
     * @param name Group name to create the load resource group.
     * @param keys To be included in the list of key keys, the corresponding configuration file in the name or sbuKeys property one or a resource group name.
     * @param override Is the default false for the same name resource group already exists.
     * @returns Create success or fail.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
     * <br>可以监听 ResourceEvent.CONFIG_COMPLETE 事件来确认配置加载完成。
     * @param name 要创建的加载资源组的组名。
     * @param keys 要包含的键名列表，key 对应配置文件里的 name 属性或 sbuKeys 属性的一项或一个资源组名。
     * @param override 是否覆盖已经存在的同名资源组,默认 false。
     * @returns 是否创建成功。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function createGroup(name: string, keys: Array<string>, override: boolean = false): boolean {
        return instance.createGroup(name, keys, override);
    }
    /**
     * @language en_US
     * Check whether the configuration file contains the specified resources.
     * @param key A sbuKeys attribute or name property in a configuration file.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 检查配置文件里是否含有指定的资源。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function hasRes(key: string): boolean {
        return instance.hasRes(key);
    }

    /**
     * @language en_US
     * The synchronization method for obtaining the cache has been loaded with the success of the resource.
     * <br>The type of resource and the corresponding return value types are as follows:
     * <br>RES.ResourceItem.TYPE_BIN : ArrayBuffer JavaScript primary object
     * <br>RES.ResourceItem.TYPE_IMAGE : img Html Object，or egret.BitmapData interface。
     * <br>RES.ResourceItem.TYPE_JSON : Object
     * <br>RES.ResourceItem.TYPE_SHEET : Object
     * <br>  1. If the incoming parameter is the name of the entire SpriteSheet is returned is {image1: Texture, "image2": Texture}.
     * <br>  2. If the incoming is "sheet.image1", the return is a single resource.
     * <br>  3. If the incoming is the name of the "image1" single resource, the return is a single resource.
     * But if there are two SpriteSheet in a single picture of the same name, the return of the image after the load.
     * <br>RES.ResourceItem.TYPE_SOUND : HtmlSound Html Object
     * <br>RES.ResourceItem.TYPE_TEXT : string
     * @param key A subKeys attribute or name property in a configuration file.
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 同步方式获取缓存的已经加载成功的资源。
     * <br>资源类型和对应的返回值类型关系如下：
     * <br>RES.ResourceItem.TYPE_BIN : ArrayBuffer JavaScript 原生对象
     * <br>RES.ResourceItem.TYPE_IMAGE : img Html 对象，或者 egret.BitmapData 接口。
     * <br>RES.ResourceItem.TYPE_JSON : Object
     * <br>RES.ResourceItem.TYPE_SHEET : Object
     * <br>  1. 如果传入的参数是整个 SpriteSheet 的名称返回的是 {"image1":Texture,"image2":Texture} 这样的格式。
     * <br>  2. 如果传入的是 "sheet.image1"，返回的是单个资源。
     * <br>  3. 如果传入的是 "image1" 单个资源的名称，返回的是单个资源。但是如果有两张 SpriteSheet 中有单个图片资源名称相同，返回的是后加载的那个图片资源。
     * <br>RES.ResourceItem.TYPE_SOUND : HtmlSound Html 对象
     * <br>RES.ResourceItem.TYPE_TEXT : string
     * @param key 对应配置文件里的 name 属性或 subKeys 属性的一项。
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function getRes(key: string): any {
        return instance.getRes(key);
    }
    /**
     * @language en_US
     * Asynchronous mode to get the resources in the configuration. As long as the resources exist in the configuration file, you can get it in an asynchronous way.
     * @param key A sbuKeys attribute or name property in a configuration file.
     * @param compFunc Call back function. Example：compFunc(data,key):void.
     * @param thisObject This pointer of call back function.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 异步方式获取配置里的资源。只要是配置文件里存在的资源，都可以通过异步方式获取。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @param compFunc 回调函数。示例：compFunc(data,key):void。
     * @param thisObject 回调函数的 this 引用。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function getResAsync(key: string, compFunc: Function, thisObject: any): void {
        instance.getResAsync.apply(instance,arguments);
    }
    /**
     * @language en_US
     * Access to external resources through the full URL.
     * @param url The external path to load the file.
     * @param compFunc Call back function. Example：compFunc(data,url):void。
     * @param thisObject This pointer of call back function.
     * @param type File type (optional). Use the static constants defined in the ResourceItem class. If you do not set the file name extension.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/GetResByUrl.ts
     */
    /**
     * @language zh_CN
     * 通过完整URL方式获取外部资源。
     * @param url 要加载文件的外部路径。
     * @param compFunc 回调函数。示例：compFunc(data,url):void。
     * @param thisObject 回调函数的 this 引用。
     * @param type 文件类型(可选)。请使用 ResourceItem 类中定义的静态常量。若不设置将根据文件扩展名生成。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/GetResByUrl.ts
     */
    export function getResByUrl(url: string, compFunc: Function, thisObject: any, type: string = ""): void {
        instance.getResByUrl(url, compFunc, thisObject, type);
    }
    /**
     * @language en_US
     * Destroy a single resource file or a set of resources to the cache data, to return whether to delete success.
     * @param name Name attribute or resource group name of the load item in the configuration file.
     * @param force Destruction of a resource group when the other resources groups have the same resource situation whether the resources will be deleted, the default value true.
     * @returns Are successful destruction.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
     * @param name 配置文件中加载项的name属性或资源组名。
     * @param force 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值 true。
     * @see #setMaxRetryTimes
     * @returns 是否销毁成功。
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function destroyRes(name: string, force?: boolean): boolean {
        return instance.destroyRes(name, force);
    }
    /**
     * @language en_US
     * Sets the maximum number of concurrent load threads, the default value is 2.
     * @param thread The number of concurrent loads to be set.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 设置最大并发加载线程数量，默认值是 2。
     * @param thread 要设置的并发加载数。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function setMaxLoadingThread(thread: number): void {
        instance.setMaxLoadingThread(thread);
    }

    /**
     * @language en_US
     * Sets the number of retry times when the resource failed to load, and the default value is 3.
     * @param retry To set the retry count.
     * @includeExample extension/resource/Resource.ts
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 设置资源加载失败时的重试次数，默认值是 3。
     * @param retry 要设置的重试次数。
     * @includeExample extension/resource/Resource.ts
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function setMaxRetryTimes(retry: number): void {
        instance.setMaxRetryTimes(retry);
    }

    /**
     * @language en_US
     * Add event listeners, reference ResourceEvent defined constants.
     * @param type Event name。
     * @param listener Listener functions for handling events. This function must accept the Event object as its only parameter, and can't return any results,
     * As shown in the following example: function (evt:Event):void can have any name.
     * @param thisObject The this object that is bound to a function.
     * @param useCapture Determine the listener is running on the capture or running on the target and the bubbling phase. Set useCapture to true,
     * then the listener in the capture phase processing events, but not in the target or the bubbling phase processing events.
     * If useCapture is false, then the listener only in the target or the bubbling phase processing events.
     * To listen for events in all three stages, please call addEventListener two times: once the useCapture is set to true, once the useCapture is set to false.
     * @param priority Event listener priority. Priority is specified by a 32 - bit integer with a symbol. The higher the number, the higher the priority.
     * All listeners with a priority for n will be processed before the -1 n listener.
     * If two or more listeners share the same priority, they are processed in accordance with the order of their added. The default priority is 0.
     * @see RES.ResourceEvent
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 添加事件侦听器,参考 ResourceEvent 定义的常量。
     * @param type 事件的类型。
     * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
     * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
     * @param thisObject 侦听函数绑定的 this 对象。
     * @param useCapture 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，
     * 则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。
     * 要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
     * @param priority 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
     * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
     * @see RES.ResourceEvent
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function addEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture: boolean = false, priority: number = 0): void {
        instance.addEventListener(type, listener, thisObject, useCapture, priority);
    }
    /**
     * @language en_US
     * Remove event listeners, reference ResourceEvent defined constants.
     * @param type Event name。
     * @param listener Listening function。
     * @param thisObject The this object that is bound to a function.
     * @param useCapture Is used to capture, and this property is only valid in the display list.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 移除事件侦听器,参考ResourceEvent定义的常量。
     * @param type 事件名。
     * @param listener 侦听函数。
     * @param thisObject 侦听函数绑定的this对象。
     * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function removeEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture: boolean = false): void {
        instance.removeEventListener(type, listener, thisObject, useCapture);
    }


    /**
     * @language en_US
     * Adding a custom resource configuration.
     * @param data To add configuration.
     * @version Egret 3.1.6
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 自定义添加一项资源配置。
     * @param data 要添加的配置。
     * @version Egret 3.1.6
     * @platform Web,Native
     */
    export function $addResourceData(data: { name: string, type: string, url: string }): void {
        //这里可能需要其他配置
        instance.addResourceData(data);
    }


    /**
     * @private
     */
    export class Resource extends egret.EventDispatcher {
        /**
         * 构造函数
		 * @method RES.constructor
         * @private
         */
        public constructor() {
            super();
            this.init();
        }

        private parseResKey(key: string) {
            key = this.resConfig.getKeyByAlias(key);
            let index = key.indexOf("#");
            if (index >= 0) {
                return {
                    key: key.substr(0, index),
                    subkey: key.substr(index + 1)
                }
            }
            else {
                return {
                    key,
                    subkey: ""
                }
            }

        }



        /**
         * 注册一个自定义文件类型解析器
         * @param type 文件类型字符串，例如：bin,text,image,json等。
         * @param analyzerClass 自定义解析器的类定义
         */
        public registerAnalyzer(type: string, analyzerClass: any): void {
            throw 'unimplement';

        }

        /**
         * 多文件队列加载器
         */
        private resLoader: ResourceLoader;
        /**
         * 初始化
         */
        private init(): void {

            this.resConfig = new ResourceConfig();
            this.resLoader = new ResourceLoader();
            this.resLoader.resInstance = this;
            this.resLoader.addEventListener(ResourceEvent.GROUP_COMPLETE, this.onGroupComp, this);
            this.resLoader.addEventListener(ResourceEvent.GROUP_LOAD_ERROR, this.onGroupError, this);
        }

        /**
         * 开始加载配置
		 * @method RES.loadConfig
		 * @param url {string}
		 * @param resourceRoot {string}
		 * @param type {string}
         */
        @checkDecorator
        public loadConfig(): PromiseLike<void> {

            return new Promise<void>((reslove, reject) => {
                host.load(configItem).then((data) => {
                    this.resConfig.parseConfig(data, "resource");//todo
                    ResourceEvent.dispatchResourceEvent(this, ResourceEvent.CONFIG_COMPLETE);
                    this.loadDelayGroups();
                    reslove();
                })
            });
        }

        /**
         * 已经加载过组名列表
         */
        private loadedGroups: Array<string> = [];
        /**
         * 检查某个资源组是否已经加载完成
		 * @method RES.isGroupLoaded
		 * @param name {string}
		 * @returns {boolean}
         */
        public isGroupLoaded(name: string): boolean {
            return this.loadedGroups.indexOf(name) != -1;
        }
        /**
         * 根据组名获取组加载项列表
		 * @method RES.getGroupByName
		 * @param name {string}
		 * @returns {Array<egret.ResourceItem>}
         */
        public getGroupByName(name: string): Array<ResourceInfo> {
            return this.resConfig.getGroupByName(name);
        }

        private groupNameList: Array<any> = [];
        /**
         * 根据组名加载一组资源
		 * @method RES.loadGroup
		 * @param name {string}
		 * @param priority {number}
         */
        public loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): PromiseLike<void> {

            return new Promise<void>((reslove, reject) => {
                if (this.loadedGroups.indexOf(name) != -1) {
                    ResourceEvent.dispatchResourceEvent(this, ResourceEvent.GROUP_COMPLETE, name);
                    reslove();
                }
                else if (this.resLoader.isGroupInLoading(name)) {
                    reslove();
                }
                else {
                    var group = this.resConfig.getGroupByName(name) as ResourceItem[];
                    let p = (e: ResourceEvent) => {
                        if (e.groupName == name) {
                            if (reporter && reporter.onProgress) {
                                reporter.onProgress(e.itemsLoaded, e.itemsTotal);
                            }
                        }

                    }
                    this.resLoader.once(ResourceEvent.GROUP_COMPLETE, () => {
                        this.resLoader.removeEventListener(ResourceEvent.GROUP_PROGRESS, p, this);
                        reslove();
                    }, this);
                    this.addEventListener(ResourceEvent.GROUP_PROGRESS, p, this);
                    this.resLoader.loadGroup(group, name, priority);
                }

            })


        }
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        public createGroup(name: string, keys: Array<string>, override: boolean = false): boolean {
            if (override) {
                var index: number = this.loadedGroups.indexOf(name);
                if (index != -1) {
                    this.loadedGroups.splice(index, 1);
                }
            }
            return this.resConfig.createGroup(name, keys, override);
        }
        /**
         * res配置数据
         */
        private resConfig: ResourceConfig;
        /**
         * 队列加载完成事件
         */
        private onGroupComp(event: ResourceEvent): void {
            this.loadedGroups.push(event.groupName);
            this.dispatchEvent(event);
        }
        /**
         * 启动延迟的组加载
         */
        private loadDelayGroups(): void {
            var groupNameList: Array<any> = this.groupNameList;
            this.groupNameList = [];
            var length: number = groupNameList.length;
            for (var i: number = 0; i < length; i++) {
                var item: any = groupNameList[i];
                this.loadGroup(item.name, item.priority);
            }

        }
        /**
         * 队列加载失败事件
         */
        private onGroupError(event: ResourceEvent): void {
            this.dispatchEvent(event);
        }
        /**
         * 检查配置文件里是否含有指定的资源
		 * @method RES.hasRes
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
		 * @returns {boolean}
         */
        public hasRes(key: string): boolean {
            let name = this.parseResKey(key).key;
            return this.resConfig.getResource(name) != null;
        }

        /**
         * 通过key同步获取资源
		 * @method RES.getRes
		 * @param key {string}
		 * @returns {any}
         */
        @checkNull
        public getRes(resKey: string): any {
            let {key, subkey} = this.parseResKey(resKey);
            let r = this.resConfig.getResource(key);
            if (r && host.isSupport(r)) {
                return host.get(r);
            }


        }

        /**
         * 通过key异步获取资源
         * @method RES.getResAsync
         * @param key {string}
         * @param compFunc {Function} 回调函数。示例：compFunc(data,url):void。
         * @param thisObject {any}
         */
        public getResAsync(key: string, compFunc: Function, thisObject: any): void {

            var {key, subkey} = this.parseResKey(key);
            let r = this.resConfig.getResource(key, true);
            let url = r.url;
            let res = host.get(r);
            if (res) {
                egret.$callAsync(compFunc, thisObject, res, key);
                return;
            }
            host.load(r).then((value) => {
                RES.host.save(r, value);
                compFunc.call(thisObject, value, r.url);
            });
        }

        /**
         * 通过url获取资源
		 * @method RES.getResByUrl
		 * @param url {string}
		 * @param compFunc {Function}
		 * @param thisObject {any}
		 * @param type {string}
         */
        public getResByUrl(url: string, compFunc: Function, thisObject: any, type: string = ""): void {
            let r = this.resConfig.getResource(url);
            if (!r) {
                this.resConfig.addResourceData({ name: url, url: url });
            }
            this.getResAsync(url, compFunc, thisObject);
        }

        /**
         * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
		 * @method RES.destroyRes
         * @param name {string} 配置文件中加载项的name属性或资源组名
         * @param force {boolean} 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值true
		 * @returns {boolean}
         */
        public destroyRes(name: string, force: boolean = true): boolean {
            var group = this.resConfig.getGroup(name);

            let remove = (r: ResourceInfo) => {

                host.unload(r);
                host.remove(r)
            }

            if (group && group.length > 0) {
                var index: number = this.loadedGroups.indexOf(name);
                if (index != -1) {
                    this.loadedGroups.splice(index, 1);
                }
                for (let item of group) {
                    if (!force && this.isResInLoadedGroup(item)) {

                    }
                    else {
                        (item as ResourceItem).loaded = false;
                        remove(item);
                        this.removeLoadedGroupsByItemName(item.url);
                    }
                }
                return true;
            }
            else {
                let item = this.resConfig.getResource(name);
                if (item) {
                    (item as ResourceItem).loaded = false;
                    remove(item);
                    this.removeLoadedGroupsByItemName(item.url);
                    return true;
                }
                else {
                    console.warn(`无法删除指定组:${name}`);
                    return false;
                }



            }
        }
        private removeLoadedGroupsByItemName(name: string): void {
            var loadedGroups: Array<string> = this.loadedGroups;
            var loadedGroupLength: number = loadedGroups.length;
            for (var i: number = 0; i < loadedGroupLength; i++) {
                var group: Array<any> = this.resConfig.getGroupByName(loadedGroups[i], true);
                var length: number = group.length;
                for (var j: number = 0; j < length; j++) {
                    var item: any = group[j];
                    if (item.name == name) {
                        loadedGroups.splice(i, 1);
                        i--;
                        loadedGroupLength = loadedGroups.length;
                        break;
                    }
                }
            }
        }
        private isResInLoadedGroup(r: ResourceInfo): boolean {
            var loadedGroups: Array<string> = this.loadedGroups;
            var loadedGroupLength: number = loadedGroups.length;
            for (var i: number = 0; i < loadedGroupLength; i++) {
                var group: Array<any> = this.resConfig.getGroupByName(loadedGroups[i], true);
                var length: number = group.length;
                for (var j: number = 0; j < length; j++) {
                    var item: any = group[j];
                    if (item.url == r.url) {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * 设置最大并发加载线程数量，默认值是2.
         * @method RES.setMaxLoadingThread
         * @param thread {number} 要设置的并发加载数。
         */
        public setMaxLoadingThread(thread: number): void {
            if (thread < 1) {
                thread = 1;
            }
            this.resLoader.thread = thread;
        }

        /**
         * 设置资源加载失败时的重试次数。
         * @param retry 要设置的重试次数。
         */
        public setMaxRetryTimes(retry: number): void {
            retry = Math.max(retry, 0);
            this.resLoader.maxRetryTimes = retry;
        }

        public addResourceData(data: { name: string, type: string, url: string }): void {
            this.resConfig.addResourceData(data);
        }
    }
    /**
     * Resource单例
     */
    var instance: Resource = new Resource();

    //todo
    // 类型不应该是 any
    // 为了 decorator 引入了一个 export，但是应该是没必要的
    export var configItem: any;

    /**
     * @language en_US
     * Definition profile.
     * @param url Configuration file path (path resource.json).
     * @param resourceRoot Resource path. All URL in the configuration is the relative value of the path. The ultimate URL is the value of the sum of the URL of the string and the resource in the configuration.
     * @param type Configuration file format. Determine what parser to parse the configuration file. Default "json".
     * @version Egret 3.1.5
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 定义配置文件。
     * @param url 配置文件路径(resource.json的路径)。
     * @param resourceRoot 资源根路径。配置中的所有url都是这个路径的相对值。最终url是这个字符串与配置里资源项的url相加的值。
     * @param type 配置文件的格式。确定要用什么解析器来解析配置文件。默认"json"
     * @version Egret 3.1.5
     * @platform Web,Native
     */
    export function mapConfig<T>(url: string, selector: ResourceRootSelector<T>) {
        return function (target) {
            let resourceRoot: string;
            let type: string = "json";
            if (typeof selector == "string") {
                resourceRoot = selector as any as string;
            }
            else {
                resourceRoot = (selector as any as Function)();
            }
            if (resourceRoot.lastIndexOf("/") != 0) {
                resourceRoot = resourceRoot + "/";
            }
            configItem = { url, resourceRoot, type, name: url };
        }
    };
}

type ResourceRootSelector<T> = T | (() => T)


