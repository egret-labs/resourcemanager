# 白鹭资源管理框架

## 概述

从白鹭引擎1.0版本开始，引擎便内置了一个资源管理框架 RES。
经过两年多的时间，我们收集了大量开发者的反馈，并于 2017年初的白鹭引擎4.0版本中对其进行了一次全面的升级。

新版本资源管理框架的全部代码均为重新编写，并实现了绝大部分的旧版 API，所以开发者可以将旧版资源管理框架无缝的切换为新版本。

新的资源管理框架致力于解决旧版的以下痼疾：
* 需要繁琐的去配置 default.res.json 这个过程，虽然 Egret Wing 和 ResDepot 可以一定程度上简化这一点
* 基于全局事件的设计，开发者经常需要自己去封装一层去实现针对特定资源组的回调函数
* 事件与回调函数混杂，并且容易嵌入回调函数的嵌套调用中
* 需要开发者重新实现一套热更新机制，无法充分利用和扩展现有的资源管理框架
* RES.Analyzer 的扩展编写非常繁琐
* 资源组这个概念在真正大型项目中，更多的采用动态方式，而非在配置文件中进行配置


为了解决上述问题，新版本资源管理框架按照以下思路进行设计
* 基于 Promise 的异步机制，统一回调函数与全局事件
* 自动化生成资源配置文件（类比原来的 default.res.json），降低开发者对资源维护的复杂性
* 无需开发者在资源配置文件中配置资源组
* 内置热更新机制
* 重新设计更容易扩展的 API，废弃 RES.Analyzer 
* 除了 RES.Analyzer 之外，尽可能保证向下兼容

在解决上述问题的同时，新的资源管理框架还具备以下新特性：
* 在 Promise 机制的基础上，引入 async / await 语法，大幅提升异步处理的开发效率
* 允许开发者针对不同平台发布不同的资源，大幅降低特定平台的资源尺寸


## 配置

```typescript
@RES.mapConfig("config.json", () => "resource", path => {
    var ext = path.substr(path.lastIndexOf(".") + 1);
    var typeMap = {
        "jpg": "image",
        "png": "image",
        "json": "json",
        "fnt": "font",
        "mp3": "sound"
    }
    return typeMap[ext];
})
```
白鹭资源管理框架采用 ES2015 的装饰器语法进行配置。


<a name="upgrade-decorator">
> 如果开发者从老项目迁移到新版资源管理框架，
当没有配置 RES.mapConfig 注解时，
会强制添加名为 "config.json" 的配置，
并忽略 RES.loadConfig() 中的参数

<a name="processor">
## 资源生命周期

任意一个资源的生命周期都遵循以下机制：

加载 -> 处理 -> 持有 -> 销毁实例 -> 销毁缓存

处理器（ Processor ）参与整个生命周期过程，并提供必要的函数供开发者进行扩展


## 自定义处理器

开发者如想自定义处理器，首先需要遵循以下接口

```typescript
var customProcessor:RES.processor.Processor = {

    async onLoadStart(host,resource) {
        let text = host.load(resource,RES.processor.TextProcessor);
        let data = my_parser.parse(text);
        return text;
    },

    async onRemoveStart(host,resource) {
        let data = host.get(resource);
        data.dispose();
    },

    getData(host, resource, key, subkey) => { //可选函数

    }

}
```

编写完自定义处理器后，需要针对类型进行映射

```typescript
RES.processor.map("customType",customProcessor);
```
并在 ```RES.mapConfig```的第三个参数中，将特定文件的类型设置为 ```customType```



## 不兼容的变化

* RES.Analyzer 相关 API 已被废弃，开发者应使用 RES.processor.Processor API 进行替换
* 开发者请务必确认 ```RES.mapConfig```函数的第三个参数，针对文件类型的判断符合您的游戏要求，特别是json等同一文件扩展名，却可能有多种类型的情况。


