# 开发环境

Notadd 的主体开发环境或模块以及插件的开发环境，均以仓库 ```https://github.com/notadd/next``` 为主或以此为蓝本。

## 包依赖关系

开发环境基于 ```Yarn``` 的 ```Workspace``` 的功能为基础，提供了对应所需的依赖关系的映射，所以开发时，必需基于 ```Yarn``` 工具链，而非 ```NPM``` 工具链。

## 包发布

使用工具 Lerna 对包的版本及发布进行管理，[官方文档参考](https://lernajs.io/)。

## 命令行

- ```yarn dev```：运行开发、调试环境
- ```yarn build```：运行包编译
- ```yarn run publish```：包批量发布
