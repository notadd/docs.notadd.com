---
title: 工作流
---

## 后台模块前端开发工作流

Notadd 的后台，是基于 Vue.js 的前端项目，使用了来自 iView 的相关样式组件，但是我们为了实现可插拔机制，同时也为了兼容 Webpack 的现代化打包方式，故实现了基于 Webpack 将模块和插件的相关代码打包成 UMD 规范的 JavaScript 模块。故此，前端开发工作流上，无法使用 develop 模式。

### 从模板开始

第一步：克隆项目：https://github.com/notadd/vue-module.git，放置于模块的目录 **resources/mixes/administration** 中。

第二步：填写个性化信息。

有如下几个地方（文件相对于模板根目录）：

* **package.json** 中的 **name**，**version**，**description**，**author** 等属性

* **build/webpack.base.conf.js** 中的 **module.exports.output.library** 的属性

* **config/index.js** 中的 **module.exports.build.assetsSubDirectory** 的属性

* **build/watch.js** 中的变量需与 **config/index.js** 中的 **module.exports.build.assetsSubDirectory** 的属性一致

* 模块配置文件的资源发布路径需与 **config/index.js** 中的 **module.exports.build.assetsSubDirectory** 的属性一致，[参考](https://github.com/notadd/content/blob/master/configuration.yaml)

### 路由注册

前端路由注入的位置在文件 **src/mixes/router.js** 中，参考示例文件：[**CMS 模块的路由注入代码示例文件**](https://github.com/notadd/content/blob/master/resources/mixes/administration/src/mixes/router.js)。

### 页面开发

项目基于 Vue.js，故开发前必须了解 Vue.js 的相关文档，[中文文档传送门](https://cn.vuejs.org/)。

### 页面调试

#### 第一步：模板克隆，并置于对应的目录中，进行前端项目的安装（yarn install 或 npm install）

#### 第二步：使用命令进行编译并监视文件变化，以及自动重新编译（yarn watch 或 npm run watch）

#### 第三步：进行页面开发

#### 第四步：进行后台进行页面功能调试（浏览器访问 http://you-domain.com/admin）
