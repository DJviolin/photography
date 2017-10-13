'use strict';

/*
    URL LIST:
    http://magyarkert.com/qr/?city=jakabszallas
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
var data = {
    city: city,
};
console.log(`city == ${data.city}`);

var getData = function (city) {
    //var g = container;
    var container;
    var link = 'https://magyarkert.com/qr/data/' + city + '/data.json';
    var request = new XMLHttpRequest();
    request.open('GET', link, false); // false sets the async to false
    request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        // Success!
        //var data = JSON.parse(request.responseText);
        container = JSON.parse(request.responseText);
    } else {
        // We reached our target server, but it returned an error
    }
    };
    request.onerror = function () {
        // There was a connection error of some sort
    };
    request.send();
    return container;
}
//console.log(`json == ${JSON.stringify(getData(data.city), null, 4)}`);
console.log(`json == ${getData('jakabszallas')}`);








var init = function (city) {
    console.log("init executed!");

    const app = document.getElementById('app');
    app.innerHTML = 'app populated!';
}

document.addEventListener('DOMContentLoaded', function () {
    return init(data.city);
});
