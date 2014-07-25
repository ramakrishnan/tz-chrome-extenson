// Reference from
// ===================
// Places Autocomplete
// ===================
// https://developers.google.com/maps/documentation/javascript/places-autocomplete

// https://developers.google.com/maps/documentation/geocoding/
// https://developers.google.com/maps/documentation/timezone

var Timezone = function() {
  var initMap = function() {
  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-90, 180),
    new google.maps.LatLng(-90, 180));

  var input = document.getElementById('place-autocomplete');
  var options = {
    bounds: defaultBounds
  };

  autocomplete = new google.maps.places.Autocomplete(input, options);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
      findLocalTime(autocomplete.getPlace());
    });
  }

  var findLocalTime = function(place) {
    var params = {
      location: place.geometry.location.k.toString() + ',' + place.geometry.location.B.toString(),
      timestamp:  Math.floor((new Date()).getTime() / 1000)
    }
    var query = unescape($.param(params));
    $.get("https://maps.googleapis.com/maps/api/timezone/json?" + query)
      .done(function(resp) {
        var date = new Date();
        var toUtc = date.getTime() + (date.getTimezoneOffset() * 60000);
        var worldTime = toUtc + ( resp.dstOffset + resp.rawOffset ) * 1000;
        displayWorldTime(new Date(worldTime), resp.timeZoneName);
        displayLocalTime(date);
      });
  };

  var displayWorldTime = function(date, zone) {
    var data = date.toString().split(" ");
    // var destination = $("div.world span");
    $("div.world span.week").text(data[0]);
    $("div.world span.day").text(data[2]);
    $("div.world span.month").text(data[1]);
    $("div.world span.year").text(data[3]);
    $("div.world span.time").text(data[4]);
    $("div.world span.zone").text(zone);
  };

  var displayLocalTime = function(date) {
    $("div.local span.time").text(date.toString());
  };

  var addToFavorite = function() {
    var input = $('#place-autocomplete').val();
    var options = {
      address: input
    };
    $.get('https://maps.googleapis.com/maps/api/geocode/json?' + $.param(options))
      .done(function(resp) {
        var places = chrome.storage.get('places');
        console.log(places);
        console.log("resp", resp);
      });
  };


  return {
    initMap: initMap,
    addToFavorite: addToFavorite
  }
}();

$(document).ready(function() {
  Timezone.initMap();
  $("#add-place").on('click', Timezone.addToFavorite);
});
