---
title: 开始使用
---

## 环境要求


### 需要的扩展

* PHP 必须大于 7.0.0
* 必须安装 PHP 扩展 dom
* 必须安装 PHP 扩展 fileinfo
* 必须安装 PHP 扩展 gd
* 必须安装 PHP 扩展 json
* 必须安装 PHP 扩展 mbstring
* 必须安装 PHP 扩展 openssl
* 使用 Mysql 数据库引擎则必须安装PHP扩展 pdo_mysql
* 使用 Pgsql 数据库引擎则必须安装PHP扩展 pdo_pgsql
* 使用 Sqlite 数据库引擎则必须安装PHP扩展 pdo_sqlite

### 需要的函数

`exec`,`system`,`scandir`,`shell_exec`,`proc_open`,`proc_get_status`


## 安装说明

### 系统环境

操作系统： Linux（推荐）/Mac OS/ Windows 2008+

PHP版本 ： 7.0+

数据库： PostgreSQL（推荐）/MariaDB/MySQL/SQLite3


### [系统需要安装的拓展](/#/v1.0/zh-CN/installations/first)

### [独立服务器及VPS安装](/#/v1.0/zh-CN/installations/vps)

### [虚拟主机安装(暂未提供)](/#/v1.0/zh-CN/installations/vhost)

### [Apache、Nginx、Caddy 伪静态/路由配置](/#/v1.0/zh-CN/installations/conf)

### [编译安装](/#/v1.0/zh-CN/installations/compile)

### [模块安装](/#/v1.0/zh-CN/installations/module)

### [插件安装](/#/v1.0/zh-CN/installations/extension)

## Nginx/Apache/Caddy

### Nginx 配置

```
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

### Apache 配置

Apache 下一般public（服务器）/根目录（虚拟主机） 下都有附带的 `.htaccess` 文件，
如果在你的Apache环境中不起作用，请尝试下面这个版本：

```
Options +FollowSymLinks
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
```
### caddy 配置

```
    fastcgi / localhost:9000 php {
        index index.php
    }

    # To handle .html extensions with laravel change ext to
    # ext / .html

    rewrite {
        r .*
        ext /
        to /index.php?{query}
    }
 ```
## 编译安装流程

{{< note title="安装前注意" >}}
安装前请确保已经安装git、php及composer，否则无法执行安装。
{{< /note >}}


### 1. 下载源代码

```bash
$ git clone https://github.com/notadd/notadd.git
```

### 2. 修改 public、storage 目录权限

设置为 php-fpm 的用户及用户组(部分一键安装包为 `www:www` )，Windows 请跳过此步

```bash
$ chown -R www-data:www-data notadd
```

或

```bash
$ chmod 755 notadd/public notadd/storage
```

### 3. 安装

```bash
$ cd notadd
$ composer install
$ php notadd vendor:publish --force
```
{{< note title="如果composer执行慢或者卡住" >}}
请使用中国镜像 https://pkg.phpcomposer.com/
{{< /note >}}

将域名绑定到 `notadd/public` 目录，并访问该域名进行安装。

访问后台入口 `http://yourdomain/admin`。

{{< warning title="pulic 必须为网站根目录" >}}
否则前端资源将请求不到，出现空白页。
同时，为了网站安全，请务必执行此操作。
{{< /warning >}}

## VPS及独立服务器安装

