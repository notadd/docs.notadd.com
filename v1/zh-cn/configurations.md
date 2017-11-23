
# 为什么要统计配置文件

配置文件是组件或模块、插件装配到核心（Notadd）的载体，规范统一的数据结构，为架构统一，代码风格统一，做了很好的铺垫。

# 支持的配置信息和功能注入类型

配置文件包含了模块的基本信息，以及能实现功能的注入。示例文件参考：[Administration 模块的配置文件](https://github.com/notadd/administration/blob/master/configuration.yaml)。

具体列表如下：

[name](#name) ，
[identification](#identification) ，
[author](#author) ，
[version](#version) ，
[csrf](#csrf) ，
[dashboards](#dashboards)， 
[menus](#menus) ，
[pages](#pages) ，
[publishes](#publishes) 

## name

**描述：** 名称

**格式：** 字符串

**可用于：**

    - 模块
    - 插件

## identification

**描述：** 标识

**格式：** 字符串

**可用于：**

    - 模块
    - 插件

## author

**描述：** 作者

**格式：** 无键值数值

**可用于：**

    - 模块
    - 插件

## version

**描述：** 版本

**格式：** 字符串

**可用于：**

    - 模块
    - 插件

## csrf

**描述：** CSRF

**格式：** 无键值数值，参考[CSRF 例外](#CSRF)

**可用于：**

    - 模块
    - 插件

## dashboards

**描述：** 后台首页仪表盘模块

**格式：** 无键值数值，参考[后台首页仪表盘模块](#后台首页仪表盘模块)

**可用于：**

    - 模块
    - 插件

## menus

**描述：** 后台菜单

**格式：** 无键值数值，参考[后台菜单](#后台菜单)

**可用于：**

    - 模块
    - 插件

## pages

**描述：** 后台自定义页面

**格式：** 无键值数值，参考[后台自定义页面](#后台自定义页面)

**可用于：**

    - 模块
    - 插件

## publishes

**描述：** 资源发布

**格式：** 带键值数值，参考[资源发布](#资源发布)

**可用于：**

    - 模块
    - 插件
    
# CSRF

示例代码：

```yaml
csrf:
    - 'admin*'
    - 'api*'
    - 'editor*'
```

# 后台首页仪表盘模块

```yaml
dashboards:
    -                                                                          # 第一个模块
        identification: systeminfo                                             # 仪表盘模块标识
        title: 系统信息                                                         # 仪表盘模块标题
        template: Notadd\Administration\SystemInformation@handler              # 仪表盘模块模板，第一种方式，类方法渲染后直接返回 HTML 代码
    -                                                                          # 第二个模块
        identification: development                                            # 仪表盘模块标识
        title: 开发团队                                                         # 仪表盘模块标题
        template:                                                              # 仪表盘模块模板，第二种方式，Vue render 函数渲染
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
```

# 后台菜单

示例代码：

```yaml
menus:
    global:                                                                    # 菜单标识，全局菜单
        icon: settings                                                         # 菜单图标
        permission:                                                            # 权限定义
        path: '/'                                                              # 后台前端路由
        text: 全局                                                               # 菜单文本
        children:                                                               # 侧边栏菜单
            -                                                                  # 第一项侧边栏菜单
                icon: ios-cog                                                  # 菜单图标
                text: 全局设置                                                  # 菜单文本
            -                                                                  # 第二项侧边栏菜单
                children:                                                      # 子级菜单
                    -                                                          # 第一项子级菜单
                        path: /upload                                          # 后台前端路由
                        text: 上传设置                                          # 菜单文本
                icon: ios-paper                                                # 菜单图标
                text: 附件设置                                                  # 菜单文本

```

# 后台自定义页面

示例代码：

```yaml
pages:
    configurations:                                                            # 页面标识
        initialization:                                                        # 页面初始化配置
            name: 参数配置                                                      # 页面名称
            tabs: true                                                         # 页面是否包含多 Tabs
            target: global                                                     # 页面嵌入位置
        tabs:                                                                  # 页面 Tabs 定义
            configuration:                                                     # 页面 Tab 标识
                default: true                                                  # 是否默认 Tab
                show: true                                                     # 是否显示 Tab
                submit: api/setting/set                                        # Tab 表单提交地址
                title: 全局设置                                                 # Tab 标题
                fields:                                                        # Tab 表单定义
                    name:                                                      # 字段名称
                        default: ''                                            # 字段默认值
                        description: ''                                        # 字段描述
                        label: 网站名称                                         # 字段文本
                        key: site.name                                         # 字段名字
                        placeholder: 请输入网站名称                              # 字段占位文本
                        required: true                                         # 是否必填
                        type: input                                            # 字段类型
                        validates:                                             # 字段表单验证定义
                            -
                                message: 请输入网站名称
                                required: true
                                trigger: change
                                type: string
```

# 资源发布

示例代码：

```yaml
publishes:
    assets/admin: resources/mixes/administration/dist/assets/admin
#   statics路径  ：模块或插件内路径
```
