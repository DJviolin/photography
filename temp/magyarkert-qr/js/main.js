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
//var data = {
data = {
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
    function scriptLoader(vendor) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.defer = true;
        script.onload = function () {
            console.log('The "' + vendor + '" script is loaded');
        }
        script.src = 'js/vendor/jquery.min.js';
        head.appendChild(script);
    }
    function qrCodeDisplay(url) {
        scriptLoader('js/vendor/jquery.min.js');
        scriptLoader('js/vendor/jquery.qrcode.min.js');

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.defer = true;
        script.onload = function () {
            console.log('The script is loaded');
        }
        script.text = "" +
            "console.log('Hello, World from qrData!');" +
            "var qrData = {" +
            "    size: 295, /*2.5cm at 300dpi*/" +
            "    url: \"http://magyarkert.com/qr/?c=" + url + "\"," +
            "};" +
            "jQuery('#qrcodeCanvas').qrcode({" +
            "    render: \"canvas\"," +
            "    width: qrData.size," +
            "    height: qrData.size," +
            "    text: qrData.url," +
            "});" +
        "";
        //head.appendChild(script);
        document.body.appendChild(script);
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

            //var div = document.createElement("div");
            //div.innerHTML += qrCodeDisplay(json.url);
            //document.body.appendChild(div);
            if (debug === "true") {
                qrCodeDisplay(json.url);
            }
        })
        .catch((error) => {
            app.innerHTML = "<h1>404</h1><h3>Az oldal nem létezik</3>";
            //console.log('fetch(catch): Network response was not ok.')
        });
}

document.addEventListener('DOMContentLoaded', function () {
    return init(data.city, data.debug);
});
