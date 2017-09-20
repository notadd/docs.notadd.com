---
title: 配置文件规范文档
---

## 为什么要统计配置文件

配置文件是组件或模块、插件装配到核心（Notadd）的载体，规范统一的数据结构，为架构统一，代码风格统一，做了很好的铺垫。

## 支持的配置信息和功能注入类型

配置文件包含了模块的基本信息，以及能实现功能的注入。示例文件参考：[Administration 模块的配置文件](https://github.com/notadd/administration/blob/master/configuration.yaml)。

具体列表如下：

### name

描述：模块或插件的名称

格式：字符串

可用于：

    - 模块
    - 插件

### identification

描述：模块或插件的标识

格式：字符串

可用于：

    - 模块
    - 插件

