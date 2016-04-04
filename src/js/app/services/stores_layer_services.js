(function(){
'use strict';

angular.module('demoApp')
    .factory('storesLayerServices', ['$rootScope', 'gmapServices', 'heatmapLayerServices', storesLayerServices]);

    function storesLayerServices ($rootScope, gmapServices, heatmapLayerServices) {
        var service = {};

        var fusionLayer = {
            'column': 'col10',
            'options': {
                styleId: 2,
                templateId: 2,
                suppressInfoWindows: true
            }
        };

        var fusionLayerByYear = {
            '2009': '1SJRTBeljLIFqByTNTJ8rsfP_K-Vo7v1fKdOmGS4U',
            '2010': '1BZJ4VqSFD738QFjZEi4aDj0lFiYyoGjcjsKM4-D4',
            '2011': '1lq2tY8WksxOd1YIq-lmtGkN_Z5ZwnPymes_uzyya',
            '2012': '1y7jtlx5h4kbpXp7fU19-lY9u9-9edSuB0wuCcl1l',
            '2013': '1cDWkjPXbKzzQ3n5GpydwfBSC9RqiuLK0iW4CPElj',
            '2014': '1cDWkjPXbKzzQ3n5GpydwfBSC9RqiuLK0iW4CPElj'
        };

        service.data = {
          'location': {
              'layer': null,
              'watcher': null,
              'listener': null,
              'infobox': null
          },
          'heatmap': {
              'currentLayer': null,
              'layers': {},
              'watcher': null,
              'listener': null
          }
        };

        service.showLocationLayer = showLocationLayer;
        service.hideLocationLayer = hideLocationLayer;

        service.showHeatmapLayer = showHeatmapLayer;
        service.hideHeatmapLayer = hideHeatmapLayer;


        function showLocationLayer () {
            hideHeatmapLayer();

            service.data.location.watcher = $rootScope.$watch('timeValue', function (newValue) {
                // Hide Infowindow when changing data
                $rootScope.showStoreInfoWindow = false;

                var layerId = fusionLayerByYear[newValue];
                if(layerId) {
                    hideFusionLayer();
                    service.data.location.layer = gmapServices.loadFusionTableLayer(
                        fusionLayer.column,
                        layerId,
                        fusionLayer.options
                    );

                    service.data.location.listener = gmapServices.addListener(
                        service.data.location.layer,
                        'click',
                        function (event) {
                            $rootScope.$apply(function(){
                                // Hide Member Infowindow first
                                $rootScope.showMemberInfoWindow = false;

                                $rootScope.showStoreInfoWindow = true;
                            });

                            var content = event.infoWindowHtml;

                            // pass data here
                            $rootScope.$emit('show-store-detail', {content: content});
                        }
                    );

                }
            });
        }

        function hideLocationLayer () {
            hideFusionLayer();
            service.data.location.watcher = destroyListener(service.data.location.watcher);
            if(service.data.location.listener) {
                gmapServices.clearInstanceListeners(service.data.location.listener);
                service.data.location.listener = null;
            }
        }

        function showHeatmapLayer() {
            hideLocationLayer();

            service.data.heatmap.watcher = $rootScope.$watch('timeValue', function (newValue) {
                hideCurrentHeatmap();

                showCurrentHeatmap(newValue);
            });
        }

        function showCurrentHeatmap (year) {
            /* Load Heatmap if not instantiated */
            if(!service.data.heatmap.layers[year]) {
                var layerid = fusionLayerByYear[year];
                heatmapLayerServices.loadHeatMapLayerByFusionId(layerid)
                    .then(function (data) {
                        if (data.heatmap) {
                            service.data.heatmap.layers[year] = data.heatmap;
                            service.data.heatmap.currentLayer = service.data.heatmap.layers[year];
                            gmapServices.showLayer(service.data.heatmap.currentLayer);
                        }
                    });
                return;
            } else {
                /* Otherwise assign it to currentLayer and show */
                service.data.heatmap.currentLayer = service.data.heatmap.layers[year];
                gmapServices.showLayer(service.data.heatmap.currentLayer);
            }
        }

        function hideHeatmapLayer() {
            hideHeatMaps();
            hideCurrentHeatmap();
            service.data.heatmap.watcher = destroyListener(service.data.heatmap.watcher);
        }

        function hideCurrentHeatmap () {
            gmapServices.hideLayer(service.data.heatmap.currentLayer);
            service.data.heatmap.currentLayer = null;
        }

        function hideHeatMaps () {
            for(var year in service.data.heatmap.layers) {
                var heatmap = service.data.heatmap.layers[year];
                if(heatmap && heatmap.getMap()) {
                    gmapServices.hideLayer(heatmap);
                }
            }
        }

        function hideFusionLayer () {
            gmapServices.hideFusionTableLayer(service.data.location.layer);
            service.data.location.layer = null;
        }

        function destroyListener (listener) {
            if (listener) {
                listener();
                listener = null;
            }
            return listener
        }

        return service;
    }
}());