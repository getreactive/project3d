

var project3dApp = angular.module('demoApp',['ngTable']);

project3dApp.controller('demoAppCtrl',function($scope,$http,$filter,NgTableParams){

    $scope.tags = [];
    $scope.parentTag = [];
    $scope.dataArr = [];
    $scope.selectCounter = {};

    $scope.paramObj = {
        "device":[],
        "browser":[],
        "country":[]
    };

    $scope.selectedevice = [];
    $scope.selectedcountry = [];
    $scope.selectedbrowser = [];
     /*****************************/

    $scope.changeSelection = function(data) {
        // console.info(user);
    };

    $scope.createParamObject= function(parent, selectedValue, selected) {

/*        {
            "country":[],
            "browser":[],
            "device":[]

        }*/

        if(parent == "country" && selected==true){

            $scope.selectedcountry.push(selectedValue)
            $scope.selectedcountry = $.unique($scope.selectedcountry)

        }else if(parent == "country" && selected==false){

            $scope.selectedcountry = _.without($scope.selectedcountry,selectedValue)

        }else if(parent == "browser" && selected==true){

            $scope.selectedbrowser.push(selectedValue)
            $scope.selectedbrowser = $.unique($scope.selectedbrowser)

        }else if(parent == "browser" && selected==false){

            $scope.selectedbrowser = _.without($scope.selectedbrowser,selectedValue)

        }else if(parent == "device" && selected==true){

            $scope.selectedevice.push(selectedValue)
            $scope.selectedevice = $.unique($scope.selectedevice)
        }else if(parent == "device" && selected==false){

            $scope.selectedevice = _.without($scope.selectedevice,selectedValue)
        }

        $scope.paramObj.country = $scope.selectedcountry
        $scope.paramObj.device = $scope.selectedevice
        $scope.paramObj.browser = $scope.selectedbrowser

        $scope.updateStats()
        console.log("$scope.paramObj --> ",$scope.paramObj)
    };

    $scope.selectedData = function(data,parentid){
        console.log("selected",data, " parentId ",parentid)
        if(data.$selected) {
            if(($scope.parentTag.indexOf($scope.tableDataArr[parentid].id)) + 1) {
                $scope.selectCounter[$scope.tableDataArr[parentid].id]++;
            }else{
                $scope.parentTag.push($scope.tableDataArr[parentid].id);
                $scope.selectCounter[$scope.tableDataArr[parentid].id] = 1;
            }
            $scope.tags.push(data.name);

            var parent = $scope.parentTag.indexOf($scope.tableDataArr[parentid].id);

            var currentparent = $scope.tableDataArr[parentid].id;
            var currentvalue = data.name

            $scope.createParamObject(currentparent,currentvalue,true)

        }else{
            var id = $scope.tags.indexOf(data.name);
            $scope.tags.splice(id,1);
            $scope.selectCounter[$scope.tableDataArr[parentid].id]--;
            if($scope.selectCounter[$scope.tableDataArr[parentid].id]==0){
                var parent = $scope.parentTag.indexOf($scope.tableDataArr[parentid].id);
                $scope.parentTag.splice(parent,1);
            }

            var currentparent = $scope.tableDataArr[parentid].id;
            var currentvalue = data.name

            $scope.createParamObject(currentparent,currentvalue,false)

        }
    };

    $scope.closeTag = function(tag){
        var parent = $scope.parentTag.indexOf(tag);
        $scope.parentTag.splice(parent,1);
        for(var i=0;i<$scope.tableDataArr.length;i++){
            if($scope.tableDataArr[i].id==tag){
                console.log($scope.tableDataArr[i].data);
                $.each($scope.tableDataArr[i].data,function(index){
                    delete $scope.tableDataArr[i].data[index].$selected;
                })

            }
        }
    };

    /*****************************/


/*  POST       /totalrevenue         controllers.Application.getGlobalTotalRevenueAction
    POST        /totalimpressions     controllers.Application.getGlobalTotalFilledImpressionAction
    POST        /totalecpm         controllers.Application.getGlobalTotaleCPMAction
    POST        /browswestats         controllers.Application.getGlobalBrowserStatsAction
    POST        /devicestats          controllers.Application.getGlobalDeviceStatsAction
    POST        /countrystats         controllers.Application.getGlobalCountryStatsAction*/


    //Chart Services

    $scope.callGlobalTotalRevenueAction = function(parmdata){

        var _paramdata = parmdata;
        var req = {
            method: 'POST',
            url: '/totalrevenue',
            headers: {
                'Content-Type': 'application/json'
            },
            data: _paramdata
        };

        $http(req).success(function(data){
            console.log("callGlobalTotalRevenueAction ",data)

        }).error(function(){

        });

    };

    $scope.callGlobalTotalFilledImpressionAction = function(parmdata) {

        var _paramdata = parmdata;
        var req = {
            method: 'POST',
            url: '/totalimpressions',
            headers: {
                'Content-Type': 'application/json'
            },
            data: _paramdata
        };

        $http(req).success(function(data){

            console.log("callGlobalTotalFilledImpressionAction ",data)

        }).error(function(){

        });
    };

    $scope.callGlobalTotaleCPMAction = function(parmdata) {

        var _paramdata = parmdata;
        var req = {
            method: 'POST',
            url: '/totalecpm',
            headers: {
                'Content-Type': 'application/json'
            },
            data:_paramdata
        };

        $http(req).success(function(data){

            console.log("callGlobalTotaleCPMAction ",data)

        }).error(function(){

        });
    };

    $scope.callGlobalBrowserStatsAction = function(parmdata) {

        var _paramdata = jQuery.extend(true, {},parmdata);
        _paramdata.metrics = "revenue"
        var req = {
            method: 'POST',
            url: '/browserstats',
            headers: {
                'Content-Type': 'application/json'
            },
            data: _paramdata
        };

        $http(req).success(function(data){

            var _tmpdata = {}

            _tmpdata.id="browser";
            _tmpdata.title="Browser";
            _tmpdata.data = data


            $scope.tableDataArr.push(_tmpdata)


        }).error(function(){

        });

    };

    $scope.callGlobalDeviceStatsAction = function(parmdata) {

        var _paramdata = jQuery.extend(true, {},parmdata);
        _paramdata.metrics = "revenue";
        var req = {
            method: 'POST',
            url: '/devicestats',
            headers: {
                'Content-Type': 'application/json'
            },
            data: _paramdata
        };

        $http(req).success(function(data){

            console.log("device data",data)

            /*{"id" : "device",
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
            }*/

            var _tmpdata = {}

            _tmpdata.id="device";
            _tmpdata.title="Device";
            _tmpdata.data = data


            $scope.tableDataArr.push(_tmpdata)

        }).error(function(){

        });


    };

    $scope.callGlobalCountryStatsAction = function(parmdata) {

        var _paramdata = jQuery.extend(true, {},parmdata);
        _paramdata.metrics = "revenue";
        var req = {
            method: 'POST',
            url: '/countrystats',
            headers: {
                'Content-Type': 'application/json'
            },
            data: _paramdata
        };

        $http(req).success(function(data){

            var _tmpdata = {}
            _tmpdata.id="country";
            _tmpdata.title="Country";
            _tmpdata.data = data
            $scope.tableDataArr.push(_tmpdata)

        }).error(function(){

        });


    };



    $scope.tableDataArr = [

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

    ];

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

    $scope.init= function() {

        var req = $scope.paramObj;
        $scope.callGlobalDeviceStatsAction(req)
        $scope.callGlobalCountryStatsAction(req)
        $scope.callGlobalBrowserStatsAction(req)

        $scope.callGlobalTotalRevenueAction(req)
        $scope.callGlobalTotalFilledImpressionAction(req)
        $scope.callGlobalTotaleCPMAction(req)

    };

    $scope.updateStats = function() {
        var req = $scope.paramObj;
        $scope.tableDataArr = [];
        $scope.callGlobalDeviceStatsAction(req)
        $scope.callGlobalCountryStatsAction(req)
        $scope.callGlobalBrowserStatsAction(req)

        $scope.callGlobalTotalRevenueAction(req)
        $scope.callGlobalTotalFilledImpressionAction(req)
        $scope.callGlobalTotaleCPMAction(req)

    };

    $scope.genrateRevChart = function(data){

        var chardivwidth = $("#revenue-chart").width();
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = chardivwidth - margin.left - margin.right,
            height = 220 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%d-%b-%y").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x).ticks(d3.time.hour, 6)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickFormat(function (d) {
            var array = ['','k','M','G','T','P'];
            var i=0;
            while (d > 1000)
            {
                i++;
                d = d/1000;
            }

            d = d+' '+array[i];

            return d;}).
            orient("left")

        var area = d3.svg.area()
            .x(function(d) { return x(d.date); })
            .y0(height)
            .y1(function(d) { return y(d.revenue); });

        $("#revenue-chart").html(" ");

        var svg = d3.select("#revenue-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        data.forEach(function(d){

            var newdate =new Date(Number(d.timestamp)*1000);
            //console.log("New Data",newdate);
            d.date = newdate
            d.revenue = +d.revenue

        });

        console.log("Final data -->",data);

            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) {
                    console.log(d.revenue);
                return d.revenue; }
            )]);

            svg.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(" ");


    }

});