# 插件安装

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
