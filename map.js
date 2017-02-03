define([
  "esri/map",
  "esri/layers/VectorTileLayer",
  './popup.js'
], function (Map, VectorTileLayer, popup) {
  var map = new Map("map", {
    smartNavigation: false,
    infoWindow: popup
  });

  var topographic = new VectorTileLayer("https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer");

  map.addLayer(topographic);

  return map;
});
