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
白鹭资源管理框架采用 ES7 的装饰器语法进行配置。


<a name="upgrade-decorator">
> 如果开发者从老项目迁移到新版资源管理框架，
当没有配置 RES.mapConfig 注解时，
会强制添加名为 "config.resjs" 的配置，
并忽略 RES.loadConfig() 中的参数
