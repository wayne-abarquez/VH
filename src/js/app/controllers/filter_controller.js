(function () {
    'use strict';

    angular.module('demoApp')
        .controller('filterController', ['gmapServices', filterController]);

    function filterController(gmapServices) {
        var vm = this;

        vm.placeInput = '';
        vm.filterLayer = '';

        var searchMarker = null;
        var searchInfowindow = null;

        var autocomplete = null;

        vm.initialize = initialize;
        vm.clearVisuals = clearVisuals;

        vm.initialize();

        /* Controller Functions here */

        function initialize() {
            autocomplete = gmapServices.initializeAutocomplete('filter-location-input');

            searchInfowindow = gmapServices.createInfoWindow('');
            searchMarker = gmapServices.createLetterMarker('L');

            autocomplete.addListener('place_changed', placeChangeCallback);
        }

        function showResult(location, address) {
            if (!searchMarker.getMap()) gmapServices.showMarker(searchMarker);

            searchMarker.setPosition(location);

            searchInfowindow.setContent(address);

            gmapServices.addListener(searchMarker, 'click', function () {
                searchInfowindow.open(gmapServices.map, searchMarker);
            });

            gmapServices.triggerEvent(searchMarker, 'click');
        }

        function clearVisuals() {
            if (searchMarker && searchMarker.getMap()) {
                gmapServices.hideMarker(searchMarker);
                searchInfowindow.close();
            }
        }

        function placeChangeCallback() {
            var place = autocomplete.getPlace();

            console.log('Place: ', place);

            if (!place.geometry) {
                alert("Autocomplete's returned place contains no geometry");
                return;
            }
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                gmapServices.map.fitBounds(place.geometry.viewport);
            } else {
                gmapServices.map.setCenter(place.geometry.location);
                gmapServices.map.setZoom(14);
            }

            showResult(place.geometry.location, place.formatted_address);
        }


        /* Non Scope Functions here */

    }
}());