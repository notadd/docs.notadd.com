# 如何开发一个 Notadd 扩展

扩展代码结构请参考项目 http://git.oschina.net/notadd/duoshuo

扩展将包含如下几个部分：

* 扩展注入
* 路由注入
* CSRF注入

## 扩展安装

对于 扩展 的安装，仅需将扩展文件按照下面的目录结构，放置到插件根目录 extensions (wwwroot/extensions)下，然后执行命令 composer update 即可。

## 目录结构

目录结构如下：

```
# wwwroot/extensions                              插件根目录
    # vendor                                      厂商目录(目录名称仅为示例，开发时自行修改)
        #  extension                              插件目录(目录名称仅为示例，开发时自行修改)
            # configuations                       可加载配置文件目录
            # resources                           资源目录
                # translations                    翻译文件目录
                # views                           视图目录
            # src                                 源码目录
                # Extension                       扩展服务提供者定义文件
            # composer.json                       Composer 配置文件
```

一个 Notadd 的扩展，是一个符合 composer 规范的包，所以，扩展对第三方代码有依赖时，可以在 composer.json 中的 require 节点中添加第三方的包。

而作为一个符合 Notadd 扩展定义规范的包，composer.json 需拥有如下信息：

* type 必须为 notadd-module
* require 中必须添加包 notadd/installers

代码参考如下(来自扩展根目录下的文件 composer.json, 文件中不应该包含 // 的注释信息，此处仅作为说明)

```json
{
    "name": "notadd/duoshuo",
    "description": "Notadd Extension for Duoshuo.",
    "type": "notadd-extension",                                                      // type 必须设置为 notadd-extension
    "keywords": ["notadd", "duoshuo", "extension"],
    "homepage": "https://notadd.com",
    "license": "Apache-2.0",
    "authors": [
        {
            "name": "Notadd",
            "email": "notadd@ibenchu.com"
        }
    ],
    "autoload": {
        "psr-4": {
            "Notadd\\Duoshuo\\": "src/"
        }
    },
    "require": {
        "php": ">=7.0",
        "notadd/installers": "0.5.*"                                                // 必须依赖包 notadd/installers
    }
}
```

## 扩展注入

所谓 扩展注入 ，是 Notadd 在加载扩展的时候，会检索扩展目录下的类 ModuleServiceProvider，此类必须命名为 ModuleServiceProvider，且需放在源码根目录中，且命名空间必须为 composer.json 的中 autoload 节点定义的符合 psr-4 规范的命名空间，否则 Notadd 将不能正确加载扩展！

类 Extension 的父类必须为 Notadd\Foundation\Extension\Abstracts\Extension ，且必须包含 boot 方法。

类 Extension 的代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2017, notadd.com
 * @datetime 2017-02-21 11:28
 */
namespace Notadd\Duoshuo;

use Notadd\Foundation\Extension\Abstracts\Extension as AbstractExtension;

/**
 * Class Extension.
 */
class Extension extends AbstractExtension
{
    /**
     * Boot provider.
     */
    public function boot()
    {
    }
}
```

## 路由注入

由于 Notadd 的路由注入，需要实现事件 RouteRegister，并在事件监听中添加 路由 。

所以，所谓的路由注入，实际是在类 Extension 实现事件 RouteRegister 的订阅，并在事件订阅类中注册扩展所需要的路由。

类 Extension 的代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2017, notadd.com
 * @datetime 2017-02-21 11:28
 */
namespace Notadd\Duoshuo;

use Illuminate\Events\Dispatcher;
use Notadd\Duoshuo\Listeners\RouteRegister;
use Notadd\Foundation\Extension\Abstracts\Extension as AbstractExtension;

/**
 * Class Extension.
 */
class Extension extends AbstractExtension
{
    /**
     * Boot provider.
     */
    public function boot()
    {
        $this->app->make(Dispatcher::class)->subscribe(RouteRegister::class);
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
 * @copyright (c) 2017, notadd.com
 * @datetime 2017-02-21 11:50
 */
namespace Notadd\Duoshuo\Listeners;

use Notadd\Duoshuo\Controllers\DuoshuoController;
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
        $this->router->group(['middleware' => ['auth:api', 'cross', 'web'], 'prefix' => 'api/duoshuo'], function () {
            $this->router->post('backup', DuoshuoController::class . '@backup');
            $this->router->post('configuration', DuoshuoController::class . '@configuration');
            $this->router->post('number', DuoshuoController::class . '@number');
        });
    }
}
```

## CSRF注入

所谓的CSRF注入，实际是在类 Extension 实现事件 CsrfTokenRegister 的订阅，并在事件订阅类中注册扩展所需要的路由。

类 Extension 的代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2017, notadd.com
 * @datetime 2017-02-21 11:28
 */
namespace Notadd\Duoshuo;

use Illuminate\Events\Dispatcher;
use Notadd\Duoshuo\Listeners\CsrfTokenRegister;
use Notadd\Foundation\Extension\Abstracts\Extension as AbstractExtension;

/**
 * Class Extension.
 */
class Extension extends AbstractExtension
{
    /**
     * Boot provider.
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
 * @copyright (c) 2017, notadd.com
 * @datetime 2017-02-23 19:38
 */
namespace Notadd\Duoshuo\Listeners;

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
        $event->registerExcept('api/duoshuo*');
    }
}
```
