define([
  "esri/map",
  "esri/layers/VectorTileLayer",
  './popup.js'
], function (Map, VectorTileLayer, popup) {
  var map = new Map("map", {
    smartNavigation: false,
    infoWindow: popup
  });

  var topographic = new VectorTileLayer("https://www.arcgis.com/sharing/rest/content/items/be44936bcdd24db588a1ae5076e36f34/resources/styles/root.json");

  map.addLayer(topographic);

  return map;
});