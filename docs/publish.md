# 使用 ResourceManager 发布资源


## 执行过程

* 在项目的 ```egretProperties.json``` 中添加```"resources": []```
* 执行 ``` egret publish --version version1 ``` 完成游戏 js 文件编译加密过程
* 执行 ``` res publish . bin-release/web/version1 ``` 完成资源发布和 js 文件发布
* 将游戏资源上传至游戏远程服务器 / CDN 中，不要发布到另一个文件夹，
