# 如何在前端项目中使用 trans (翻译) 功能

在 Notadd 后台的前端体系中，我们实现了 多语言 ，可以通过设定不同的语言，来实现本地化的功能。

具体的方案，是提供了 trans 函数，类似于 Laravel 的 PHP 版本的 trans 辅助函数。

代码参考如下：

```javascript
import trans from '../helpers/injection';

trans('install.install.success'); //将输出"安装成功！"
```

是不是非常的简单易用呢？😁😁😁😁
