# 如何基于 Notadd 构建 API

Notadd 底层实现了 passport 机制，有统一的授权管理，主要支持两种方式进行 API 授权，一个是 client，领一个是 passport，这个在其他文档中有做详细的说明。

这里主要说的是，如何基于 Notadd 进行 API 接口的开发。

## 业务逻辑

熟悉 Laravel 的同学都应该知道，Laravel 遵循这样的业务逻辑实现：

```text
路由(route) -> 控制器(controller) -> 业务逻辑(model) -> 数据输出(view)
```

而 Notadd 的 API 业务逻辑实现同样遵循类似的流程：

```text
路由(route) -> 控制器(controller) -> API 处理器(handler) -> 模型(model) -> 数据输出(json)
```

其中，主要的差异在于，API 处理器提供了对数据输出格式的输出，返回的数据格式统一为：

```php
[
    'code' => 200,             // API 接口返回的状态码，默认为 200
    'data' => [],              // API 接口返回的数据，主要为数组形式
    'message' => 'success！',  // API 接口返回的提示信息，可以包含错误信息或成功信息
]
```

## 路由

Notadd 在实现 API 授权的时候，使用的是有 **路由中间件(middleware)** 的方式来实现的。

具体实现方式，是在路由的中间配置参数中添加 **auth:api** 。

例如，在实现 api/setting/all 和 api/setting/set 两个 API 的时候，添加 auth:api 的中间件，代码参考如下：

```php
$this->router->group(['middleware' => ['auth:api', 'web'], 'prefix' => 'api/setting'], function () {
    $this->router->post('all', 'Notadd\Foundation\Setting\Controllers\SettingController@all');
    $this->router->post('set', 'Notadd\Foundation\Setting\Controllers\SettingController@set');
});
```

Notadd 针对需要跨域的 API 还提供了 cross 的路由中间件，以实现 API 跨域的功能。

例如，为前两个 API 提供跨域的功能实现，代码参考如下：

```php
$this->router->group(['middleware' => ['auth:api', 'cross', 'web'], 'prefix' => 'api/setting'], function () {
    $this->router->post('all', 'Notadd\Foundation\Setting\Controllers\SettingController@all');
    $this->router->post('set', 'Notadd\Foundation\Setting\Controllers\SettingController@set');
});
```

## 控制器

由于有了独立的 API处理器 ，控制器层可以制作简单处理，仅需向控制器注入 handler，并由 handler 提供的辅助方法返回 API 数据给前台，即可。

例如，在前面路由调用的 SettingController 中，仅需要注入 AllHandler ，使用方法 toResponse 和 generateHttpResponse 来返回结果给前台，代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2016, notadd.com
 * @datetime 2016-11-08 17:01
 */
namespace Notadd\Foundation\Setting\Controllers;

use Notadd\Foundation\Routing\Abstracts\Controller;
use Notadd\Foundation\Setting\Contracts\SettingsRepository;
use Notadd\Foundation\Setting\Handlers\AllHandler;
use Notadd\Foundation\Setting\Handlers\SetHandler;

/**
 * Class SettingController.
 */
class SettingController extends Controller
{
    /**
     * @var \Notadd\Foundation\Setting\Contracts\SettingsRepository
     */
    protected $settings;

    /**
     * SettingController constructor.
     *
     * @param \Notadd\Foundation\Setting\Contracts\SettingsRepository $settings
     *
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function __construct(SettingsRepository $settings)
    {
        parent::__construct();
        $this->settings = $settings;
    }

    /**
     * All handler.
     *
     * @param \Notadd\Foundation\Setting\Handlers\AllHandler $handler
     *
     * @return \Notadd\Foundation\Passport\Responses\ApiResponse
     * @throws \Exception
     */
    public function all(AllHandler $handler)
    {
        return $handler->toResponse()->generateHttpResponse();
    }

