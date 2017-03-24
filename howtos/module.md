# 如何开发一个 Notadd 模块

模块代码结构请参考项目 https://github.com/notadd/content

模块将包含如下几个部分：

* 模块注入
* 路由注入
* 门面注入
* CSRF注入

## 模块安装

对于模块的安装，目前 Notadd 支持的安装方式，仅为在 根项目 中对 模块 进行依赖。

例如，需要安装模块 notadd/content ,可以修改根项目的文件 composer.json，参考代码如下：

```json
{
    "name": "notadd/notadd",
    "description": "The Notadd Framework.",
    "keywords": [
        "notadd",
        "cms",
        "foundation",
        "framework"
    ],
    "homepage": "https://notadd.com",
    "license": "Apache-2.0",
    "type": "project",
    "authors": [
        {
            "name": "twilroad",
            "email": "269044570@qq.com"
        }
    ],
    "autoload": {
        "classmap": [
            "storage/databases"
        ]
    },
    "require": {
        "php": ">=7.0",
        "notadd/content": "0.1.*",
        "wikimedia/composer-merge-plugin": "dev-master"
    },
    "require-dev": {
        "fzaninotto/faker": "~1.4",
        "mockery/mockery": "0.9.*",
        "phpunit/phpunit": "~5.0",
        "symfony/css-selector": "3.1.*",
        "symfony/dom-crawler": "3.1.*"
    },
    "config": {
        "preferred-install": "dist"
    },
    "scripts": {
        "post-create-project-cmd": [
            "php notadd key:generate"
        ],
        "post-install-cmd": [
            "Notadd\\Foundation\\Composer\\ComposerScripts::postInstall",
            "php notadd optimize"
        ],
        "post-update-cmd": [
            "Notadd\\Foundation\\Composer\\ComposerScripts::postUpdate",
            "php notadd optimize"
        ]
    },
    "extra": {
        "merge-plugin": {
            "include": [
                "extensions/*/*/composer.json"
            ],
            "recurse": true,
            "replace": false,
            "merge-dev": false
        }
    }
}
```

更新文件 composer.json 后，执行 composer update 即可完成对模块的安装。

完整示例代码，请参考项目 https://github.com/notadd/notadd

## 目录结构

目录结构如下：

```
# module                                             模块目录
    # resources                                      资源目录
        # translations                               翻译文件目录
        # views                                      视图目录
    # src                                            源码目录
        # ModuleServiceProvider.php                  模块服务提供者定义文件
    # composer.json                                  Composer 配置文件
```

一个 Notadd 的模块，是一个符合 composer 规范的包，所以，模块对第三方代码有依赖时，可以在 composer.json 中的 require 节点中添加第三方的包。

而作为一个符合 Notadd 模块定义规范的包，composer.json 需拥有如下信息：

* type 必须为 notadd-module
* require 中必须添加包 notadd/installers

代码参考如下(来自扩展根目录下的文件 composer.json, 文件中不应该包含 // 的注释信息，此处仅作为说明)

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
    "type": "notadd-module",                                                          // type 必须设置为 notadd-module
    "authors": [
        {
            "name": "Notadd",
            "email": "notadd@ibenchu.com"
        }
    ],
    "require": {
        "php": ">=7.0",
        "notadd/installers": "0.1.*"                                                  // 必须依赖包 notadd/installers
    },
    "autoload": {
        "psr-4": {
            "Notadd\\Content\\": "src/"
        }
    }
}
```

## 模块注入

所谓 模块注入 ，是 Notadd 在加载模块的时候，会检索模块目录下的类 ModuleServiceProvider，此类必须命名为 ModuleServiceProvider，且需放在源码根目录中，且命名空间必须为 composer.json 的中 autoload 节点定义的符合 psr-4 规范的命名空间，否则 Notadd 将不能正确加载模块！

类 ModuleServiceProvider 的父类必须为 Illuminate\Support\ServiceProvider ，且必须包含 boot 方法。相关服务提供者的概念可以参考 Laravel 文档。

类 ModuleServiceProvider 的代码参考如下：

```php

<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2016, iBenchu.org
 * @datetime 2016-10-08 17:12
 */
namespace Notadd\Content;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\ServiceProvider;
use Notadd\Content\Listeners\RouteRegister;

/**
 * Class Module.
 */
