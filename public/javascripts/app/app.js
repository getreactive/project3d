

var project3dApp = angular.module('demoApp',['ngTable']);

project3dApp.controller('demoAppCtrl',function($scope,$http){


    $scope.init= function() {
        $scope.getTableData = function(){
             $scope.tableDataArr = [
                {"id" : "a",
                    "title" : "Country",
                    "data" :  [
                        {"id":"US",
                            "name":"United State",
                            "value":2000},
                        {"id":"UAE",
                            "name":"United Arab Emirates",
                            "value":2000},
                        {"id":"India",
                            "name":"India",
                            "value":6000},
                        {"id":"Africa",
                            "name":"Africa",
                            "value":1000},
                        {"id":"Canada",
                            "name":"Canada",
                            "value":5500},
                        {"id":"Pakistan",
                            "name":"Pakistan",
                            "value":1000},
                        {"id":"Japan",
                            "name":"Japan",
                            "value":2000},
                        {"id":"China",
                            "name":"China",
                            "value":2500},
                        {"id":"Singapore",
                            "name":"Singapore",
                            "value":3000}
                    ]
                },
                {"id" : "b",
                    "title" : "Inventory Type",
                    "data" :  [
                        {"id":"US",
                            "name":"United State",
                            "value":2000},
                        {"id":"UAE",
                            "name":"United Arab Emirates",
                            "value":2000},
                        {"id":"India",
                            "name":"India",
                            "value":6000},
                        {"id":"Africa",
                            "name":"Africa",
                            "value":1000},
                        {"id":"Canada",
                            "name":"Canada",
                            "value":5500},
                        {"id":"Pakistan",
                            "name":"Pakistan",
                            "value":1000},
                        {"id":"Japan",
                            "name":"Japan",
                            "value":2000},
                        {"id":"China",
                            "name":"China",
                            "value":2500},
                        {"id":"Singapore",
                            "name":"Singapore",
                            "value":3000}
                    ]
                },
                {"id" : "c",
                    "title" : "Inventory Source",
                    "data" :  [
                        {"id":"US",
                            "name":"United State",
                            "value":2000},
                        {"id":"UAE",
                            "name":"United Arab Emirates",
                            "value":2000},
                        {"id":"India",
                            "name":"India",
                            "value":6000},
                        {"id":"Africa",
                            "name":"Africa",
                            "value":1000},
                        {"id":"Canada",
                            "name":"Canada",
                            "value":5500},
                        {"id":"Pakistan",
                            "name":"Pakistan",
                            "value":1000},
                        {"id":"Japan",
                            "name":"Japan",
                            "value":2000},
                        {"id":"China",
                            "name":"China",
                            "value":2500},
                        {"id":"Singapore",
                            "name":"Singapore",
                            "value":3000}
                    ]
                },
                {"id" : "d",
                    "title" : "Publisher",
                    "data" :  [
                        {"id":"US",
                            "name":"United State",
                            "value":2000},
                        {"id":"UAE",
                            "name":"United Arab Emirates",
                            "value":2000},
                        {"id":"India",
                            "name":"India",
                            "value":6000},
                        {"id":"Africa",
                            "name":"Africa",
                            "value":1000},
                        {"id":"Canada",
                            "name":"Canada",
                            "value":5500},
                        {"id":"Pakistan",
                            "name":"Pakistan",
                            "value":1000},
                        {"id":"Japan",
                            "name":"Japan",
                            "value":2000},
                        {"id":"China",
                            "name":"China",
                            "value":2500},
                        {"id":"Singapore",
                            "name":"Singapore",
                            "value":3000}
                    ]
                },
                {"id" : "e",
                    "title" : "Advertiser",
                    "data" :  [
                        {"id":"US",
                            "name":"United State",
                            "value":2000},
                        {"id":"UAE",
                            "name":"United Arab Emirates",
                            "value":2000},
                        {"id":"India",
                            "name":"India",
                            "value":6000},
                        {"id":"Africa",
                            "name":"Africa",
                            "value":1000},
                        {"id":"Canada",
                            "name":"Canada",
                            "value":5500},
                        {"id":"Pakistan",
                            "name":"Pakistan",
                            "value":1000},
                        {"id":"Japan",
                            "name":"Japan",
                            "value":2000},
                        {"id":"China",
                            "name":"China",
                            "value":2500},
                        {"id":"Singapore",
                            "name":"Singapore",
                            "value":3000}
                    ]
                },
                {"id" : "f",
                    "title" : "Category",
                    "data" :  [
                        {"id":"US",
                            "name":"United State",
                            "value":2000},
                        {"id":"UAE",
                            "name":"United Arab Emirates",
                            "value":2000},
                        {"id":"India",
                            "name":"India",
                            "value":6000},
                        {"id":"Africa",
                            "name":"Africa",
                            "value":1000},
                        {"id":"Canada",
                            "name":"Canada",
                            "value":5500},
                        {"id":"Pakistan",
                            "name":"Pakistan",
                            "value":1000},
                        {"id":"Japan",
                            "name":"Japan",
                            "value":2000},
                        {"id":"China",
                            "name":"China",
                            "value":2500},
                        {"id":"Singapore",
                            "name":"Singapore",
                            "value":3000}
                    ]
                }
            ];

            //loop it
            //
        };
        $scope.getVizData = function(){
            $scope.graphDataArr = [
                {"id" : "a",
                    "title" : "Uniques"
                },
                {"id" : "b",
                    "title" : "Impressions"
                },
                {"id" : "c",
                    "title" : "eCPM"
                },
                {"id" : "d",
                    "title" : "Revenue"
                },
                {"id" : "e",
                    "title" : "Clicks"
                },
                {"id" : "f",
                    "title" : "CTR"
                }
            ];

            //loop it
            //
        };
    }
});