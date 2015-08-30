var retailApp = angular.module('retailApp',['ngTable','mgcrea.ngStrap','ngDialog','LocalStorageModule']);

retailApp.controller('retailAppCtrl',function($scope,$http,$compile,ngDialog,localStorageService){

    $scope.totalstorecount = 0;
    $scope.totalitemquantity = 0;
    $scope.totalsales = 0;

    $scope.paramObj = {
            "timerange":[],
            "state":[],
            "store":[],
            "category":[]
    };

    $scope.init = function(){

        var paramdata = $scope.paramObj
        console.log("Hello");
        $scope.getGlobalStats(paramdata);
        $scope.getStateStats(paramdata);

    };


    $scope.getGlobalStats = function(paramdata){

            var _paramdata = paramdata;
            var req = {
                method: 'POST',
                url: '/retail/getglobalstats',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: _paramdata
            };

            $http(req).success(function(data){

                console.log("Data --> ",data)


                    $scope.totalstorecount = new Intl.NumberFormat().format(parseInt(data.stotecount));
                    $scope.totalitemquantity = new Intl.NumberFormat().format(parseInt(data.totalquantity));
                    $scope.totalsales = new Intl.NumberFormat().format(parseInt(data.totalsales));

                //$scope.conversiondata = new Intl.NumberFormat().format(parseInt(data[0].value));

            }).error(function(){
            });

    };

    $scope.getStateStats = function(paramdata){

            var _paramdata = paramdata;
            var req = {
                method: 'POST',
                url: '/retail/getstatestats',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: _paramdata
            };

            $http(req).success(function(data){

                console.log("getStateStats --> ",data)

            }).error(function(){
            });

    };

});