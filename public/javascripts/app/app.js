var project3dApp = angular.module('demoApp',['ngTable','mgcrea.ngStrap','ngDialog','LocalStorageModule']);

project3dApp.controller('demoAppCtrl',function($scope,$http,$compile,ngDialog,localStorageService){

    $scope.tags = [];
    $scope.parentTag = [];
    $scope.dataArr = [];
    $scope.selectCounter = {};
    $scope.graphTemp = [];
    $scope.tableTemp = [];

    $scope.multiselectCountry = [];
    $scope.multiselectSite = [];
    $scope.multiselectBrowser = [];
    $scope.multiselectDevice = [];
    $scope.multiselectCampaigm = [];
    $scope.multiselectCreative= [];

    $scope.graphDataArr = [
        {
            "id": "clickcount",
            "title": "Click"
        },
        {
            "id": "impressioncount",
            "title": "Conversion"
        },
        {
            "id": "browser",
            "title": "Browser"
        },
        {
            "id": "country",
            "title": "Country"
        },
        {
            "id": "site",
            "title": "Site"
        },
        {
            "id": "browser",
            "title": "Browser"
        },
        {
            "id": "device",
            "title": "Device"
        },
        {
            "id": "creative",
            "title": "Creative"
        },
        {
            "id": "campaign",
            "title": "Campaign"
        }

    ];
    $scope.tableDataArr = [];
    $scope.mainData = {};

    $scope.paramObj = {
        "country":[],
        "browser":[],
        "device":[],
        "site":[],
        "campaign":[],
        "creative":[],
        "timerange":[],
        "argmetrics":['impression']
    };

    $scope.selectedmetrics = ['impression'];
    $scope.selectedevice = [];
    $scope.selectedcountry = [];
    $scope.selectedbrowser = [];
    $scope.selectecreative = [];
    $scope.selectecampaign = [];
    $scope.selectesite = [];
    $scope.templateobj = {};
    $scope.clickdata= 0;
    $scope.impressiondata =0;
    $scope.conversiondata =0;

    $scope.applySlimScroll = function(){

        $('.table-responsive').slimScroll({
            height: '250px'
       });
    };

    $scope.startDate = new Date(1433117400000);
    $scope.endDate = new Date(1435708800000);//null;//
    $scope.starttime = "1433117400";
    $scope.endtime = "1435708800";
    var _timetange = [];
    _timetange.push("1433117400","1435708800");
    $scope.paramObj.timerange = _timetange;

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


            var startDate = new Date(start.toISOString());
            var endDate = new Date(end.toISOString())
           // console.log("Start--> ", startDate.getTime()/1000);
           // console.log("End--> ", endDate.getTime()/1000);
            $scope.starttime = Math.round(0.0 + startDate.getTime()/1000);
            $scope.endtime = Math.round(0.0 + endDate.getTime()/1000);
            $scope.createParamObject("datetime",null,true)
            //Math.round(new Date().getTime()/1000.0) getTime() returns time in milliseconds
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        });
    };

    $scope.init= function() {

        var req = $scope.paramObj;

        localStorageService.set("centraldashboardobj",null);

        console.log("Init function --> ",req);

        $scope.callClickStats(req);
        $scope.callConversionStats(req);
        $scope.callImpressionStats(req);

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

        //$scope.applySlimScroll();
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
                    "title": "Browser",
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
                }/*,
                       {
                           "id": "browser",
                           "title": "Browser"
                       },
                       {
                           "id": "country",
                           "title": "Country"
                       },
                       {
                           "id": "site",
                           "title": "Site"
                       },
                       {
                           "id": "browser",
                           "title": "Browser"
                       },
                       {
                           "id": "device",
                           "title": "Device"
                       },
                       {
                           "id": "creative",
                           "title": "Creative"
                       },
                       {
                           "id": "campaign",
                           "title": "Campaign"
                       }*/
            ]
        };

        $scope.templateobj = result;
        //console.log("******** ",result);
        $scope.tableDataArr = result.tableDataArr;
        $scope.graphDataArr = result.graphDataArr;
        //console.log("$scope.tableDataArr", $scope.tableDataArr);
        //console.log("$scope.graphDataArr",$scope.graphDataArr);

    };

    $scope.changeTableData = function(data) {


    };

    $scope.changeSelection = function(data) {

        var req = $scope.paramObj;

    };

    $scope.createParamObject = function(parent, selectedValue, selected) {

        //console.log("Selected Value ",selectedValue)

        console.log("&*&*&*&*-->",localStorageService.get("centraldashboardobj"));

        if(parent == "country" && selected==true){
            var _localobj = localStorageService.get("centraldashboardobj")
            for(i=0;i<selectedValue.length;i++){

            $scope.selectedcountry.push(selectedValue[i]);
            if(_localobj != null){
            _localobj["country"].push(selectedValue[i]);
            }

            }
            $scope.selectedcountry = $.unique($scope.selectedcountry);
            console.log("$scope.selectedcountry-->",$scope.selectedcountry);

            if(_localobj != null){
            _localobj["country"] = $.unique(_localobj["country"]);

            localStorageService.set("centraldashboardobj",_localobj);
            }

        }else if(parent == "country" && selected==false){

         var _localobj = localStorageService.get("centraldashboardobj")
                    for(i=0;i<selectedValue.length;i++){
                    if(_localobj != null){
                    _localobj["country"]= _.without(_localobj["country"],selectedValue[i]);
                    }
                    }
                    if(_localobj != null){
         localStorageService.set("centraldashboardobj",_localobj);
         }
         $scope.selectedcountry = _.without($scope.selectedcountry,selectedValue)

        }else if(parent == "browser" && selected==true){

          var _localobj = localStorageService.get("centraldashboardobj")
                     for(i=0;i<selectedValue.length;i++){

                     $scope.selectedcountry.push(selectedValue[i])
                     if(_localobj != null){
                     _localobj["browser"].push(selectedValue[i]);
                     }
                     }
                     $scope.selectedcountry = $.unique($scope.selectedcountry);
                     if(_localobj != null){
                     _localobj["browser"] = $.unique(_localobj["browser"]);
                     localStorageService.set("centraldashboardobj",_localobj);
                     }
        }else if(parent == "browser" && selected==false){

         var _localobj = localStorageService.get("centraldashboardobj")
                    for(i=0;i<selectedValue.length;i++){
        if(_localobj != null){
                    _localobj["browser"]= _.without(_localobj["browser"],selectedValue[i]);
                    }
                    }
                    if(_localobj != null){
         localStorageService.set("centraldashboardobj",_localobj);
         }
         $scope.selectedcountry = _.without($scope.selectedcountry,selectedValue)

        }else if(parent == "device" && selected==true){
           var _localobj = localStorageService.get("centraldashboardobj")
                                for(i=0;i<selectedValue.length;i++){

                                $scope.selectedcountry.push(selectedValue[i])
                                if(_localobj != null){
                                _localobj["device"].push(selectedValue[i]);
                                }
                                }
                                $scope.selectedcountry = $.unique($scope.selectedcountry);
                                if(_localobj != null){
                                _localobj["device"] = $.unique(_localobj["device"]);
                                localStorageService.set("centraldashboardobj",_localobj);
                                }
        }else if(parent == "device" && selected==false){

             var _localobj = localStorageService.get("centraldashboardobj")
                               for(i=0;i<selectedValue.length;i++){
                            if(_localobj != null){
                               _localobj["device"]= _.without(_localobj["device"],selectedValue[i]);
                               }
                               }
                               if(_localobj != null){
                    localStorageService.set("centraldashboardobj",_localobj);
                    }
                    $scope.selectedcountry = _.without($scope.selectedcountry,selectedValue)
        }
        else if(parent == "site" && selected==true){
         var _localobj = localStorageService.get("centraldashboardobj")
                                         for(i=0;i<selectedValue.length;i++){

                                         $scope.selectedcountry.push(selectedValue[i])
                                         if(_localobj != null){
                                         _localobj["site"].push(selectedValue[i]);
                                         }
                                         }
                                         $scope.selectedcountry = $.unique($scope.selectedcountry);
                                         if(_localobj != null){
                                         _localobj["site"] = $.unique(_localobj["site"]);
                                         localStorageService.set("centraldashboardobj",_localobj);
                                         }
        }else if(parent == "site" && selected==false){

             var _localobj = localStorageService.get("centraldashboardobj")
                                          for(i=0;i<selectedValue.length;i++){
                                    if(_localobj != null){
                                          _localobj["site"]= _.without(_localobj["site"],selectedValue[i]);
                                          }
                                          }
                                          if(_localobj != null){
                               localStorageService.set("centraldashboardobj",_localobj);
                               $scope.selectedcountry = _.without($scope.selectedcountry,selectedValue)
                               }
        }
        else if(parent == "campaign" && selected==true){
            var _localobj = localStorageService.get("centraldashboardobj")
                                                   for(i=0;i<selectedValue.length;i++){

                                                   $scope.selectedcountry.push(selectedValue[i])
                                                   if(_localobj != null){
                                                   _localobj["campaign"].push(selectedValue[i]);
                                                   }
                                                   }
                                                   $scope.selectedcountry = $.unique($scope.selectedcountry);
                                                   if(_localobj != null){
                                                   _localobj["campaign"] = $.unique(_localobj["campaign"]);
                                                   localStorageService.set("centraldashboardobj",_localobj);
                                                   }
        }else if(parent == "campaign" && selected==false){

              var _localobj = localStorageService.get("centraldashboardobj")
                                                      for(i=0;i<selectedValue.length;i++){
                                                    if(_localobj != null){
                                                      _localobj["campaign"]= _.without(_localobj["campaign"],selectedValue[i]);
                                                      }
                                                      }
                                                      if(_localobj != null){
                                           localStorageService.set("centraldashboardobj",_localobj);
                                           }
                                           $scope.selectedcountry = _.without($scope.selectedcountry,selectedValue)
        }
        else if(parent == "creative" && selected==true){
             var _localobj = localStorageService.get("centraldashboardobj")
                                                              for(i=0;i<selectedValue.length;i++){

                                                              $scope.selectedcountry.push(selectedValue[i])
                                                              if(_localobj != null){
                                                              _localobj["creative"].push(selectedValue[i]);
                                                              }
                                                              }
                                                              $scope.selectedcountry = $.unique($scope.selectedcountry);
                                                              if(_localobj != null){
                                                              _localobj["creative"] = $.unique(_localobj["creative"]);
                                                              localStorageService.set("centraldashboardobj",_localobj);
                                                              }
        }else if(parent == "creative" && selected==false){

              var _localobj = localStorageService.get("centraldashboardobj")
                                                                 for(i=0;i<selectedValue.length;i++){
                                                                if(_localobj != null){
                                                                 _localobj["creative"]= _.without(_localobj["creative"],selectedValue[i]);
                                                                 }
                                                                 }
                                                                 if(_localobj != null){
                                                      localStorageService.set("centraldashboardobj",_localobj);
                                                      $scope.selectedcountry = _.without($scope.selectedcountry,selectedValue)
                                                      }
        }else if(parent == "datetime" && selected==true){

            var timerange = [];
            timerange.push($scope.starttime.toString());
            timerange.push($scope.endtime.toString());
            $scope.paramObj.timerange = timerange;
            var _localobj = localStorageService.get("centraldashboardobj")
            if(_localobj != null){
            _localobj.timerange = timerange;
            localStorageService.set("centraldashboardobj",_localobj);
            }

        }

        $scope.paramObj.country = $scope.selectedcountry;
        $scope.paramObj.device = $scope.selectedevice;
        $scope.paramObj.browser = $scope.selectedbrowser;
        $scope.paramObj.creative=$scope.selectecreative;
        $scope.paramObj.campaign=$scope.selectecampaign;
        $scope.paramObj.site=$scope.selectesite;
        var timerange = [];
        timerange.push($scope.starttime.toString());
        timerange.push($scope.endtime.toString());
        $scope.paramObj.timerange = timerange;
        //console.log("$scope.paramObj --> ",$scope.paramObj)

        var _pram = $scope.paramObj;
        var _localobj = localStorageService.get("centraldashboardobj")
        if(_localobj != null){
                console.log("I am Here !!")
                console.log("Create Objact param",_localobj);
                $scope.updateStats(_localobj);
        }else {
              /*  localStorageService.set("centraldashboardobj",_pram);
                $scope.updateStats(_pram);*/
                localStorageService.set("centraldashboardobj",_pram);
                $scope.updateStats(_pram);
        }
    };

    $scope.parkedDiv = [];

    $scope.unparking = function(data){
        var id = data;
        var currentid = "#table"+id;
        //console.log("currentID--> ",currentid);
        //console.log("$scope.parkedDiv-->",$scope.parkedDiv)
        $scope.parkedDiv.pop(currentid);
        var _parkid = "#park-"+data;
        $(_parkid).remove();
        $(currentid).parent().show();
    };

    $scope.parking = function(data) {

        //console.log("Parking ---> ",data);
        //console.log(data);
        var currentid = "#table"+data;
        $scope.parkedDiv.push(currentid);
        $(currentid).parent().hide();
        var parkid = "park-"+data;

        var str = "<span class='parking-garage' id="+"'"+parkid+"'"+" ng-click=unparking('"+data+"')>"+data+"&nbsp;<i class='fa fa-times'></i></span>";
        var htmlTemp = $(str).appendTo("#parking-house");
        $compile(htmlTemp)($scope);
        //$("#parking-house").append(htmlTemp);
        //console.log("$(currentid).parent()-->",$(currentid).parents().attr("id"));
    };

          $scope.removedDimention = [];
          $scope.clickCount = 0;
          $scope.conversionCount = 0;
          $scope.impressionCount = 0;
          $scope.allCount = 0;


    $scope.hiddenVizDivArray = [];
    $scope.hideVizDiv = function(selectedTitle) {

        console.log("hideVizDiv -->",selectedTitle);
        var id = "#"+selectedTitle;
        $scope.hiddenVizDivArray.push(selectedTitle);
        $scope.hiddenVizDivArray = _.uniq($scope.hiddenVizDivArray);
        $(id).hide();

    }

    $scope.vizToggel = function(selectedTitle){

       console.log("vizToggel -->",selectedTitle);
       var id= selectedTitle.toLowerCase()+"-viz-div";
       var _id = "#"+id
       if(_.indexOf($scope.hiddenVizDivArray,id) != -1){

            $(_id).show();
            $scope.hiddenVizDivArray = _.without($scope.hiddenVizDivArray,id)

       }else {

            $(_id).hide();
            $scope.hiddenVizDivArray.push(id);
            $scope.hiddenVizDivArray = _.uniq($scope.hiddenVizDivArray);
       }

       console.log(" vizToggel $scope.hiddenVizDivArray -->",$scope.hiddenVizDivArray)


    };

    $scope.getClassForMetricsDropDown= function(selectedTitle){

    //btn btn-default btn-stats
         if(selectedTitle=="Impression")
                return "btn btn-default btn-stats btn-clicked"
         else if(selectedTitle=="Click")
             return "btn btn-default btn-stats";
         else if(selectedTitle=="Conversion")
             return "btn btn-default btn-stats";
          else
              return "btn btn-default btn-stats"

     }

    $scope.statsToggel = function(data){

        //console.log(data);
        var id="#stats-"+data;
        $(id).toggleClass("btn-clicked");

        //console.log(id);
        if(data == "Impression" && $(id).hasClass("btn-clicked")){

                if($scope.selectedmetrics.length==3 && $("#stats-All").hasClass("btn-clicked")){

                    $scope.selectedmetrics = [];

                }

            $scope.selectedmetrics.push('impression')
            //console.log("Show Impression Data !!");
            $("#stats-All").removeClass("btn-clicked");
            $scope.selectedmetrics = $.unique($scope.selectedmetrics);

                            $scope.paramObj.argmetrics = $scope.selectedmetrics;

                                                var req = $scope.paramObj;
                                                $scope.callDSPBrowserStats(req);
                                                $scope.callDSPDeviceStats(req);
                                                $scope.callDSPAdvertiserStats(req);
                                                $scope.callDSPCampaignStats(req);
                                                $scope.callDSPCountryStats(req);
                                                $scope.callDSPSitesStats(req);

        }else if(data == "Click" && $(id).hasClass("btn-clicked")){

                        if($scope.selectedmetrics.length==3 && $("#stats-All").hasClass("btn-clicked")){

                            $scope.selectedmetrics = [];

                        }


            $scope.selectedmetrics.push('click')
            //console.log("Show Click Data !!")
            $("#stats-All").removeClass("btn-clicked");
            $scope.selectedmetrics = $.unique($scope.selectedmetrics);

                            $scope.paramObj.argmetrics = $scope.selectedmetrics;

                                                var req = $scope.paramObj;
                                                $scope.callDSPBrowserStats(req);
                                                $scope.callDSPDeviceStats(req);
                                                $scope.callDSPAdvertiserStats(req);
                                                $scope.callDSPCampaignStats(req);
                                                $scope.callDSPCountryStats(req);
                                                $scope.callDSPSitesStats(req);



        }else if(data == "Conversion" && $(id).hasClass("btn-clicked")){

                if($scope.selectedmetrics.length==3 && $("#stats-All").hasClass("btn-clicked")){

                    $scope.selectedmetrics = [];

                }
            $scope.selectedmetrics.push('conversion')
            //console.log("Show Conversion Data !!")
            $("#stats-All").removeClass("btn-clicked");
            $scope.selectedmetrics = $.unique($scope.selectedmetrics);


                            $scope.paramObj.argmetrics = $scope.selectedmetrics;

                                                var req = $scope.paramObj;
                                                $scope.callDSPBrowserStats(req);
                                                $scope.callDSPDeviceStats(req);
                                                $scope.callDSPAdvertiserStats(req);
                                                $scope.callDSPCampaignStats(req);
                                                $scope.callDSPCountryStats(req);
                                                $scope.callDSPSitesStats(req);




        }else if(data == "All" && $(id).hasClass("btn-clicked")){
        $scope.selectedmetrics.push('impression')
        $scope.selectedmetrics.push('click')
        $scope.selectedmetrics.push('conversion')
        $("#stats-Conversion").removeClass("btn-clicked");
        $("#stats-Impression").removeClass("btn-clicked");
        $("#stats-Click").removeClass("btn-clicked");
        //console.log("Show All Data !!")
        $scope.selectedmetrics = $.unique($scope.selectedmetrics);
                        $scope.paramObj.argmetrics = $scope.selectedmetrics;

                                            var req = $scope.paramObj;
                                            $scope.callDSPBrowserStats(req);
                                            $scope.callDSPDeviceStats(req);
                                            $scope.callDSPAdvertiserStats(req);
                                            $scope.callDSPCampaignStats(req);
                                            $scope.callDSPCountryStats(req);
                                            $scope.callDSPSitesStats(req);


        }else {

            //console.log("Cart Man-->",data);
            if(data == "Impression"){
             $scope.selectedmetrics = _.without($scope.selectedmetrics, "impression");
             //console.log("I am in Impression block ");

            }
            if(data == "Click"){

            //console.log("I am in Click block ");
            $scope.selectedmetrics = _.without($scope.selectedmetrics, "click");
            }
            if(data == "Conversion"){
            $scope.selectedmetrics = _.without($scope.selectedmetrics, "conversion");
            //console.log("I am in Conversion block ");

            }
            if(data == "All"){
                        $scope.selectedmetrics = _.without($scope.selectedmetrics, "conversion");
                        $scope.selectedmetrics = _.without($scope.selectedmetrics, "click");
                        $scope.selectedmetrics = _.without($scope.selectedmetrics, "impression");
                        console.log("I am in Conversion block ");

                        }
            //console.log("Show No Data !!")

                            $scope.paramObj.argmetrics = $scope.selectedmetrics;

                                                var req = $scope.paramObj;
                                                $scope.callDSPBrowserStats(req);
                                                $scope.callDSPDeviceStats(req);
                                                $scope.callDSPAdvertiserStats(req);
                                                $scope.callDSPCampaignStats(req);
                                                $scope.callDSPCountryStats(req);
                                                $scope.callDSPSitesStats(req);

        }

        //console.log($scope.selectedmetrics)

    };