1. [下载安装包](https://downloads.notadd.com/vps/)

2. 解压文件。 （Linux 下可通过 `tar -Jxvf [文件名]` 解压  ）

3. 将网站根目录指定到public目录即可。


## 模块的安装

以内容管理模块为例。



### GitHub源码安装方式：

1、克隆仓库的develop分支：

```bash
cd notadd/modules
git clone https://github.com/notadd/content.git
```

2、模块初始化：

```bash
cd content
composer install --no-dev
```

3、到 **后台/全局/应用管理/模块配置/本地安装** 进行模块的安装。


### 压缩包文件安装方式：

1、获取文件，从 https://pkg.notadd.com/Atlantia/modules/content/content_0.3.21.tar.xz 下载文件，并解压缩到目录 notadd/modules 。

2、模块初始化：

```bash
cd notadd/modules/content
composer install --no-dev
```

3、到 **后台/全局/应用管理/模块配置/本地安装** 进行模块的安装。


## 插件安装

以百度推送插件为例。

GitHub 源码安装方式：

1、克隆仓库：

```bash
cd notadd/extensions
## 若没有厂商目录，则新建一个，已存在则忽略下面一条命令：
mkdir notadd
git clone https://github.com/notadd/baidu-push.git
```

2、插件初始化：

```bash
cd baidu-push
composer install --no-dev
```

3、到 **后台/全局/应用管理/插件配置/本地安装** 进行模块的安装。

压缩包文件安装方式：

1、获取文件，从 https://pkg.notadd.com/Atlantia/extensions/baidu-push/baidu-push_0.1.3.tar.xz 下载文件，并解压缩到目录 notadd/extensions 。

解压缩文件后，需确保对应插件目录有两层目录，第一层目录为厂商目录，第二层目录为插件目录，例如百度推送的目录层次为： notadd/extensions/notadd/baidu-push 。

2、模块初始化：

```bash
cd notadd/extensions/notadd/baidu-push
composer install --no-dev
```

3、到 **后台/全局/应用管理/插件配置/本地安装** 进行模块的安装。


## 应用商店

**下载带宽由 [美猴云](http://www.meihouyun.com/) 提供**

（Linux 下可通过 `tar -Jxvf [文件名]` 解压xz文件  ）

### 模块

模块安装方式：上传到 modules目录，后台安装 或执行 composer update

**[文章模块](https://pkg.notadd.com/Atlantia/modules/content/content_0.3.21.tar.xz)**  [`Github 地址`](https://github.com/notadd/content)

**用户模块** （暂无下载地址） [`Github地址`](https://github.com/notadd/member)

**商城模块** （暂无下载地址）[`Oschina地址`](https://git.oschina.net/meilande/ecommerce)

**微信模块** （暂无下载地址）[`Github地址`](https://github.com/notadd/wechat)

### 插件

插件安装方式：上传到 extensions， 后台安装 或执行 composer update


### 全局

**导航栏** [`即将发布`](#)
 - 系统导航栏插件
 
**多说插件** [`即将发布`](#)
 - 文章评论系统
 
**网站sitemap插件** [`即将发布`](#)
 - 网站地图
 
**[百度主动推送](https://pkg.notadd.com/Atlantia/extensions/baidu-push/baidu-push_0.1.3.tar.xz)**
 - 推送网站新链接给百度搜索引擎
 
**短信接口**（阿里大于）[`开发中`](https://www.zybuluo.com/zuohuadong/note/696008)
 - 用于发短信验证码、语音验证码
 
**幻灯片** [`开发中`](#)
 - 首页幻灯片
 
**云存储** [`开发中`](#)
 - 不经过服务器的七牛云存储插件
 
**验证码** [`开发中`](https://www.zybuluo.com/zuohuadong/note/638706)
 - 系统全局验证码
 
**极验验证** [`开发中`](#)
 - 第三方验证码系统
 
**邮件插件**（sendcloud/阿里邮件推送） [`开发中`](#)
 - 第三方邮件发送，替代不安全的smtp和sendmail
 
**Markdown 小型编辑器
 - 支持Markdown语法的简单编辑器
 
**支付插件** [`开发中`](#)
 - 支付宝、微信、银联、paypal支付
 
**内置搜索
 - 简单的notadd全文搜索引擎
 
**百度API搜索
 - 基于百度的API搜索引擎
 
**增强搜索
 - 基于 xunsearch 的增强搜索

#### 用户

**单点登录
 - 支持QQ、微信、新浪、百度 账号登录 
 
**推荐好友（分销）
 - 推荐好友，返积分（可结合其他功能实现分销推广）
 
**资料审核
 - 资料认证审核流程
 - 用户复审流程
 
**认证设置
 - 认证用户对应的用户组及时间（自动） 
 - 到达时间后用户复审所在用户组
 
**用户消息通讯
 - 用户聊天
 - 群聊

#### 多用户商城

**秒杀插件
 - 开始时间、结束时间、份数、优惠方式： 定额
 
**优惠券插件
 - 商城优惠券系统
 
**包邮插件
 - 满多少包邮
 
**商品自提点插件
 - 商品自提
 - 依赖于二维码验证插件
 
**二维码验证插件
 - 自提核验，线下核验
 
**For微信插件
 - 允许商城在微信中使用（需要安装微信模块）
 
**渠道上货插件
 - 渠道商上货，商家可快速添加
 
**图片空间
 - 商城图片管理
 
**打印发货单
 - 发货单打印



#### 微信

**投票活动
 - 投票拿奖活动
 
**自动回复
 - 用户关注回复、关键词回复 
 
**微信机器人
 - 根据消息回复用户


### 模板

**Notadd 后台管理模板** [`Github地址`](https://github.com/notadd/administration)
 - 基于iView2 的Notadd管理后台

### 拓展

**PostgreSQL数据库增强拓展**
 - 充分使用PostgreSQL 特性
 
**源码加密增强拓展**
 - 适合加密插件
 
**swoole 增强拓展**
 - swoole的增强拓展 
