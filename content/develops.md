---
title: 二次开发
---

# 什么是二次开发

所谓二次开发，即是在 Notadd Framework 的基础上，对 Notadd Framework 的原有结构、原有功能进行调整或增强。

## Notadd Framework 支持进行的二次开发内容。

# Notadd 推荐的扩展方式

Notadd 的基本特性是，模块化，可扩展，可插拔，故此，和 Laravel 的基于 Composer 的可扩展方式是有区别的。

## 传统的 Laravel 的扩展方式

* 独立的 routes.php 实现路由的增加和修改
* 构建一个扩展包，通过服务提供者进行功能扩展和 IOC 容器实例注入
* 基于脚手架的功能扩展方式，如 Auth 的扩展，有对应的命令行生成源码的脚手架

从以上两种方式可以看出，Laravel 具备很强的自扩展能力，但是也存在以下几个弊端：

* 从项目的构建到部署，离不开开发者的参与，普通使用者无法拿到操作方式统一和简洁的开箱即用的源码
* 扩展包仅能实现固定业务底层的逻辑实现，与现有业务逻辑相融合或代码合并时，仍然需要二次编码，甚至不得不修改包的部分实现代码

## Notadd 推荐的扩展方式

为可扩展、可插拔而生的 Notadd，很轻松的就在代码层上解决了以上弊端：

* 完全遵循 Composer 规范，轻松实现对任意第三方 Composer 包的引用
* 开箱即用的可插拔架构，减少开发者的结构构建时间
* 基于 OAuth2 的 API 验证技术，多平台，多方案实现，为 API 的安全保驾护航
* 完整的 RESUTFul API 规范，轻松实现对 API 的构建
* 提供多层次的可扩展架构，拓展(extension)、模块(module)、插件(addon)

### 功能性扩展说明列表

