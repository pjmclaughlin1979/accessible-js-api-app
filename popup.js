define([
  "esri/dijit/Popup"
], function (Popup) {
  var popup = new Popup({
    fillSymbol: false,
    highlight: false,
    lineSymbol: false,
    markerSymbol: false,
    pagingControls: false,
    pagingInfo: false,
    visibleWhenEmpty: false,
    titleInBody: true
  }, dojo.create("div"));

  return popup;
});