<script>
    window.onload = function () {
        var firstScript = document.getElementsByTagName('script')[0];

        // 引入降级标志脚本
        var fbScript = document.createElement('script');
        fbScript.type = 'text/javascript';
        fbScript.async = true;
        fbScript.src = '${fallbackFilePath}?v=' + Date.now();
        firstScript.parentNode.insertBefore(fbScript, firstScript);

        fbScript.onload = function () {
            // 降级标志位
            if (window.SW_FALLBACK) {
                navigator.serviceWorker && navigator.serviceWorker.getRegistration('${swPrefix}').then(function(reg) {
                    reg && reg.unregister().then(function(boolean) {
                        if (boolean) {
                            console.log('sw unregistered successfully')
                        }
                    });
                });
                return;
            }
            importSwRegister();
        }

        fbScript.onerror = function () {
            importSwRegister();
        }

        function importSwRegister() {
            // 引入 sw-register.js
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = '${publicPath}${fileName}?v=' + Date.now();
            firstScript.parentNode.insertBefore(script, firstScript);
        }
    };
</script>