* [Administrator](#administrator) 
* [路由](#路由)
* [拓展](#拓展)  特定环境拓展， 诸如 swoole拓展，PostgreSQL增强拓展
* [模块](#模块)  大功能，诸如商城、文章、微信
* [插件](#插件)  功能增强，诸如 全局短信，全局验证码。

# Administrator

Administrator 作为唯一的网站管理实例，有着控制管理入口、分配管理职责等功能。

Notadd 的实现方式：

## 类 Administration

```php
namespace Notadd\Foundation\Administration;

use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use InvalidArgumentException;
use Notadd\Foundation\Administration\Abstracts\Administrator;

/**
 * Class Administration.
 */
class Administration
{
    /**
     * @var \Notadd\Foundation\Administration\Abstracts\Administrator
     */
    protected $administrator;

    /**
     * @var \Illuminate\Container\Container
     */
    protected $container;

    /**
     * @var \Illuminate\Events\Dispatcher
     */
    protected $events;

    /**
     * Administration constructor.
     *
     * @param \Illuminate\Container\Container $container
     * @param \Illuminate\Events\Dispatcher   $events
     */
    public function __construct(Container $container, Dispatcher $events)
    {
        $this->container = $container;
        $this->events = $events;
    }

    /**
     * Get administrator.
     *
     * @return \Notadd\Foundation\Administration\Abstracts\Administrator
     */
    public function getAdministrator()
    {
        return $this->administrator;
    }

    /**
     * Status of administrator's instance.
     *
     * @return bool
     */
    public function hasAdministrator()
    {
        return is_null($this->administrator) ? false : true;
    }

    /**
     * Set administrator instance.
     *
     * @param \Notadd\Foundation\Administration\Abstracts\Administrator $administrator
     *
     * @throws \InvalidArgumentException
     */
    public function setAdministrator(Administrator $administrator)
    {
        if (is_object($this->administrator)) {
            throw new InvalidArgumentException('Administrator has been Registered!');
        }
        if ($administrator instanceof Administrator) {
            $this->administrator = $administrator;
            $this->administrator->init();
        } else {
            throw new InvalidArgumentException('Administrator must be instanceof ' . Administrator::class . '!');
        }
    }
}
```

## 抽象类 Administrator

```php
namespace Notadd\Foundation\Administration\Abstracts;

use Illuminate\Events\Dispatcher;
use Illuminate\Routing\Router;
use InvalidArgumentException;

/**
 * Class Administrator.
 */
abstract class Administrator
{
    /**
     * @var \Illuminate\Events\Dispatcher
     */
    protected $events;

    /**
     * @var mixed
     */
    protected $handler;

    /**
     * @var string
     */
    protected $path;

    /**
     * @var \Illuminate\Routing\Router
     */
    protected $router;

    /**
     * Administrator constructor.
     *
     * @param \Illuminate\Events\Dispatcher $events
     * @param \Illuminate\Routing\Router    $router
     */
    public function __construct(Dispatcher $events, Router $router)
    {
        $this->events = $events;
        $this->router = $router;
    }

    /**
     * Get administration handler.
     *
     * @return mixed
     */
    public function getHandler()
    {
        return $this->handler;
    }

    /**
     * Administration route path.
     *
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Init administrator.
     *
     * @throws \InvalidArgumentException
     */
    final public function init()
    {
        if (is_null($this->path) || is_null($this->handler)) {
            throw new InvalidArgumentException('Handler or Path must be Setted!');
        }
        $this->router->group(['middleware' => 'web'], function () {
            $this->router->get($this->path, $this->handler);
        });
    }

    /**
     * Register administration handler.
     *
     * @param $handler
     */
    public function registerHandler($handler)
    {
        $this->handler = $handler;
    }

    /**
     * Register administration route path.
     *
     * @param string $path
     */
    public function registerPath($path)
    {
        $this->path = $path;
    }
}
```

## IOC 实例注册方式

```php
namespace Notadd\Administration;

use Illuminate\Support\ServiceProvider;
use Notadd\Administration\Controllers\AdminController;
use Notadd\Foundation\Administration\Administration;

/**
 * Class Extension.
 */
class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Boot service provider.
     *
     * @param \Notadd\Foundation\Administration\Administration $administration
     */
    public function boot(Administration $administration)
    {
        $administrator = new Administrator($this->app['events'], $this->app['router']);
        $administrator->registerPath('admin');
        $administrator->registerHandler(AdminController::class . '@handle');
        $administration->setAdministrator($administrator);
    }
}
```

# 路由

可编程路由是 **Laravel** 的一大特性，而在 **Notadd** 中，允许以 **Event** 的形式进行扩展。

## 扩展示例

### 第一步：

在模块目录（如：modules/administration）的源码目录中的订阅者目录（src/Subscribers）中添加一个继承自类 **Notadd\Foundation\Routing\Abstracts\RouteRegister** 的事件订阅者类，类名可完全自定义，例如：**RouteRegister**。

### 第二步：

在类 RouteRegister 实现 router 定义，示例代码如下：

```php
namespace Notadd\Content\Listeners;

use Notadd\Content\Controllers\Api\Article\ArticleController as ArticleApiController;
use Notadd\Content\Controllers\Api\Article\ArticleTemplateController as ArticleTemplateApiController;
use Notadd\Content\Controllers\Api\Category\CategoryController as CategoryApiController;
use Notadd\Content\Controllers\Api\Category\CategoryTemplateController as CategoryTemplateApiController;
use Notadd\Content\Controllers\Api\Category\CategoryTypeController as CategoryTypeApiController;
use Notadd\Content\Controllers\Api\Page\PageController as PageApiController;
use Notadd\Content\Controllers\Api\Page\PageTemplateController as PageTemplateApiController;
use Notadd\Content\Controllers\Api\Page\PageTypeController as PageTypeApiController;
use Notadd\Content\Controllers\ArticleController;
use Notadd\Content\Controllers\Api\Article\ArticleTypeController as ArticleTypeApiController;
use Notadd\Content\Controllers\CategoryController;
use Notadd\Content\Controllers\PageController;
use Notadd\Foundation\Routing\Abstracts\RouteRegister as AbstractRouteRegister;

/**
 * Class RouteRegister.
 */
class RouteRegister extends AbstractRouteRegister
{
    /**
     * Handle Route Registrar.
     */
    public function handle()
    {
        $this->router->group(['middleware' => ['auth:api', 'web'], 'prefix' => 'api/article'], function () {
            $this->router->resource('template', ArticleTemplateApiController::class);
            $this->router->resource('type', ArticleTypeApiController::class);
            $this->router->resource('/', ArticleApiController::class);
        });
        $this->router->group(['middleware' => ['auth:api', 'web'], 'prefix' => 'api/category'], function () {
            $this->router->resource('template', CategoryTemplateApiController::class);
            $this->router->resource('type', CategoryTypeApiController::class);
            $this->router->resource('/', CategoryApiController::class);
        });
        $this->router->group(['middleware' => ['auth:api', 'web'], 'prefix' => 'api/page'], function () {
            $this->router->resource('template', PageTemplateApiController::class);
            $this->router->resource('type', PageTypeApiController::class);
            $this->router->resource('/', PageApiController::class);
        });
        $this->router->group(['middleware' => 'web', 'prefix' => 'article'], function () {
            $this->router->resource('/', ArticleController::class);
        });
        $this->router->group(['middleware' => 'web', 'prefix' => 'category'], function () {
            $this->router->resource('/', CategoryController::class);
        });
        $this->router->group(['middleware' => 'web', 'prefix' => 'page'], function () {
            $this->router->resource('/', PageController::class);
        });
    }
}
```

# 拓展

**拓展**一般需要在特定环境下实现，比如 Workerman 模块，需要安装 Workerman 支持的拓展。

新特性，开发中...

# 模块

**模块**是 Notadd 的功能实体，是区别于 **notadd/framework** 来说的，**notadd/framework** 仅是承载 Notadd 体系的逻辑实现，并没有包含功能性代码。

## 目录结构

**模块**位于目录 **modules** 下，每个模块在一个独立的文件夹内，模块内部的目录结构如下：

```
# module/administration                                                                模块目录
    # resources                                                                        资源目录
        # translations                                                                 翻译文件目录
        # views                                                                        视图目录
    # src                                                                              源码目录
            # Controllers                                                              控制器目录
            # Subscribers                                                              事件订阅者目录（支持自动发现）
            # ModuleServiceProvider.php                                                模块的服务提供者
    # composer.json                                                                    Composer 配置文件
    # configuration.yaml                                                               模块配置文件
    # readme.md                                                                        模块说明文件
```

## Resources

Resources 目录是 Module 的资源类文件放置的目录，包含如下几个类型目录：

* assets
* translations
* views

### Assets

assets 目录为前端相关资源或项目的放置目录。

### Translations

translations 目录为多语言资源文件的放置目录。

### Views

views 目录为视图资源文件的放置目录。

## ModuleServiceProvider

ModuleServiceProvider 是 Module 的模块入口文件，也 Module 的所有功能注入及组件启动的服务提供者。

## 完整示例

```php
namespace Notadd\Content;

use Illuminate\Events\Dispatcher;
use Illuminate\Support\ServiceProvider;
use Notadd\Content\Events\RegisterArticleTemplate;
use Notadd\Content\Events\RegisterArticleType;
use Notadd\Content\Events\RegisterCategoryTemplate;
use Notadd\Content\Events\RegisterCategoryType;
use Notadd\Content\Events\RegisterPageTemplate;
use Notadd\Content\Events\RegisterPageType;
use Notadd\Content\Listeners\CsrfTokenRegister;
use Notadd\Content\Listeners\RouteRegister;
use Notadd\Content\Managers\ArticleManager;
use Notadd\Content\Managers\CategoryManager;
use Notadd\Content\Managers\PageManager;

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
        $this->loadMigrationsFrom(realpath(__DIR__ . '/../databases/migrations'));
        $this->loadTranslationsFrom(realpath(__DIR__ . '/../resources/translations'), 'content');
    }

    /**
     * Register services.
     */
    public function register()
    {
        $this->app->alias('article.manager', ArticleManager::class);
        $this->app->alias('category.manager', CategoryManager::class);
        $this->app->alias('page.manager', PageManager::class);
        $this->app->singleton('article.manager', function ($app) {
            $manager = new ArticleManager($app, $app['events']);
            $this->app->make(Dispatcher::class)->fire(new RegisterArticleTemplate($app, $manager));
            $this->app->make(Dispatcher::class)->fire(new RegisterArticleType($app, $manager));

            return $manager;
        });
        $this->app->singleton('category.manager', function ($app) {
            $manager = new CategoryManager($app, $app['events']);
            $this->app->make(Dispatcher::class)->fire(new RegisterCategoryTemplate($app, $manager));
            $this->app->make(Dispatcher::class)->fire(new RegisterCategoryType($app, $manager));

            return $manager;
        });
        $this->app->singleton('page.manager', function ($app) {
            $manager = new PageManager($app, $app['events']);
            $this->app->make(Dispatcher::class)->fire(new RegisterPageTemplate($app, $manager));
            $this->app->make(Dispatcher::class)->fire(new RegisterPageType($app, $manager));

            return $manager;
        });
    }
}
```

## Composer 配置文件

通过对 Composer 的自定义，可以实现 Notadd 风格的目录结构。

### Type

配置 type 属性为 notadd-module，会告诉 Composer Installer 将该 Package 安装到目录 modules 下，而非默认目录 vendor 下。

### Require

添加 notadd/installers 的 Package，才能调整 Composer 对该类型 Package 的默认处理逻辑，实现重定向安装目录的特性。

介于，模块的安装方式有两种，一种方式是：将 Composer Package 写入程序根项目目录下的 composer.json 文件，另一种方法是，单独初始化模块 Package，并以文件夹的形式放到 modules 目录，并且，需要使用命令 composer install --no-dev 进行初始化。

故此，包 notadd/installers 应放置在 require-dev 中。 

### 完整示例

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
            "email": "heshudong@ibenchu.com"
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

## 模块配置文件

模块配置文件，是包含模块定义，模块版本定义，后台页面注入，后台仪表盘模块注入，资源目录注入等功能或特性实现的配置文件。

### 完整示例

```yaml
name: 后台管理                                                                             # 模块名称
identification: notadd/administration                                                     # 模块标识，需和 composer.json 的 name 属性一致
description: 'Notadd 后台管理模块'                                                         # 模块描述
author:                                                                                   # 模块作者
    - twilroad
    - 269044570@qq.com
version: 2.0.0                                                                            # 模块版本
csrf:                                                                                     # 模块 CSRF 注入
    - 'admin*'
    - 'api*'
    - 'editor*'
dashboards:                                                                               # 后台仪表盘模块注入
    -
        identification: systeminfo
        title: 系统信息
        template: Notadd\Administration\SystemInformation@handler
    -
        identification: development
        title: 开发团队
        template:
            -
                tag: p
                content:
                    -
                        tag: strong
                        content:
                            - 开发团队：
                    -
                        attrs:
                            href: https://github.com/twilroad
                            target: _blank
                        tag: a
                        content:
                            - 寻风
                    - ，
                    -
                        attrs:
                            href: https://www.zuohuadong.cn
                            target: _blank
                        tag: a
                        content:
                            - 依剑听雨
                    - ，
                    -
                        attrs:
                            href: https://github.com/medz
                            target: _blank
                        tag: a
                        content:
                            - Seven Du
                    - ，
                    -
                        attrs:
                            href: https://github.com/QiyueShiyi
                            target: _blank
                        tag: a
                        content:
                            - Luff
                    - ，
                    -
                        attrs:
                            href: https://weibo.com/u/2181906365
                            target: _blank
                        tag: a
                        content:
                            - 小莫
                    - ，
                    -
                        attrs:
                            href: https://weibo.com/u/3189357545
                            target: _blank
                        tag: a
                        content:
                            - 睡不醒的酸柠檬
                    - ，
                    -
                        attrs:
                            href: http://weibo.com/u/3854583077
                            target: _blank
                        tag: a
                        content:
                            - 浅殤
                    - ，
                    -
                        attrs:
                            href: https://weibo.cn/u/3258236872
                            target: _blank
                        tag: a
                        content:
                            - 马镝清同学
                    - ，
                    -
                        attrs:
                            href: http://weibo.com/u/5592753739
                            target: _blank
                        tag: a
                        content:
                            - 未央花事结
                    - 。
            -
                tag: p
                content:
                    -
                        tag: strong
                        content:
                            - 开发团队：
                    -
                        attrs:
                            href: https://github.com/LitoMore
                            target: _blank
                        tag: a
                        content:
                            - LitoMore
                    - ，
                    -
                        attrs:
                            href: https://github.com/ganlanshu0211
                            target: _blank
                        tag: a
                        content:
                            - 半缕阳光
                    - ，
                    -
                        attrs:
                            href: https://github.com/ToxinSting
                            target: _blank
                        tag: a
                        content:
                            - Rayle
                    - ，
                    -
                        attrs:
                            href: https://github.com/cloudsher
                            target: _blank
                        tag: a
                        content:
                            - cloudSher
                    - ，
                    -
                        attrs:
                            href: http://www.lovetd.cn
                            target: _blank
                        tag: a
                        content:
                            - 怒杀一只鸡
                    - 。
menus:                                                                                    # 后台菜单注入
    global:
        icon: settings
        permission:
        path: '/'
        text: 全局
        children:
            -
                icon: ios-cog
                text: 全局设置
            -
                children:
                    -
                        path: /upload
                        text: 上传设置
                icon: ios-paper
                text: 附件设置
            -
                childrend:
                    -
                        path: /module
                        text: 模块配置
                    -
                        path: /extension
                        text: 插件配置
                    -
                        path: /template
                        text: 模板配置
                    -
                        path: /expand
                        text: 拓展配置
                icon: plus
                text: 应用管理
            -
                icon: plus
                text: 全局插件
            -
                childrend:
                    -
                        path: /menu
                        text: 菜单管理
                    -
                        path: /seo
                        text: SEO 管理
                    -
                        path: /mail
                        text: 邮件设置
                    -
                        path: /debug
                        text: 调试工具
                icon: stats-bars
                text: 系统插件
pages:                                                                                    # 后台页面注入
    configurations:
        initialization:
            name: 参数配置
            tabs: true
            target: global
        tabs:
            configuration:
                default: true
                show: true
                submit: api/setting/set
                title: 全局设置
                fields:
                    name:
                        default: ''
                        description: ''
                        label: 网站名称
                        key: site.name
                        placeholder: 请输入网站名称
                        required: true
                        type: input
                        validates:
                            -
                                message: 请输入网站名称
                                required: true
                                trigger: change
                                type: string
                    enabled:
                        default: false
                        description: '关闭后网站将不能访问'
                        format: boolean
                        label: 站点开启
                        key: site.enabled
                        required: false
                        type: switch
                    domain:
                        default: ''
                        description: '不带 http:// 或 https://'
                        label: 网站域名
                        key: site.domain
                        required: false
                        type: input
                    multidomain:
                        default: false
                        description: '由于前后端分离机制，官方不对多域名做特殊支持，可能导致其他未知问题'
                        format: boolean
                        label: 开启多域名
                        key: site.multidomain
                        required: false
                        type: switch
                    beian:
                        default: ''
                        label: 备案信息
                        key: site.beian
                        required: false
                        type: input
                    company:
                        default: ''
                        label: 公司名称
                        key: site.company
                        required: false
                        type: input
                    copyright:
                        default: ''
                        label: 版权信息
                        key: site.copyright
                        required: false
                        type: input
                    statistics:
                        default: ''
                        label: 统计代码
                        key: site.statistics
                        required: false
                        type: textarea
publishes:                                                                                # 资源目录映射
    assets/admin: resources/mixes/administration/dist/assets/admin
```

## 事件订阅者目录

事件订阅者模式，是 事件 机制中比较好用的一个模式，实现事件订阅者的自动发现，将能减少开发者的不少开发事件。

# 插件

## 说明

**Extension** 作为 Notadd Framework 的一个特性存在，允许通过 Extension 的方式对 Notadd Framework 进行功能或模板的扩展。
**Extension** 的机制类似于 **Laravel** 中 **Service Provider** 的机制，提供了一种实现组件化的机制，并可以实现传统插件机制中的安装、卸载以及插件启动过程。

## 基本结构

一个完整的 Notadd Extension ，必然是遵循 **Composer** 相关规范的 **Package**。

### 目录结构

**插件**位于目录 **extensions** 下，插件目录结构如下

```
# vendor                                                                               厂商目录
    # extension                                                                        插件目录
        # configuations                                                                可加载配置文件目录
        # resources                                                                    资源目录
            # translations                                                             翻译文件目录
            # views                                                                    视图目录
        # src                                                                          源码目录
            # Extension                                                                扩展服务提供者定义文件
        # composer.json                                                                Composer 配置文件
```

* [Extension](/#/v1.0/zh-CN/extensions/provider)
* [Resources](/#/v1.0/zh-CN/extensions/resources)
* [Composer](/#/v1.0/zh-CN/extensions/composer)

## 其他说明

* **composer.json** 中需定义 **type** 为 **notadd-extension**
* **composer.json** 中需依赖 **package** 为 **notadd/installers**

## Extension 结构

Extension 的机制类似于 **Laravel** 中 **Service Provider** 的机制，提供了一种实现组件化的机制，并可以实现传统插件机制中的安装、卸载以及插件启动过程。

### 基本结构

一个完整的 Notadd Extension ，必然是遵循 **Composer** 相关规范的 **Package**。

### 目录结构

**插件**位于目录 **extensions** 下，插件目录结构如下

```
# vendor                                                                               厂商目录
    # extension                                                                        插件目录
        # configuations                                                                可加载配置文件目录
        # resources                                                                    资源目录
            # translations                                                             翻译文件目录
            # views                                                                    视图目录
        # src                                                                          源码目录
        # bootstrap.php                                                                插件启动脚本
        # composer.json                                                                Composer 配置文件
```

## 其他说明

* **composer.json** 中需定义 **type** 为 **notadd-module**
* **composer.json** 中需依赖 **package** 为 **notadd/installers**



## Composer

通过对 Composer 的自定义，可以实现 Composer 自动加载 Extension 定义的依赖项。

## Type

配置 type 属性为 notadd-extension。

## Require

添加 notadd/installers 的 Package，才能实现 Composer 自动加载 Extension 定义的依赖项。

## 完整示例

```json
{
    "name": "notadd/extension-demo",
    "description": "Notadd's Demo Extension.",
    "type": "notadd-extension",
    "keywords": ["notadd", "demo", "extension"],
    "homepage": "https://notadd.com",
    "license": "Apache-2.0",
    "authors": [
        {
            "name": "twilroad",
            "email": "heshudong@ibenchu.com"
        }
    ],
    "autoload": {
        "psr-4": {
            "Notadd\\Demo\\": "src/"
        }
    },
    "require": {
        "php": ">=7.0",
        "notadd/installers": "0.5.*"
    }
}
```