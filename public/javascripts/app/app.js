

var project3dApp = angular.module('demoApp',['ngTable']);

project3dApp.controller('demoAppCtrl',function($scope,$http){

    $scope.init= function() {
        $scope.getTableData = function(){
             $scope.tableDataArr = [
                {"id" : "country",
                    "title" : "Country",
                    "data" :  [
                        {"id":"US",
                            "name":"United State",
                            "value":8000},
                        {"id":"UAE",
                            "name":"United Arab Emirates",
                            "value":5000},
                        {"id":"India",
                            "name":"India",
                            "value":6000},
                        {"id":"Africa",
                            "name":"Africa",
                            "value":3000},
                        {"id":"Canada",
                            "name":"Canada",
                            "value":4500},
                        {"id":"Pakistan",
                            "name":"Pakistan",
                            "value":3000},
                        {"id":"Japan",
                            "name":"Japan",
                            "value":4000},
                        {"id":"China",
                            "name":"China",
                            "value":6500},
                        {"id":"Singapore",
                            "name":"Singapore",
                            "value":4000}
                    ]
                },
                {"id" : "site",
                    "title" : "Site",
                    "data" :  [
                        {"id":"google",
                            "name":"google.com",
                            "value":9000},
                        {"id":"flipkart",
                            "name":"flipkart.com",
                            "value":4000},
                        {"id":"truckway",
                            "name":"truckway.in",
                            "value":2000},
                        {"id":"cartrade",
                            "name":"cartrade.in",
                            "value":3000},
                        {"id":"redbus",
                            "name":"redbus.in",
                            "value":3500},
                        {"id":"innovative",
                            "name":"innovative.com",
                            "value":2000},
                        {"id":"innox",
                            "name":"innox.com",
                            "value":2000},
                        {"id":"inocc",
                            "name":"inocc.com",
                            "value":2500},
                        {"id":"goldencar",
                            "name":"goldencar.com",
                            "value":3000},
                        {"id":"cartank",
                            "name":"cartank.com",
                            "value":3000}
                    ]
                },
                {"id" : "device",
                    "title" : "Device",
                    "data" :  [
                        {"id":"browser",
                            "name":"browser",
                            "value":8000},
                        {"id":"SGH-I337",
                            "name":"SGH-I337",
                            "value":2000},
                        {"id":"LT30p",
                            "name":"LT30p",
                            "value":2000},
                        {"id":"GT-P5210",
                            "name":"GT-P5210",
                            "value":4000},
                        {"id":"Iphone",
                            "name":"Iphone",
                            "value":5000}
                    ]
                },
                {"id" : "advertisers",
                    "title" : "Advertisers",
                    "data" :  [
                        {"id":"flipkart",
                            "name":"flipkart.com",
                            "value":5000},
                        {"id":"redbus",
                            "name":"redbus.in",
                            "value":4500},
                        {"id":"truckway",
                            "name":"truckway.com",
                            "value":3000},
                        {"id":"cartrade",
                            "name":"cartrade.com",
                            "value":4000},
                        {"id":"payZippy",
                            "name":"payZippy.com",
                            "value":3000},
                        {"id":"amazon",
                            "name":"amazon.com",
                            "value":6000},
                        {"id":"carBuy",
                            "name":"carBuy.com",
                            "value":3500},
                        {"id":"goibibo",
                            "name":"goibibo.com",
                            "value":5000},
                        {"id":"bookmyshow",
                            "name":"bookmyshow.com",
                            "value":4500},
                        {"id":"payu",
                            "name":"payu.com",
                            "value":4000},
                        {"id":"trader",
                            "name":"trader.com",
                            "value":3000}
                    ]
                }
                //{"id" : "e",
                //    "title" : "Advertiser",
                //    "data" :  [
                //        {"id":"US",
                //            "name":"United State",
                //            "value":2000},
                //        {"id":"UAE",
                //            "name":"United Arab Emirates",
                //            "value":2000},
                //        {"id":"India",
                //            "name":"India",
                //            "value":6000},
                //        {"id":"Africa",
                //            "name":"Africa",
                //            "value":1000},
                //        {"id":"Canada",
                //            "name":"Canada",
                //            "value":5500},
                //        {"id":"Pakistan",
                //            "name":"Pakistan",
                //            "value":1000},
                //        {"id":"Japan",
                //            "name":"Japan",
                //            "value":2000},
                //        {"id":"China",
                //            "name":"China",
                //            "value":2500},
                //        {"id":"Singapore",
                //            "name":"Singapore",
                //            "value":3000}
                //    ]
                //},
                //{"id" : "f",
                //    "title" : "Category",
                //    "data" :  [
                //        {"id":"US",
                //            "name":"United State",
                //            "value":2000},
                //        {"id":"UAE",
                //            "name":"United Arab Emirates",
                //            "value":2000},
                //        {"id":"India",
                //            "name":"India",
                //            "value":6000},
                //        {"id":"Africa",
                //            "name":"Africa",
                //            "value":1000},
                //        {"id":"Canada",
                //            "name":"Canada",
                //            "value":5500},
                //        {"id":"Pakistan",
                //            "name":"Pakistan",
                //            "value":1000},
                //        {"id":"Japan",
                //            "name":"Japan",
                //            "value":2000},
                //        {"id":"China",
                //            "name":"China",
                //            "value":2500},
                //        {"id":"Singapore",
                //            "name":"Singapore",
                //            "value":3000}
                //    ]
                //}
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