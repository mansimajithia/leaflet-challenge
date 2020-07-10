// Stor out API endpoint inside queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Create myMap w/out overlays
var myMap = L.map("map", {
    center: [
        37.09, -95.71       
    ],
    zoom: 5
});

// Tile Layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Perform GET Request to the queryURL
d3.json(queryURL, function (data) {
    console.log(data);

    var features = data.features

    // For loop to get each magnitude, place, time, coordinate

    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var magnitude = feature.properties.mag;
        var place = feature.properties.place;
        var earthquakeTime = Date(feature.properties.time);
        var coordinates = feature.geometry.coordinates;

        var color;
        if (magnitude > 5) {
            color = "red";
        }
        else if (magnitude > 4) {
            color = "orange"
        }
        else if (magnitude > 3) {
            color = "gold"
        }
        else if (magnitude > 2) {
            color = "yellow"
        }
        else if (magnitude > 1) {
            color = "yellowgreen"
        }
        else {
            color = "green"
        }
        function getColor(d) {
            return d > 5 ? '#EA2C2C' :
                   d > 4 ? '#EA822C' :
                   d > 3 ? '#EE9C00' :
                   d > 2 ? '#D4EE00' :
                   d > 1 ? '#98EE00':
                            '#CCFF33';
        }
        L.circle([coordinates[1], coordinates[0]], {
            color: color,
            fillcolor: color,
            fillOpacity: 0.75,
            radius: magnitude * 1000
        }).bindPopup("<h3>" + place +
            "</h3><hr><p>" + earthquakeTime + "</p><hr><p> magnitude: " + magnitude + "</p>").addTo(myMap);
    }
    console.log(earthquakeTime)

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);
})