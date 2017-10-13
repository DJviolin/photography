'use strict';

/*
    https://babeljs.io/repl/

    Polyfill:
    https://github.com/github/fetch

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

var init = function (city) {
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
    return fetch(streams)
        .then(response => (response.ok ? response.json() : console.log('fetch(streams): Network response was not ok.')))
        .then((json) => {
            app.innerHTML += apiDisplay(
                json.name,
                json.description,
                json.pictures,
            );
            console.log(`${JSON.stringify(json, null, 4)}`);
        })
        .catch((error) => {
            app.innerHTML = "<h1>404</h1><h3>Az oldal nem létezik</3>";
            console.log('fetch(catch): Network response was not ok.')
        });
}

document.addEventListener('DOMContentLoaded', function () {
    return init(data.city);
});
