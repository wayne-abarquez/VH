(function () {
    'use strict';

    angular.module('demoApp')
        .controller('layerController', ['$rootScope', 'storesLayerServices',
            'membersLayerServices', 'airportsLayerServices', 'atmsLayerServices',
            'banksLayerServices', 'restaurantsLayerServices', 'hotelsLayerServices',
            'gmapServices', layerController]);

    function layerController($rootScope, storesLayerServices, membersLayerServices,
                             airportsLayerServices, atmsLayerServices, banksLayerServices,
                             restaurantsLayerServices, hotelsLayerServices, gmapServices) {
        var vm = this;

        var yokohamaLayer = null;
        var layerExpandedCtr = 0;

        vm.layers = [
            {
                label: 'Stores',
                action: '',
                selected: false,
                children: [
                    {
                        label: 'Locations',
                        selected: false,
                        action: 'layerCtl.toggleStoresLocationLayer()'
                    },
                    {
                        label: 'Heatmap',
                        selected: false,
                        action: 'layerCtl.toggleStoresHeatmapLayer()'
                    }
                ]
            },
            {
                label: 'Members',
                action: '',
                selected: false,
                children: [
                    {
                        label: 'Locations',
                        selected: false,
                        action: 'layerCtl.toggleMembersLocationLayer()'
                    },
                    {
                        label: 'Heatmap',
                        selected: false,
                        action: 'layerCtl.toggleMembersHeatmapLayer()'
                    }
                ]
            },
            {
                label: 'Marketing',
                action: '',
                selected: false,
                children: [
                    {
                        label: 'Yokohama',
                        selected: false,
                        action: 'layerCtl.toggleYokohamaLayer()'
                    },
                    {
                        label: 'Airports',
                        selected: false,
                        action: 'layerCtl.toggleAirportsLayer()'
                    },
                    {
                        label: 'ATMS',
                        selected: false,
                        action: 'layerCtl.toggleATMsLayer()'
                    },
                    {
                        label: 'Banks',
                        selected: false,
                        action: 'layerCtl.toggleBanksLayer()'
                    },
                    {
                        label: 'Restaurants',
                        selected: false,
                        action: 'layerCtl.toggleRestaurantsLayer()'
                    },
                    {
                        label: 'Hotels',
                        selected: false,
                        action: 'layerCtl.toggleHotelsLayer()'
                    }
                ]
            }
        ];


        /* Stores */
        vm.toggleStoresLocationLayer = toggleStoresLocationLayer;
        vm.toggleStoresHeatmapLayer = toggleStoresHeatmapLayer;

        /* Members */
        vm.toggleMembersLocationLayer = toggleMembersLocationLayer;
        vm.toggleMembersHeatmapLayer = toggleMembersHeatmapLayer;

        /* Marketing */
        vm.toggleYokohamaLayer = toggleYokohamaLayer;
        vm.toggleAirportsLayer = toggleAirportsLayer;
        vm.toggleATMsLayer = toggleATMsLayer;
        vm.toggleBanksLayer = toggleBanksLayer;
        vm.toggleRestaurantsLayer = toggleRestaurantsLayer;
        vm.toggleHotelsLayer = toggleHotelsLayer;

        /* Accordion Resize Workaround*/
        vm.expandCallback = expandCallback;
        vm.collapseCallback = collapseCallback;

        /* Scope Functions here */

        /* Stores Functions  */
        function toggleStoresLocationLayer () {
            if (vm.layers[0].children[0].selected) {
                // Disable Store Heatmap Checkbox
                // only one layer per entity
                // to avoid conflict in fusion table layer
                vm.layers[0].children[1].selected = false;

                storesLayerServices.showLocationLayer();
            } else {
                storesLayerServices.hideLocationLayer();
            }
            toggleTimeSlider();
        }

        function toggleStoresHeatmapLayer() {
            if (vm.layers[0].children[1].selected) {
                vm.layers[0].children[0].selected = false;

                storesLayerServices.showHeatmapLayer();
            } else {
                storesLayerServices.hideHeatmapLayer();
            }
            toggleTimeSlider();
        }

        /* Members Functions */

        function toggleMembersLocationLayer() {
            if (vm.layers[1].children[0].selected) {
                vm.layers[1].children[1].selected = false;
                membersLayerServices.showLocationLayer();
            } else {
                membersLayerServices.hideLocationLayer();
            }
            toggleTimeSlider();
        }

        function toggleMembersHeatmapLayer() {
            if (vm.layers[1].children[1].selected) {
                vm.layers[1].children[0].selected = false;
                membersLayerServices.showHeatmapLayer();
            } else {
                membersLayerServices.hideHeatmapLayer();
            }
            toggleTimeSlider();
        }

        /* Markerting */


        function toggleYokohamaLayer () {
            var otps = {
                styleId: 2,
                templateId: 2
            };

            if (vm.layers[2].children[0].selected) {
                yokohamaLayer = gmapServices.loadFusionTableLayer('col48', '1g3J4yE3xLYOU8nKRD-CMt36cmWJiWgooerr4YGQm', otps);
            } else {
                gmapServices.hideFusionTableLayer(yokohamaLayer);
            }
        }


        function toggleAirportsLayer () {
            if (vm.layers[2].children[1].selected) {
                airportsLayerServices.showLayer();
            } else {
                airportsLayerServices.hideLayer();
            }
        }

        function toggleATMsLayer() {
            if (vm.layers[2].children[2].selected) {
                atmsLayerServices.showLayer();
            } else {
                atmsLayerServices.hideLayer();
            }
        }

        function toggleBanksLayer() {
            if (vm.layers[2].children[3].selected) {
                banksLayerServices.showLayer();
            } else {
                banksLayerServices.hideLayer();
            }
        }

        function toggleRestaurantsLayer () {
            if (vm.layers[2].children[4].selected) {
                restaurantsLayerServices.showLayer();
            } else {
                restaurantsLayerServices.hideLayer();
            }
        }

        function toggleHotelsLayer() {
            if (vm.layers[2].children[5].selected) {
                hotelsLayerServices.showLayer();
            } else {
                hotelsLayerServices.hideLayer();
            }
        }

        /*
        *  Workaround to resize height of layer panel
        *  when expanded
        */
        function expandCallback () {
            layerExpandedCtr++;
            if(layerExpandedCtr > 0) $rootScope.layerPanelHasExpanded = true;
        }

        function collapseCallback () {
            layerExpandedCtr--;
            if (layerExpandedCtr === 0) $rootScope.layerPanelHasExpanded = false;
        }

        /* Non Scope Functions here */

        function toggleTimeSlider() {
            var hasSelected = false;
            vm.layers.forEach(function (layer) {
                for(var i=0; i<2; i++) {
                    layer.children.forEach(function(childLayer){
                        if (childLayer.selected) {
                            hasSelected = true;
                        }
                    });
                }
            });
            $rootScope.showTimeSlider = hasSelected;
        }
     }
}());
