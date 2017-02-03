define([
  "esri/map",
  "esri/layers/VectorTileLayer",
  './popup.js'
], function (Map, VectorTileLayer, popup) {
  var map = new Map("map", {
    smartNavigation: false,
    infoWindow: popup
  });

  var topographic = new VectorTileLayer("https://www.arcgis.com/sharing/rest/content/items/c50de463235e4161b206d000587af18b/resources/styles/root.json");

  map.addLayer(topographic);

  return map;
});
