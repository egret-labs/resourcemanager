declare var __promise__line: string;
interface PromiseTaskReporter {
    onProgress?: (current: number, total: number) => void;
    onCancel?: () => void;
}
declare class Promise<T> implements PromiseLike<T> {
    /**
     * When the `resolve` function is called in the body of the `executor` function passed to the constructor,
     * the Promise is fulfilled with result object passed to `resolve`.
     *
     * When the `reject` function is called, the promise is rejected with the `error` passed to `reject`.
     * For consistency and debugging (eg stack traces), `error` should be an instanceof `Error`.
     *
     * Any errors thrown in the constructor callback will be implicitly passed to `reject`.
     */
    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (error?: any) => void) => void);
    /**
     * `onFulfilled` is called when/if Promise resolves.
     * `onRejected` is called when/if Promise rejects.
     *
     * Both are optional, if either/both are omitted the next onFulfilled/onRejected in the chain is called.
     * Both callbacks have a single parameter, the fulfillment value or rejection reason.
     *
     * `then` returns a new Promise equivalent to the value you return from onFulfilled/onRejected after being passed through Promise.resolve.
     * If an error is thrown in the callback, the returned Promise rejects with that error.
     *
     * @param [onFulfilled]     called when/if Promise resolves
     * @param [onRejected]      called when/if Promise rejects
     */
    then<U>(onFulfilled?: (value: T) => U | PromiseLike<U>, onRejected?: (error: any) => U | PromiseLike<U>): Promise<U>;
    then<U>(onFulfilled?: (value: T) => U | PromiseLike<U>, onRejected?: (error: any) => void): Promise<U>;
    /**
     * Sugar for promise.then(undefined, onRejected)
     *
     * @param [onRejected]      called when/if Promise rejects
     */
    catch<U>(onRejected?: (error: any) => U | PromiseLike<U>): Promise<U>;
    /** Makes a new empty Promise. */
    static resolve(): Promise<any>;
    /**
     * Make a new promise from the Thenable.
     * A Thenable is Promise-like in as far as it has a `then` method.
     */
    static resolve<T>(value?: T | PromiseLike<T>): Promise<T>;
    /** Make a Promise that rejects to `err`. For consistency and debugging (eg stack traces), `err` should be an instanceof Error. */
    static reject(error: any): Promise<any>;
    /** Make a Promise that rejects to `err`. For consistency and debugging (eg stack traces), `err` should be an instanceof Error. */
    static reject<T>(error: T): Promise<T>;
    /**
     * Make a Promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * The array passed to all can be a mixture of Promise-like objects and other objects.
     *
     * The fulfillment value is an array (in order) of fulfillment values.
     * The rejection value is the first rejection value.
     */
    static all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>, T9 | PromiseLike<T9>, T10 | PromiseLike<T10>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
    /**
     * Make a Promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * The array passed to all can be a mixture of Promise-like objects and other objects.
     *
     * The fulfillment value is an array (in order) of fulfillment values.
     * The rejection value is the first rejection value.
     */
    static all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>, T9 | PromiseLike<T9>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
    /**
     * Make a Promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * The array passed to all can be a mixture of Promise-like objects and other objects.
     *
     * The fulfillment value is an array (in order) of fulfillment values.
     * The rejection value is the first rejection value.
     */
    static all<T1, T2, T3, T4, T5, T6, T7, T8>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>, T8 | PromiseLike<T8>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8]>;
    /**
     * Make a Promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * The array passed to all can be a mixture of Promise-like objects and other objects.
     *
     * The fulfillment value is an array (in order) of fulfillment values.
     * The rejection value is the first rejection value.
     */
    static all<T1, T2, T3, T4, T5, T6, T7>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>, T7 | PromiseLike<T7>]): Promise<[T1, T2, T3, T4, T5, T6, T7]>;
    /**
     * Make a Promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * The array passed to all can be a mixture of Promise-like objects and other objects.
     *
     * The fulfillment value is an array (in order) of fulfillment values.
     * The rejection value is the first rejection value.
     */
    static all<T1, T2, T3, T4, T5, T6>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>, T6 | PromiseLike<T6>]): Promise<[T1, T2, T3, T4, T5, T6]>;
    /**
     * Make a Promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * The array passed to all can be a mixture of Promise-like objects and other objects.
     *
     * The fulfillment value is an array (in order) of fulfillment values.
     * The rejection value is the first rejection value.
     */
    static all<T1, T2, T3, T4, T5>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>, T5 | PromiseLike<T5>]): Promise<[T1, T2, T3, T4, T5]>;
    /**
     * Make a Promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * The array passed to all can be a mixture of Promise-like objects and other objects.
     *
     * The fulfillment value is an array (in order) of fulfillment values.
     * The rejection value is the first rejection value.
     */
    static all<T1, T2, T3, T4>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>, T4 | PromiseLike<T4>]): Promise<[T1, T2, T3, T4]>;
    /**
     * Make a Promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * The array passed to all can be a mixture of Promise-like objects and other objects.
     *
     * The fulfillment value is an array (in order) of fulfillment values.
     * The rejection value is the first rejection value.
     */
    static all<T1, T2, T3>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>, T3 | PromiseLike<T3>]): Promise<[T1, T2, T3]>;
    /**
     * Make a Promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * The array passed to all can be a mixture of Promise-like objects and other objects.
     *
     * The fulfillment value is an array (in order) of fulfillment values.
     * The rejection value is the first rejection value.
     */
    static all<T1, T2>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>]): Promise<[T1, T2]>;
    /**
     * Make a Promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * The array passed to all can be a mixture of Promise-like objects and other objects.
     *
     * The fulfillment value is an array (in order) of fulfillment values.
     * The rejection value is the first rejection value.
     */
    static all<T>(values: (T | PromiseLike<T>)[]): Promise<T[]>;
    /**
     * Make a Promise that fulfills when any item fulfills, and rejects if any item rejects.
     */
    static race<T>(promises: (T | PromiseLike<T>)[]): Promise<T>;
}
declare module RES {
    interface File {
        url: string;
        type: string;
        crc32?: string;
        size?: number;
        name: string;
        soundType?: string;
    }
    interface Dictionary {
        [file: string]: File | Dictionary;
    }
    function getResourceInfo(url: string): File;
    namespace FileSystem {
        var data: Dictionary;
        function addFile(filename: string, type?: string): void;
        function getFile(filename: string): File;
        function mkdir(dirpath: string): void;
        function exists(dirpath: string): boolean;
    }
}
declare type ResourceRootSelector<T> = T | (() => T);
declare module RES {
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
    function mapConfig<T>(url: string, selector: ResourceRootSelector<T>): (target: any) => void;
    var resourceRoot: string;
    interface ResourceInfo {
        url: string;
        type: string;
        crc32?: string;
        size?: number;
        name: string;
        soundType?: string;
        /**
         * 是否被资源管理器进行管理，默认值为 false
         */
        extra?: boolean;
    }
    interface Data {
        resources: Dictionary;
        groups: {
            [groupName: string]: string[];
        };
        alias: {
            [aliasName: string]: string;
        };
    }
    /**
     * @class RES.ResourceConfig
     * @classdesc
     * @private
     */
    class ResourceConfig {
        config: Data;
        resourceRoot: string;
        constructor();
        __temp__get__type__via__url(url_or_alias: string): string;
        parseResKey(key: string): {
            key: string;
            subkey: string;
        };
        getKeyByAlias(aliasName: string): string;
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        createGroup(name: string, keys: Array<string>, override?: boolean): boolean;
        /**
         * 解析一个配置文件
         * @method RES.ResourceConfig#parseConfig
         * @param data {any} 配置文件数据
         * @param folder {string} 加载项的路径前缀。
         */
        parseConfig(data: Data, resourceRoot: string): void;
        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        addSubkey(subkey: string, name: string): void;
        addAlias(alias: any, key: any): void;
        /**
         * 获取加载项类型。
         * @method RES.ResourceConfig#getType
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
         * @returns {string}
         */
        getType(key: string): string;
        addResourceData(data: {
            name: string;
            type?: string;
            url: string;
        }): void;
    }
}
declare module RES {
}
declare module RES {
    function profile(): void;
    var host: ProcessHost;
    namespace manager {
        var config: ResourceConfig;
        function init(): Promise<void>;
        function load(resources: ResourceInfo[] | ResourceInfo, reporter?: PromiseTaskReporter): Promise<ResourceInfo[] | ResourceInfo>;
        function destory(): void;
    }
    interface ProcessHost {
        resourceConfig: ResourceConfig;
        load: (resource: ResourceInfo, processor?: Processor) => Promise<any>;
        unload: (resource: ResourceInfo) => Promise<any>;
        save: (rexource: ResourceInfo, data: any) => void;
        get: (resource: ResourceInfo) => any;
        remove: (resource: ResourceInfo) => void;
    }
    interface Processor {
        onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;
        onRemoveStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;
        getSubResource?(host: ProcessHost, resource: ResourceInfo, data: any, subkey: string): any;
    }
    class ResourceManagerError extends Error {
        static errorMessage: {
            2001: string;
        };
        constructor(code: number, replacer?: string);
    }
}
declare module RES.processor {
    function isSupport(resource: ResourceInfo): any;
    function map(type: string, processor: Processor): void;
    function getRelativePath(url: string, file: string): string;
    var ImageProcessor: Processor;
    var BinaryProcessor: Processor;
    var TextProcessor: Processor;
    var JsonProcessor: Processor;
    var XMLProcessor: Processor;
    var CommonJSProcessor: Processor;
    var SheetProcessor: Processor;
    var FontProcessor: Processor;
    var SoundProcessor: Processor;
}
declare module RES {
    /**
     * @language en_US
     * The events of resource loading.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 资源加载事件。
     * @version Egret 2.4
     * @platform Web,Native
     */
    class ResourceEvent extends egret.Event {
        /**
         * @language en_US
         * Failure event for a load item.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个加载项加载失败事件。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ITEM_LOAD_ERROR: string;
        /**
         * @language en_US
         * Configure file to load and parse the completion event. Note: if a configuration file is loaded, it will not be thrown out, and if you want to handle the configuration loading failure, monitor the CONFIG_LOAD_ERROR event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 配置文件加载并解析完成事件。注意：若有配置文件加载失败，将不会抛出此事件，若要处理配置加载失败，请同时监听 CONFIG_LOAD_ERROR 事件。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static CONFIG_COMPLETE: string;
        /**
         * @language en_US
         * Configuration file failed to load.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 配置文件加载失败事件。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static CONFIG_LOAD_ERROR: string;
        /**
         * @language en_US
         * Delay load group resource loading progress event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 延迟加载组资源加载进度事件。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static GROUP_PROGRESS: string;
        /**
         * @language en_US
         * Delay load group resource to complete event. Note: if you have a resource item loading failure, the event will not be thrown, if you want to handle the group load failure, please listen to the GROUP_LOAD_ERROR event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 延迟加载组资源加载完成事件。注意：若组内有资源项加载失败，将不会抛出此事件，若要处理组加载失败，请同时监听 GROUP_LOAD_ERROR 事件。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static GROUP_COMPLETE: string;
        /**
         * @language en_US
         * Delayed load group resource failed event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 延迟加载组资源加载失败事件。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static GROUP_LOAD_ERROR: string;
        /**
         * @language en_US
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        /**
         * @language zh_CN
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * @language en_US
         * File number that has been loaded.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 已经加载的文件数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        itemsLoaded: number;
        /**
         * @language en_US
         * Total file number to load.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要加载的总文件数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        itemsTotal: number;
        /**
         * @language en_US
         * Resource group name.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 资源组名。
         * @version Egret 2.4
         * @platform Web,Native
         */
        groupName: string;
        /**
         * @language en_US
         * An item of information that is finished by the end of a load.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一次加载项加载结束的项信息对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        resItem: ResourceItem;
    }
}
declare module RES {
    /**
     * @language en_US
     * Resource term. One of the resources arrays in resource.json.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 资源项。对应 resource.json 中 resources 数组中的一项。
     * @version Egret 2.4
     * @platform Web,Native
     */
    namespace ResourceItem {
        const TYPE_IMAGE: string;
        const TYPE_TEXT: string;
        function convertToResItem(r: ResourceInfo): ResourceItem;
    }
    interface ResourceItem extends ResourceInfo {
        /**
         * @language en_US
         * Name of resource term.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 加载项名称。
         * @version Egret 2.4
         * @platform Web,Native
         */
        name: string;
        /**
         * @language en_US
         * URL of resource term.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要加载的文件地址。
         * @version Egret 2.4
         * @platform Web,Native
         */
        url: string;
        /**
         * @language en_US
         * Type of resource term.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 加载项文件类型。
         * @version Egret 2.4
         * @platform Web,Native
         */
        type: string;
        /**
         * @language en_US
         * The raw data object to be referenced.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 被引用的原始数据对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        data: ResourceInfo;
    }
}
declare module RES {
    let checkNull: MethodDecorator;
    namespace upgrade {
        function setUpgradeGuideLevel(level: "warning" | "silent"): void;
        let checkDecorator: MethodDecorator;
    }
}
declare module RES {
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
    function registerAnalyzer(type: string, analyzerClass: any): void;
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
    function loadConfig(url?: string, resourceRoot?: string): Promise<void>;
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
    function loadGroup(name: string, priority?: number, reporter?: PromiseTaskReporter): Promise<void>;
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
    function isGroupLoaded(name: string): boolean;
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
    function getGroupByName(name: string): Array<ResourceItem>;
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
    function createGroup(name: string, keys: Array<string>, override?: boolean): boolean;
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
    function hasRes(key: string): boolean;
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
    function getRes(key: string): any;
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
    function getResAsync(key: string): Promise<any>;
    function getResAsync(key: string, compFunc: Function, thisObject: any): void;
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
    function getResByUrl(url: string, compFunc: Function, thisObject: any, type?: string): void;
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
    function destroyRes(name: string, force?: boolean): boolean;
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
    function setMaxLoadingThread(thread: number): void;
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
    function setMaxRetryTimes(retry: number): void;
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
    function addEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture?: boolean, priority?: number): void;
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
    function removeEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture?: boolean): void;
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
    function $addResourceData(data: {
        name: string;
        type: string;
        url: string;
    }): void;
    /**
     * @private
     */
    class Resource extends egret.EventDispatcher {
        private loadedGroups;
        /**
         * 构造函数
         * @method RES.constructor
         * @private
         */
        constructor();
        /**
         * 开始加载配置
         * @method RES.loadConfig
         * @param url {string}
         * @param resourceRoot {string}
         * @param type {string}
         */
        loadConfig(): Promise<void>;
        /**
         * 检查某个资源组是否已经加载完成
         * @method RES.isGroupLoaded
         * @param name {string}
         * @returns {boolean}
         */
        isGroupLoaded(name: string): boolean;
        /**
         * 根据组名获取组加载项列表
         * @method RES.getGroupByName
         * @param name {string}
         * @returns {Array<egret.ResourceItem>}
         */
        getGroupByName(name: string): Array<ResourceInfo>;
        /**
         * 根据组名加载一组资源
         * @method RES.loadGroup
         * @param name {string}
         * @param priority {number}
         */
        loadGroup(name: string, priority?: number, reporter?: PromiseTaskReporter): Promise<any>;
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        createGroup(name: string, keys: Array<string>, override?: boolean): boolean;
        /**
         * 检查配置文件里是否含有指定的资源
         * @method RES.hasRes
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
         * @returns {boolean}
         */
        hasRes(key: string): boolean;
        /**
         * 通过key同步获取资源
         * @method RES.getRes
         * @param key {string}
         * @returns {any}
         */
        getRes(resKey: string): any;
        /**
         * 通过key异步获取资源
         * @method RES.getResAsync
         * @param key {string}
         * @param compFunc {Function} 回调函数。示例：compFunc(data,url):void。
         * @param thisObject {any}
         */
        getResAsync(key: string): Promise<any>;
        getResAsync(key: string, compFunc: Function, thisObject: any): void;
        /**
         * 通过url获取资源
         * @method RES.getResByUrl
         * @param url {string}
         * @param compFunc {Function}
         * @param thisObject {any}
         * @param type {string}
         */
        getResByUrl(url: string, compFunc: Function, thisObject: any, type?: string): Promise<any> | void;
        /**
         * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
         * @method RES.destroyRes
         * @param name {string} 配置文件中加载项的name属性或资源组名
         * @param force {boolean} 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值true
         * @returns {boolean}
         */
        destroyRes(name: string, force?: boolean): boolean;
        /**
         * 设置最大并发加载线程数量，默认值是2.
         * @method RES.setMaxLoadingThread
         * @param thread {number} 要设置的并发加载数。
         */
        setMaxLoadingThread(thread: number): void;
        /**
         * 设置资源加载失败时的重试次数。
         * @param retry 要设置的重试次数。
         */
        setMaxRetryTimes(retry: number): void;
        addResourceData(data: {
            name: string;
            type: string;
            url: string;
        }): void;
    }
    var configItem: any;
}
