(function(){
'use strict';

angular.module('demoApp')
    .factory('membersLayerServices', ['$rootScope', 'gmapServices', 'heatmapLayerServices', membersLayerServices]);

    function membersLayerServices ($rootScope, gmapServices, heatmapLayerServices) {
        var service = {};

        var fusionLayer = {
            'column': 'col14',
            'options': {
                styleId: 2,
                templateId: 2,
                suppressInfoWindows: true
            }
        };

        var fusionLayerByYear = {
            '2009': '1MCPZ_Y9az2C-V0agGDNuGEj7ywTLsMRNb8MlNJae',
            '2010': '1aizUWjBV8Rc1CWVJJXLcjG0SpbhkyEdekAu2CqkB',
            '2011': '1BTFb4UbTD4dR6Ia5yU5DXGploXZU7aiOnYqD3hL2',
            '2012': '1_SABjl2PDjOKpw_XYUps-3CCnOPnqaHsI-1gw3I3',
            '2013': '11rwWZCUxD_YG21zRZgVBneLKy5KsjkOHrFnz1FkP',
            '2014': '1-sFyxtkBbFywlimDzGZJhrfAHpLc9tjS9af32aQL'
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


        function showLocationLayer() {
            hideHeatmapLayer();

            service.data.location.watcher = $rootScope.$watch('timeValue', function (newValue) {
                // Hide Infowindow when changing data
                $rootScope.showMemberInfoWindow = false;

                var layerId = fusionLayerByYear[newValue];
                if (layerId) {
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
                            $rootScope.$apply(function () {
                                // Hide Store Infowindow first
                                $rootScope.showStoreInfoWindow = false;

                                $rootScope.showMemberInfoWindow = true;
                            });

                            var content = event.infoWindowHtml;

                            // pass data here
                            $rootScope.$emit('show-member-detail', {content: content});
                        }
                    );

                }
            });
        }

        function hideLocationLayer() {
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

        function showCurrentHeatmap(year) {
            /* Load Heatmap if not instantiated */
            if (!service.data.heatmap.layers[year]) {
                var layerid = fusionLayerByYear[year];
                heatmapLayerServices.loadHeatMapMemberLayerByFusionId(layerid)
                    .then(function (data) {
                        if (data.heatmap) {
                            service.data.heatmap.layers[year] = data.heatmap;
                            service.data.heatmap.currentLayer = service.data.heatmap.layers[year];
                            gmapServices.showLayer(service.data.heatmap.currentLayer);
                        }
                    });
                return;
            }

            /* Otherwise assign it to currentLayer and show */
            service.data.heatmap.currentLayer = service.data.heatmap.layers[year];
            gmapServices.showLayer(service.data.heatmap.currentLayer);
        }

        function hideCurrentHeatmap() {
            gmapServices.hideLayer(service.data.heatmap.currentLayer);
            service.data.heatmap.currentLayer = null;
        }

        function hideHeatmapLayer() {
            hideHeatMaps();
            hideCurrentHeatmap();
            service.data.heatmap.watcher = destroyListener(service.data.heatmap.watcher);
        }

        function hideHeatMaps() {
            for (var year in service.data.heatmap.layers) {
                var heatmap = service.data.heatmap.layers[year];
                if (heatmap && heatmap.getMap()) {
                    gmapServices.hideLayer(heatmap);
                }
            }
        }

        function hideFusionLayer() {
            gmapServices.hideFusionTableLayer(service.data.location.layer);
            service.data.location.layer = null;
        }

        function destroyListener(listener) {
            if (listener) {
                listener();
                listener = null;
            }
            return listener
        }

        return service;
    }
}());