define([
  'esri/geometry/Extent',
], function (Extent) {
  // utility  to turn a point into an extend we can use
  return function pointToExtent (map, point, toleranceInPixel) {
    var pixelWidth = map.extent.getWidth() / map.width;
    var toleranceInMapCoords = toleranceInPixel * pixelWidth;

    return new Extent({
      xmin: point.x - toleranceInMapCoords,
      ymin: point.y - toleranceInMapCoords,
      xmax: point.x + toleranceInMapCoords,
      ymax: point.y + toleranceInMapCoords,
      spatialReference: {
        wkid: map.spatialReference
      }
    });
  }
})