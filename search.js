define([
  './map.js',
  'esri/dijit/Search',
  'esri/layers/FeatureLayer'
], function (map, Search, FeatureLayer) {

  var search = new Search({
   enableButtonMode: false, //this enables the search widget to display as a single button
   map: map,
   expanded: true,
   minCharacters: 3,
   enableSourcesMenu: false,
   allPlaceholder: 'Search for an address or restraunts',
   enableHighlight: false,
   autoNavigate: false,
   autoSelect: false
 }, 'search');

  var sources = search.get('sources');

  // push our source at the top of the sources list
  sources.unshift({
    featureLayer: new FeatureLayer('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Oldest_Surviving_Los_Angeles_Restaurants/FeatureServer/0'),
    searchFields: ['name', 'year', 'description'],
    displayField: 'name',
    exactMatch: false,
    outFields: ['*'],
    name: 'Restraunts',
    placeholder: 'Search Restraunts',
    maxResults: 6,
    maxSuggestions: 6,
    enableSuggestions: true,
    minCharacters: 3
  });

   //Set the sources above to the search widget
  search.set('sources', sources);

  search.startup();

  return search;
});