/*    $scope.statsRemoved =  function(data){
       console.log(data);
        if(data=="Country" || data=="Browser" || data=="Click" || data=="Device" || data == "Site" || data =="Creative" || data == "Campaign") {
            var currentid = "#table" + data;
            $(currentid).parent().hide();
            $scope.removedDimention.push(data);
        }else{

        }
    };*/

    $scope.selectedData = function(data,parentid){

        //console.log("selected",data, " parentId ",parentid);
        //alert("")
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
            var currentvalue=[];
             currentvalue.push(data.name);

            //console.log("currentparent == ",currentparent)
            //console.log("currentvalue == ",currentvalue)

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
            var currentvalue = [];
            currentvalue.push(data.name);

            $scope.createParamObject(currentparent,currentvalue,false);

        }

        //console.log("&*&*&*&*&-->",$scope.parentTag);
    };

    $scope.resetFilterWithTag = function(tag){

        $scope.paramObj

    };

  $scope.multiselectdialogdata = null;

  $scope.user = {
    select: []
  };

    $scope.currentStats = null;
    $scope.currentslectedDimentionList = [];

    $scope.getDimentionSelectedValue = function(data,isSelected){

            var _tmp = $scope.currentStats;

            console.log(isSelected);

            if(_tmp == "country"){
                if(isSelected == true){
                $scope.currentslectedDimentionList.push(data);

                }else{
                $scope.currentslectedDimentionList = _.without($scope.currentslectedDimentionList,data);
                }

            }else if(_tmp == "site"){

                if(isSelected == true){
                               $scope.currentslectedDimentionList.push(data);
                               }else{
                               $scope.currentslectedDimentionList = _.without($scope.currentslectedDimentionList,data);
                               }

            }else if(_tmp == "browser"){

                if(isSelected == true){
                               $scope.currentslectedDimentionList.push(data);
                               }else{
                               $scope.currentslectedDimentionList = _.without($scope.currentslectedDimentionList,data);
                               }

            }else if(_tmp == "device"){

                 if(isSelected == true){
                                $scope.currentslectedDimentionList.push(data);
                                }else{
                                $scope.currentslectedDimentionList = _.without($scope.currentslectedDimentionList,data);
                                }
            }else if(_tmp == "creative"){

                 if(isSelected == true){
                                $scope.currentslectedDimentionList.push(data);
                                }else{
                                $scope.currentslectedDimentionList = _.without($scope.currentslectedDimentionList,data);
                                }
            }else if(_tmp == "campaign"){
                 if(isSelected == true){
                                $scope.currentslectedDimentionList.push(data);
                                }else{
                                $scope.currentslectedDimentionList = _.without($scope.currentslectedDimentionList,data);
                                }

            }

            if(localStorageService.get("centraldashboardobj") != null){

                var _obj = localStorageService.get("centraldashboardobj");

                for(var a=0;a<$scope.currentslectedDimentionList.length;a++){

                    _obj[_tmp].push($scope.currentslectedDimentionList[a]);

                    _obj[_tmp] = _.uniq(_obj[_tmp]);
                }

                localStorageService.set("centraldashboardobj",_obj);
                console.log("_obj",_obj)

            }else{

            var _obj = $scope.paramObj;
             for(var a=0;a<$scope.currentslectedDimentionList.length;a++){

                                _obj[_tmp].push($scope.currentslectedDimentionList[a]);

                                _obj[_tmp] = _.uniq(_obj[_tmp]);
                            }

                            localStorageService.set("centraldashboardobj",_obj);
                            console.log("_obj",_obj)


            }
            console.log("new data-->",$scope.currentslectedDimentionList);
        }


    $scope.multiselectenable = false;

    $scope.mutliselect = function(data) {

            var _paramdata = {};
            _paramdata.id=data.toLowerCase();
            _paramdata.name=data.toLowerCase();
            $scope.currentStats = data.toLowerCase();

            var req = {
                        method: 'POST',
                        url: '/getmultiselectdata',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: _paramdata
                    };

                    $http(req).success(function(data){
                    $scope.multiselectdialogdata = data;
                        //console.log("getmultiselectdata ",$scope.multiselectdialogdata);

                        ngDialog.openConfirm({
                            template: 'assets/templates/dialogTemplate.html',
                            className: 'ngdialog-theme-plain',
                            scope: $scope
                        });

                        //console.log($scope.user.select)

                    }).error(function(){
                    });

    };

    $scope.$on('ngDialog.opened', function (event, $dialog) {
                $dialog.find('.ngdialog-content').css('width', '400px');

    });


    $scope.getMultiFilterDataFromDB = function() {

        $scope.currentslectedDimentionList=[];
        // Tag entry
        console.log("$scope.currentStats ",$scope.currentStats)
        $scope.parentTag.push($scope.currentStats)
        $scope.parentTag=_.uniq($scope.parentTag);
        console.log("$scope.paramObj -->",$scope.paramObj);

           var _obj = localStorageService.get("centraldashboardobj");
                    if(_obj != null){

                        console.log("in getMultiFilterDataFromDB ",_obj);
                        $scope.updateStats(_obj);
                    }

    }

    $scope.closeTag = function(tag){

        var parent = $scope.parentTag.indexOf(tag);
        $scope.parentTag.splice(parent,1);
        for(var i=0;i<$scope.tableDataArr.length;i++){
            if($scope.tableDataArr[i].id==tag){
                $.each($scope.tableDataArr[i].data,function(index){
                    delete $scope.tableDataArr[i].data[index].$selected;
                })
            }
        }

        if(tag=="country"){
            $scope.paramObj.country = [];

            var _obj = localStorageService.get("centraldashboardobj");
            _obj.country = [];
            localStorageService.set("centraldashboardobj",_obj);

        }
        if(tag=="browser"){
            $scope.paramObj.browser = [];
                        var _obj = localStorageService.get("centraldashboardobj");
                        _obj.browser = [];
                        localStorageService.set("centraldashboardobj",_obj);
        }
        if(tag=="device"){
            $scope.paramObj.device = [];
                                    var _obj = localStorageService.get("centraldashboardobj");
                                    _obj.device = [];
                                    localStorageService.set("centraldashboardobj",_obj);
        }
        if(tag=="site"){
            $scope.paramObj.site = [];
             var _obj = localStorageService.get("centraldashboardobj");
             _obj.site = [];
            localStorageService.set("centraldashboardobj",_obj);
        }
        if(tag=="campaign"){
            $scope.paramObj.campaign = [];
                         var _obj = localStorageService.get("centraldashboardobj");
                         _obj.campaign = [];
                        localStorageService.set("centraldashboardobj",_obj);
        }
        if(tag=="creative"){
            $scope.paramObj.creative = [];
                                     var _obj = localStorageService.get("centraldashboardobj");
                                     _obj.creative = [];
                                    localStorageService.set("centraldashboardobj",_obj);

        }

        var _pram = $scope.paramObj;


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
            localStorageService.set("centraldashboardobj",paramdata);

            var _obj = localStorageService.get("centraldashboardobj");
            if(_obj != null){

                $scope.updateStats(_obj);
            }else {

            $scope.updateStats(paramdata);
            }
        }else {

            var _localobj = localStorageService.get("centraldashboardobj");
            if(_localobj != null){
                $scope.updateStats(_localobj);
            }else {
            $scope.updateStats(_pram);
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
             //console.log("callDSPBrowserStats ",data)

             var _d = $scope.templateobj;
             $.each(_d.tableDataArr,function(i,v){
                 if(v.id=="browser"){
                     v.data=data;
                 }
             });

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

    $scope.callImpressionStats = function(parmdata){

        var _paramdata = parmdata;
        _paramdata.metrics="count";
        var req = {
            method: 'POST',
            url: '/impressiondata',
            headers: {
                'Content-Type': 'application/json'
            },
            data: _paramdata
        };

        $http(req).success(function(data){

            //console.log("callImpressionStats ",data);
            $scope.impressiondata = new Intl.NumberFormat().format(parseInt(data[0].value));


        }).error(function(){
        });
    };



    $scope.callClickStats = function(parmdata){

        var _paramdata = parmdata;
        _paramdata.metrics="count";
        var req = {
            method: 'POST',
            url: '/clickdata',
            headers: {
                'Content-Type': 'application/json'
            },
            data: _paramdata
        };

        $http(req).success(function(data){

            //console.log("callClickStats ",data);

            $scope.clickdata=  new Intl.NumberFormat().format(parseInt(data[0].value));

            //console.log("$scope.clickdata",$scope.clickdata )


        }).error(function(){
        });
    };

    $scope.callConversionStats = function(parmdata){

        var _paramdata = parmdata;
        _paramdata.metrics="count";
        var req = {
            method: 'POST',
            url: '/conversiondata',
            headers: {
                'Content-Type': 'application/json'
            },
            data: _paramdata
        };

        $http(req).success(function(data){

            //console.log("callConversionStats ",data);
            $scope.conversiondata = new Intl.NumberFormat().format(parseInt(data[0].value));

        }).error(function(){
        });
    };

    // New DSP code end

    $scope.updateStats = function(param) {
        var req = param;


        $scope.callClickStats(req);
        $scope.callConversionStats(req);
        $scope.callImpressionStats(req);


        $scope.callDSPBrowserStats(req);
        $scope.callDSPDeviceStats(req);
        $scope.callDSPAdvertiserStats(req);
        $scope.callDSPCampaignStats(req);
        $scope.callDSPCountryStats(req);
        $scope.callDSPSitesStats(req);

        $scope.callDSPImpressionCount(req);
        $scope.callDSPclickCount(req);
        $scope.callDSPConversion(req);

       // $scope.applySlimScroll();
    };

    $scope.drawMetricsGraph = function(location,name,data) {

        var _location = $(location);

        _location.html(" ");

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = _location.width() - margin.left - margin.right,
            height = 230 - margin.top - margin.bottom;

        //console.log("Name -> ",name);
        //console.log("location ->",data)

        //console.log($scope.endtime - $scope.starttime)

        var parseDate = d3.time.format("%d-%b-%y").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height,0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            //.ticks(20)
           // .ticks(d3.time.day, 1)
            //.tickFormat(d3.time.format("%Y-%m-%d"));


        var diff = $scope.endtime - $scope.starttime;
        if(diff <= 96400){

           xAxis.ticks(d3.time.hours, 1);
        } else{
            xAxis.ticks(d3.time.day, 1);
        }

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
            .ticks(7)
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
            .attr("height", height + margin.top + margin.bottom + 10)
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
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                    return "rotate(-25)"
                });

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                //.text("Count");

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);

    };
    //console.log("Chal Beta selfi la la ra ",$scope.tableDataArr);

});