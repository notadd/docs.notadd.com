---
title: 拓展技术文档
---

## 什么是拓展

特定环境拓展， 诸如 Swoole 拓展，PostgreSQL 增强拓展。

## 目录结构

```
# extensions/composer                                                          拓展目录
    # src                                                                      源码目录
        # ExtensionServiceProvider.php                                         拓展的服务提供者
        # Installer.php                                                        拓展的安装器
        # Uninstaller.php                                                      拓展的卸载器
    # composer.json                                                            Composer 配置文件
    # readme.md                                                                模块说明文件
```

### 源码目录

**源码目录**包含 PHP 源码。

### Composer 配置文件

**Composer 配置文件** (composer.json) 是符合 [Composer 官方规范](https://getcomposer.org/doc/04-schema.md) 的JSON格式的文档，Composer 相关规范，可以查阅 [Composer 官方文档](https://getcomposer.org)。

#### Type

将 **type** 设置为 **notadd-extension**，可以将当前模块包（Package）安装到 **extensions** 目录下。

#### Require

实现 **type** 的重定向安装目录的特性，必须添加对包（Package）：[notadd/installers](https://packagist.org/packages/notadd/installers)的依赖，建议添加到 **require-dev** 下。

## 初始化

拓展不同于模块或插件，不承载具体的业务逻辑，故此不需要配置文件。

但是却可以实现以下几种功能：

> 添加第三方包(Package)

> 向服务器环境添加系统级功能支持，诸如安装 PHP 扩展，额外的数据库服务，如 PgSQL

无论实现哪种功能，均必须使用使用命令 composer install --no-dev 在拓展目录进行项目初始化。

## 安装器

拓展安装器，包含了向系统添加或判断是否存在特定软件的逻辑代码，如果需要中断安装过程，请抛出异常(Exception)。

## 卸载器

拓展卸载器，包含了从系统中移除或判断是否已经移除了特定软件的逻辑diam，如果需要中断卸载过程，请抛出异常(Exception)。
