# Composer

通过对 Composer 的自定义，可以实现 Notadd 风格的目录结构。

## Type

配置 type 属性为 notadd-module，会告诉 Composer Installer 将该 Package 安装到目录 modules 下，而非默认目录 vendor 下。

## Require

添加 notadd/installers 的 Package，才能调整 Composer 对该类型 Package 的默认处理逻辑，实现重定向安装目录的特性。

介于，模块的安装方式有两种，一种方式是：将 Composer Package 写入程序根目录的 composer.json 文件，另一种方法是，单独初始化模块 Package，并以文件夹的形式放到 modules 目录，因此，包 notadd/installers 应放置在 require-dev 中。 

## 完整示例

```json
{
    "name": "notadd/content",
    "description": "Notadd's Content Module.",
    "keywords": [
        "notadd",
        "cms",
        "framework",
        "content"
    ],
    "homepage": "https://notadd.com",
    "license": "Apache-2.0",
    "type": "notadd-module",
    "authors": [
        {
            "name": "twilroad",
            "email": "269044570@qq.com"
        }
    ],
    "require": {
        "php": ">=7.0"
    },
    "require-dev": {
        "notadd/installers": "0.5.*"
    },
    "autoload": {
        "psr-4": {
            "Notadd\\Content\\": "src/"
        }
    }
}
```
