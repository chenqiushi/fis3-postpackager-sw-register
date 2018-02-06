<script>
    window.onload = function () {
        // 降级标志位
        if (window.swFallback) {
            navigator.serviceWorker && navigator.serviceWorker.getRegistration('/m/').then(function(reg) {
                reg.unregister().then(function(boolean) {
                    if (boolean) {
                        console.log('sw unregistered successfully')
                    }
                });
            });
            return;
        }

        var script = document.createElement('script');
        var firstScript = document.getElementsByTagName('script')[0];
        script.type = 'text/javascript';
        script.async = true;
        script.src = '${publicPath}${fileName}?v=' + Date.now();
        firstScript.parentNode.insertBefore(script, firstScript);
    };
</script>