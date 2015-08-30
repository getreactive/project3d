var retailApp = angular.module('retailApp',['ngTable','mgcrea.ngStrap','ngDialog','LocalStorageModule']);

retailApp.controller('retailAppCtrl',function($scope,$http,$compile,ngDialog,localStorageService){

    $scope.totalstorecount = 0;
    $scope.totalitemquantity = 0;
    $scope.totalsales = 0;
    $scope.tags = [];
    $scope.parentTag = [];
    $scope.selectCounter = {};

    $scope.paramObj = {
            "timerange":[],
            "state":[],
            "store":[],
            "category":[]
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

                    }];

    $scope.init = function(){

        var paramdata = $scope.paramObj
        console.log("Hello init");
        $scope.getGlobalStats(paramdata);
        $scope.getStateStats(paramdata);
        $scope.getCategoryStats(paramdata);
        $scope.getTotalSalesStats(paramdata);
        $scope.getTotalQuantityStats(paramdata);

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
                            $scope.drawMetricsGraph("#sale-by-state","sale-by-state",data);

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
                                     $scope.drawMetricsGraph("#quantity-sale","quantity-sale",data);

                                 }).error(function(){
                                 });

        };


   $scope.createParamObject = function(parent, selectedValue, selected) {

        console.log("parent --> ",parent);
        console.log("selectedValue --> ",selectedValue);
        console.log("selected --> ",selected);

    };


   $scope.closeTag = function(tag){

    console.log("closeTag --> ",tag);
   }

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

  $scope.mutliselect = function(tabletitle){

        console.log("Table Title selected ", tabletitle);

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

});