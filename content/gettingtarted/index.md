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


## 应用商店 Alpha

正在开发中...

[点击查看可用扩展](https://bbs.notadd.com/topic/7/notadd-%E6%A8%A1%E5%9D%97%E6%8F%92%E4%BB%B6%E6%A8%A1%E6%9D%BF%E6%8B%93%E5%B1%95-%E8%BF%9B%E5%BA%A6%E8%A1%A8)


