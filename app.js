require([
  './map.js', './layer.js', './search.js', './popup.js', './point-to-extent.js',
  'esri/tasks/query', 'esri/geometry/geometryEngine', 'esri/layers/FeatureLayer',
  'dojo/text!./list-item.html',
  'dojo/string', 'dojo/on', 'dijit/focus', 'dijit/a11y'
], function(
  map, restaurants, search, popup, pointToExtent,
  Query, geometryEngine, FeatureLayer,
  listTemplate,
  string, on,  focus, a11y
) {
  // utility that will reformat the list based on a new
  // list of features and update the ARIA live region
  // that will speak a summary of the results
  function updateList (features, liveRegionText) {
    var newList = '';

    for (var i = 0; i < features.length; i++) {
      var attributes = features[i].attributes || features[i].feature.attributes;
      newList += string.substitute(listTemplate, attributes);
    }

    document.getElementById('results').innerText = liveRegionText;
    document.getElementById('list').innerHTML = newList;
  }

  // when the feature layer is ready set the extent of the
  // map to include all the restaurants
  restaurants.on('load', function () {
    map.setExtent(restaurants.fullExtent);
  });

  // when the layer is done loading all its features update
  // the list with the current list of features
  restaurants.on('update-end', function () {
    updateList(restaurants.graphics, restaurants.graphics.length + ' restaurants loaded.');
  });

  // Update the list when we get search
  // results from our search dijit
  search.on('search-results', function () {
    // set our results by source.
    // [0] is the feature layer of restaurants
    // [1] is the world geocoder
    var restrauntResults = search.searchResults && search.searchResults[0];
    var geocoderResults = search.searchResults && search.searchResults[1];

    // there are restaurants matching the search
    if(restrauntResults && restrauntResults.length) {
      // use the restraunt name if there is only 1 feature
      // otherwise use the value of the text in the search
      var textValue = (restrauntResults.length > 1) ? search.value : restrauntResults[0].name;

      // update the restraunt list and live region
      updateList(restrauntResults, restrauntResults.length + ' restaurants matching ' + textValue + '.');

      // focus the first item in the list
      focus.focus(a11y.getFirstInTabbingOrder('list'));
      return;
    }

    // if there is a single result from the geocoder we
    // matched a place name so we can calulate nearby
    // restaurants with geometryEngine and update the list
    if(geocoderResults && geocoderResults.length === 1) {
      var textValue = geocoderResults[0].name;
      var extent = geocoderResults[0].extent;
      var restaurantsInExtent = restaurants.graphics.filter(function (graphic) {
        return geometryEngine.contains(extent, graphic.geometry);
      });

      updateList(restaurantsInExtent, restaurantsInExtent.length + ' restaurants near ' + textValue + '.');
      console.log(extent);
      map.setExtent(extent);
      focus.focus(a11y.getFirstInTabbingOrder('list'));
      return;
    }

    // neither of the 2 conditions were met so there are no
    // restraunt results AND more then 1 result from the
    // geocoder so update the live region and focus the input
    updateList([], 'No results matching ' + search.value);
    search.focus();
  });

  // when the search is cleared update the list and refocus
  // the search input
  search.on('clear-search', function () {
    updateList(restaurants.graphics, 'Search cleared. Showing ' + restaurants.graphics.length + ' restaurants.');
    search.focus();
  });

  // when the escape key is pressed clear our
  // current search and refocus our input
  on(document, 'keyup', function (e) {
    if(e.keyCode === 27) {
      search.clear();
      search.focus();
    }
  });

  // when an item on the list is clicked find the
  // feature that was clicked and open its popup
  on(document.getElementById('list'), 'button:click', function (e) {
    var id = parseInt(this.dataset.id, 10);
    var feature = restaurants.graphics.filter(function(graphic) {
      return graphic && graphic.attributes && graphic.attributes.FID === id;
    })[0];
    map.infoWindow.setFeatures([feature]);
    map.infoWindow.show(feature.geometry);
    map.centerAndZoom(feature.geometry, 16);
  });

  var selectedFeature;

  // when we show or update a popup focus
  // the item in the list
  popup.on('show, selection-change, set-features', function (e) {
    var feature = popup.getSelectedFeature();
    selectedFeature = feature ? feature.attributes.FID : undefined;
    if (selectedFeature) {
      focus.focus(a11y.getFirstInTabbingOrder('restraunt-' + selectedFeature));
    }
  });

  // when a popup is closed return the focus to the same spot in the list
  popup.on('hide', function (e) {
    if(selectedFeature) {
      focus.focus(a11y.getFirstInTabbingOrder('restraunt-' + selectedFeature));
      selectedFeature = undefined;
    }
  });

  // when we click the map, query the layer to
  // get the first feature and show its popup.
  map.on('click', function (event) {
    var query = new Query();
    query.geometry = pointToExtent(map, event.mapPoint, 4);

    var selection = restaurants.selectFeatures(query, FeatureLayer.SELECTION_NEW);

    if(selection.features && selection.features.length > 0) {
      map.infoWindow.setFeatures([selection]);
      map.infoWindow.show(event.mapPoint);
    }
  });

  // kick everything off by adding our layer to the map
  map.addLayer(restaurants);
});