(function () {
    'use strict';

    angular.module('demoApp')
        .factory('restaurantsLayerServices', ['placesAPI', 'gmapServices', restaurantsLayerServices]);

    function restaurantsLayerServices(placesAPI, gmapServices) {
        var service = {};

        var placesType = 'restaurant';

        var markers = [];

        service.showLayer = showLayer;
        service.hideLayer = hideLayer;

        function showLayer() {
            showMarkers();
        }

        function hideLayer() {
            gmapServices.hideMarkers(markers);
        }

        function showMarkers() {
            if (markers.length > 0) {
                gmapServices.showMarkers(markers);
                return;
            }

            getData()
                .then(function (results) {
                    results.forEach(function (item) {
                        createMarker(item);
                    });
                });
        }

        function createMarker(data) {
            var marker = gmapServices.createCustomMarker(
                data.coordinates,
                data.icon
            );
            gmapServices.addMarkerInfoWindowClickListener(marker, data.content);
            markers.push(marker);
        }

        function getData() {
            return placesAPI.getPlacesByTypeAndLocation(placesType);
        }

        return service;
    }
}());