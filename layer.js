define([
  "esri/layers/FeatureLayer",
  "esri/symbols/PictureMarkerSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/dijit/PopupTemplate"
], function (FeatureLayer, PictureMarkerSymbol, SimpleRenderer, PopupTemplate) {
  var template = new PopupTemplate({
    title: '{name} - {year}',
    description: '<p>{description}</p><address>{street}<br>{city}, {state}, {zip}</address>  <p><a href=\"{url}\">Website</a></p>'
  });

  var marker = new PictureMarkerSymbol({
    "url": window.location.href + "marker-w-shadow.png",
    "width": 13.5,
    "height": 25,
    "type": "esriPMS",
    "yoffset": 13.5
  });

  var renderer = new SimpleRenderer(marker);

  var restaurants = new FeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Oldest_Surviving_Los_Angeles_Restaurants/FeatureServer/0", {
    mode: FeatureLayer.MODE_SNAPSHOT,
    outFields: ["*"],
    infoTemplate: template
  });

  restaurants.setRenderer(renderer);

  return restaurants;
});
