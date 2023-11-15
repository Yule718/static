$(function (){
    let json = [
        {
            "img_url":"/usr/uploads/2023/10/1303641613.jpg",
            "url_config":"https://002519.hk"
        }
        ];
    storage = {
        get:function (k){
            return window.localStorage ? localStorage.getItem(k) : null;
        },
        set:function (k,v){
            return window.localStorage ? localStorage.setItem(k ,v) : null;
        },
        incr: function (k){
            var v = this.get(k);
            return this.set(k, (v?parseInt(v):0)+1 )
        },
        del: function (k){
            return window.localStorage && localStorage.removeItem(k)
        }
    }
    var key=0;
    let storagekey ="last-pop-ad",
        curDate = formatDate(new Date()),
        adDate = storage.get(storagekey) || formatDate(0);
    if(window.localStorage){        
        if (curDate === adDate){
            return;
        }        
    }

    function formatDate(date) {
        return (new Date(date)).toISOString().slice(0,10).replaceAll('-','')
    }
    var ab2b64 = function (t) {
        return new Promise(function (e) {
            const n = new Blob([t]);
            const r = new FileReader();
            r.onload = function (t) {
                const n = t.target.result;
                const r = n.substring(n.indexOf(",") + 1);
                e(r);
            };
            r.readAsDataURL(n);
        });
    };
    function jmImg(selector , warpEle){
        var ele = $(selector), url = ele.data('src')
        $.ajax(url, { xhrFields: {responseType: 'arraybuffer'} }).then((res) => {
                ab2b64(res).then((base64str) => {
                    let ary = url.split('.'),decryptStr = base64str;
                    ele.attr('src','data:image/'+ary.pop()+';base64,'+decryptStr);
                    $(warpEle).show();
                });
            })
    }
    function render(data){
        let html = `<div class="adspop" style="display:none">
        <div class="popup-container">
            <div class="popup-content">
                <div class="popup-close"><img src="/usr/themes/Mirages/static/adpop/ads-close.png"></div>
                <div class="popup-picture">
                    <img data-src="${data.img_url}" data-uri="${data.url_config}">
                </div>
            </div>
        </div>
    </div>`;
        $(body).append(html);
        jmImg('.adspop .popup-picture>img','.adspop');
    }
    
    if (json.length === 0){
        return;
    }
    let tmp = [];
    for(var i = 0; i < json.length; i++) {
        if (json[i].position == 2002){ //mac
            if (navigator.userAgentData){
                if (navigator.userAgentData.platform == 'macOS'){
                    tmp.push(json[i]);
                }
            }else if(/Mac\s+OS/i.test(navigator.userAgent)){
                tmp.push(json[i]);
            }
        }else if (json[i].position == 2003){ // win
            if (navigator.userAgentData){
                if (navigator.userAgentData.platform == 'Windows'){
                    tmp.push(json[i]);
                }
            }else if(/windows/i.test(navigator.userAgent)){
                tmp.push(json[i]);
            }
        }else{
            tmp.push(json[i]);
        }
    }
    json = tmp;
    render(json[key]);
    $(body).delegate( '.adspop .popup-close','click' ,function (){
        $('.adspop').remove();
        if (++key < json.length){
            render(json[key]);
        }
        storage.set(storagekey,curDate);
    })
    $(body).delegate( '.adspop .popup-picture','click' ,function (){
        let uri = $(this).find('img').data('uri');
        if (typeof(uri)!=="string" || uri.length < 1){
            return ;
        }
        window.open(uri);
    });
})