# 升级指导

## 从 ResourceManager 4.0 升级


### 装饰器语法被废弃

ResourceManager 5.0 放弃了 4.0 中的装饰器语法（即 @RES.mapConfig ） 这个机制，而是采用了在 resource 文件夹中添加一个 config.ts 文件的机制，具体请参见[这篇文档](README.md#config)

### 需要手动设置 config.res.js 路径

开发者需要在 RES 启动前，添加以下代码：
```typescript
RES.setConfigURL("resource/config.res.js")
```

注意，上面这行代码必须加在 RES 的最前，包括 ```RES.loadConfig``` 、```RES.addEventListener```等任何 API 之前