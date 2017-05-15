# 如何开发一个 Notadd Administration 模块的前端扩展

阅读此文档，需对 Laravel，VueJS 2,Webpack 有了解。

前端扩展，指的是，针对项目 [notadd/administration](https://github.com/notadd/administration) 的前端部分进行扩展功能的开发。

完整示例，请参考模块项目 [notadd/content](http://github.net/notadd/content) 。

前端扩展包含的功能注入点如下：

* 扩展安装注入
* 头部菜单注入
* 路由注入
* 侧边栏菜单注入

## 说明

项目 notadd/administration 的前端部分，是基于 VueJS 2 实现的单页应用(SPA)。

所以，对前端进行扩展，实际是对 VueJS 项目的扩展。

由于 VueJS 项目基于 Webpack 进行构建和打包，所以前端扩展项目也必须基于 Webpack 进行构建和打包。

如何创建和开发 VueJS 2 的项目，请参见 [VueJS 官方文档](http://cn.vuejs.org/v2/guide/)。

但是，Notadd 的前端扩展项目，并不是一个完整的 VueJS 2 的项目，因为 Notadd 只接受 UMD 模块风格的前端模块注入，所以在使用 Webpack 进行模块构建时，webpackConfig 中需要针对 output 参数进行调整，主要体现：

* 必须定义 **output** 的 **library** 别名，此名称，必须与 捆绑 的模块或扩展项目中 composer.json 文件中定义的 name 完全一致，否则无法加载前端扩展
* 必须定义 **output** 的 **libraryTarget** 为 **umd**

配置代码参考如下(来自文件 build/webpack.prod.conf.js)：

```javascript
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/extension.js'),
    library: 'notadd/content',                                                              // 必须定义 library 别名
    libraryTarget: "umd"                                                                    // 必须定义 libraryTarget 为 umd
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css')
    }),
    new OptimizeCSSPlugin()
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
```

## 默认导出模块

使用 Webpack 导出 UMD 模块风格的模块是，在 Webpack 配置中定义的 entry 入口文件中，必须使用默认导出模块，作为 Notadd 前端功能注入的注入点。

代码参考如下：

```ecmascript 6
import {headerMixin, installMixin, routerMixin} from './helpers/mixes'

let Core = {}

headerMixin(Core)
installMixin(Core)
routerMixin(Core)

export default Core
```

如上代码所示，模块 Core 即为项目构建后的默认导出模块，在该示例中，使用了 mixin 特性，为模块增加 header，install，router的注入逻辑。

## 扩展安装注入

如上(默认导出模块)述说，installMixin 为模块 Core 注入了 Core.install 的实现，具体代码如下：

```ecmascript 6
export function installMixin (Core) {
  Core.install = function (Vue, Notadd) {
    Core.instance = Notadd
    vueMixin(Core, Vue)
  }
}
export function vueMixin (Core, Vue) {
  Core.http = Vue.http
}
```

Core.install 的调用者，为该方法提供了两个对象，一个是 Vue 全局对象，一个是 Notadd 全局对象。

Vue 全局对象提供的特性，可以参考 VueJS 2 的官方文档。

Notadd 全局对象主要包含如下特性：

* Notadd.Vue：Vue 全局对象的副本
* Notadd.http：axios 全局对象的副本
* Notadd.store：Vuex 对象的副本
* Notadd.components：常用的功能型组件(符合 Vue 组件规范)
* Notadd.layouts：常用的布局型组件(符合 Vue 组件规范)

所以，如果模块 Core 中需要使用 Vue 或 Notadd 的任意对象，均可通过 mixin 特性来附加。

## 头部菜单注入

如上(默认导出模块)述说，headerMixin 为模块 Core 注入了 Core.header 的实现，具体代码如下：

```ecmascript 6
export function headerMixin (Core) {
  Core.header = function (menu) {
    menu.push({
      'text': '文章',
      'icon': 'icon icon-article',
      'uri': '/content'
    })
  }
}
```

## 路由注入

如上(默认导出模块)述说，routerMixin 为模块 Core 注入了 Core.router 的实现，具体代码如下：

```ecmascript 6
import ContentArticle from '../components/Article'
import ContentArticleCreate from '../components/ArticleCreate'
import ContentArticleDraft from '../components/ArticleDraft'
import ContentArticleDraftEdit from '../components/ArticleDraftEdit'
import ContentArticleEdit from '../components/ArticleEdit'
import ContentArticleRecycle from '../components/ArticleRecycle'
import ContentCategory from '../components/ArticleCategory'
import ContentComment from '../components/Comment'
import ContentComponent from '../components/Component'
import ContentDashboard from '../components/Dashboard'
import ContentExtension from '../components/Extension'
import ContentLayout from '../components/Layout'
import ContentPage from '../components/Page'
import ContentPageCategory from '../components/PageCategory'
import ContentPageCreate from '../components/PageCreate'
import ContentPageEdit from '../components/PageEdit'
import ContentTemplate from '../components/Template'
import ContentTag from '../components/ArticleTag'
export function routerMixin (Core) {
  Core.router = function (router) {
    router.modules.push({
      path: '/content',
      component: ContentLayout,
      children: [
        {
          path: '/',
          component: ContentDashboard,
          beforeEnter: router.auth
        },
        {
          path: 'article/all',
          component: ContentArticle,
          beforeEnter: router.auth
        },
        {
          path: 'article/create',
          component: ContentArticleCreate,
          beforeEnter: router.auth
        },
        {
          path: 'article/:id/draft',
          component: ContentArticleDraftEdit,
          beforeEnter: router.auth
        },
        {
          path: 'article/:id/edit',
          component: ContentArticleEdit,
          beforeEnter: router.auth
        },
        {
          path: 'article/category',
          component: ContentCategory,
          beforeEnter: router.auth
        },
        {
          path: 'article/tag',
          component: ContentTag,
          beforeEnter: router.auth
        },
        {
          path: 'article/recycle',
          component: ContentArticleRecycle,
          beforeEnter: router.auth
        },
        {
          path: 'article/draft',
          component: ContentArticleDraft,
          beforeEnter: router.auth
        },
        {
          path: 'page/all',
          component: ContentPage,
          beforeEnter: router.auth
        },
        {
          path: 'page/create',
          component: ContentPageCreate,
          beforeEnter: router.auth
        },
        {
          path: 'page/:id/edit',
          component: ContentPageEdit,
          beforeEnter: router.auth
        },
        {
          path: 'page/category',
          component: ContentPageCategory,
          beforeEnter: router.auth
        },
        {
          path: 'component',
          component: ContentComponent,
          beforeEnter: router.auth
        },
        {
          path: 'template',
          component: ContentTemplate,
          beforeEnter: router.auth
        },
        {
          path: 'extension',
          component: ContentExtension,
          beforeEnter: router.auth
        },
        {
          path: 'comment',
          component: ContentComment,
          beforeEnter: router.auth
        }
      ]
    })
  }
}
```

Core.router 的调用者，为该方法提供了一个 router 对象，该 router 对象中包含如下特性：

* auth: 后台登录验证中间件
* bases: 基础路由定义
* modules: 模块路由定义

## 侧边栏菜单注入

侧边栏菜单注入，提供了扩展管理子级菜单的注入，由 Core.sidebar 提供注入，代码参考如下：

```ecmascript 6
export default {
  sidebar: function (sidebar) {
    sidebar.push({
      text: '多说评论',
      icon: 'fa fa-comment',
      uri: '/duoshuo'
    })
  }
}
```

## 前端扩展构建和打包

在进行代码编写和相关配置之后，使用命令 npm run build 即可完成对扩展模块的打包。

## 前端资源注入

通过前端工具构建和打包后，可以得到前端静态资源文件（js文件，css文件，图片文件等），可以模块中的类 ModuleServiceProvider 或扩展中的类 Extension 中将静态资源文件发布到 public 目录下。

类 ModuleServiceProvider 的代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2016, notadd.com
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
        $this->publishes([
            realpath(__DIR__ . '/../resources/mixes/administration/dist/assets/content/administration') => public_path('assets/content/administration'),
            realpath(__DIR__ . '/../resources/mixes/foreground/dist/assets/content/foreground') => public_path('assets/content/foreground'),
        ], 'public');
    }
}
```

然而，这样并没有结束，仍然需要告诉 Administration 模块你提供了哪些静态资源文件，给后台的前端页面使用。

在模块中的类 ModuleServiceProvider 或扩展中的类 Extension 中提供了相应注入点，script 方法将告诉后台的前端页面引用前面打包生成的 UMD 模块文件，stylesheet 方法将告诉后台的前端页面引用前面打包生成样式文件。

具体代码参考如下：

```php
<?php
/**
 * This file is part of Notadd.
 *
 * @author TwilRoad <269044570@qq.com>
 * @copyright (c) 2016, notadd.com
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
    /**
     * Get script of extension.
     *
     * @return string
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public static function script()
    {
        return asset('assets/content/administration/js/module.js');
    }

    /**
     * Get stylesheet of extension.
     *
     * @return array
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public static function stylesheet()
    {
        return [
            asset('assets/content/administration/css/module.css'),
        ];
    }
}
```
