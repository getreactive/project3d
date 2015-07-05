var myApp = angular.module('myApp',[]);

myApp.controller('mainController',function($scope){


    $scope.name="main Controller";
});


myApp.controller('subController',function($scope){

    $scope.name="sub Controller";

});


