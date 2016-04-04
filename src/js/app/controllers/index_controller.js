(function(){
'use strict';

angular.module('demoApp')
    .controller('indexController', ['$rootScope', '$mdSidenav', indexController]);

    function indexController ($rootScope, $mdSidenav) {
        var vm = this;

        // Show Treasure Overlay Spinner
        $rootScope.spinner = {
            active: false
        };

        /* Time Slider Value */
        $rootScope.timeValue = 2014;

        /* Show/Hides Time Slider in UI */
        $rootScope.showTimeSlider = false;

        /*
        *  Flag to Resize Layer Panel Height when Expanded
        *  and Shrinks if not
        */
        $rootScope.layerPanelHasExpanded = false;

        $rootScope.showStoreInfoWindow = false;
        $rootScope.showMemberInfoWindow = false;

        vm.toggleLayerPanel = buildToggler('layerPanel');
        vm.toggleSearchPanel = buildToggler('searchPanel');
        vm.closeSideNav = closeSideNav;

        vm.lastSideNavOpenId = '';

        function buildToggler(navID) {
            return function () {
                if (vm.lastSideNavOpenId && vm.lastSideNavOpenId !== navID) {
                    closeSideNav(vm.lastSideNavOpenId);
                }

                $mdSidenav(navID).toggle();

                vm.lastSideNavOpenId = navID;
            }
        }

        function closeSideNav(navID) {
            $mdSidenav(navID).close();
        }
    }
}());