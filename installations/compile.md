# 编译安装流程

* 下载或克隆仓库：https://github.com/notadd/notadd.git；
* 部署代码，修改 public、storage 目录权限；
* 执行 **```composer install```** 安装；
* 浏览器访问所绑定域名进行安装，或命令行执行 **```php notadd install```** 命令进行安装；
* 到目录 **modules/administration/resources/assets** 执行 **```npm install```** 命令；
* 到目录 **modules/administration/resources/assets** 执行 **```npm run build```** 命令；
* 到网站根目录执行命令 **```php notadd vendor:publish --tag=public --force```**；
* 访问后台入口 **http://yourdomain/admin**。