var app = angular.module("table",["ngTable"]);
app.controller("tableCtrl",function($scope ,$filter, NgTableParams){
        var data = [
        {name: "Moroni", age: 50},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34}
    ];
    $scope.data = data;
    $scope.updated = [];
    //$scope.update = function(id){
    //    $scope.updated.push(data[id]);
    //};

    $scope.tableParams = new NgTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        filter: {
            //name: 'M'       // initial filter
        },
        sorting: {
            //name: 'asc'     // initial sorting
        }
    }, {
        filterDelay: 0,
        total: data.length, // length of data
        getData: function ($defer, params) {
            // use build-in angular filter
            var filteredData = params.filter() ?
                $filter('filter')(data, params.filter()) :
                data;
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                data;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
});


