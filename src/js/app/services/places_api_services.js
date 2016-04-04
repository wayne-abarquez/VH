(function(){
'use strict';

angular.module('demoApp')
    .factory('placesAPI', ['$q', 'gmapServices', placesAPI]);

    function placesAPI ($q, gmapServices) {
        var service = {};

        service.placesDefaultCoordinates = new google.maps.LatLng(35.983285, 140.041351);
        service.defaultBounds = {
            south: 34.96474831110365,
            west: 138.1008912695313,
            north: 36.35937516297948,
            east: 141.8527223242188
        };

        service.placesService = null;

        service.getPlacesByTypeAndLocation = getPlacesByTypeAndLocation;

        var icons = {
            'restaurant': 'http://cre-demo.appspot.com/icons/restaurant.png',
            'airport': 'http://cre-demo.appspot.com/icons/airport.png',
            'bus_station': 'http://cre-demo.appspot.com/icons/bus.png',
            'atm': 'http://cre-demo.appspot.com/icons/atm.png',
            'bank': 'http://cre-demo.appspot.com/icons/bank.png',
            'parking': 'http://cre-demo.appspot.com/icons/parking.png',
            'hotel': 'http://cre-demo.appspot.com/icons/lodging.png'
        };

        function initialize () {
            gmapServices.initializePlacesService();
        };
        initialize();


        function getPlacesByTypeAndLocation(placeType, latLng, radiusParam) {
            var dfd = $q.defer();
            var radius = radiusParam || 50000;


            var processResults = function (results, status) {
                //console.log('Status: ',status);
                //console.log('Results: ',results);

                if (status !== google.maps.places.PlacesServiceStatus.OK) dfd.reject('No data available.');

                var resultsArray = [];

                results.forEach(function (place) {
                    var ratings = place.rating || 'No Ratings.';
                    var content = place.name + '<br>';
                        content += 'Ratings: ' + ratings + '<br>';
                        content += place.vicinity;

                    var item = {
                        'name': place.name,
                        'address': place.vicinity,
                        'rating': ratings,
                        'coordinates': place.geometry.location,
                        'content': content,
                        'icon': icons[placeType]
                    };

                    resultsArray.push(item);
                });

                dfd.resolve(resultsArray);
            };

            var request = {
                radius: radius,
                types: [placeType]
            };

            if(!latLng) {
                request.bounds = service.defaultBounds;
            } else {
                request.location = {lat: latLng.lat(), lng: latLng.lng()};
            }

            //console.log('Request: ',request);

            gmapServices.placesService.nearbySearch(request, processResults);

            return dfd.promise;
        }

        return service;
    }
}());