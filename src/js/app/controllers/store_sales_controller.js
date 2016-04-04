(function(){
'use strict';

angular.module('demoApp')
    .controller('storeSalesController', ['$mdDialog', 'columns', 'rowData', storeSalesController]);
    // Controller Alias = stSalesCtl
    function storeSalesController ($mdDialog, columns, rowData) {
        var vm = this;

        vm.selected = [];

        vm.query = {
            order: 'ShopCode',
            limit: 10,
            page: 1,
            filter: ''
        };

        vm.filter = {
            show: false,
            form: null
        };

        vm.columns = columns;
        vm.rowData = rowData;

        vm.close = close;
        vm.onReorder = onReorder;
        vm.removeFilter = removeFilter;

        /* Controller Functions here */

        /* MD Table Functions */

        function onReorder () {}

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';

            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        }

        /* Dialog Functions */

        function close() {
            $mdDialog.hide();
        }
        /* Non Scope Functions here */

    }
}());
