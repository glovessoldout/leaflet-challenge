let usgsurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
let overlayMaps = 0;

let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap]
  });
// https://www.usgs.gov/natural-hazards/earthquake-hazards/science/determining-depth-earthquake?qt-science_center_objects=0#qt-science_center_objects
//grades = [0,5,10,15,20,40,70,210,630];
colors = ['#1a9850','#66bd63','#a6d96a','#d9ef8b','#ffffbf','#fee08b','#fdae61','#f46d43','#d73027','000000'];
//getColor(grades[i] + 1)
function getColor(d) {
    return  d < 0   ? '#1a9850' :
            d < 5  ? '#66bd63' :
            d < 10  ? '#a6d96a' :
            d < 15  ? '#d9ef8b' :
            d < 20  ? '#ffffbf' :
            d < 40  ? '#fee08b' :
            d < 70  ? '#fdae61' :
            d < 210  ? '#f46d43' :
            d < 630  ? '#d73027' :
                    '000000' ;
}
var legend = L.control({position: 'bottomright'});
legend.onAdd = function(myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,5,10,15,20,40,70,210,630];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

    return div;
};
legend.addTo(myMap);
//doing a for loop on each geojson entry works best
d3.json(usgsurl, function(data){
        (data.features);
        //console.log(data.features[0]);
        //console.log(data.features[0].geometry.coordinates);
        let count = data.metadata.count;
        for(i=0;i<count;i++){
            L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
                color: getColor(data.features[i].geometry.coordinates[2]),
                fillColor: getColor(data.features[i].geometry.coordinates[2]),
                fillOpacity: 0.3,
                radius: 50000*(data.features[i].properties.mag)
              }).bindPopup("<h3>" + data.features[i].properties.place +
              "</h3><hr><p>" + new Date(data.features[i].properties.time) + "<h3>Magnitude: " + data.features[i].properties.mag +
              "<h3>Depth: " + data.features[i].geometry.coordinates[2] + "</p>").addTo(myMap);
        }
        });

    

