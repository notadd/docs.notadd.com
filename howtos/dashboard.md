# 如何通过插件或模块的方式对后台首页进行模块注入

Notadd 后台管理的首页(Dashboard)，是可以通过插件或扩展，进行添加自定义模块的。

## 支持的自定义模块类型

* html(自定义原生 HTML 代码)
* text(字符串文本)
* button(普通按钮或带链接的按钮)
* chart(自定义图标，基于[百度图标](http://echarts.baidu.com/))

## 数据结构

### button

```json
{
    content: '这是 Button 文本内容',
    link: 'http://www.hao123.com',
    span: 12,
    theme: 'primary',
    title: '这是 Button 标题',
    type: 'button',
}
```

### chart

```json
{
    content: {
        title: {
            text: 'Notadd 图标测试',
        },
        tooltip: {},
        xAxis: {
            data: ['Shirt', 'Sweater', 'Chiffon Shirt', 'Pants', 'High Heels', 'Socks'],
        },
        yAxis: {},
        series: [
            {
                name: 'Sales',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20],
            },
        ],
    },
    span: 12,
    style: 'height: 300px;',
    title: '这是 Chart 标题',
    type: 'chart',
}
```

### html

```json
{
    content: '这是 Html 文本内容',
    span: 12,
    title: '这是 Html 标题',
    type: 'html',
}
```

### text

```json
{
    content: '这是 Text 文本内容',
    span: 12,
    title: '这是 Text 标题',
    type: 'text',
}
```

## 注入方法

基于 Notadd 后台前端框架，实现该页面的注入，仅需要前端模块注入的install方式中使用useBoard函数进行注入即可。

参考代码如下：

```javascript
export default function (injection) {
    injection.useBoard({
        content: {
            title: {
                text: 'Notadd Content 模块图标测试',
            },
            tooltip: {},
            xAxis: {
                data: ['资讯', '科技', '文化', '讲座', '娱乐', '软件'],
            },
            yAxis: {},
            series: [
                {
                    name: 'Sales',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20],
                },
            ],
        },
        span: 12,
        style: 'height: 300px;',
        title: '这是 Chart 标题',
        type: 'chart',
    });
}
```
