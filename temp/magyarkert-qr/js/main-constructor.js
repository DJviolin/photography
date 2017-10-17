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
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
		const app = document.getElementById(id);
		app.innerHTML += "Hello, World from deviceready constructor!";

        console.log('Received Event: ' + id);
    }
};

app.initialize();
