# Egret 资源管理框架


## 核心功能

* 友好的资源加载 API
* 版本控制支持
* 针对不同平台发布不同的资源
* 更容易开发者进行扩展的结构
* 80% 兼容旧版 API 

## 当前状态 - Public Beta 1

资源管理模块目前作为白鹭引擎的全新特性，本次开放发布希望获得开发者的广泛反馈意见，目前暂时不建议开发者用于正式项目中。具体时间表如下：

* 10月17日 Public Beta 1 ，第一次公开发布，收集开发者反馈
* 10月24日 Public Beta 2 ，完善功能，修复开发者反馈的 BUG，开发者可以将此版本用于两个月内会发布的商业项目中
* 10月31日 Public Beta 3 ，完善功能，与白鹭引擎的工具链完成集成
* 11月14日 Release Candidate , 候选发布版，这个版本全部功能已稳定，开发者可以将此版本用于一个月内会发布的商业项目中
* 11月下旬 Final ，正式版本，开发者可以将其使用于新产品或者线上已有产品（大型重度产品有可能需要白鹭引擎团队的配合技术支持）


## 运行测试项目

执行 ```egret run test/es6-api``` 或者 ``` egret run test/classic-api ``` 

## 如何使用

* 在命令行中执行 ``` npm install egret-cli -g ``` 安装命令行工具

> ```egret-cli```是白鹭引擎测试性的命令行工具，在未来版本中，```egret-cli```会被集成进 ```egret```命令行中，无需重复下载安装
* 在 egret 项目文件夹中执行 ```egret-cli resource upgrade```，升级老项目的资源配置文件( default.res.json )
* 在 ```egretProperties.json``` 中，删除 ```module/res``` 字段，添加 ```module/resourcemanager```字段，并将 bin/resourcemanager 文件夹拷贝至项目中
* 当游戏资源发生变化后，执行```egret-cli resource build```，更新资源配置

> 在即将到来的下个版本，这一步会自动执行
