'use strict';

/*
	URL LIST:
    http://magyarkert.com/qr/?c=jakabszallas&debug=true

	TODO (es2015, stage-2, Minify):
    https://babeljs.io/repl/
    
    ResponsiveVoice.js:
    https://responsivevoice.org/api/
    https://responsivevoice.org/text-to-speech-languages/magyar-szoveget-beszedde/
    https://github.com/ResponsiveVoice/ResponsiveVoice
    https://responsivevoice.org/license/
    https://codepen.io/omgwtfbrblolttyl/pen/qZXYVJ

	Polyfill:
    https://github.com/github/fetch
    https://github.com/taylorhakes/promise-polyfill

    Dynamic script loading:
    https://youtu.be/i_qE1iAmjFg?t=28m59s
	https://plnkr.co/edit/b9O19f?p=preview
	https://github.com/newbreedofgeek/dynamic-js-script-loader
*/

// Avoid `console` errors in browsers that lack a console.
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

var app = {
    // Application Constructor
    initialize: function () {
        var _this = this;

        document.addEventListener('DOMContentLoaded', _this.onDeviceReady.bind(_this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function () {
        var _this = this;

        if (window.fetch) {
            return _this.receivedEvent('deviceready');
        } else {
            _this.scriptLoader('//rawcdn.githack.com/taylorhakes/promise-polyfill/e20aa9031b0352d695fc0428cb8bc0145ffc5519/promise.min.js', function () {
                _this.scriptLoader('//rawcdn.githack.com/github/fetch/v2.0.3/fetch.js', function () {
                    //console.log("window.fetch === " + window.fetch); // undefined
                    return _this.receivedEvent('deviceready');
                });
            });
        }
    },

    // Business logic starts here
    getParameterByName: function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    queryString: function () {
        var _this = this;
        var city = _this.getParameterByName('c');
        var debug = _this.getParameterByName('debug');
        var data = {
            city: city,
            debug: debug,
        };
        return data;
    },

    /*
        // Dynamic script loader with integrated callback hell

        // Usage:
        scriptLoader('a1.js', function () {
            scriptLoader('a2.js', function () {
                console.log('Hello');
            });
        });
    */
    scriptLoader: function (filename, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = filename;
        script.defer = true;
        if (typeof callback === 'function') {
            script.onload = callback;
        }
        return head.appendChild(script);
    },

    /*apiDisplay: function (name, description, pictures) {
		return "" +
			"<article class=\"city\">" +
				"<p>" + name + "</p>" +
				"<p>" + description + "</p>" +
                "<p>" + pictures.map(function (item) {
                            return "<img src=\"" + item + "\" alt=\"\" />";
                        }).join('') + "</p>" +
			"</article>" +
		"";
    },*/
    apiDisplay: function (name, description, pictures) {
		return `
			<article class="city">
				<p>${name}</p>
				<p>${description}</p>
				<p>${pictures.map(item => `<img src="${item}" alt="" />`).join('')}</p>
			</article>
		`;
    },

    qrCodeDisplay: function (url, size) {
        var _this = this;

		return _this.scriptLoader('js/vendor/jquery.min.js', function () {
			_this.scriptLoader('js/vendor/jquery.qrcode.min.js', function () {
				//console.log('scriptLoader started!');
				var script = document.createElement('script');
				script.type = 'text/javascript';
				//script.onload = function () {
				//	console.log('The script is loaded');
				//}
				script.text = "" +
					//"console.log('qrData started!');" +
					"var qrData = {" +
					    "size: " + size + "," +
					    "url: \"http://magyarkert.com/qr/?c=" + url + "\"," +
					"};" +
					"jQuery('#qrcodeCanvas').qrcode({" +
					    "render: \"canvas\"," +
					    "width: qrData.size," +
					    "height: qrData.size," +
					    "text: qrData.url," +
					"});" +
				"";
				script.defer = true;
				var head = document.getElementsByTagName('head')[0];
				head.appendChild(script);
				//document.body.appendChild(script);
			});
		});
    },
    
    responsiveVoice: function (text) {
        var _this = this;
        const voice = document.getElementById("voice");

        //voice.innerHTML += `
        //    <input onclick='responsiveVoice.speak("${text}", "Hungarian Male", {volume: 1});' type='button' value='🔊 Play' />
        //`;

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
        	console.log('responsiveVoice loaded!');
        }
        script.text = "" +
            "responsiveVoice.speak(\"" + text + "\", \"Hungarian Male\", {volume: 1});" +
        "";
        script.defer = true;
        voice.appendChild(script);
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var _this = this;

        const app = document.getElementById(id);
        var streams = 'data/' + _this.queryString().city + '/data.json';

        return fetch(streams)
            .then(response => (response.ok ? response.json() : console.log('fetch(streams): Network response was not ok.')))
            .then((json) => {
                app.innerHTML += _this.apiDisplay(
                    json.name,
                    json.description,
                    json.pictures,
                );
                _this.responsiveVoice(json.voice);
                //console.log(`${JSON.stringify(json, null, 4)}`);
                if (_this.queryString().debug === "true") {
                    _this.qrCodeDisplay(json.url, 295); // 2.5cm at 300dpi
                    console.log('Received Event: ' + id);
                }
            })
            .catch((error) => {
                app.innerHTML = "<h1>404</h1><h3>Az oldal nem létezik</3>";
                //console.log('fetch(catch): Network response was not ok.')
            });
    }
};

app.initialize();
