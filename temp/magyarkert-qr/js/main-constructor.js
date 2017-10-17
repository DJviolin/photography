'use strict';

/*
	TODO (es2015, stage-2, Minify):
	https://babeljs.io/repl/

	TODO:
	- IE 11 error for temlate literals

	Polyfill:
	https://github.com/github/fetch

	URL LIST:
	http://magyarkert.com/qr/?c=jakabszallas&debug=true

	Dynamic script loading:
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
        document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
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
        head.appendChild(script);
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
		const app = document.getElementById(id);
        app.innerHTML += "Hello, World from deviceready constructor!";
        
        var city = this.getParameterByName('c');
        var debug = this.getParameterByName('debug');
        var data = {
            city: city,
            debug: debug,
        };
        console.log(`data.city === ${data.city}`);

        console.log('Received Event: ' + id);
    }
};

app.initialize();
