(function(){
'use strict';

angular.module('demoApp')
    .factory('heatmapLayerServices', ['GOOGLE_API_KEY', '$q', '$http', heatmapLayerServices]);

    function heatmapLayerServices (GOOGLE_API_KEY, $q, $http) {
        var service = {};

        var baseUrl = 'https://www.googleapis.com/fusiontables/v2/query?sql=SELECT';

        service.gradients = [
            [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ],

            [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 200, 255, 1)',
                'rgba(0, 100, 200, 1)',
                'rgba(0, 87, 190, 1)',
                'rgba(0, 63, 190, 1)',
                'rgba(5, 42, 190, 1)',
                'rgba(18, 22, 181, 1)',
                'rgba(30, 12, 181, 1)',
                'rgba(45, 0, 153, 1)',
                'rgba(55, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ]
        ];

        service.loadHeatMapLayerByFusionId = loadHeatMapLayerByFusionId;
        service.loadHeatMapMemberLayerByFusionId = loadHeatMapMemberLayerByFusionId;


        function queryHeatmap(columns, layerId) {
            var url = baseUrl + ' ' + columns + ' FROM ';
            url += layerId + '&';

            //url += 'maxResults=' + '20' + '&';

            url += 'key=' + GOOGLE_API_KEY;

            //var _params = {
            //    maxResults: "10"
            //};

            return $http({
               method: 'GET',
               url: encodeURI(url)
               //data: _params
            });
        }

        function filterPoints (points) {
            var pointsArray = [];
            var lat = '',
                lng = '';

            points.forEach(function(latLngArray){
               lat = latLngArray[0];
               lng = latLngArray[1];

               if(isNaN(lat) || isNaN(lng)) return;

               pointsArray.push(new google.maps.LatLng(lat, lng));
            });

            return pointsArray;
        }

        function filterGeometryPoints(points) {
            var pointsArray = [];
            var lat = '',
                lng = '';

            points.forEach(function (geom) {
                if(!(geom[0].geometry && geom[0].geometry.coordinates)) return;

                var latLng = geom[0].geometry.coordinates;
                lat = latLng[1];
                lng = latLng[0];

                console.log('Geom: ', latLng);

                if (isNaN(lat) || isNaN(lng)) return;

                pointsArray.push(new google.maps.LatLng(lat, lng));
            });

            return pointsArray;
        }

        function createHeatmap (points, radius, intensity, isMembers) {
            var points = isMembers
                ? filterGeometryPoints(points)
                : filterPoints(points);

            var pointArray = new google.maps.MVCArray(points);

            var heatmap = new google.maps.visualization.HeatmapLayer({
                data: pointArray,
                dissipating: false,
                radius: radius || 0.15
            });

            if(intensity) heatmap.set('maxIntensity', intensity);

            if(isMembers) heatmap.set('gradient', service.gradients[1]);

            return heatmap;
        }

        function loadHeatMapLayerByFusionId(layerId) {
            var dfd = $q.defer();
            var columns = 'Latitude, Longitude';

            queryHeatmap(columns, layerId)
                .then(function (response) {
                    var heatmapObj = createHeatmap(response.data.rows);
                    dfd.resolve({heatmap: heatmapObj});
                }, function (err) {
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        function loadHeatMapMemberLayerByFusionId(layerId) {
            var dfd = $q.defer();
            var columns = 'geometry';

            queryHeatmap(columns, layerId)
                .then(function (response) {
                    console.log('Response: ',response);
                    var heatmapObj = createHeatmap(response.data.rows, 0.1, 0.5, true);
                    dfd.resolve({heatmap: heatmapObj});
                }, function (err) {
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        return service;
    }
}());