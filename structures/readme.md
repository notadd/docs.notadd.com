# 目录结构说明

### 整站目录说明

```
── 程序根目录
├─ extensions 插件目录
├─modules 模块目录
├─ public 公共目录（请将网站根目录指向于此）
│   ├─ assets 静态资源目录
│   ├─ uploads 上传目录
│   ├─ favicon.ico ICON图标文件
│   └─ index.php 入口文件
├─ storage 缓存目录
└─ vendor 第三方类库目录
```

### 示例插件目录说明

```
──extensions\vendor\brick-carving BrickCarving插件目录
├─ src 插件源码目录
├─ resources 插件静态资源目录
├─ vendor 第三方类库目录
└─ composer.json 插件Composer文件
```