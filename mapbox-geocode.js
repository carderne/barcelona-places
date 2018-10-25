var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/14NOm-Eq-aikKuYET9HedWCwYmaAz630LvOnk8Zdg_Us/edit?usp=sharing';
function init() {
    Tabletop.init( { key: publicSpreadsheetUrl,
                     callback: showInfo,
                     simpleSheet: true } )
}

function showInfo(data, tabletop) {
    for(var row = 0; row < data.length; row++) {
        geocoder.query({
            query: data[row].Address + ", Barcelona",
            country: 'es',
            proximity: L.latLng(41.4, 2.16)
        }, addMarker(data[row]));
    }
}
window.addEventListener('DOMContentLoaded', init)

function addMarker(metadata) {
    return function (err, data) {
            lat = data.latlng[0];
            lng = data.latlng[1];
            marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup("<h3>"+metadata.Name+"</h3><p>"+metadata.Address+"</p><p>"+metadata.Notes+"</p>");

            // AwesomeMarkers is used to create fancier icons
            var icon = L.AwesomeMarkers.icon({
                icon: getIcon(metadata.Category),
                iconColor: "white",
                markerColor: getColor(metadata.Category),
                prefix: "fa",
                extraClasses: "fa-rotate-0"
            });
            marker.setIcon(icon);

    }
}

L.mapbox.accessToken = 'pk.eyJ1IjoiY2FyZGVybmUiLCJhIjoiY2puZnE3YXkxMDBrZTNrczI3cXN2OXQzNiJ9.2BDgu40zHwh3CAfHs6reAQ';

var map = L.map("map").setView([41.3825, 2.17694], 13);

// This is the standard OSM map
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

OpenStreetMap_Mapnik.addTo(map);

var geocoder = L.mapbox.geocoder("mapbox.places");

//map.locate({setView: true, maxZoom: 15});

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.circleMarker(e.latlng, {
        radius: 10,
        color: 'white',
        fillColor: 'blue',
        fillOpacity: 1
    }).addTo(map)
        //.bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

L.easyButton('fa-location-arrow', function(btn, map){
    map.locate({setView: true, maxZoom: 15});
}).addTo( map );


// Returns different colors depending on the string passed
// Used for the points layer
function getColor(type) {
    console.log(type)
    switch (type) {
        case "Bakery":
            return "blue";
        case "Coffee shop":
            return "green";
        case "Restaurant":
            return "cadetblue";
        case "Store":
            return "orange"; // orange-gold
        case "Supermarket":
            return "red"; // red
        default:
            return "purple"; // pink

    }
}

// Returns different icon names depending on the string passed
// Used for the points layer
function getIcon(type) {
    console.log(type)
    switch (type) {
        case "Bakery":
            return "birthday-cake";
        case "Coffee shop":
            return "coffee";
        case "Restaurant":
            return "cutlery";
        case "Store":
            return "shopping-basket"; // orange-gold
        case "Supermarket":
            return "shopping-cart"; // red
        default:
            return "info"; // pink

    }
}