    /**
     * Set handler.
     *
     * @param \Notadd\Foundation\Setting\Handlers\SetHandler $handler
     *
     * @return \Notadd\Foundation\Passport\Responses\ApiResponse
     * @throws \Exception
     */
    public function set(SetHandler $handler)
    {
        return $handler->toResponse()->generateHttpResponse();
    }
}
```

## API Handler 和模型

在 API Handler中提供了模型的操作接口。

在 Notadd 中，提供了两类 API Handler，一类是 DataHandler，另一类是 SetHandler，顾名思义，DataHandler 仅提供数据返回接口，而 SetHandler 不仅提供数据返回接口，还提供其他操作处理的接口。

具体差异体现在，DataHandler 在返回数据接口时仅调用方法 data，而 SetHandler 在调用 data 方法前还有调用 execute 方法。

例如，在前面的 SettingController 中使用的 AllHandler 为 DataHandler 类 Handler，提供返回所有 配置项 的 API 功能，SetHandler 为 SetHandler 类 Handler，提供 修改配置项 并返回所有 配置项 的 API 功能。

AllHandler 的代码如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2016, notadd.com
 * @datetime 2016-11-23 14:44
 */
namespace Notadd\Foundation\Setting\Handlers;

use Illuminate\Container\Container;
use Notadd\Foundation\Passport\Abstracts\DataHandler;
use Notadd\Foundation\Setting\Contracts\SettingsRepository;

/**
 * Class AllHandler.
 */
class AllHandler extends DataHandler
{
    /**
     * @var \Notadd\Foundation\Setting\Contracts\SettingsRepository
     */
    protected $settings;

    /**
     * AllHandler constructor.
     *
     * @param \Illuminate\Container\Container                         $container
     * @param \Notadd\Foundation\Setting\Contracts\SettingsRepository $settings
     */
    public function __construct(
        Container $container,
        SettingsRepository $settings
    ) {
        parent::__construct($container);
        $this->settings = $settings;
    }

    /**
     * Http code.
     *
     * @return int
     */
    public function code()                                                 // 定义 API 操作结果的状态码
    {
        return 200;
    }

    /**
     * Data for handler.
     *
     * @return array
     */
    public function data()                                                  // 定义 API 返回的数据
    {
        return $this->settings->all()->toArray();
    }

    /**
     * Errors for handler.
     *
     * @return array
     */
    public function errors()                                                // 定义 API 操作失败时返回的信息
    {
        return [
            '获取全局设置失败！',
        ];
    }

    /**
     * Messages for handler.
     *
     * @return array
     */
    public function messages()                                             // 定义 API 操作成功时返回的信息
    {
        return [
            '获取全局设置成功！',
        ];
    }
}
```

SetHandler 的代码如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2016, notadd.com
 * @datetime 2016-11-23 15:09
 */
namespace Notadd\Foundation\Setting\Handlers;

use Illuminate\Container\Container;
use Notadd\Foundation\Passport\Abstracts\SetHandler as AbstractSetHandler;
use Notadd\Foundation\Setting\Contracts\SettingsRepository;

/**
 * Class SetHandler.
 */
class SetHandler extends AbstractSetHandler
{
    /**
     * @var \Notadd\Foundation\Setting\Contracts\SettingsRepository
     */
    protected $settings;

    /**
     * SetHandler constructor.
     *
     * @param \Illuminate\Container\Container                         $container
     * @param \Notadd\Foundation\Setting\Contracts\SettingsRepository $settings
     */
    public function __construct(
        Container $container,
        SettingsRepository $settings
    ) {
        parent::__construct($container);
        $this->settings = $settings;
    }

    /**
     * Data for handler.
     *
     * @return array
     */
    public function data()                                                                    // 定义 API 返回的数据
    {
        return $this->settings->all()->toArray();
    }

    /**
     * Errors for handler.
     *
     * @return array
     */
    public function errors()                                                                  // 定义 API 操作失败时返回的信息
    {
        return [
            '修改设置失败！',
        ];
    }

    /**
     * Execute Handler.
     *
     * @return bool
     */
    public function execute()                                                                 // 定义 API 执行的修改操作
    {
        $this->settings->set('site.enabled', $this->request->input('enabled'));
        $this->settings->set('site.name', $this->request->input('name'));
        $this->settings->set('site.domain', $this->request->input('domain'));
        $this->settings->set('site.beian', $this->request->input('beian'));
        $this->settings->set('site.company', $this->request->input('company'));
        $this->settings->set('site.copyright', $this->request->input('copyright'));
        $this->settings->set('site.statistics', $this->request->input('statistics'));

        return true;
    }

    /**
     * Messages for handler.
     *
     * @return array
     */
    public function messages()                                                                // 定义 API 操作成功时返回的信息
    {
        return [
            '修改设置成功!',
        ];
    }
}
```

## 数据输出

API 结果的数据输出，已经在 控制器(controller) 中做了处理。

至此，一个完整的 API 开发完成。
