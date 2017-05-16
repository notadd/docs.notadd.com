---
title: 技术规范
---


## 技术规范

### 支持的PSR规范

* 基于 PSR-4 规范实现 autoload
* 基于 PSR-1 规范的代码风格

## 依赖的 Package

Notadd Framework 基于 Composer 构建，并使用 Composer 组织代码。

## 目录结构说明

### 整站目录说明

```
# wwwroot                            网站根目录
    # extensions                     插件根目录
    # modules                        模块根目录
    # public                         公共目录
        # assets                     静态资源目录
        # uploads                    上传目录
        # favicon.ico                ICON图标文件
        # index.php                  入口文件
    # storage                        缓存目录
    # vendor                         第三方类库目录
```

### 示例插件目录说明

```
# extensions\vendor\brick-carving    BrickCarving插件目录
    # src                            插件源码目录
    # resources                      插件静态资源目录
    # vendor                         第三方类库目录
    # composer.json                  插件Composer文件
```

