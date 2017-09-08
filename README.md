# Egret 资源管理框架


## 核心功能

#### 友好的资源加载 API

* 遵循 ES6 Promise 标准的异步语法
``` javascript
RES.loadConfig().then(()=>{
    RES.getResAsync("assets/bg.jpg");
}).then(()=>{
    RES.getResAsync("assets/icon.jpg");
});
```
* 支持 ES2015 async / await 异步语法 ( 依赖白鹭引擎4.0版本 )
``` javascript
await RES.loadConfig()
await RES.getResAsync("assets/bg.jpg");
await RES.getResAsync("assets/icon.jpg");
```

#### 版本控制支持

集成版本控制功能，无需额外配置即可支持素材热更新。可以帮助您的游戏或应用显著降低运维成本及用户的流量消耗。

#### 自动合并文本文件与纹理集

对于 HTML5 游戏而言，为了降低HTTP请求数量，提升加载效率，开发者经常需要将游戏中的文本文件进行合并压缩，零散图片合并成纹理集，ResourceManager 命令行中内置了这些模块，并在后续版本中允许开发者进行自由扩展



#### 更容易开发者进行扩展的结构 

开发者可以自定义构建与发布环节中使用哪些功能，从而更方便的与现有的工作流进行集成以及定制自身需求。


#### 80% 兼容旧版 API 
除了 ```RES.Analyzer```相关 API 之外其他所有API均可向下兼容，并提供升级脚本帮助您将现有项目升级至新版本资源管理器



## 运行测试项目

执行 ```egret run test/promise-api``` 或者 ``` egret run test/classic-api ``` 

## 如何调试

* 安装 Egret Wing 或者 VSCode ，打开项目根目录
* 在项目根目录下执行 npm install
* 调试项目（F5)，或执行 ``` npm run debug ```

## 如何使用

* 在命令行中执行 ``` npm install egret-resource-manager -g ``` 安装命令行工具

* 执行 ```res upgrade { your-project }``` 将旧版 res 模块升级为新版本，升级过程会完成下述操作
    
    * 将 ```egret-resource-manager``` 中包含的新版本资源管理系统的源代码复制到项目文件夹中
    
    * 将 ```egretProperties.json``` 中的 ```res``` 字段修改为 ```resourcemanager```

* 当游戏资源发生变化后，执行```res build { your_project }```，更新资源配置

## 文档

更多文档参见[这里](docs/)
