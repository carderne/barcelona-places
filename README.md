# barcelona-places
A simple web map displaying some nice places to go (mostly food) in Barcelona, that we collect in a Google [sheet](https://docs.google.com/spreadsheets/d/14NOm-Eq-aikKuYET9HedWCwYmaAz630LvOnk8Zdg_Us/edit?usp=sharing).

The map imports the sheet using [Tabletop.js](https://github.com/jsoma/tabletop) and then uses [mapbox.js](https://www.mapbox.com/mapbox.js/api/v3.1.1/l-mapbox-geocoder/) (not MapBox GL) to geocode the location information in the sheet (name, address) to points on the map. Uses a map designed in [MapBox Studio](https://www.mapbox.com/mapbox-studio/) and a location marker for the user.

See the map here: [Barcelona Places](https://rdrn.me/barcelona-places/) 