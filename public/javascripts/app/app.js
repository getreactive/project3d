/**
 * Created by rahul on 22/06/15.
 */

var project3dApp = angular.module('demoApp',['ngTable'])

project3dApp.controller('demoAppCtrl',function($scope,$http){


    $scope.init= function() {
            console.log("App started !!")
    }


})