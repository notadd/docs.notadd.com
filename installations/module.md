# 模块的安装

以内容管理模块为例。

已处理化的文件包下载地址： 。

GitHub源码安装方式：

1、克隆仓库的develop分支：

```bash
cd notadd/modules
git clone https://github.com/notadd/content.git --branch=develop
```

2、模块初始化：

```bash
cd content
composer install --no-dev
```

3、到 **后台/全局/应用管理/模块配置/本地安装** 进行模块的安装。

压缩包文件安装方式：

1、获取文件，从 https://pkg.notadd.com/Atlantia/modules/content/content_0.3.21.tar.xz 下载文件，并解压缩到目录 notadd/modules 。

2、模块初始化：

```bash
cd notadd/modules/content
composer install --no-dev
```

3、到 **后台/全局/应用管理/模块配置/本地安装** 进行模块的安装。
