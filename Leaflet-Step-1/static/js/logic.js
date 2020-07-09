// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// If map is already initialized:
var container = L.DomUtil.get('map'); if(container != null){ container._leaflet_id = null; }
// Create myMap w/out overlays
var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
  });

// TileLayer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1IjoibWFuc2ltYWppdGhpYSIsImEiOiJja2J2Z2FhZWYwNXJ6MzFvYjd6bWZ5dGUwIn0.qMbXMOKsox-8NIfFraGrIg"
  }).addTo(myMap);

// Perform GET request to the query URL
d3.json(queryUrl, function(data){
    console.log(data);

    var features = data.features

    // For loop to get each magnitude, place, time, coordinate

    for (var i=0; i<features.length; i++){
        var feature = features[i];
        var magnitude = feature.properties.mag;
        var place = feature.properties.place;
        var earthquakeTime = Date(feature.properties.time);
        var coordinates = feature.geometry.coordinates
        
        if (magnitude > 5) {
            color = "red";
        }
        else if (magnitude > 4){
            color = "orange"
        }
        else if (magnitude > 3){
            color = "gold"
        }
        else if (magnitude > 2){
            color = "yellow"
        }
        else if (magnitude > 1){
            color = "yellowgreen"
        }
        else {
            color = "green"
        }

        L.circle([coordinates[1], coordinates[0]],{
            color: color,
            fillcolor: color,
            fillOpacity: 0.75,
            radius: magnitude * 1000
        }).bindPopup("<h3>" + place +
        "</h3><hr><p>" + earthquakeTime + "</p><hr><p> magnitude: " + magnitude + "</p>").addTo(myMap);
    }
    console.log(earthquakeTime)

    // Adding legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
        var div = L.DomUtil.create ('div', 'info legend'),
        grades = ['5+', '4-5', '3-4', '2-3', '1-2', '0-1'],
        colors = ['red', 'orange', 'gold', 'yellow', 'yellowgreen', 'green'],
        labels = [];

        var legendInfo = "<h2 style=\"color:red\">Earthquake Magnitude</h2>" +
        "<div class=\"labels\">" +
        "</div>";

        div.innerHTML = legendInfo;
        return div;
    }
    legend.addTo(myMap);
})