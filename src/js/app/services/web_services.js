(function(){
'use strict';

angular.module('demoApp')
    .factory('webServices', ["$http", '$q', 'SALES_GOOGLE_API_KEY', webServices]);

    function webServices($http, $q, SALES_GOOGLE_API_KEY) {
        var service = {};
        var fusionTableQueryBaseUrl = 'https://www.googleapis.com/fusiontables/v2/query?sql=';

        service.getTransactionData = getTransactionData;
        service.getTransactionDataWithLimit = getTransactionDataWithLimit;


        function getTransactionData(salesTableId, whereFilter) {
            var dfd = $q.defer();

            var query = encodeURIComponent('SELECT * FROM ' + salesTableId + ' WHERE ' + whereFilter);
            //var query = 'SELECT * FROM ' + salesTableId + ' WHERE ' + whereFilter;

            var url = fusionTableQueryBaseUrl + query;
            url += '&key=' + SALES_GOOGLE_API_KEY;

            $http({
                method: 'GET',
                url: url
            }).then(
                function (response) {
                    var data = response.data;
                    var columns = data.columns;
                    var rowData = data.rows;

                    if (!rowData) {
                        dfd.reject();
                    }

                    dfd.resolve({
                        columns: columns,
                        rows: rowData
                    });

                }, function (err) {
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        function getTransactionDataWithLimit(salesTableId) {
            var dfd = $q.defer();

            var query = encodeURIComponent('SELECT * FROM ' + salesTableId + ' LIMIT 50');

            var url = fusionTableQueryBaseUrl + query;
            url += '&key=' + SALES_GOOGLE_API_KEY;

            $http({
                method: 'GET',
                url: url
            }).then(
                function (response) {
                    var data = response.data;
                    var columns = data.columns;
                    var rowData = data.rows;

                    if (!rowData) {
                        dfd.reject();
                    }

                    dfd.resolve({
                        columns: columns,
                        rows: rowData
                    });

                }, function (err) {
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        return service;
    }
}());