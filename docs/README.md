# 白鹭资源管理框架


## 配置

```
@RES.mapConfig("config.resjs", () => "resource")
class Main extends egret.DisplayObjectContainer {

    constructor(){
        super();
        RES.loadConfig();
    }
}
```
白鹭资源管理框架采用 ES2015 的装饰器语法进行配置。


<a name="upgrade-decorator">
> 如果开发者从老项目迁移到新版资源管理框架，
当没有配置 RES.mapConfig 注解时，
会强制添加名为 "config.resjs" 的配置，
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

    onLoadStart(host,resource){
        return new Promise(( reslove ,reject ) => {

        })
    },

    onRemoveStart(host,resource){
        return new Promise(( reslove ,reject ) => {

        })
    },

    getData(host, resource, key, subkey) => { //可选函数

    }

}
```

编写完自定义处理器后，需要针对类型进行映射

```
RES.processor.map("customType",customProcessor);
```
并在 ```config.resjs```中将特定文件的类型设置为 ```customType```




