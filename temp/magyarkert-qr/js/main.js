'use strict';

/*
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

var model = getParameterByName('c');

var data = {
    city: c,
};

console.log(`city == ${data.city}`);
