/*
* Script to import a spreadsheet from Google Sheets and use MapBox Geocoding to display the elements on a simple map
* Code lives on GitHub: https://github.com/carderne/barcelona-places
* (c) Chris Arderne
*/

// Set up map and import my basemap from MapBox Studio
L.mapbox.accessToken = 'pk.eyJ1IjoiY2FyZGVybmUiLCJhIjoiY2puZnE3YXkxMDBrZTNrczI3cXN2OXQzNiJ9.2BDgu40zHwh3CAfHs6reAQ';
var map = L.mapbox.map('map').setView([41.40, 2.17], 14);

// Add the style to your map as image tiles
L.mapbox.styleLayer('mapbox://styles/carderne/cjnoj4ubt0vxq2rn2lbi3aos2', {
	attribution: '&copy; <a href="https://github.com/carderne/barcelona-places">Chris Arderne</a>'
}).addTo(map);

// Geocoder using mapbox.js (not MapBox GL)
var geocoder = L.mapbox.geocoder("mapbox.places");



// load the spreadsheet using Tabletop.js and once loaded, call the function to do the geocoding
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/14NOm-Eq-aikKuYET9HedWCwYmaAz630LvOnk8Zdg_Us/edit?usp=sharing';
function init() {
    Tabletop.init( { key: publicSpreadsheetUrl,
                     callback: geocodeData,
                     simpleSheet: true } );
}
window.addEventListener('DOMContentLoaded', init);

// iterate through each item in the spreadsheet and attempt to geocode it, with addMarker as the callback
function geocodeData(data, tabletop) {
    for(var row = 0; row < data.length; row++) {
        geocoder.query({
            query: data[row].Name + ", " + data[row].Address + ", Barcelona",
            country: 'es',
            proximity: L.latLng(41.4, 2.16),
        }, addMarker(data[row]));
    }
}

// if geocode is successfull, add a marker for the point
function addMarker(metadata) {
    return function (err, data) {
    	if (data.latlng) {
	        var marker = L.marker(data.latlng).addTo(map);
	        marker.bindPopup("<h3>"+metadata.Name+"</h3><p>"+metadata.Address+"</p><p>"+metadata.Notes+"</p>");

	        // AwesomeMarkers is used to create fancier icons
	        var icon = L.AwesomeMarkers.icon({
	            icon: getIcon(metadata.Category),
	            iconColor: "white",
	            markerColor: getColor(metadata.Category),
	            prefix: "fa",
	        });
	        marker.setIcon(icon);
	    } else {
	    	// print out the name of unsuccessful geocodes so we can see which were excluded
	    	console.log(metadata.Name);
	    }
    };
}

// Returns different colors depending on the string passed
function getColor(type) {
    switch (type) {
        case "Bakery": return "blue";
        case "Coffee shop": return "green";
        case "Restaurant": return "cadetblue";
        case "Store": return "orange"; // orange-gold
        case "Supermarket": return "red"; // red
        default: return "purple"; // pink
    }
}

// Returns different icon names depending on the string passed
function getIcon(type) {
    switch (type) {
        case "Bakery": return "birthday-cake";
        case "Coffee shop": return "coffee";
        case "Restaurant": return "cutlery";
        case "Store": return "shopping-basket"; // orange-gold
        case "Supermarket": return "shopping-cart"; // red
        default: return "info"; // pink
    }
}

var locationCircle;
var locationCircleMarker;

// Add a blue marker and accuracy ring to the user's location
function onLocationFound(e) {
	if (locationCircle != null && locationCircleMarker != null) {
		locationCircle.remove();
		locationCircleMarker.remove();
	}

    var radius = e.accuracy / 2;

    locationCircleMarker = L.circleMarker(e.latlng, {
        radius: 10,
        color: 'white',
        fillColor: 'blue',
        fillOpacity: 1
    }).addTo(map);
        //.bindPopup("You are within " + radius + " meters from this point").openPopup();

    locationCircle = L.circle(e.latlng, radius).addTo(map);
}

// button to locate user
L.easyButton('fa-location-arrow', function(btn, map) {
    map.locate({setView: true, maxZoom: 15});
}).addTo( map );

map.on('locationfound', onLocationFound);

L.easyButton('fa-user', function (btn, map) {
	window.open("https://rdrn.me/");
}).addTo(map);