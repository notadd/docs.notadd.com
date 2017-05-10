# 编译安装流程

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

将域名绑定到 `notadd/public` 目录，并访问该域名进行安装。

访问后台入口 `http://yourdomain/admin`。

