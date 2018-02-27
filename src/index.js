/**
 * @file fis3-postpackager-sw-register
 * @author chenqiushi(qiushidev@gmail.com)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const etpl = require('etpl');
const babel = require('babel-core');
const PROJECT_PATH = fis.project.getProjectPath();

/**
 * 对于小于 100 的数字向左补全0
 *
 * @param  {number} value 数字
 * @return {string}       补全后的字符串
 */
function padding(value) {
    return value < 10 ? `0${value}` : value;
}

/**
 * 获取时间戳版本号
 *
 * @return {string} 版本号
 */
function getVersion() {
    let d = new Date();

    return ''
        + d.getFullYear()
        + padding(d.getMonth() + 1)
        + padding(d.getDate())
        + padding(d.getHours())
        + padding(d.getMinutes())
        + padding(d.getSeconds());
}

/**
 * babel 编译
 *
 * @param {string} source 源代码
 * @return {string} 编译后的代码
 */
function babelCompiler(source) {
    return babel.transform(source, {
        comments: false,
        minified: true,
        presets: [
            [
                'env',
                {
                    targets: {
                        node: 3
                    },
                    modules: false
                }
            ]
        ]
    }).code;
}

module.exports = function (ret, pack, settings, opt) {

    let swRegisterFilePath = settings.filePath ? path.join(PROJECT_PATH, settings.filePath) : '';
    if (!fs.existsSync(swRegisterFilePath)) {
        swRegisterFilePath = path.resolve(__dirname, '../templates', 'sw-register.js');
    }

    let fileName = path.basename(swRegisterFilePath).replace(/\.js/g, ext => `_${Date.now()}${ext}`);
    let version = settings.version || getVersion();
    let publicPath = (settings.publicPath || '') + '/';
    let swPrefix = settings.swPrefix || '';
    let fallbackFilePath = settings.fallbackFilePath || '';

    // 编译默认模板并增加版本号
    let con = fs.readFileSync(swRegisterFilePath, 'utf-8');
    con = babelCompiler(con).replace(/(['"])([^\s;,()]+?\.js[^'"]*)\1/g, item => {
        let swFilePath = RegExp.$2;

        // 准备增加 version 参数
        if (/\.js/g.test(item)) {
            item = item.replace(/\?/g, '&');
        }

        if (swPrefix) {
            item = item
                .replace(swFilePath, swPrefix + '/' + swFilePath)
                .replace(/\/{1,}/g, '/');
        }

        return item.replace(/\.js/g, ext => `${ext}?v=${version}`);
    });

    // 导出 sw-register.js 文件
    let newSwRegisterFile = fis.file(PROJECT_PATH, 'src/' + fileName);
    newSwRegisterFile.setContent(con);
    ret.pkg[newSwRegisterFile.subpath] = newSwRegisterFile;

    // 在入口文件插入 sw-register entry 脚本
    let files = ret.src;
    Object.keys(files).forEach(function (subpath) {
        // 只处理 entry 文件
        if (subpath.indexOf(settings.entry) !== -1) {
            let file = files[subpath];

            if (!file.isHtmlLike) {
                return;
            }

            let content = file.getContent();

            let swRegisterEntryFilePath = path.resolve(__dirname, '../templates', 'sw-register-entry.js.tpl');
            let swRegisterEntryFileTpl = fs.readFileSync(swRegisterEntryFilePath, 'utf-8');

            let swRegisterEntryFileContent = etpl.compile(swRegisterEntryFileTpl)({
                publicPath,
                fileName,
                fallbackFilePath,
                swPrefix: swPrefix || '/'
            });

            content = content.replace(/<\/body>/, `${swRegisterEntryFileContent}</body>`);
            file.setContent(content);
        }
    });
};

