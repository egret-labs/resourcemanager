var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RES;
(function (RES) {
    RES.checkNull = function (target, propertyKey, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i - 0] = arguments[_i];
            }
            if (!arg[0]) {
                console.warn("\u65B9\u6CD5" + propertyKey + "\u7684\u53C2\u6570\u4E0D\u80FD\u4E3Anull");
                return null;
            }
            else {
                return method.apply(this, arg);
            }
        };
    };
    RES.checkDecorator = function (target, propertyKey, descriptor) {
        var method = descriptor.value;
        descriptor.value = function (url, resourceRoot) {
            if (resourceRoot) {
                console.warn("已经废弃 resourceRoot"); //todo
            }
            if (url) {
                console.warn("已经废弃 url");
            }
            console.assert(RES.configItem, "需要为文档类添加 RES.mapConfig 注解");
            return method.apply(this);
        };
    };
})(RES || (RES = {}));
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
var RES;
(function (RES) {
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
    var ResourceItem;
    (function (ResourceItem) {
        ResourceItem.TYPE_IMAGE = "image";
        function convertToResItem(r) {
            var name;
            var config = RES["configInstance"];
            if (!config.config) {
                name = r.url;
            }
            else {
                for (var aliasName in config.config.alias) {
                    if (config.config.alias[aliasName] == r.url) {
                        name = aliasName;
                    }
                }
            }
            var result = {
                name: name,
                url: r.url,
                type: r.type,
                data: r,
                groupName: "",
                loaded: true
            };
            return result;
        }
        ResourceItem.convertToResItem = convertToResItem;
    })(ResourceItem = RES.ResourceItem || (RES.ResourceItem = {}));
})(RES || (RES = {}));
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
var RES;
(function (RES) {
    /**
     * @class RES.ResourceConfig
     * @classdesc
     * @private
     */
    var ResourceConfig = (function () {
        function ResourceConfig() {
            RES["configInstance"] = this;
        }
        /**
         * @internal
         */
        ResourceConfig.prototype.getGroupByName = function (name, shouldNotBeNull) {
            var group = this.config.groups[name];
            var result = [];
            if (!group) {
                if (shouldNotBeNull) {
                    throw "none group " + name;
                }
                return null;
            }
            for (var _i = 0, group_1 = group; _i < group_1.length; _i++) {
                var key = group_1[_i];
                var r = this.getResource(key, true);
                result.push(r);
            }
            return result;
        };
        ResourceConfig.prototype.__temp__get__type__via__url = function (url_or_alias) {
            var url = this.config.alias[url_or_alias];
            if (!url) {
                url = url_or_alias;
            }
            var suffix = url.substr(url.lastIndexOf(".") + 1);
            if (suffix) {
                suffix = suffix.toLowerCase();
            }
            var type;
            switch (suffix) {
                case "xml":
                case "json":
                case "sheet":
                    type = suffix;
                    break;
                case "png":
                case "jpg":
                case "gif":
                case "jpeg":
                case "bmp":
                    type = "image";
                    break;
                case "fnt":
                    type = "font";
                    break;
                case "txt":
                    type = "text";
                    break;
                case "mp3":
                case "ogg":
                case "mpeg":
                case "wav":
                case "m4a":
                case "mp4":
                case "aiff":
                case "wma":
                case "mid":
                    type = "sound";
                    break;
                case "jmc":
                    type = "json";
                    break;
                default:
                    type = "bin";
                    break;
            }
            return type;
        };
        ResourceConfig.prototype.getKeyByAlias = function (aliasName) {
            if (this.config.alias[aliasName]) {
                return this.config.alias[aliasName];
            }
            else {
                return aliasName;
            }
        };
        ResourceConfig.prototype.getResource = function (url_or_alias, shouldNotBeNull) {
            var url = this.config.alias[url_or_alias];
            if (!url) {
                url = url_or_alias;
            }
            var r = this.config.resources[url];
            if (!r) {
                if (shouldNotBeNull) {
                    throw "none resource url or alias : " + url_or_alias;
                }
                return null;
            }
            return r;
        };
        /**
         * 根据组名获取原始的组加载项列表
         * @method RES.ResourceConfig#getRawGroupByName
         * @param name {string} 组名
         * @returns {Array<any>}
         * @internal
         */
        ResourceConfig.prototype.getGroup = function (name) {
            return this.getGroupByName(name);
        };
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        ResourceConfig.prototype.createGroup = function (name, keys, override) {
            if (override === void 0) { override = false; }
            if ((!override && this.config.groups[name]) || !keys || keys.length == 0) {
                return false;
            }
            var group = [];
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (this.config.groups[key]) {
                    var groupInfo = this.config.groups[key];
                    group = group.concat(groupInfo);
                }
                else if (this.config.alias[key] || this.config.resources[key]) {
                    group = group.concat(key);
                }
                else {
                    group = group.concat(key);
                    console.warn("resource not exist : " + key);
                }
            }
            this.config.groups[name] = group;
            return true;
            // var groupDic: any = this.groupDic;
            // var group: Array<any> = [];
            // var length: number = keys.length;
            // for (var i: number = 0; i < length; i++) {
            //     var key: string = keys[i];
            //     var g: Array<any> = groupDic[key];
            //     if (g) {
            //         var len: number = g.length;
            //         for (var j: number = 0; j < len; j++) {
            //             var item: any = g[j];
            //             if (group.indexOf(item) == -1)
            //                 group.push(item);
            //         }
            //     }
            //     else {
            //         item = this.keyMap[key];
            //         if (item) {
            //             if (group.indexOf(item) == -1)
            //                 group.push(item);
            //         }
            //         else {
            //             egret.$warn(3200, key);
            //         }
            //     }
            // }
            // if (group.length == 0)
            //     return false;
            // this.groupDic[name] = group;
            // return true;
        };
        /**
         * 解析一个配置文件
         * @method RES.ResourceConfig#parseConfig
         * @param data {any} 配置文件数据
         * @param folder {string} 加载项的路径前缀。
         */
        ResourceConfig.prototype.parseConfig = function (data, resourceRoot) {
            var resources = data.resources;
            for (var resourceKey in resources) {
                var r = resources[resourceKey];
                r.url = resourceRoot + "/" + r.url;
                r.name = resourceKey;
            }
            this.config = data;
            // if (!data)
            //     return;
            // var resources: Array<any> = data["resources"];
            // if (resources) {
            //     var length: number = resources.length;
            //     for (var i: number = 0; i < length; i++) {
            //         var item: any = resources[i];
            //         var url: string = item.url;
            //         if (url && url.indexOf("://") == -1)
            //             item.url = folder + url;
            //         this.addItemToKeyMap(item);
            //     }
            // }
            // var groups: Array<any> = data["groups"];
            // if (groups) {
            //     length = groups.length;
            //     for (i = 0; i < length; i++) {
            //         var group: any = groups[i];
            //         var list: Array<any> = [];
            //         var keys: Array<string> = (<string>group.keys).split(",");
            //         var l: number = keys.length;
            //         for (var j: number = 0; j < l; j++) {
            //             var name: string = keys[j].trim();
            //             item = this.keyMap[name];
            //             if (item && list.indexOf(item) == -1) {
            //                 list.push(item);
            //             }
            //         }
            //         this.groupDic[group.name] = list;
            //     }
            // }
        };
        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        ResourceConfig.prototype.addSubkey = function (subkey, name) {
            this.addAlias(subkey, name);
        };
        ResourceConfig.prototype.addAlias = function (alias, key) {
            if (this.config.alias[key]) {
                key = this.config.alias[key];
            }
            this.config.alias[alias] = key + "#" + alias;
        };
        /**
         * 获取加载项类型。
         * @method RES.ResourceConfig#getType
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
         * @returns {string}
         */
        ResourceConfig.prototype.getType = function (key) {
            return this.getResource(key, true).type;
        };
        ResourceConfig.prototype.addResourceData = function (data) {
            if (!data.type) {
                data.type = this.__temp__get__type__via__url(data.url);
            }
            this.config.resources[data.url] = data;
            if (data.name) {
                this.config.alias[data.name] = data.url;
            }
        };
        return ResourceConfig;
    }());
    RES.ResourceConfig = ResourceConfig;
})(RES || (RES = {}));
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
var RES;
(function (RES) {
    /**
     * @class RES.ResourceLoader
     * @classdesc
     * @extends egret.EventDispatcher
     * @private
     */
    var ResourceLoader = (function (_super) {
        __extends(ResourceLoader, _super);
        /**
         * 构造函数
         * @method RES.ResourceLoader#constructor
         */
        function ResourceLoader() {
            _super.call(this);
            /**
             * 最大并发加载数
             */
            this.thread = 2;
            /**
             * 正在加载的线程计数
             */
            this.loadingCount = 0;
            /**
             * 当前组加载的项总个数,key为groupName
             */
            this.groupTotalDic = {};
            /**
             * 已经加载的项个数,key为groupName
             */
            this.numLoadedDic = {};
            /**
             * 正在加载的组列表,key为groupName
             */
            this.itemListDic = {};
            /**
             * 加载失败的组,key为groupName
             */
            this.groupErrorDic = {};
            this.retryTimesDic = {};
            this.maxRetryTimes = 3;
            this.failedList = new Array();
            /**
             * 优先级队列,key为priority，value为groupName列表
             */
            this.priorityQueue = {};
            /**
             * 当前应该加载同优先级队列的第几列
             */
            this.queueIndex = 0;
        }
        ;
        /**
         * 检查指定的组是否正在加载中
         * @method RES.ResourceLoader#isGroupInLoading
         * @param groupName {string}
         * @returns {boolean}
         */
        ResourceLoader.prototype.isGroupInLoading = function (groupName) {
            return this.itemListDic[groupName] !== undefined;
        };
        /**
         * 开始加载一组文件
         * @method RES.ResourceLoader#loadGroup
         * @param list {egret.Array<ResourceItem>} 加载项列表
         * @param groupName {string} 组名
         * @param priority {number} 加载优先级
         */
        ResourceLoader.prototype.loadGroup = function (list, groupName, priority) {
            if (priority === void 0) { priority = 0; }
            if (this.itemListDic[groupName] || !groupName)
                return;
            if (!list || list.length == 0) {
                egret.$warn(3201, groupName);
                var event = new RES.ResourceEvent(RES.ResourceEvent.GROUP_LOAD_ERROR);
                event.groupName = groupName;
                this.dispatchEvent(event);
                return;
            }
            if (this.priorityQueue[priority])
                this.priorityQueue[priority].push(groupName);
            else
                this.priorityQueue[priority] = [groupName];
            this.itemListDic[groupName] = list;
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var resItem = list[i];
                resItem.groupName = groupName;
            }
            this.groupTotalDic[groupName] = list.length;
            this.numLoadedDic[groupName] = 0;
            this.next();
        };
        /**
         * 加载下一项
         */
        ResourceLoader.prototype.next = function () {
            var _this = this;
            var load = function (r) {
                RES.host.load(r)
                    .then(function (response) {
                    RES.host.save(r, response);
                    r.loaded = true;
                    _this.onItemComplete(r);
                });
            };
            var processor;
            while (this.loadingCount < this.thread) {
                var resItem = this.getOneResourceItem();
                if (!resItem)
                    break;
                this.loadingCount++;
                if (resItem.loaded) {
                    this.onItemComplete(resItem);
                }
                else if (load(resItem)) {
                    ;
                }
            }
        };
        /**
         * 获取下一个待加载项
         */
        ResourceLoader.prototype.getOneResourceItem = function () {
            if (this.failedList.length > 0)
                return this.failedList.shift();
            var maxPriority = Number.NEGATIVE_INFINITY;
            for (var p in this.priorityQueue) {
                maxPriority = Math.max(maxPriority, p);
            }
            var queue = this.priorityQueue[maxPriority];
            var length = queue.length;
            var list = [];
            for (var i = 0; i < length; i++) {
                if (this.queueIndex >= length)
                    this.queueIndex = 0;
                list = this.itemListDic[queue[this.queueIndex]];
                if (list.length > 0)
                    break;
                this.queueIndex++;
            }
            if (list.length == 0)
                return undefined;
            return list.shift();
        };
        /**
         * 加载结束
         */
        ResourceLoader.prototype.onItemComplete = function (resItem) {
            this.loadingCount--;
            var groupName = resItem.groupName;
            if (!resItem.loaded) {
                var times = this.retryTimesDic[resItem.name] || 1;
                if (times > this.maxRetryTimes) {
                    delete this.retryTimesDic[resItem.name];
                    RES.ResourceEvent.dispatchResourceEvent(this.resInstance, RES.ResourceEvent.ITEM_LOAD_ERROR, groupName, resItem);
                }
                else {
                    this.retryTimesDic[resItem.name] = times + 1;
                    this.failedList.push(resItem);
                    this.next();
                    return;
                }
            }
            if (groupName) {
                this.numLoadedDic[groupName]++;
                var itemsLoaded = this.numLoadedDic[groupName];
                var itemsTotal = this.groupTotalDic[groupName];
                if (!resItem.loaded) {
                    this.groupErrorDic[groupName] = true;
                }
                RES.ResourceEvent.dispatchResourceEvent(this.resInstance, RES.ResourceEvent.GROUP_PROGRESS, groupName, resItem, itemsLoaded, itemsTotal);
                if (itemsLoaded == itemsTotal) {
                    var groupError = this.groupErrorDic[groupName];
                    this.removeGroupName(groupName);
                    delete this.groupTotalDic[groupName];
                    delete this.numLoadedDic[groupName];
                    delete this.itemListDic[groupName];
                    delete this.groupErrorDic[groupName];
                    if (groupError) {
                        RES.ResourceEvent.dispatchResourceEvent(this, RES.ResourceEvent.GROUP_LOAD_ERROR, groupName);
                    }
                    else {
                        RES.ResourceEvent.dispatchResourceEvent(this, RES.ResourceEvent.GROUP_COMPLETE, groupName);
                    }
                }
            }
            else {
                this.callBack.call(this.resInstance, resItem);
            }
            this.next();
        };
        /**
         * 从优先级队列中移除指定的组名
         */
        ResourceLoader.prototype.removeGroupName = function (groupName) {
            for (var p in this.priorityQueue) {
                var queue = this.priorityQueue[p];
                var length = queue.length;
                var index = 0;
                var found = false;
                var length = queue.length;
                for (var i = 0; i < length; i++) {
                    var name = queue[i];
                    if (name == groupName) {
                        queue.splice(index, 1);
                        found = true;
                        break;
                    }
                    index++;
                }
                if (found) {
                    if (queue.length == 0) {
                        delete this.priorityQueue[p];
                    }
                    break;
                }
            }
        };
        return ResourceLoader;
    }(egret.EventDispatcher));
    RES.ResourceLoader = ResourceLoader;
})(RES || (RES = {}));
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
var RES;
(function (RES) {
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
    var ResourceEvent = (function (_super) {
        __extends(ResourceEvent, _super);
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
        function ResourceEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            _super.call(this, type, bubbles, cancelable);
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
            this.itemsLoaded = 0;
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
            this.itemsTotal = 0;
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
            this.groupName = "";
        }
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method RES.ResourceEvent.dispatchResourceEvent
         * @param target {egret.IEventDispatcher}
         * @param type {string}
         * @param groupName {string}
         * @param resItem {egret.ResourceItem}
         * @param itemsLoaded {number}
         * @param itemsTotal {number}
         * @internal
         * @private
         */
        ResourceEvent.dispatchResourceEvent = function (target, type, groupName, resItem, itemsLoaded, itemsTotal) {
            if (groupName === void 0) { groupName = ""; }
            if (resItem === void 0) { resItem = undefined; }
            if (itemsLoaded === void 0) { itemsLoaded = 0; }
            if (itemsTotal === void 0) { itemsTotal = 0; }
            var event = egret.Event.create(ResourceEvent, type);
            event.groupName = groupName;
            if (resItem) {
                event.resItem = RES.ResourceItem.convertToResItem(resItem);
            }
            event.itemsLoaded = itemsLoaded;
            event.itemsTotal = itemsTotal;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        return ResourceEvent;
    }(egret.Event));
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
    ResourceEvent.ITEM_LOAD_ERROR = "itemLoadError";
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
    ResourceEvent.CONFIG_COMPLETE = "configComplete";
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
    ResourceEvent.CONFIG_LOAD_ERROR = "configLoadError";
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
    ResourceEvent.GROUP_PROGRESS = "groupProgress";
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
    ResourceEvent.GROUP_COMPLETE = "groupComplete";
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
    ResourceEvent.GROUP_LOAD_ERROR = "groupLoadError";
    RES.ResourceEvent = ResourceEvent;
})(RES || (RES = {}));
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
var RES;
(function (RES) {
    /**
     * @classic
     * @private
     */
    var AnalyzerBase = (function (_super) {
        __extends(AnalyzerBase, _super);
        function AnalyzerBase() {
            _super.call(this);
            this.resourceConfig = (RES["configInstance"]);
        }
        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        AnalyzerBase.prototype.addSubkey = function (subkey, name) {
            this.resourceConfig.addSubkey(subkey, name);
        };
        /**
         * 加载一个资源文件
         * @param resItem 加载项信息
         * @param compFunc 加载完成回调函数,示例:compFunc(resItem:ResourceItem):void;
         * @param thisObject 加载完成回调函数的this引用
         */
        AnalyzerBase.prototype.loadFile = function (resItem, compFunc, thisObject) {
        };
        /**
         * 同步方式获取解析完成的数据
         * @param name 对应配置文件里的name属性。
         */
        AnalyzerBase.prototype.getRes = function (name, subkey) {
        };
        /**
         * 销毁某个资源文件的二进制数据,返回是否删除成功。
         * @param name 配置文件中加载项的name属性
         */
        AnalyzerBase.prototype.destroyRes = function (name) {
            return false;
        };
        /**
         * 读取一个字符串里第一个点之前的内容。
         * @param name {string} 要读取的字符串
         */
        AnalyzerBase.getStringPrefix = function (name) {
            if (!name) {
                return "";
            }
            var index = name.indexOf(".");
            if (index != -1) {
                return name.substring(0, index);
            }
            return "";
        };
        return AnalyzerBase;
    }(egret.HashObject));
    RES.AnalyzerBase = AnalyzerBase;
})(RES || (RES = {}));
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (sent[0] === 1) throw sent[1]; return sent[1]; }, trys: [], stack: [] }, sent, f;
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (1) {
            if (_.done) switch (op[0]) {
                case 0: return { value: void 0, done: true };
                case 1: case 6: throw op[1];
                case 2: return { value: op[1], done: true };
            }
            try {
                switch (f = 1, op[0]) {
                    case 0: case 1: sent = op; break;
                    case 4: return _.label++, { value: op[1], done: false };
                    case 7: op = _.stack.pop(), _.trys.pop(); continue;
                    default:
                        var r = _.trys.length > 0 && _.trys[_.trys.length - 1];
                        if (!r && (op[0] === 6 || op[0] === 2)) { _.done = 1; continue; }
                        if (op[0] === 3 && (!r || (op[1] > r[0] && op[1] < r[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < r[1]) { _.label = r[1], sent = op; break; }
                        if (r && _.label < r[2]) { _.label = r[2], _.stack.push(op); break; }
                        if (r[2]) { _.stack.pop(); }
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            }
            catch (e) { op = [6, e]; }
            finally { f = 0, sent = void 0; }
        }
    }
    return {
        next: function (v) { return step([0, v]); },
        "throw": function (v) { return step([1, v]); },
        "return": function (v) { return step([2, v]); }
    };
};
var RES;
(function (RES) {
    function promisify(loader) {
        return __awaiter(this, void 0, void 0, function () {
            _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (reslove, reject) {
                        var onSuccess = function () {
                            var texture = loader['data'] ? loader['data'] : loader['response'];
                            reslove(texture);
                        };
                        var onError = function () {
                            reject();
                        };
                        loader.addEventListener(egret.Event.COMPLETE, onSuccess, _this);
                        loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, _this);
                    })];
            });
        });
        var _this;
    }
    function getRelativePath(url, file) {
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
    RES.getRelativePath = getRelativePath;
    RES.ImageProcessor = {
        onLoadStart: function (host, resource) {
            return __awaiter(this, void 0, void 0, function () {
                var loader, bitmapData, texture;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            loader = new egret.ImageLoader();
                            loader.load(resource.url);
                            return [4 /*yield*/, promisify(loader)];
                        case 1:
                            bitmapData = _a.sent();
                            texture = new egret.Texture();
                            texture._setBitmapData(bitmapData);
                            // var config: any = resItem.data;
                            // if (config && config["scale9grid"]) {
                            //     var str: string = config["scale9grid"];
                            //     var list: Array<string> = str.split(",");
                            //     texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                            // }
                            return [2 /*return*/, texture];
                    }
                });
            });
        },
        onRemoveStart: function (host, resource) {
            var texture = host.get(resource);
            texture.dispose();
            return Promise.resolve();
        }
    };
    RES.TextProcessor = {
        onLoadStart: function (host, resource) {
            return __awaiter(this, void 0, void 0, function () {
                var request, text;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            request = new egret.HttpRequest();
                            request.responseType = egret.HttpResponseType.TEXT;
                            request.open(resource.url, "get");
                            request.send();
                            return [4 /*yield*/, promisify(request)];
                        case 1:
                            text = _a.sent();
                            return [2 /*return*/, text];
                    }
                });
            });
        },
        onRemoveStart: function (host, resource) {
            return Promise.resolve();
        }
    };
    RES.JsonProcessor = {
        onLoadStart: function (host, resource) {
            return __awaiter(this, void 0, void 0, function () {
                var text, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, host.load(resource, RES.TextProcessor)];
                        case 1:
                            text = _a.sent();
                            data = JSON.parse(text);
                            return [2 /*return*/, data];
                    }
                });
            });
        },
        onRemoveStart: function (host, request) {
            return Promise.resolve();
        }
    };
    RES.XMLProcessor = {
        onLoadStart: function (host, resource) {
            return __awaiter(this, void 0, void 0, function () {
                var text, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, host.load(resource, RES.TextProcessor)];
                        case 1:
                            text = _a.sent();
                            data = egret.XML.parse(text);
                            return [2 /*return*/, data];
                    }
                });
            });
        },
        onRemoveStart: function (host, resource) {
            return Promise.resolve();
        }
    };
    RES.SheetProcessor = {
        onLoadStart: function (host, resource) {
            return __awaiter(this, void 0, void 0, function () {
                var data, imageUrl, r, texture, frames, spriteSheet, subkey, config, texture;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, host.load(resource, RES.JsonProcessor)];
                        case 1:
                            data = _a.sent();
                            console.log(11);
                            console.log(data);
                            imageUrl = getRelativePath(resource.url, data.file);
                            host.resourceConfig.addResourceData({ name: imageUrl, type: "image", url: imageUrl });
                            r = host.resourceConfig.getResource(imageUrl);
                            if (!r) {
                                throw 'error';
                            }
                            return [4 /*yield*/, host.load(r)];
                        case 2:
                            texture = _a.sent();
                            frames = data.frames;
                            if (!frames) {
                                throw 'error';
                            }
                            spriteSheet = new egret.SpriteSheet(texture);
                            for (subkey in frames) {
                                config = frames[subkey];
                                texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                            }
                            console.log(spriteSheet);
                            return [2 /*return*/, spriteSheet];
                    }
                });
            });
        },
        onRemoveStart: function (host, resource) {
            return Promise.resolve();
        }
    };
})(RES || (RES = {}));
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RES;
(function (RES) {
    var __tempCache = {};
    RES.host = {
        get resourceConfig() {
            return RES['configInstance'];
        },
        load: function (resourceInfo, processor) {
            if (!processor) {
                processor = RES.host.isSupport(resourceInfo);
            }
            if (!processor) {
                throw 'error';
            }
            return processor.onLoadStart(RES.host, resourceInfo);
        },
        unload: function (resource) {
            var processor = RES.host.isSupport(resource);
            if (processor) {
                return processor.onRemoveStart(RES.host, resource);
            }
            else {
                return Promise.resolve();
            }
        },
        save: function (resource, data) {
            __tempCache[resource.url] = data;
        },
        get: function (resource) {
            return __tempCache[resource.url];
        },
        remove: function (resource) {
            delete __tempCache[resource.url];
        },
        isSupport: function (resource) {
            var type = resource.type;
            var map = {
                "image": RES.ImageProcessor,
                "json": RES.JsonProcessor,
                "text": RES.TextProcessor,
                "xml": RES.XMLProcessor,
                "sheet": RES.SheetProcessor
            };
            return map[type];
        }
    };
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
    function registerAnalyzer(type, analyzerClass) {
        instance.registerAnalyzer(type, analyzerClass);
    }
    RES.registerAnalyzer = registerAnalyzer;
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
    function loadConfig(url, resourceRoot) {
        instance.loadConfig();
    }
    RES.loadConfig = loadConfig;
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
    function loadGroup(name, priority) {
        if (priority === void 0) { priority = 0; }
        instance.loadGroup(name, priority);
    }
    RES.loadGroup = loadGroup;
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
    function isGroupLoaded(name) {
        return instance.isGroupLoaded(name);
    }
    RES.isGroupLoaded = isGroupLoaded;
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
    function getGroupByName(name) {
        return instance.getGroupByName(name).map(function (r) { return RES.ResourceItem.convertToResItem(r); });
    }
    RES.getGroupByName = getGroupByName;
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
    function createGroup(name, keys, override) {
        if (override === void 0) { override = false; }
        return instance.createGroup(name, keys, override);
    }
    RES.createGroup = createGroup;
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
    function hasRes(key) {
        return instance.hasRes(key);
    }
    RES.hasRes = hasRes;
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
    function getRes(key) {
        return instance.getRes(key);
    }
    RES.getRes = getRes;
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
    function getResAsync(key, compFunc, thisObject) {
        instance.getResAsync(key, compFunc, thisObject);
    }
    RES.getResAsync = getResAsync;
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
    function getResByUrl(url, compFunc, thisObject, type) {
        if (type === void 0) { type = ""; }
        instance.getResByUrl(url, compFunc, thisObject, type);
    }
    RES.getResByUrl = getResByUrl;
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
    function destroyRes(name, force) {
        return instance.destroyRes(name, force);
    }
    RES.destroyRes = destroyRes;
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
    function setMaxLoadingThread(thread) {
        instance.setMaxLoadingThread(thread);
    }
    RES.setMaxLoadingThread = setMaxLoadingThread;
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
    function setMaxRetryTimes(retry) {
        instance.setMaxRetryTimes(retry);
    }
    RES.setMaxRetryTimes = setMaxRetryTimes;
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
    function addEventListener(type, listener, thisObject, useCapture, priority) {
        if (useCapture === void 0) { useCapture = false; }
        if (priority === void 0) { priority = 0; }
        instance.addEventListener(type, listener, thisObject, useCapture, priority);
    }
    RES.addEventListener = addEventListener;
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
    function removeEventListener(type, listener, thisObject, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        instance.removeEventListener(type, listener, thisObject, useCapture);
    }
    RES.removeEventListener = removeEventListener;
    /**
     * @language en_US
     * Get the actual URL of the resource file.<br/>
     * Because this method needs to be called to control the actual version of the URL have the original resource files were changed, so would like to get the specified resource file the actual URL.<br/>
     * In the development and debugging phase, this method will directly return value passed.
     * @param url Url used in the game
     * @returns Actual loaded url
     * @version Egret 2.4
     * @platform Web,Native
     */
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
    function $addResourceData(data) {
        //这里可能需要其他配置
        instance.addResourceData(data);
    }
    RES.$addResourceData = $addResourceData;
    /**
     * @private
     */
    var Resource = (function (_super) {
        __extends(Resource, _super);
        /**
         * 构造函数
         * @method RES.constructor
         * @private
         */
        function Resource() {
            _super.call(this);
            /**
             * 已经加载过组名列表
             */
            this.loadedGroups = [];
            this.groupNameList = [];
            this.init();
        }
        Resource.prototype.parseResKey = function (key) {
            key = this.resConfig.getKeyByAlias(key);
            var index = key.indexOf("#");
            if (index >= 0) {
                return {
                    key: key.substr(0, index),
                    subkey: key.substr(index + 1)
                };
            }
            else {
                return {
                    key: key,
                    subkey: ""
                };
            }
        };
        /**
         * 注册一个自定义文件类型解析器
         * @param type 文件类型字符串，例如：bin,text,image,json等。
         * @param analyzerClass 自定义解析器的类定义
         */
        Resource.prototype.registerAnalyzer = function (type, analyzerClass) {
            throw 'unimplement';
        };
        /**
         * 初始化
         */
        Resource.prototype.init = function () {
            this.resConfig = new RES.ResourceConfig();
            this.resLoader = new RES.ResourceLoader();
            this.resLoader.resInstance = this;
            this.resLoader.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComp, this);
            this.resLoader.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupError, this);
        };
        /**
         * 开始加载配置
         * @method RES.loadConfig
         * @param url {string}
         * @param resourceRoot {string}
         * @param type {string}
         */
        Resource.prototype.loadConfig = function () {
            var _this = this;
            RES.host.load(RES.configItem).then(function (data) {
                _this.resConfig.parseConfig(data, "resource"); //todo
                RES.ResourceEvent.dispatchResourceEvent(_this, RES.ResourceEvent.CONFIG_COMPLETE);
                _this.loadDelayGroups();
            });
        };
        /**
         * 检查某个资源组是否已经加载完成
         * @method RES.isGroupLoaded
         * @param name {string}
         * @returns {boolean}
         */
        Resource.prototype.isGroupLoaded = function (name) {
            return this.loadedGroups.indexOf(name) != -1;
        };
        /**
         * 根据组名获取组加载项列表
         * @method RES.getGroupByName
         * @param name {string}
         * @returns {Array<egret.ResourceItem>}
         */
        Resource.prototype.getGroupByName = function (name) {
            return this.resConfig.getGroupByName(name);
        };
        /**
         * 根据组名加载一组资源
         * @method RES.loadGroup
         * @param name {string}
         * @param priority {number}
         */
        Resource.prototype.loadGroup = function (name, priority) {
            if (priority === void 0) { priority = 0; }
            if (this.loadedGroups.indexOf(name) != -1) {
                RES.ResourceEvent.dispatchResourceEvent(this, RES.ResourceEvent.GROUP_COMPLETE, name);
                return;
            }
            if (this.resLoader.isGroupInLoading(name))
                return;
            var group = this.resConfig.getGroupByName(name);
            this.resLoader.loadGroup(group, name, priority);
        };
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        Resource.prototype.createGroup = function (name, keys, override) {
            if (override === void 0) { override = false; }
            if (override) {
                var index = this.loadedGroups.indexOf(name);
                if (index != -1) {
                    this.loadedGroups.splice(index, 1);
                }
            }
            return this.resConfig.createGroup(name, keys, override);
        };
        /**
         * 队列加载完成事件
         */
        Resource.prototype.onGroupComp = function (event) {
            this.loadedGroups.push(event.groupName);
            this.dispatchEvent(event);
        };
        /**
         * 启动延迟的组加载
         */
        Resource.prototype.loadDelayGroups = function () {
            var groupNameList = this.groupNameList;
            this.groupNameList = [];
            var length = groupNameList.length;
            for (var i = 0; i < length; i++) {
                var item = groupNameList[i];
                this.loadGroup(item.name, item.priority);
            }
        };
        /**
         * 队列加载失败事件
         */
        Resource.prototype.onGroupError = function (event) {
            if (event.groupName == Resource.GROUP_CONFIG) {
                RES.ResourceEvent.dispatchResourceEvent(this, RES.ResourceEvent.CONFIG_LOAD_ERROR);
            }
            else {
                this.dispatchEvent(event);
            }
        };
        /**
         * 检查配置文件里是否含有指定的资源
         * @method RES.hasRes
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
         * @returns {boolean}
         */
        Resource.prototype.hasRes = function (key) {
            var name = this.parseResKey(key).key;
            return this.resConfig.getResource(name) != null;
        };
        /**
         * 通过key同步获取资源
         * @method RES.getRes
         * @param key {string}
         * @returns {any}
         */
        Resource.prototype.getRes = function (resKey) {
            var _a = this.parseResKey(resKey), key = _a.key, subkey = _a.subkey;
            var r = this.resConfig.getResource(key);
            if (r && RES.host.isSupport(r)) {
                return RES.host.get(r);
            }
        };
        /**
         * 通过key异步获取资源
         * @method RES.getResAsync
         * @param key {string}
         * @param compFunc {Function} 回调函数。示例：compFunc(data,url):void。
         * @param thisObject {any}
         */
        Resource.prototype.getResAsync = function (key, compFunc, thisObject) {
            var _a = this.parseResKey(key), key = _a.key, subkey = _a.subkey;
            var r = this.resConfig.getResource(key, true);
            var url = r.url;
            var res = RES.host.get(r);
            if (res) {
                egret.$callAsync(compFunc, thisObject, res, key);
                return;
            }
            RES.host.load(r).then(function (value) {
                RES.host.save(r, value);
                compFunc.call(thisObject, value, r.url);
            });
        };
        /**
         * 通过url获取资源
         * @method RES.getResByUrl
         * @param url {string}
         * @param compFunc {Function}
         * @param thisObject {any}
         * @param type {string}
         */
        Resource.prototype.getResByUrl = function (url, compFunc, thisObject, type) {
            if (type === void 0) { type = ""; }
            var r = this.resConfig.getResource(url);
            if (!r) {
                this.resConfig.addResourceData({ name: url, url: url });
            }
            this.getResAsync(url, compFunc, thisObject);
        };
        /**
         * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
         * @method RES.destroyRes
         * @param name {string} 配置文件中加载项的name属性或资源组名
         * @param force {boolean} 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值true
         * @returns {boolean}
         */
        Resource.prototype.destroyRes = function (name, force) {
            if (force === void 0) { force = true; }
            var group = this.resConfig.getGroup(name);
            var remove = function (r) {
                RES.host.unload(r);
                RES.host.remove(r);
            };
            if (group && group.length > 0) {
                var index = this.loadedGroups.indexOf(name);
                if (index != -1) {
                    this.loadedGroups.splice(index, 1);
                }
                for (var _i = 0, group_2 = group; _i < group_2.length; _i++) {
                    var item = group_2[_i];
                    if (!force && this.isResInLoadedGroup(item)) {
                    }
                    else {
                        item.loaded = false;
                        remove(item);
                        this.removeLoadedGroupsByItemName(item.url);
                    }
                }
                return true;
            }
            else {
                var item = this.resConfig.getResource(name);
                if (item) {
                    item.loaded = false;
                    remove(item);
                    this.removeLoadedGroupsByItemName(item.url);
                    return true;
                }
                else {
                    console.warn("\u65E0\u6CD5\u5220\u9664\u6307\u5B9A\u7EC4:" + name);
                    return false;
                }
            }
        };
        Resource.prototype.removeLoadedGroupsByItemName = function (name) {
            var loadedGroups = this.loadedGroups;
            var loadedGroupLength = loadedGroups.length;
            for (var i = 0; i < loadedGroupLength; i++) {
                var group = this.resConfig.getGroupByName(loadedGroups[i], true);
                var length = group.length;
                for (var j = 0; j < length; j++) {
                    var item = group[j];
                    if (item.name == name) {
                        loadedGroups.splice(i, 1);
                        i--;
                        loadedGroupLength = loadedGroups.length;
                        break;
                    }
                }
            }
        };
        Resource.prototype.isResInLoadedGroup = function (r) {
            var loadedGroups = this.loadedGroups;
            var loadedGroupLength = loadedGroups.length;
            for (var i = 0; i < loadedGroupLength; i++) {
                var group = this.resConfig.getGroupByName(loadedGroups[i], true);
                var length = group.length;
                for (var j = 0; j < length; j++) {
                    var item = group[j];
                    if (item.url == r.url) {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * 设置最大并发加载线程数量，默认值是2.
         * @method RES.setMaxLoadingThread
         * @param thread {number} 要设置的并发加载数。
         */
        Resource.prototype.setMaxLoadingThread = function (thread) {
            if (thread < 1) {
                thread = 1;
            }
            this.resLoader.thread = thread;
        };
        /**
         * 设置资源加载失败时的重试次数。
         * @param retry 要设置的重试次数。
         */
        Resource.prototype.setMaxRetryTimes = function (retry) {
            retry = Math.max(retry, 0);
            this.resLoader.maxRetryTimes = retry;
        };
        Resource.prototype.addResourceData = function (data) {
            this.resConfig.addResourceData(data);
        };
        return Resource;
    }(egret.EventDispatcher));
    /**
     * 配置文件组组名
     */
    Resource.GROUP_CONFIG = "RES__CONFIG";
    __decorate([
        RES.checkDecorator
    ], Resource.prototype, "loadConfig", null);
    __decorate([
        RES.checkNull
    ], Resource.prototype, "getRes", null);
    RES.Resource = Resource;
    /**
     * Resource单例
     */
    var instance = new Resource();
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
    function mapConfig(url, selector) {
        return function (target) {
            var resourceRoot;
            var type = "json";
            if (typeof selector == "string") {
                resourceRoot = selector;
            }
            else {
                resourceRoot = selector();
            }
            if (resourceRoot.lastIndexOf("/") != 0) {
                resourceRoot = resourceRoot + "/";
            }
            RES.configItem = { url: url, resourceRoot: resourceRoot, type: type, name: url };
        };
    }
    RES.mapConfig = mapConfig;
    ;
})(RES || (RES = {}));
var egret;
(function (egret) {
    egret.$locale_strings = egret.$locale_strings || {};
    egret.$locale_strings["zh_CN"] = egret.$locale_strings["zh_CN"] || {};
    var locale_strings = egret.$locale_strings["zh_CN"];
    //RES 3200-3299
    locale_strings[3200] = "RES.createGroup()传入了配置中不存在的键值: {0}";
    locale_strings[3201] = "RES加载了不存在或空的资源组:\"{0}\"";
    locale_strings[3202] = "请不要使用不同的类型方式来加载同一个素材！";
    locale_strings[3203] = "找不到指定文件类型的解析器:{0}。 请先在项目初始化里注册指定文件类型的解析器，再启动资源加载。";
})(egret || (egret = {}));
