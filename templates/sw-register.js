/**
 * @file serviceworker register
 * @author fis3-postpackager-sw-register
 */

/* global navigator, document */

navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js').then((reg) => {
    reg.onupdatefound = () => {
        let installingWorker = reg.installing;
        installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
                case 'installed':
                    if (navigator.serviceWorker.controller) {
                        let themeColor = document.querySelector('meta[name=theme-color]');
                        let dom = document.createElement('div');

                        themeColor && (themeColor.content = '#000');

                        /* eslint-disable max-len */
                        dom.innerHTML = `
                            <style>
                                .app-refresh{background:#000;height:0;line-height:52px;overflow:hidden;position:fixed;top:0;left:0;right:0;z-index:10001;padding:0 18px;transition:all .3s ease;-webkit-transition:all .3s ease;-moz-transition:all .3s ease;-o-transition:all .3s ease;}
                                .app-refresh-wrap{display:flex;color:#fff;font-size:15px;}
                                .app-refresh-wrap label{flex:1;}
                                .app-refresh-show{height:52px;}
                            </style>
                            <div class="app-refresh" id="app-refresh">
                                <div class="app-refresh-wrap" onclick="location.reload()">
                                    <label>已更新最新版本</label>
                                    <span>点击刷新</span>
                                </div>
                            </div>
                        `;
                        /* eslint-enable max-len */

                        document.body.appendChild(dom);
                        setTimeout(() => document.getElementById('app-refresh').className += ' app-refresh-show');
                    }
                    break;
            }
        };
    };
});
