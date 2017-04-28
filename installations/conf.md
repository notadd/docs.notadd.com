## Nginx 配置

```
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

## Apache 配置

Apache 下一般public（服务器）/根目录（虚拟主机） 下都有附带的 `.htaccess` 文件，
如果在你的Apache环境中不起作用，请尝试下面这个版本：

```
Options +FollowSymLinks
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
```
## caddy 配置

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
