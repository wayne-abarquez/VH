(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['$rootScope', 'gmapServices', gmapController]);

    function gmapController($rootScope, gmapServices) {

        var vm = this;

        $rootScope.spinner = {
            active: false
        };

        vm.initialize = initialize;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('map-canvas');
        }

    }
}());