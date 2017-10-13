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

var city = getParameterByName('city');

var data = {
    city: city,
};

console.log(`city == ${data.city}`);



function getJSON(city) {
    var link = 'http://magyarkert.com/qr/data/' + city + '/data.json';

    var request = new XMLHttpRequest();
    request.open('GET', link, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
      } else {
        // We reached our target server, but it returned an error
    
      }
    };
    request.onerror = function() {
      // There was a connection error of some sort
    };
    request.send();
}

console.log(`json == ${getJSON('jakabszallas')}`);
