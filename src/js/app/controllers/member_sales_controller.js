(function(){
'use strict';

angular.module('demoApp')
    .controller('memberSalesController', ['$mdDialog', 'columns', 'rowData', memberSalesController]);
    // Controller Alias = mbrSalesCtl
    function memberSalesController ($mdDialog, columns, rowData) {
        var vm = this;

        vm.selected = [];

        vm.query = {
            order: '',
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
