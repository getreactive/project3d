var retailApp = angular.module('retailApp',['ngTable','mgcrea.ngStrap','ngDialog','LocalStorageModule']);

retailApp.controller('retailAppCtrl',function($scope,$http,$compile,ngDialog,localStorageService){

    $scope.totalstorecount = 0;
    $scope.totalitemquantity = 0;
    $scope.totalsales = 0;
    $scope.tags = [];
    $scope.parentTag = [];
    $scope.selectCounter = {};
    $scope.selectedstate = [];
    $scope.selectedcategory = [];
    $scope.selectedstore = [];
    $scope.selecteditem = [];
    $scope.selectedmetrics = ['sales'];
    $scope.currentStats = null;
    $scope.currentslectedDimentionList = [];
    $scope.paramObj = {
            "timerange":[],
            "state":[],
            "store":[],
            "category":[],
            "item":[],
            "argmetrics":['sales']
    };
    $scope.tableDataArr =[{
                        "id": "state",
                        "title": "State",
                        "data": []
                    },
                    {
                        "id": "category",
                        "title": "Category",
                        "data": []

                    },
                    {
                         "id": "store",
                         "title": "Store",
                         "data": []

                    },
                     {
                          "id": "item",
                          "title": "Item",
                          "data": []

                     }];

    $scope.graphDataArr = [
            {
                "id": "quantity",
                "title": "Quantity"
            },
            {
                "id": "sales",
                "title": "Sales"
            }

        ];

        $scope.getClassForMetricsDropDown= function(selectedTitle){

        //btn btn-default btn-stats
             if(selectedTitle=="Sales")
                    return "btn btn-default btn-stats btn-clicked"
             else if(selectedTitle=="Quantity")
                 return "btn btn-default btn-stats";
              else
                  return "btn btn-default btn-stats"

         }

    $scope.statsToggel = function(data){

        console.log("$scope.statsToggel --> ",data);
        var id="#stats-"+data;
        $(id).toggleClass("btn-clicked");

        //console.log(id);
        if(data == "Sales" && $(id).hasClass("btn-clicked")){

                if($scope.selectedmetrics.length==2 && $("#stats-All").hasClass("btn-clicked")){

                    $scope.selectedmetrics = [];

                }

            $scope.selectedmetrics.push('sales')
            //console.log("Show Impression Data !!");
            $("#stats-All").removeClass("btn-clicked");
            $scope.selectedmetrics = $.unique($scope.selectedmetrics);

                            $scope.paramObj.argmetrics = $scope.selectedmetrics;

                                                var req = $scope.paramObj;
            $scope.getStateStats(req);
            $scope.getCategoryStats(req);
            $scope.getStoreStats(req);
            $scope.getItemStats(req);
        }else if(data == "Quantity" && $(id).hasClass("btn-clicked")){

                        if($scope.selectedmetrics.length==2 && $("#stats-All").hasClass("btn-clicked")){

                            $scope.selectedmetrics = [];

                        }


            $scope.selectedmetrics.push('quantity')
            //console.log("Show Click Data !!")
            $("#stats-All").removeClass("btn-clicked");
            $scope.selectedmetrics = $.unique($scope.selectedmetrics);

                            $scope.paramObj.argmetrics = $scope.selectedmetrics;

                                                var req = $scope.paramObj;
                                                            $scope.getStateStats(req);
                                                            $scope.getCategoryStats(req);
                                                            $scope.getStoreStats(req);
                                                            $scope.getItemStats(req);



        }else if(data == "All" && $(id).hasClass("btn-clicked")){
        $scope.selectedmetrics.push('sales')
        $scope.selectedmetrics.push('quantity')
        $("#stats-Sales").removeClass("btn-clicked");
        $("#stats-Quantity").removeClass("btn-clicked");
        //console.log("Show All Data !!")
        $scope.selectedmetrics = $.unique($scope.selectedmetrics);
        $scope.paramObj.argmetrics = $scope.selectedmetrics;

        var req = $scope.paramObj;
        $scope.getStateStats(req);
        $scope.getCategoryStats(req);
        $scope.getStoreStats(req);
        $scope.getItemStats(req);


        }else {

            //console.log("Cart Man-->",data);
            if(data == "Quantity"){
             $scope.selectedmetrics = _.without($scope.selectedmetrics, "quantity");
            }
            if(data == "Sales"){

            //console.log("I am in Click block ");
            $scope.selectedmetrics = _.without($scope.selectedmetrics, "sales");
            }
            if(data == "All"){
                        $scope.selectedmetrics = _.without($scope.selectedmetrics, "quantity");
                        $scope.selectedmetrics = _.without($scope.selectedmetrics, "sales");
                        console.log("I am in Conversion block ");

                        }
            //console.log("Show No Data !!")

                            $scope.paramObj.argmetrics = $scope.selectedmetrics;

                                                var req = $scope.paramObj;
                                                       $scope.getStateStats(req);
                                                       $scope.getCategoryStats(req);
                                                       $scope.getStoreStats(req);
                                                       $scope.getItemStats(req);

        }

        //console.log($scope.selectedmetrics)

    };
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

                console.log("#viz-"+selectedTitle);
                $("#viz-"+selectedTitle).addClass("btn-clicked");
           }else {

                $(_id).hide();
                $scope.hiddenVizDivArray.push(id);
                $scope.hiddenVizDivArray = _.uniq($scope.hiddenVizDivArray);
                $("#viz-"+selectedTitle).removeClass("btn-clicked")
           }

           console.log(" vizToggel $scope.hiddenVizDivArray -->",$scope.hiddenVizDivArray)


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

    $scope.init = function(){

        localStorageService.set("centralretaildashboardobj",null);

        var paramdata = $scope.paramObj
        console.log("Hello init");
        $scope.getGlobalStats(paramdata);
        $scope.getStateStats(paramdata);
        $scope.getCategoryStats(paramdata);
        $scope.getStoreStats(paramdata);
        $scope.getItemStats(paramdata);
        $scope.getTotalSalesStats(paramdata);
        $scope.getTotalQuantityStats(paramdata);
        $scope.datetimecheck();
        //stats-Sales

    };

        $scope.updateStats = function(param) {
            var req = param;

            console.log("updateStats--> ",req)
            $scope.dataDownload = param;

            $scope.getGlobalStats(req);
            $scope.getStateStats(req);
            $scope.getCategoryStats(req);
            $scope.getStoreStats(req);
            $scope.getItemStats(req);
            $scope.getTotalSalesStats(req);
            $scope.getTotalQuantityStats(req);


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

                    console.log("Data --> ",data);
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
                //$scope.drawPieChart("#pie-sales",data);
                $.each($scope.tableDataArr,function(i,v){

                     if(v.id=="state"){
                         v.data=data;
                     }
                });

            }).error(function(){
            });

    };

    $scope.getCategoryStats = function(paramdata){

                var _paramdata = paramdata;
                var req = {
                    method: 'POST',
                    url: '/retail/getcategorystats',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: _paramdata
                };

                $http(req).success(function(data){

                    console.log("getCategoryStats --> ",data)


                     $.each($scope.tableDataArr,function(i,v){

                         if(v.id=="category"){
                             v.data=data;
                         }
                     });

                }).error(function(){
                });

        };


        $scope.getStoreStats = function(paramdata){

                    var _paramdata = paramdata;
                    var req = {
                        method: 'POST',
                        url: '/retail/getstorestats',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: _paramdata
                    };

                    $http(req).success(function(data){

                        console.log("getStoreStats --> ",data)


                         $.each($scope.tableDataArr,function(i,v){

                             if(v.id=="store"){
                                 v.data=data;
                             }
                         });

                    }).error(function(){
                    });

            };

            $scope.getItemStats = function(paramdata){

                        var _paramdata = paramdata;
                        var req = {
                            method: 'POST',
                            url: '/retail/getitemstats',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: _paramdata
                        };

                        $http(req).success(function(data){

                            console.log("getItemStats --> ",data)


                             $.each($scope.tableDataArr,function(i,v){

                                 if(v.id=="item"){
                                     v.data=data;
                                 }
                             });

                        }).error(function(){
                        });

                };

    $scope.getTotalSalesStats = function(paramdata){

                        var _paramdata = paramdata;
                        var req = {
                            method: 'POST',
                            url: '/retail/gettotalsalesstats',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: _paramdata
                        };

                        $http(req).success(function(data){

                            console.log("$scope.getTotalSalesStats --> ",data);
                            $scope.drawMetricsGraph("#sales-by-state","sales-by-state",data);

                        }).error(function(){
                        });

         };
    $scope.getTotalQuantityStats = function(paramdata){

                                 var _paramdata = paramdata;
                                 var req = {
                                     method: 'POST',
                                     url: '/retail/gettotalquantitystats',
                                     headers: {
                                         'Content-Type': 'application/json'
                                     },
                                     data: _paramdata
                                 };

                                 $http(req).success(function(data){

                                     console.log("$scope.getTotalQuantityStats --> ",data);
                                     $scope.drawMetricsGraph("#quantity-sales","quantity-sales",data);

                                 }).error(function(){
                                 });

        };


   $scope.createParamObject = function(parent, selectedValue, selected) {

        console.log("parent --> ",parent);
        console.log("selectedValue --> ",selectedValue);
        console.log("selected --> ",selected);

        if(parent == "state" && selected==true){

              var _localobj = localStorageService.get("centralretaildashboardobj")

                 for(i=0;i<selectedValue.length;i++){

                    $scope.selectedstate.push(selectedValue[i]);
                    if(_localobj != null){
                    _localobj["state"].push(selectedValue[i]);
                    }

                    }
                    $scope.selectedstate = $.unique($scope.selectedstate);
                    console.log("$scope.selectedstate-->",$scope.selectedstate);

                    if(_localobj != null){
                    _localobj["state"] = $.unique(_localobj["state"]);

                    localStorageService.set("centralretaildashboardobj",_localobj);
                    }

                }else if(parent == "state" && selected==false){

                 var _localobj = localStorageService.get("centralretaildashboardobj")
                            for(i=0;i<selectedValue.length;i++){
                            if(_localobj != null){
                            _localobj["state"]= _.without(_localobj["state"],selectedValue[i]);
                            }
                            }
                            if(_localobj != null){
                 localStorageService.set("centralretaildashboardobj",_localobj);
                 }
                 $scope.selectedstate = _.without($scope.selectedstate,selectedValue)

                }else if(parent == "category" && selected==true){

                  var _localobj = localStorageService.get("centralretaildashboardobj")
                             for(i=0;i<selectedValue.length;i++){

                             $scope.selectedcategory.push(selectedValue[i])
                             if(_localobj != null){
                             _localobj["category"].push(selectedValue[i]);
                             }
                             }
                             $scope.selectedcategory = $.unique($scope.selectedcategory);
                             if(_localobj != null){
                             _localobj["category"] = $.unique(_localobj["category"]);
                             localStorageService.set("centralretaildashboardobj",_localobj);
                             }
                }else if(parent == "category" && selected==false){

                 var _localobj = localStorageService.get("centralretaildashboardobj")
                            for(i=0;i<selectedValue.length;i++){
                if(_localobj != null){
                            _localobj["category"]= _.without(_localobj["category"],selectedValue[i]);
                            }
                            }
                            if(_localobj != null){
                 localStorageService.set("centralretaildashboardobj",_localobj);
                 }
                 $scope.selectedcategory = _.without($scope.selectedstore,selectedValue)

                }else if(parent == "store" && selected==true){

                                   var _localobj = localStorageService.get("centralretaildashboardobj")
                                              for(i=0;i<selectedValue.length;i++){

                                              $scope.selectedstore.push(selectedValue[i])
                                              if(_localobj != null){
                                              _localobj["store"].push(selectedValue[i]);
                                              }
                                              }
                                              $scope.selectedstore = $.unique($scope.selectedstore);
                                              if(_localobj != null){
                                              _localobj["store"] = $.unique(_localobj["store"]);
                                              localStorageService.set("centralretaildashboardobj",_localobj);
                                              }
                                 }else if(parent == "store" && selected==false){

                                  var _localobj = localStorageService.get("centralretaildashboardobj")
                                             for(i=0;i<selectedValue.length;i++){
                                 if(_localobj != null){
                                             _localobj["store"]= _.without(_localobj["store"],selectedValue[i]);
                                             }
                                             }
                                             if(_localobj != null){
                                  localStorageService.set("centralretaildashboardobj",_localobj);
                                  }
                                  $scope.selectedstore = _.without($scope.selectedstore,selectedValue)

                                 }else if(parent == "item" && selected==true){

                                                                     var _localobj = localStorageService.get("centralretaildashboardobj")
                                                                                for(i=0;i<selectedValue.length;i++){

                                                                                $scope.selecteditem.push(selectedValue[i])
                                                                                if(_localobj != null){
                                                                                _localobj["item"].push(selectedValue[i]);
                                                                                }
                                                                                }
                                                                                $scope.selecteditem = $.unique($scope.selecteditem);
                                                                                if(_localobj != null){
                                                                                _localobj["item"] = $.unique(_localobj["item"]);
                                                                                localStorageService.set("centralretaildashboardobj",_localobj);
                                                                                }
                                                                   }else if(parent == "item" && selected==false){

                                                                    var _localobj = localStorageService.get("centralretaildashboardobj")
                                                                               for(i=0;i<selectedValue.length;i++){
                                                                   if(_localobj != null){
                                                                               _localobj["item"]= _.without(_localobj["item"],selectedValue[i]);
                                                                               }
                                                                               }
                                                                               if(_localobj != null){
                                                                    localStorageService.set("centralretaildashboardobj",_localobj);
                                                                    }
                                                                    $scope.selecteditem = _.without($scope.selecteditem,selectedValue)

                                                                   }else if(parent == "datetime" && selected==true){

                    var timerange = [];
                    timerange.push($scope.starttime.toString());
                    timerange.push($scope.endtime.toString());
                    $scope.paramObj.timerange = timerange;
                    var _localobj = localStorageService.get("centralretaildashboardobj")
                    if(_localobj != null){
                    _localobj.timerange = timerange;
                    localStorageService.set("centralretaildashboardobj",_localobj);
                    }

                }

                $scope.paramObj.state = $scope.selectedstate;
                $scope.paramObj.category = $scope.selectedcategory;
                $scope.paramObj.store = $scope.selectedstore;
                $scope.paramObj.item = $scope.selecteditem;

                var timerange = [];
                timerange.push($scope.starttime.toString());
                timerange.push($scope.endtime.toString());
                $scope.paramObj.timerange = timerange;
                //console.log("$scope.paramObj --> ",$scope.paramObj)

                var _pram = $scope.paramObj;
                var _localobj = localStorageService.get("centralretaildashboardobj")
                if(_localobj != null){
                        console.log("I am Here !!")
                        console.log("Create Objact param",_localobj);
                        $scope.updateStats(_localobj);
                }else {
                      /*  localStorageService.set("centraldashboardobj",_pram);
                        $scope.updateStats(_pram);*/
                        localStorageService.set("centralretaildashboardobj",_pram);
                        $scope.updateStats(_pram);
                }
    };

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

        if(tag=="state"){
            $scope.paramObj.state = [];

            var _obj = localStorageService.get("centralretaildashboardobj");
            _obj.state = [];
            localStorageService.set("centralretaildashboardobj",_obj);

        }
        if(tag=="category"){
            $scope.paramObj.category = [];
                        var _obj = localStorageService.get("centralretaildashboardobj");
                        _obj.category = [];
                        localStorageService.set("centralretaildashboardobj",_obj);
        }if(tag=="store"){
                     $scope.paramObj.store = [];
                                 var _obj = localStorageService.get("centralretaildashboardobj");
                                 _obj.store = [];
                                 localStorageService.set("centralretaildashboardobj",_obj);
                 }if(tag=="item"){
                              $scope.paramObj.item = [];
                                          var _obj = localStorageService.get("centralretaildashboardobj");
                                          _obj.item = [];
                                          localStorageService.set("centralretaildashboardobj",_obj);
                          }

        var _pram = $scope.paramObj;

        if($scope.parentTag.length == 0){

            $scope.selectedstate = [];
            $scope.selectedcategory = [];
            $scope.selectedstore = [];
            $scope.selecteditem = [];

            $scope.paramObj.state = [];
            $scope.paramObj.category = [];
            $scope.paramObj.store = [];
            $scope.paramObj.item = [];

            var paramdata = $scope.paramObj;
            localStorageService.set("centralretaildashboardobj",paramdata);

            var _obj = localStorageService.get("centralretaildashboardobj");
            if(_obj != null){

                $scope.updateStats(_obj);
            }else {

            $scope.updateStats(paramdata);
            }
        }else {

            var _localobj = localStorageService.get("centralretaildashboardobj");
            if(_localobj != null){
                $scope.updateStats(_localobj);
            }else {
            $scope.updateStats(_pram);
            }
        }

    };

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

    $scope.changeSelection = function(data) {

        var req = $scope.paramObj;

    };

    $scope.multiselectenable = false;

    $scope.mutliselect = function(data) {

            var _paramdata = {};
            _paramdata.id=data.toLowerCase();
            _paramdata.name=data.toLowerCase();
            $scope.currentStats = data.toLowerCase();

            var req = {
                        method: 'POST',
                        url: '/retail/getmultiselectdata',
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

               var _obj = localStorageService.get("centralretaildashboardobj");
                        if(_obj != null){

                            console.log("in getMultiFilterDataFromDB ",_obj);
                            $scope.updateStats(_obj);
                        }

        }

   $scope.getDimentionSelectedValue = function(data,isSelected){

                    var _tmp = $scope.currentStats;

                    console.log(isSelected);

                    if(_tmp == "state"){
                        if(isSelected == true){
                        $scope.currentslectedDimentionList.push(data);

                        }else{
                        $scope.currentslectedDimentionList = _.without($scope.currentslectedDimentionList,data);
                        }

                    }else if(_tmp == "category"){

                        if(isSelected == true){
                                       $scope.currentslectedDimentionList.push(data);
                                       }else{
                                       $scope.currentslectedDimentionList = _.without($scope.currentslectedDimentionList,data);
                                       }

                    }

                    if(localStorageService.get("centralretaildashboardobj") != null){

                        var _obj = localStorageService.get("centralretaildashboardobj");

                        for(var a=0;a<$scope.currentslectedDimentionList.length;a++){

                            _obj[_tmp].push($scope.currentslectedDimentionList[a]);

                            _obj[_tmp] = _.uniq(_obj[_tmp]);
                        }

                        localStorageService.set("centralretaildashboardobj",_obj);
                        console.log("_obj",_obj)

                    }else{

                    var _obj = $scope.paramObj;
                     for(var a=0;a<$scope.currentslectedDimentionList.length;a++){

                                        _obj[_tmp].push($scope.currentslectedDimentionList[a]);

                                        _obj[_tmp] = _.uniq(_obj[_tmp]);
                                    }

                                    localStorageService.set("centralretaildashboardobj",_obj);
                                    console.log("_obj",_obj)


                    }
                    console.log("new data-->",$scope.currentslectedDimentionList);
                }


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


      $scope.drawPieChart = function(location,data){

         var _location = $(location);

          _location.html(" ");

         var margin = {top: 20, right: 20, bottom: 30, left: 50},
         width = _location.width() - margin.left - margin.right,
         height = 230 - margin.top - margin.bottom;

         var radius = Math.min(width, height) / 2;

                var color = d3.scale.category20b();

                var svg = d3.select(location)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)
                  .append('g')
                  .attr('transform', 'translate(' + (width / 2) +
                    ',' + (height / 2) + ')');

                var arc = d3.svg.arc()
                  .outerRadius(radius);

                var pie = d3.layout.pie()
                  .value(function(d) { return d.sales; })
                  .sort(null);


                data.forEach(function(d) {

                                    d.name = d.name;
                                    d.sales = +parseInt(d.sales);
                                });

                console.log("YUUYUY --> ",data);

                var path = svg.selectAll('path')
                  .data(pie(data))
                  .enter()
                  .append('path')
                  .attr('d', arc)
                  .attr('fill', function(d, i) {
                    return color(d.data.name);
                  });

                path.on('mouseover', function(d) {

                    console.log(d)
                });

                  path.on('mouseout', function() {
                    console.log("Mouse out")
                  });

      }




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

});