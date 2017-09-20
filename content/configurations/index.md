---
title: 配置文件规范文档
---

## 为什么要统计配置文件

配置文件是组件或模块、插件装配到核心（Notadd）的载体，规范统一的数据结构，为架构统一，代码风格统一，做了很好的铺垫。

## 支持的配置信息和功能注入类型

配置文件包含了模块的基本信息，以及能实现功能的注入。示例文件参考：[Administration 模块的配置文件](https://github.com/notadd/administration/blob/master/configuration.yaml)。

具体列表如下：

[name](#name)
[identification](#identification)
[author](#author)
[version](#version)
[csrf](#csrf)
[dashboards](#dashboards)
[menus](#menus)
[pages](#pages)
[publishes](#publishes)

### name

**描述：** 名称

**格式：** 字符串

**可用于：**

    - 模块
    - 插件

### identification

**描述：** 标识

**格式：** 字符串

**可用于：**

    - 模块
    - 插件

### author

**描述：** 作者

**格式：** 无键值数值

**可用于：**

    - 模块
    - 插件

### version

**描述：** 版本

**格式：** 字符串

**可用于：**

    - 模块
    - 插件

### csrf

**描述：** CSRF

**格式：** 无键值数值，参考[CSRF 例外](CSRF)

**可用于：**

    - 模块
    - 插件

### dashboards

**描述：** 后台首页仪表盘模块

**格式：** 无键值数值，参考[后台首页仪表盘模块](#后台首页仪表盘模块)

**可用于：**

    - 模块
    - 插件

### menus

**描述：** 后台菜单

**格式：** 无键值数值，参考[后台菜单](#后台菜单)

**可用于：**

    - 模块
    - 插件

### pages

**描述：** 后台自定义页面

**格式：** 无键值数值，参考[后台自定义页面](#后台自定义页面)

**可用于：**

    - 模块
    - 插件

### publishes

**描述：** 资源发布

**格式：** 带键值数值，参考[资源发布](#资源发布)

**可用于：**

    - 模块
    - 插件
