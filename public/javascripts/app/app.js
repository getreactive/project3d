var project3dApp = angular.module('demoApp',['ngTable','mgcrea.ngStrap']);

project3dApp.controller('demoAppCtrl',function($scope,$http,$filter,NgTableParams){

    $scope.tags = [];
    $scope.parentTag = [];
    $scope.dataArr = [];
    $scope.selectCounter = {};
    $scope.graphTemp = [];
    $scope.tableTemp = [];
    $scope.graphDataArr = [];
    $scope.tableDataArr = [];
    $scope.mainData = {};

    $scope.paramObj = {
        "country":[],
        "browser":[],
        "device":[],
        "site":[],
        "campaign":[],
        "advertiser":[]
    };

    $scope.selectedevice = [];
    $scope.selectedcountry = [];
    $scope.selectedbrowser = [];
    $scope.selecteadvertiser = [];
    $scope.selectecampaign = [];
    $scope.selectesite = [];


    $scope.templateobj = {}

    $scope.init= function() {

        var req = $scope.paramObj;

        $scope.callDSPBrowserStats(req);
        $scope.callDSPDeviceStats(req);
        $scope.callDSPAdvertiserStats(req);
        $scope.callDSPCampaignStats(req);
        $scope.callDSPCountryStats(req);
        $scope.callDSPSitesStats(req);

        $scope.callDSPImpressionCount(req);
        $scope.callDSPclickCount(req);
        $scope.callDSPConversion(req);

    };

    $scope.getLayoutTemplate = function(){

        var result = {
            "tableDataArr": [
                {
                    "id": "country",
                    "title": "Country",
                    "data": []

                },
                {
                    "id": "browser",
                    "title": "browser",
                    "data": []

                },
                {
                    "id": "device",
                    "title": "Device",
                    "data": [

                    ]
                },
                {
                    "id": "site",
                    "title": "Site",
                    "data": []

                },{
                    "id": "advertiser",
                    "title": "Advertiser",
                    "data": []
                },{
                    "id": "campaign",
                    "title": "campaign",
                    "data": []
                },
            ],
            "graphDataArr": [
                {
                    "id": "impressioncount",
                    "title": "Impression"
                },
                {
                    "id": "clickcount",
                    "title": "Click"
                },
                {
                    "id": "conversion",
                    "title": "Conversion"
                }
            ]
        };

        $scope.templateobj = result;

        console.log("******** ",result)
        $scope.tableDataArr = result.tableDataArr;
        $scope.graphDataArr = result.graphDataArr;

        console.log("$scope.tableDataArr", $scope.tableDataArr)
        console.log("$scope.graphDataArr",$scope.graphDataArr)


    };

    $scope.changeTableData = function(data) {


    };

    $scope.changeSelection = function(data) {
         console.log(data);



        var req = $scope.paramObj;

        $scope.callDSPBrowserStats(req);
        $scope.callDSPDeviceStats(req);
        $scope.callDSPAdvertiserStats(req);
        $scope.callDSPCampaignStats(req);
        $scope.callDSPCountryStats(req);
        $scope.callDSPSitesStats(req);

        $scope.callDSPImpressionCount(req);
        $scope.callDSPclickCount(req);
        $scope.callDSPConversion(req);
    };



    $scope.createParamObject= function(parent, selectedValue, selected) {

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
        else if(parent == "site" && selected==true){

            $scope.selectesite.push(selectedValue)
            $scope.selectesite = $.unique($scope.selectesite)
        }else if(parent == "site" && selected==false){

            $scope.selectesite = _.without($scope.selectesite,selectedValue)
        }
        else if(parent == "campaign" && selected==true){

            $scope.selectecampaign.push(selectedValue)
            $scope.selectecampaign = $.unique($scope.selectecampaign)
        }else if(parent == "campaign" && selected==false){

            $scope.selectecampaign = _.without($scope.selectecampaign,selectedValue)
        }
        else if(parent == "advertiser" && selected==true){

            $scope.selecteadvertiser.push(selectedValue)
            $scope.selecteadvertiser = $.unique($scope.selecteadvertiser)
        }else if(parent == "advertiser" && selected==false){

            $scope.selecteadvertiser = _.without($scope.selecteadvertiser,selectedValue)
        }


        $scope.paramObj.country = $scope.selectedcountry
        $scope.paramObj.device = $scope.selectedevice
        $scope.paramObj.browser = $scope.selectedbrowser
        $scope.paramObj.advertiser=$scope.selecteadvertiser
        $scope.paramObj.campaign=$scope.selectecampaign
        $scope.paramObj.site=$scope.selectesite

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


/*  POST        /dspbrowserstats           controllers.DSPApplication.getGlobalBrowserStatsAction
    POST        /dspdevicestats            controllers.DSPApplication.getGlobalDeviceStatsAction
    POST        /dspcountrystats           controllers.DSPApplication.getGlobalCountryStatsAction
    POST        /dspsitestats              controllers.DSPApplication.getGlobalSiteStatsAction
    POST        /dspcampaignstats          controllers.DSPApplication.getGlobalCampaignStatsAction
    POST        /dspadvertiserstats        controllers.DSPApplication.getGlobalAdvertiserStatsAction

    POST        /dspimpression             controllers.DSPApplication.getGlobalTotalImpressionAction
    POST        /dspclickcount            controllers.DSPApplication.getGlobalClickCountAction
    POST        /dspconversion             controllers.DSPApplication.getGlobalConversionCountAction*/

    // New DSP Code Start

     $scope.callDSPBrowserStats = function(parmdata){

         var _paramdata = parmdata;
         _paramdata.metrics="count";
         var req = {
             method: 'POST',
             url: '/dspbrowserstats',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: _paramdata
         };

         $http(req).success(function(data){
             console.log("callDSPBrowserStats ",data)

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){

                 console.log("i",i);
                 console.log("v",v);
                 if(v.id=="browser"){
                     v.data=data;
                 }
             });

             //$scope.genrateRevChart(data)
         }).error(function(){
         });


     };
     $scope.callDSPDeviceStats = function(parmdata){

         var _paramdata = parmdata;
         _paramdata.metrics="count";
         var req = {
             method: 'POST',
             url: '/dspdevicestats',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: _paramdata
         };

         $http(req).success(function(data){
             console.log("dspdevicestats ",data)

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){

                 console.log("i",i);
                 console.log("v",v);
                 if(v.id=="device"){
                     v.data=data;
                 }
             });

             //$scope.genrateRevChart(data)
         }).error(function(){
         });


     };
     $scope.callDSPCountryStats = function(parmdata){

         var _paramdata = parmdata;
         _paramdata.metrics="count";
         var req = {
             method: 'POST',
             url: '/dspcountrystats',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: _paramdata
         };

         $http(req).success(function(data){
             console.log("dspcountrystats ",data)

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){

                 console.log("i",i);
                 console.log("v",v);
                 if(v.id=="country"){
                     v.data=data;
                 }
             });

             //$scope.genrateRevChart(data)
         }).error(function(){
         });
     };
     $scope.callDSPSitesStats = function(parmdata){

         var _paramdata = parmdata;
         _paramdata.metrics="count";
         var req = {
             method: 'POST',
             url: '/dspsitestats',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: _paramdata
         };

         $http(req).success(function(data){
             console.log("dspsitestats ",data)

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){

                 console.log("i",i);
                 console.log("v",v);
                 if(v.id=="site"){
                     v.data=data;
                 }
             });

             //$scope.genrateRevChart(data)
         }).error(function(){
         });

     };
     $scope.callDSPCampaignStats = function(parmdata){

         var _paramdata = parmdata;
         _paramdata.metrics="count";
         var req = {
             method: 'POST',
             url: '/dspcampaignstats',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: _paramdata
         };

         $http(req).success(function(data){
             console.log("dspcampaignstats ",data)

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){

                 console.log("i",i);
                 console.log("v",v);
                 if(v.id=="campaign"){
                     v.data=data;
                 }
             });

             //$scope.genrateRevChart(data)
         }).error(function(){
         });

     };
     $scope.callDSPAdvertiserStats = function(parmdata){

         var _paramdata = parmdata;
         _paramdata.metrics="count";
         var req = {
             method: 'POST',
             url: '/dspadvertiserstats',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: _paramdata
         };

         $http(req).success(function(data){
             console.log("dspadvertiserstats ",data)

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){

                 console.log("i",i);
                 console.log("v",v);
                 if(v.id=="advertiser"){
                     v.data=data;
                 }
             });

             //$scope.genrateRevChart(data)
         }).error(function(){
         });
     };

     $scope.callDSPImpressionCount = function(parmdata){

         var _paramdata = parmdata;
         var req = {
             method: 'POST',
             url: '/dspimpression',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: _paramdata
         };

         $http(req).success(function(data){

             console.log("callDSPImpressionCount ",data);

             $scope.drawMetricsGraph$scope("#impressioncount","impressioncount",data)

                 //$scope.genrateRevChart(data)
         }).error(function(){
         });

     };

     $scope.callDSPclickCount = function(parmdata){

         var _paramdata = parmdata;
         var req = {
             method: 'POST',
             url: '/dspclickcount',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: _paramdata
         };

         $http(req).success(function(data){

             console.log("callDSPclickCount ",data);

             //$scope.genrateRevChart(data)
         }).error(function(){
         });
     };
     $scope.callDSPConversion = function(parmdata){

         var _paramdata = parmdata;
         var req = {
             method: 'POST',
             url: '/dspconversion',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: _paramdata
         };

         $http(req).success(function(data){

             console.log("callDSPConversion ",data);

             //$scope.genrateRevChart(data)
         }).error(function(){
         });
     };

    // New DSP code end

    $scope.updateStats = function() {
       /* var req = $scope.paramObj;
        $scope.tableDataArr = [];
        $scope.callGlobalDeviceStatsAction(req)
        $scope.callGlobalCountryStatsAction(req)
        $scope.callGlobalBrowserStatsAction(req)

        $scope.callGlobalTotalRevenueAction(req)
        $scope.callGlobalTotalFilledImpressionAction(req)
        $scope.callGlobalTotaleCPMAction(req)*/

    };

    $scope.drawMetricsGraph$scope = function(location,name,data) {

        var _location = $(location);

        console.log("_location",_location)
        _location.html(" ");

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = _location.width() - margin.left - margin.right,
            height = 200 ///- margin.top - margin.bottom;

        console.log("Name -> ",name);
        console.log("location ->",_location);
        console.log("drawMetricsGraph Data ->",data);


        var parseDate = d3.time.format("%d-%b-%y").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
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

                return d;})
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) {
                console.log("Timestamp ",d)
                return x(d.timestamp);
            })
            .y(function(d) {
                return y(d.value);
            });

        var svg = d3.select("#impressioncount").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            data.forEach(function(d) {

                console.log("dd-<",d);
                var _date = date = new Date(Number(d.timestamp)*1000);
                console.log("_date ",date);
                d.timestamp = new Date(Number(_date));
                d.value = +parseInt(d.value);
            });

            x.domain(d3.extent(data, function(d) { return d.timestamp; }));
            y.domain(d3.extent(data, function(d) { return d.value; }));

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
                .text("Count");

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);

    };

    $scope.genrateRevChart = function(data) {

        $("#revenue-chart").html(" ")

        var genRows = function() {
            var a = []
            for (var i = 0; i < 10; i++) {
                var o = {
                    name: 'Item'+i,
                    value: Math.round(Math.random() * 100)
                }
                a.push(o)
            }
            return a
        }

        var data = [
            {name: 'Layer 1', value: genRows()},
            {name: 'Layer 2', value: genRows()}
        ]

        // CHART

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = $("#revenue-chart").width(),
            height = 200;

        var xvalues = []
        var yvalues = []
        console.log("Data -- >",data)
        $.each(data[0].value, function(i, v) {
            console.log(data[0].value)
            console.log("v -> ",v)
            xvalues.push(v.name)
            yvalues.push(v.value)
        })

        console.log("xvalues--> ",xvalues)
        console.log("yvalues-- ",yvalues)

        var x = d3.scale.ordinal()
            .domain(xvalues)
            .rangeBands([0, (width - margin.left - margin.right)], 0)

        var y = d3.scale.linear()
            .domain(d3.extent(yvalues))
            .range([height - margin.top - margin.bottom, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
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

                return d;})
            .orient("left");

        var area = d3.svg.area()
            .x(function(d) {
                console.log("area x --> ",d);
                return x(d.name);
            })
            .y0(height)
            .y1(function(d) {
                alert("y1 Called")
                console.log("In area y1 -> ",d);
                return y(d.value);
            });

        var svg = d3.select("#revenue-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // DRAW CHART

        var layer = svg.selectAll('.layer')
            .data(data)
            .enter().append("g")
            .attr("class", "layer")

        layer.selectAll("path")
            .data(function(d) {
                alert("Called")
                console.log("Import -->",d)
                return [d]
            })
            .enter().append("path")
            .attr("class", "area")
            .attr("d", area); // THIS DOESN'T DO ANYTHING :(

        // AXIS
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

    }

    $scope.genrateeCPMChart = function(data) {

        $("#ecpm-chart").html(" ")

        var genRows = function() {
            var a = []
            for (var i = 0; i < 10; i++) {
                var o = {
                    name: 'Item'+i,
                    value: Math.round(Math.random() * 100)
                }
                a.push(o)
            }
            return a
        }

        var data = [
            {name: 'Layer 1', value: genRows()},
            {name: 'Layer 2', value: genRows()}
        ]

        // CHART

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = $("#ecpm-chart").width(),
            height = 200;

        var xvalues = []
        var yvalues = []
        console.log("Data -- >",data)
        $.each(data[0].value, function(i, v) {
            console.log(data[0].value)
            console.log("v -> ",v)
            xvalues.push(v.name)
            yvalues.push(v.value)
        })

        console.log("xvalues--> ",xvalues)
        console.log("yvalues-- ",yvalues)

        var x = d3.scale.ordinal()
            .domain(xvalues)
            .rangeBands([0, (width - margin.left - margin.right)], 0)

        var y = d3.scale.linear()
            .domain(d3.extent(yvalues))
            .range([height - margin.top - margin.bottom, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
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

                return d;})
            .orient("left");

        var area = d3.svg.area()
            .x(function(d) { return x(d.name); })
            .y0(height)
            .y1(function(d) { return y(d.value); });

        var svg = d3.select("#ecpm-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // DRAW CHART

        var layer = svg.selectAll('.layer')
            .data(data)
            .enter().append("g")
            .attr("class", "layer")

        layer.selectAll("path")
            .data(function(d) {return [d.value]})
            .enter().append("path")
            .attr("class", "area")
            .attr("d", area); // THIS DOESN'T DO ANYTHING :(

// AXIS
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
    }
});