class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Boot service provider.
     */
    public function boot()
    {
        $this->app->make(Dispatcher::class)->subscribe(RouteRegister::class);                // 订阅事件 RouteRegister
    }
}
```

## 路由注入

由于 Notadd 的路由注入，需要实现事件 RouteRegister，并在事件监听中添加 路由 。

所以，所谓的路由注入，实际是在类 ModuleServiceProvider 实现事件 RouteRegister 的订阅，并在事件订阅类中注册模块所需要的路由。

类 ModuleServiceProvider 的代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2016, iBenchu.org
 * @datetime 2016-10-08 17:12
 */
namespace Notadd\Content;

use Illuminate\Support\ServiceProvider;

/**
 * Class Module.
 */
class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Boot service provider.
     */
    public function boot()
    {
    }
}
```

事件订阅类 RouteRegister 的代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2016, iBenchu.org
 * @datetime 2016-10-08 18:30
 */
namespace Notadd\Content\Listeners;

use Notadd\Content\Controllers\Api\Article\ArticleController as ArticleApiController;
use Notadd\Foundation\Routing\Abstracts\RouteRegistrar as AbstractRouteRegistrar;

/**
 * Class RouteRegister.
 */
class RouteRegister extends AbstractRouteRegistrar
{
    /**
     * Handle Route Registrar.
     */
    public function handle()
    {
        $this->router->group(['middleware' => ['cross', 'web']], function () {               // 路由的注册
            $this->router->group(['prefix' => 'api/article'], function () {
                $this->router->post('find', ArticleApiController::class . '@find');
                $this->router->post('fetch', ArticleApiController::class . '@fetch');
            });
        });
    }
}
```

## 门面注入

门面，是 Laravel 的一个功能特色，可以通过门面调用对应 IoC 容器的实例，所以 Notadd 必然会保留这一功能。

所谓的路由注入，实际是在类 ModuleServiceProvider 实现事件 FacadeRegister 的订阅，并在事件订阅类中注册模块所需要的路由。

类 ModuleServiceProvider 的代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2016, iBenchu.org
 * @datetime 2016-10-08 17:12
 */
namespace Notadd\Content;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\ServiceProvider;
use Notadd\Content\Listeners\FacadeRegister;

/**
 * Class Module.
 */
class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Boot service provider.
     */
    public function boot()
    {
        $this->app->make(Dispatcher::class)->subscribe(FacadeRegister::class);
    }
}
```

事件订阅类 FacadeRegister 的代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2017, iBenchu.org
 * @datetime 2017-01-22 12:20
 */
namespace Notadd\Content\Listeners;

use Notadd\Foundation\Event\Abstracts\EventSubscriber;
use Notadd\Foundation\Facades\FacadeRegister as FacadeRegisterEvent;

/**
 * Class FacadeRegister.
 */
class FacadeRegister extends EventSubscriber
{
    /**
     * Name of event.
     *
     * @throws \Exception
     * @return string|object
     */
    protected function getEvent()
    {
        return FacadeRegisterEvent::class;
    }

    /**
     * Event handler.
     *
     * @param $event
     */
    public function handle(FacadeRegisterEvent $event)
    {
        $event->register('Log', 'Illuminate\Support\Facades\Log');
    }
}
```

## CSRF注入

所谓的CSRF注入，实际是在类 ModuleServiceProvider 实现事件 CsrfTokenRegister 的订阅，并在事件订阅类中注册模块所需要的路由。

类 ModuleServiceProvider 的代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2016, iBenchu.org
 * @datetime 2016-10-08 17:12
 */
namespace Notadd\Content;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\ServiceProvider;
use Notadd\Content\Listeners\CsrfTokenRegister;

/**
 * Class Module.
 */
class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Boot service provider.
     */
    public function boot()
    {
        $this->app->make(Dispatcher::class)->subscribe(CsrfTokenRegister::class);
    }
}
```

事件订阅类 CsrfTokenRegister 的代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2017, iBenchu.org
 * @datetime 2017-02-10 11:04
 */
namespace Notadd\Content\Listeners;

use Notadd\Foundation\Event\Abstracts\EventSubscriber;
use Notadd\Foundation\Http\Events\CsrfTokenRegister as CsrfTokenRegisterEvent;

/**
 * Class CsrfTokenRegister.
 */
class CsrfTokenRegister extends EventSubscriber
{
    /**
     * Name of event.
     *
     * @throws \Exception
     * @return string|object
     */
    protected function getEvent()
    {
        return CsrfTokenRegisterEvent::class;
    }

    /**
     * Register excepts.
     *
     * @param $event
     */
    public function handle(CsrfTokenRegisterEvent $event)
    {
        $event->registerExcept('api/article*');
        $event->registerExcept('api/category*');
        $event->registerExcept('api/content*');
        $event->registerExcept('api/page*');
    }
}
```
