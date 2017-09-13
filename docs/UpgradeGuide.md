# 升级指导

## 从 Egret RES 升级

### RES.Analyzer API 被废弃

开发者应该使用 RES.processor 相关 API 代替 RES.Analyzer，具体请参见[这篇文档](README.md#processor)

相比 RES.Analyzer，RES.processor 的API设计更为简洁，更方便开发者进行自由扩展

### default.res.json 配置文件被废弃

新版本通过命令行的方式创建名为 ```config.res.js``` 的文件以代替```default.res.json```，通过这种方式，开发者无需手动维护一个 ```default.res.json``` 文件，只需要指定一些特定的“规则”，即可自动生成配置文件

| |Egret RES|ResourceManager 5.0|
|:--:|:-----------:|:------------:|
|维护方式|配置文件|通过设置规则，自动生成配置文件|
|辅助工具|ResDepot / Wing | 无需其他工具 |
|配置文件体积| 较大 | 较小 |



## 从 ResourceManager 4.0 升级


### 装饰器语法被废弃

ResourceManager 5.0 放弃了 4.0 中的装饰器语法（即 @RES.mapConfig ） 这个机制，而是采用了在 resource 文件夹中添加一个 config.ts 文件的机制，具体请参见[这篇文档](README.md#config)

### 需要手动设置 config.res.js 路径

开发者需要在 RES 启动前，添加以下代码：
```typescript
RES.setConfigURL("resource/config.res.js")
```

注意，上面这行代码必须加在 RES 的最前，包括 ```RES.loadConfig``` 、```RES.addEventListener```等任何 API 之前