(function(){
'use strict';

angular.module('demoApp')
    .controller('timeSliderController', ['$scope', '$rootScope', timeSliderController]);

    function timeSliderController ($scope, $rootScope) {
        var vm = this;

        vm.timeValue = 2014;

        vm.initialize = initialize;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $scope.$watch(function(){
               return vm.timeValue;
            }, function(newValue) {
                $rootScope.timeValue = newValue;
            });
        }
    }
}());