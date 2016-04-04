(function(){
'use strict';

angular.module('demoApp')
    .controller('memberDetailController', ['$rootScope', '$mdDialog', '$timeout', 'webServices', 'alertServices', memberDetailController]);

    function memberDetailController ($rootScope, $mdDialog, $timeout, webServices, alertServices) {
        var vm = this;

        var salesTableId = '1sFp4bvmTpgMGUt5RGbTKhL1KoAl6KtxxgxJYomaX';

        vm.initialize = initialize;
        vm.viewTransactions = viewTransactions;
        vm.close = close;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            $rootScope.$on('show-member-detail', function(event, data){
                var htmlObject = $(data.content);

                showHeader(htmlObject[0].children[0].innerHTML);
                showBasicTabData(htmlObject[0].children[1].innerHTML);
                showRouteTabData(htmlObject[0].children[2].innerHTML);
                showPersonalTabData(htmlObject[0].children[3].innerHTML);
                showFinancialTabData(htmlObject[0].children[4].innerHTML);
            });
        }

        function viewTransactions(ev) {
            if (!vm.memberName) alertServices.showTransactionDataUnavailable();

            //var wherefilter = '会員名=' + vm.memberName;
            webServices.getTransactionDataWithLimit(salesTableId)
                .then(function (data) {

                    $rootScope.spinner.active = true;

                    $timeout(function () {
                        $mdDialog.show({
                            controller: 'memberSalesController',
                            controllerAs: 'mbrSalesCtl',
                            templateUrl: 'partials/_member_sales_table.tmpl.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            locals: {columns: data.columns, rowData: data.rows},
                            onShowing: function () {
                                $rootScope.spinner.active = false;
                            }
                        });
                    }, 300);
                });
        }

        function close () {
            $rootScope.showMemberInfoWindow = false;
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

            vm.memberName = data[0].split(' ')[3];
            vm.memberAddress = data[1].split(' ')[3];
            vm.memberPref = data[2].split(' ')[3];
            vm.memberPostal = data[3].split(' ')[3];
        }

        function showBasicTabData (html) {
            $('#member-basic-tab-content').html(showDataToTable(html));
        }

        function showRouteTabData (html) {
            $('#member-route-tab-content').html(showDataToTable(html));
        }

        function showPersonalTabData(html) {
            $('#member-personal-tab-content').html(showDataToTable(html));
        }

        function showFinancialTabData(html) {
            $('#member-financial-tab-content').html(showDataToTable(html));
        }
    }
}());