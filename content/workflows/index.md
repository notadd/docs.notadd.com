---
title: 工作流
---

## 后台模块前端开发工作流

Notadd 的后台，是基于 Vue.js 的前端项目，使用了来自 iView 的相关样式组件，但是我们为了实现可插拔机制，同时也为了兼容 Webpack 的现代化打包方式，故实现了基于 Webpack 将模块和插件的相关代码打包成 UMD 规范的 JavaScript 模块。故此，前端开发工作流上，无法使用 develop 模式。

### 从 CMS 模块开始

