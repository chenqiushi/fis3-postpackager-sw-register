 # fis3-postpackager-sw-register

 为 fis3 构建的项目解决 service worker 文件注册和更新的问题

 功能同 Webpack 插件 [sw-register-webpack-plugin](https://github.com/lavas-project/sw-register-webpack-plugin) 基本一致。

 更多相关背景可参考 Lavas 官网文档：[背景](https://lavas.baidu.com/guide/v2/webpack/sw-register-webpack-plugin#%E8%83%8C%E6%99%AF)

## Usage

### 安装

```bash
npm install fis3-postpackager-sw-register --save-dev
```

### fis3 配置

```js

fis.match('::package', {
    postpackager : fis.plugin('sw-register', {
        entry: '/src/common/index.html',
        // ...
    })
});

```

## Options 参数

## entry

```js
{
    entry: '/src/common/index.html'
}
```
注入 sw-register 脚本的入口文件，通常为 html 形式，必填项

### version

`version` 为 service-worker 注册提供的版本号，默认值: 当前时间的时间版本字符串

```js
// 编译构建后的 sw-register.js 代码
navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js?v=20180130153156').then(() => {
    // ...
});
```

### filePath

```js
{
    filePath: '/src/sw-register.js'
}
```
插件默认使用内置的 service worker 注册文件 sw-register.js，可通过此配置项进行自定义

### publicPath

配置 sw-register.js 的引用路径。插件默认将 sw-register.js 导出在 /src 目录，fis3 项目的配置可能将 /src 目录的 js 文件部署到特定路径，可通过此选项进行配置，默认值 '/'

### swPrefix

```js
// 产出的 sw-register 文件
navigator.serviceWorker && navigator.serviceWorker.register('${swPrefix}/service-worker.js').then(() => {
    // ...
});
```

### fallbackFilePath

可选，降级标志文件路径。插件将在入口文件以 `<script>` 形式插入，默认标志名称为 `window.SW_FALLBACK`，若改值为 `true`，则 sw-register.js 不会引入执行，注册的 service worker 会被 unregister
