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

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    getParameterByName: function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
