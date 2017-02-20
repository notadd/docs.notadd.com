# 编译安装流程

1. 下载或克隆仓库：https://github.com/notadd/notadd.git ；
2. 部署代码，修改 public、storage 目录权限；
3. 执行 `composer install` 安装；
4. 浏览器访问所绑定域名进行安装，或命令行执行 `php notadd install` 命令进行安装；
5. 到目录 `modules/administration/resources/assets` 执行 `npm install` 命令；
6. 到目录 `modules/administration/resources/assets` 执行 `npm run build` 命令；
7. 到网站根目录执行命令 *```php notadd vendor:publish --tag=public --force```；
8. 访问后台入口 http://yourdomain/admin