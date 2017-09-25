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

### 升级过程

* 执行 ``` npm install egret-resource-manager@nightly -g``` 安装最新版本
* 执行 ``` res upgrade ```，其中会在内部进行如下操作
    * 将最新的 运行时库拷贝到项目的```resourcemanager```文件夹中
    * 修改 ```tsconfig.json```文件中的 ```include```或者```exclude```字段
    * 在 ```resource```文件夹中拷贝一个名为 ```config.ts```和```config.d.ts```的文件
    * 自动执行 ``` egret clean ``` 清理项目
* 在上述操作完毕后，您需要手动修改 Main.ts 文件，包含：
    * 在 ```RES.loadConfig```之前，执行```RES.setConfigURL("resource/config.res.js")```
    * 删除```RES.mapConfig```，并将原来的第三个参数中的函数拷贝到 ```config.ts```中