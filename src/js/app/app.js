(function () {
    'use strict';

    angular
        .module('demoApp', ['ngMaterial', 'ngAnimate', 'oitozero.ngSweetAlert', 'treasure-overlay-spinner', 'vAccordion', 'md.data.table'])

        .constant('GOOGLE_API_KEY', 'AIzaSyBsmBfrnA2wV0b5StWXzmwEShNqUR4xg9E')
        .constant('SALES_GOOGLE_API_KEY', 'AIzaSyDmng5sov5Ju5jmf5-RmjOTrqnekXpSkwc')
        .constant('BASE_URL', window.location.origin + '/VH')
        .constant('LAYER_LIMIT', 5)

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('red')
                .accentPalette('pink');
        });

}());

