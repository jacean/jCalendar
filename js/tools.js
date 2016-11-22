;;
/**
 * @root:
 */
(function (root, $, undefined) {
    //this是document




})(this, jQuery);

;;

(function($){

    $.extend({
        log: function (message) {
            var now = new Date(),
                y = now.getFullYear(),
                m = now.getMonth() + 1, //！JavaScript中月分是从0开始的
                d = now.getDate(),
                h = now.getHours(),
                min = now.getMinutes(),
                s = now.getSeconds(),
                time = y + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + s;
            console.log(time + ' My App: ' + message);
        },
        date2ISO:function(date){
            var str=date.toISOString();
            return str.substring(-1,4);
        },
        parseURL:function (url) {  
            var a =  document.createElement('a');  
            a.href = url;  
            return {  
                source: url,  
                protocol: a.protocol.replace(':',''),  
                host: a.hostname,  
                port: a.port,  
                query: a.search,  
                params: (function(){  
                    var ret = {},  
                        seg = a.search.replace(/^\?/,'').split('&'),  
                        len = seg.length, i = 0, s;  
                    for (;i<len;i++) {  
                        if (!seg[i]) { continue; }  
                        s = seg[i].split('=');  
                        ret[s[0]] = s[1];  
                    }  
                    return ret;  
                })(),  
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],  
                hash: a.hash.replace('#',''),  
                path: a.pathname.replace(/^([^\/])/,'/$1'),  
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  
                segments: a.pathname.replace(/^\//,'').split('/')  
                };  
            }    

    });

}($));


