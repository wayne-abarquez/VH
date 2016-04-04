(function(){
'use strict';

angular.module('demoApp')
    .controller('storeDetailController', ['$rootScope', '$mdDialog', '$timeout', 'webServices', 'alertServices', storeDetailController]);

    function storeDetailController ($rootScope, $mdDialog, $timeout, webServices, alertServices) {
        var vm = this;

        var salesTableId = '1-iQwihFQixgyoDAHpcMhlpF2q-fSWeiJ8UJrVpX_';

        vm.initialize = initialize;
        vm.viewTransactions = viewTransactions;
        vm.close = close;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $rootScope.$on('show-store-detail', function(event, data){
                var htmlObject = $(data.content);

                showHeader(htmlObject[0].children[0].innerHTML);
                showGeneralTabData(htmlObject[0].children[1].innerHTML);
                showMembershipTabData(htmlObject[0].children[2].innerHTML);
                showFinancialTabData(htmlObject[0].children[3].innerHTML);
            });
        }

        function viewTransactions (ev) {
            if(!vm.shopCode) alertServices.showTransactionDataUnavailable();

            var wherefilter = 'ShopCode=' + vm.shopCode;

            webServices.getTransactionData(salesTableId, wherefilter)
                .then(function(data) {
                    $rootScope.spinner.active = true;

                    $timeout(function(){
                        $mdDialog.show({
                            controller: 'storeSalesController',
                            controllerAs: 'stSalesCtl',
                            templateUrl: 'partials/_store_sales_table.tmpl.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            locals: {columns: data.columns, rowData: data.rows},
                            onShowing: function () {
                                $rootScope.spinner.active = false;
                            }
                        });
                    }, 300);
                }, function () {
                    alertServices.showTransactionDataUnavailable();
                });
        }

        function close () {
            $rootScope.showStoreInfoWindow = false;
        }

        /* Non Scope Functions here */

        function showDataToTable(html) {
            var outputHtml = "<md-card><table class='mdl-data-table'><tbody>";
            var rows = html.split("<br>");
            for (var i = 0; i < rows.length - 1; i++) {
                var b = rows[i].indexOf("<b>") + 3;
                var eb = rows[i].indexOf("</b>");
                var header = rows[i].substring(b, eb);
                var data = rows[i].substring(eb + 4);

                outputHtml += "<tr><td class='mdl-data-table__cell--non-numeric'>" + header + "</td><td>" + data + "</td></tr>";
            }
            outputHtml += "</tbody></table><md-card>";
            return outputHtml;
        }

        function showHeader (html) {
            var data = html.split('<br>');

            vm.eCompany = data[0].split(' ')[3];
            vm.company = data[1].split(' ')[3];
            vm.shopName = data[2].split(' ')[3];
            vm.shopCode = data[3].split(' ')[3];
        }

        function showGeneralTabData (html) {
            $('#store-general-tab-content').html(showDataToTable(html));
        }

        function showMembershipTabData (html) {
            $('#store-membership-tab-content').html(showDataToTable(html));
        }

        function showFinancialTabData(html) {
            $('#store-financial-tab-content').html(showDataToTable(html));
        }
    }
}());