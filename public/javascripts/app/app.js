var project3dApp = angular.module('demoApp',['ngTable','mgcrea.ngStrap']);

project3dApp.controller('demoAppCtrl',function($scope,$http){

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
        "creative":[]
    };

    $scope.selectedevice = [];
    $scope.selectedcountry = [];
    $scope.selectedbrowser = [];
    $scope.selectecreative = [];
    $scope.selectecampaign = [];
    $scope.selectesite = [];
    $scope.templateobj = {}

    $scope.applySlimScroll = function(){

        $('.table-responsive').slimScroll({
            height: '250px'
        });

    };


    $scope.startDate = null;//new Date();
    $scope.endDate = null;//new Date();

    $scope.datetimecheck = function(){

        $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

        $('#reportrange').daterangepicker({
            format: 'MM/DD/YYYY',
            startDate: moment().subtract(29, 'days'),
            endDate: moment(),
            minDate: '01/01/2012',
            maxDate: '12/31/2015',
            dateLimit: { days: 60 },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            opens: 'left',
            drops: 'down',
            buttonClasses: ['btn', 'btn-sm'],
            applyClass: 'btn-primary',
            cancelClass: 'btn-default',
            separator: ' to ',
            locale: {
                applyLabel: 'Submit',
                cancelLabel: 'Cancel',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            }
        }, function(start, end, label) {
            console.log(start.toISOString(), end.toISOString(), label);
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        });
    };

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
        $scope.datetimecheck();





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
                    "id": "creative",
                    "title": "Creative",
                    "data": []
                },{
                    "id": "campaign",
                    "title": "Campaign",
                    "data": []
                },
            ],
            "graphDataArr": [

                {
                    "id": "conversion",
                    "title": "Impression"
                },
                {
                    "id": "clickcount",
                    "title": "Click"
                },
                {
                    "id": "impressioncount",
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

        var req = $scope.paramObj;


    };



    $scope.createParamObject= function(parent, selectedValue, selected) {

        console.log("Selected Value ",selectedValue)

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
        else if(parent == "creative" && selected==true){

            $scope.selectecreative.push(selectedValue)
            $scope.selectecreative = $.unique($scope.selectecreative)
        }else if(parent == "creative" && selected==false){

            $scope.selectecreative = _.without($scope.selectecreative,selectedValue)
        }


        $scope.paramObj.country = $scope.selectedcountry;
        $scope.paramObj.device = $scope.selectedevice;
        $scope.paramObj.browser = $scope.selectedbrowser;
        $scope.paramObj.creative=$scope.selectecreative;
        $scope.paramObj.campaign=$scope.selectecampaign;
        $scope.paramObj.site=$scope.selectesite;
        console.log("$scope.paramObj --> ",$scope.paramObj)

        var _pram = $scope.paramObj;
        $scope.updateStats(_pram);

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

            console.log("currentparent == ",currentparent)
            console.log("currentvalue == ",currentvalue)

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


    $scope.resetFilterWithTag = function(tag){

        $scope.paramObj

    };

    $scope.closeTag = function(tag){
        console.log("tag -->",tag)
        var parent = $scope.parentTag.indexOf(tag);
        console.log("&*&*&* ",parent)
        $scope.parentTag.splice(parent,1);
        for(var i=0;i<$scope.tableDataArr.length;i++){
            if($scope.tableDataArr[i].id==tag){
                console.log($scope.tableDataArr[i].data);
                $.each($scope.tableDataArr[i].data,function(index){
                    delete $scope.tableDataArr[i].data[index].$selected;
                })
            }
        }

/*        $scope.paramObj = {
            "country":[],
            "browser":[],
            "device":[],
            "site":[],
            "campaign":[],
            "advertiser":[]
        };*/

        if(tag=="country"){
            $scope.paramObj.country = [];
        }
        if(tag=="browser"){
            $scope.paramObj.browser = [];
        }
        if(tag=="device"){
            $scope.paramObj.device = [];
        }
        if(tag=="site"){
            $scope.paramObj.site = [];
        }
        if(tag=="campaign"){
            $scope.paramObj.campaign = [];
        }
        if(tag=="creative"){
            $scope.paramObj.creative = [];

        }

        var _pram = $scope.paramObj;

        console.log("Chal Beta selfi la la ra ",$scope.tableDataArr);
        console.log("Chal  ",$scope.parentTag);

        console.log("Updated parameter--> ",_pram)

        if($scope.parentTag.length == 0){

            $scope.selectedcountry = [];
            $scope.selectedevice = [];
            $scope.selectedbrowser = [];
            $scope.selectecreative = [];
            $scope.selectecampaign = [];
            $scope.selectesite = [];
            $scope.paramObj.creative = [];
            $scope.paramObj.browser = [];
            $scope.paramObj.campaign = [];
            $scope.paramObj.country = [];
            $scope.paramObj.device = [];
            $scope.paramObj.site = [];
            var paramdata = $scope.paramObj;
            $scope.updateStats(paramdata);
        }else {

            $scope.updateStats(_pram);
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
                 if(v.id=="browser"){
                     v.data=data;
                 }
             });

             $scope.applySlimScroll();
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

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){

                 if(v.id=="device"){
                     v.data=data;
                 }
             });

             $scope.applySlimScroll();
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

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){

                 if(v.id=="country"){
                     v.data=data;
                 }
             });

             $scope.applySlimScroll();
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

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){
                 if(v.id=="site"){
                     v.data=data;
                 }
             });

             $scope.applySlimScroll();
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

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){

                 if(v.id=="campaign"){
                     v.data=data;
                 }
             });
             $scope.applySlimScroll();

             //$scope.genrateRevChart(data)
         }).error(function(){
         });

     };
     $scope.callDSPAdvertiserStats = function(parmdata){

         var _paramdata = parmdata;
         _paramdata.metrics="count";
         var req = {
             method: 'POST',
             url: '/dspcreativestats',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: _paramdata
         };

         $http(req).success(function(data){

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){

                 if(v.id=="creative"){
                     v.data=data;
                 }
             });

             $scope.applySlimScroll();
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

             $scope.drawMetricsGraph("#conversion","conversion",data)

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

             $scope.drawMetricsGraph("#clickcount","clickcount",data)
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

             $scope.drawMetricsGraph("#impressioncount","impressioncount",data)
             //$scope.genrateRevChart(data)
         }).error(function(){
         });
     };

    // New DSP code end

    $scope.updateStats = function(param) {
        var req = param;
        $scope.callDSPBrowserStats(req);
        $scope.callDSPDeviceStats(req);
        $scope.callDSPAdvertiserStats(req);
        $scope.callDSPCampaignStats(req);
        $scope.callDSPCountryStats(req);
        $scope.callDSPSitesStats(req);

        $scope.callDSPImpressionCount(req);
        $scope.callDSPclickCount(req);
        $scope.callDSPConversion(req);

        $scope.applySlimScroll();

    };

    $scope.drawMetricsGraph = function(location,name,data) {

        var _location = $(location);

        _location.html(" ");

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = _location.width() - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        console.log("Name -> ",name);
        console.log("location ->",data)

        var parseDate = d3.time.format("%d-%b-%y").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height,0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(5)
            //.ticks(d3.time.hour, 12)
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
            .ticks(5)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) {

                return x(d.timestamp);
            })
            .y(function(d) {
                return y(d.value);
            });

        var svg = d3.select("#"+name).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            data.forEach(function(d) {

                var _date = date = new Date(Number(d.timestamp)*1000);
                d.timestamp = new Date(Number(_date));
                d.value = +parseInt(d.value);
            });

            x.domain(d3.extent(data, function(d) { return d.timestamp; }));
            //y.domain(d3.extent(data, function(d) { return d.value; }));
            y.domain([d3.min(data, function(d) { return (d.value)/1.2; }),d3.max(data, function(d) { return (d.value)/0.9; })]);

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
                //.text("Count");

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);

    };

});