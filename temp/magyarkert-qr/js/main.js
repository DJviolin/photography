'use strict';

/*
    TODO (es2015, stage-2, Minify):
    https://babeljs.io/repl/

    TODO:
    - IE 11 error for temlate literals

    Polyfill:
    https://github.com/github/fetch

    URL LIST:
    http://magyarkert.com/qr/?c=jakabszallas
*/

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var city = getParameterByName('c');
var debug = getParameterByName('debug');
var data = {
    city: city,
    debug: debug,
};
//console.log(`city == ${data.city}`);

var init = function (city, debug) {
    const app = document.getElementById('app');
    var streams = 'data/' + city + '/data.json';
    function apiDisplay(name, description, pictures) {
        return `
            <article class="city">
                <p>${name}</p>
                <p>${description}</p>
                <p>${pictures}</p>
                <p>${pictures.map(item => `<img src="${item}" alt="" />`).join('')}</p>
            </article>
        `;
    }
    function qrCodeDisplay(url) {
        if (debug === "true") {
            return `
                <script type="text/javascript" src="//code.jquery.com/jquery-1.5.2.min.js" async></script>
                <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js" async></script>
                <div id="qrcodeCanvas"></div>
                <script type="text/javascript">
                    var data = {
                        size: 295, // 2.5cm at 300dpi
                        url: "http://magyarkert.com/qr/?c=${url}",
                    };
                    jQuery('#qrcodeCanvas').qrcode({
                        render: "canvas",
                        width: data.size,
                        height: data.size,
                        text: data.url,
                    });	
                </script>
            `;
        }
    }
    return fetch(streams)
        .then(response => (response.ok ? response.json() : console.log('fetch(streams): Network response was not ok.')))
        .then((json) => {
            app.innerHTML += apiDisplay(
                json.name,
                json.description,
                json.pictures,
            );
            //console.log(`${JSON.stringify(json, null, 4)}`);

            var div = document.createElement("div");
            document.body.innerHTML += qrCodeDisplay(json.url);
            //div.innerHTML += qrCodeDisplay(json.url);
            //document.body.appendChild(div);
        })
        .catch((error) => {
            app.innerHTML = "<h1>404</h1><h3>Az oldal nem létezik</3>";
            //console.log('fetch(catch): Network response was not ok.')
        });
}

document.addEventListener('DOMContentLoaded', function () {
    return init(data.city, data.debug);
});
