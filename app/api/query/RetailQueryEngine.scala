package api.query

import java.sql.ResultSet

import api.data.Datasource

import scala.collection.mutable

/**
 * Created by rahul on 30/08/15.
 */
object RetailQueryEngine {

  val globalstarttime = "1433117400"
  val globalendtime = "1435708800"

  def giveMeQueryString(name:String,data:Array[String]): String ={

    var result  = List[String]()
    var finalqueryStr = ""
    if(data.length != 0){

      for(item <- data){

        result ::= name+"='"+item+"'"
      }
      finalqueryStr = result.mkString(" or ")
    } else {
      finalqueryStr =""
    }

    finalqueryStr
  }
  def getTimeRangeString(name:String,data:Array[String]): String = {

    //println("CartMan "+data(0)+" "+data(1))
    var finalqueryStr = ""
    var _starttime = ""
    var _endtime =""

    if(data.length !=0) {
      _starttime = data(0)
      _endtime = data(1)
      finalqueryStr = " timestamp>="+_starttime+" and timestamp<="+_endtime+" "
      //println("In if statement "+finalqueryStr)
    }else {
      _starttime = globalstarttime
      _endtime = globalendtime
      finalqueryStr = " timestamp>="+_starttime+" and timestamp<="+_endtime+" "
      //println("In else statement "+finalqueryStr)
    }
    //println("Outside "+finalqueryStr)
    finalqueryStr
  }

  def getQueryParam(state: Array[String],store: Array[String],category: Array[String],timerange: Array[String]):String ={

    var queryParam = " "
    val stateStr = giveMeQueryString("state",state)
    val categoryStr = giveMeQueryString("category",category)
    val timerangeStr = getTimeRangeString("timestamp",timerange)
    var result  = List[String]()
    result ::= stateStr
    result ::= categoryStr
    val _tmp = result.filter(_.nonEmpty)
    if(_tmp.length != 0){
      var str = ""
      _tmp.foreach{ e=>
        //println(e)
        str = str +" ("+e+") and "

      }
      str = str.dropRight(4)
      queryParam = " where "+timerangeStr+" and "+str //_tmp.mkString(" and ")
    }else{
      queryParam=" where "+timerangeStr+" "
    }

    queryParam
  }

  def getAggMetrics(metrics:Array[String]): String ={

    var result  = List[String]()
    var queryParam = ""

    //sum(impressioncount) as value, sum(clickcount) as clickvalue, sum(conversioncount) as conversionvalue

    if(metrics.length != 0){

      var result  = List[String]()
      for(item <- metrics){
        var _tmp = ""
        if(item=="sales") {
          queryParam = queryParam + "sum(sales) as sales ,"
          result ::= queryParam
        }else if(item=="quantity"){
          queryParam = queryParam + "sum(quantity) as quantity ,"
          result ::= queryParam
        }
      }

    } else {
      queryParam = " "
    }

    queryParam.dropRight(1)
  }

  //Line chart
  //1. Total Sales by time
  //2. Total Quantity sale by time

  def getTotalSalesStats(state: Array[String],store: Array[String],category: Array[String],timerange: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    val _state = state
    val _store = store
    val _category = category
    val _timerange = timerange
    val whereclouse = getQueryParam(_state,_store,_category,_timerange)

    var rs:ResultSet = null

    //select state, sum(sales) as sales, sum(quantity) as quentity from finalretail group by state Order by sales DESC;

    println("select timestamp, sum(sales) as sales from finalretail "+whereclouse+" group by timestamp Order by sales DESC")

    rs = stmt.executeQuery("select timestamp, sum(sales) as sales from finalretail "+whereclouse+" group by timestamp Order by timestamp ASC")

    var rsdata = Map[String,String]()

    while (rs.next()) {

      val timestamp = rs.getString("timestamp")
      val sales = rs.getString("sales")

      rsdata += "timestamp" -> timestamp
      rsdata += "value" -> sales

      returnData += rsdata
    }

    //println("getGlobalBrowserStats returnData--> "+returnData)
    connection.close()
    returnData
  }

  def getTotalQuantityStats(state: Array[String],store: Array[String],category: Array[String],timerange: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    val _state = state
    val _store = store
    val _category = category
    val _timerange = timerange
    val whereclouse = getQueryParam(_state,_store,_category,_timerange)

    var rs:ResultSet = null

    //select state, sum(sales) as sales, sum(quantity) as quentity from finalretail group by state Order by sales DESC;

    println("select timestamp, sum(quantity) as quantity from finalretail "+whereclouse+" group by timestamp Order by sales ASC")

    rs = stmt.executeQuery("select timestamp, sum(quantity) as quantity from finalretail "+whereclouse+" group by timestamp Order by timestamp ASC")

    var rsdata = Map[String,String]()

    while (rs.next()) {

      val timestamp = rs.getString("timestamp")
      val quantity = rs.getString("quantity")

      rsdata += "timestamp" -> timestamp
      rsdata += "value" -> quantity

      returnData += rsdata
    }

    //println("getGlobalBrowserStats returnData--> "+returnData)
    connection.close()
    returnData
  }

  def getGlobalStateStats(state: Array[String],store: Array[String],category: Array[String],timerange: Array[String],aggmetrics: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    val _state = state
    val _store = store
    val _category = category
    val _timerange = timerange
    val aggMetricsList = getAggMetrics(aggmetrics)
    val whereclouse = getQueryParam(_state,_store,_category,_timerange)

    var rs:ResultSet = null

    //select state, sum(sales) as sales, sum(quantity) as quentity from finalretail group by state Order by sales DESC;

    println("select state, "+aggMetricsList+" from finalretail "+whereclouse+" group by state Order by sales DESC")

    if(aggMetricsList.length == 0) {
      rs = stmt.executeQuery("select state from finalretail" + whereclouse + " group by state Order by sales DESC")
    }else{
      rs = stmt.executeQuery("select state, " + aggMetricsList + " from finalretail" + whereclouse + " group by state Order by sales DESC")

    }
    var rsdata = Map[String,String]()
    var quantity = ""
    var sales = ""
    while (rs.next()) {

      val count = rs.getMetaData.getColumnCount
      val state = rs.getString("state")
      for( index <- 1 to count) {

        if (rs.getMetaData.getColumnName(index).equals("quantity")) {

          quantity = rs.getString("quantity")
          rsdata += "quantity" -> quantity

        }
        if (rs.getMetaData.getColumnName(index).equals("sales")) {
          sales = rs.getString("sales")
          rsdata += "sales" -> sales
        }
      }
      rsdata += "name" -> state

      returnData += rsdata
    }

    //println("getGlobalBrowserStats returnData--> "+returnData)
    connection.close()
    returnData
  }



  def getGlobalCategoryStats(state: Array[String],store: Array[String],category: Array[String],timerange: Array[String],aggmetrics: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    val _state = state
    val _store = store
    val _category = category
    val _timerange = timerange

    val aggMetricsList = getAggMetrics(aggmetrics)
    val whereclouse = getQueryParam(_state,_store,_category,_timerange)

    var rs:ResultSet = null

    //select state, sum(sales) as sales, sum(quantity) as quentity from finalretail group by state Order by sales DESC;

    println("select category, "+aggMetricsList+" from finalretail "+whereclouse+" group by category Order by sales DESC")

    if(aggMetricsList.length == 0) {
      rs = stmt.executeQuery("select category from finalretail" + whereclouse + " group by category Order by sales DESC")
    }else{
      rs = stmt.executeQuery("select category, " + aggMetricsList + " from finalretail" + whereclouse + " group by category Order by sales DESC")
    }
    var rsdata = Map[String,String]()

    var quantity = ""
    var sales = ""
    while (rs.next()) {

      val count = rs.getMetaData.getColumnCount
      val category = rs.getString("category")
      for( index <- 1 to count) {

        if (rs.getMetaData.getColumnName(index).equals("quantity")) {

          quantity = rs.getString("quantity")
          rsdata += "quantity" -> quantity

        }
        if (rs.getMetaData.getColumnName(index).equals("sales")) {
          sales = rs.getString("sales")
          rsdata += "sales" -> sales
        }
      }
      rsdata += "name" -> category

      returnData += rsdata
    }

    //println("getGlobalBrowserStats returnData--> "+returnData)
    connection.close()
    returnData
  }


 // Global Stats Total Store, Total quantity, Total Sales
  def getGlobalStats(state: Array[String],store: Array[String],category: Array[String],timerange: Array[String]):Map[String,String] = {


   val _state = state
   val _store = store
   val _category = category
   val _timerange = timerange

   val whereclouse = getQueryParam(_state,_store,_category,_timerange)
    val queryString = "select count(distinct(store)) as stotecount, sum(quantity) as totalquantity, sum(sales) as totalsales from finalretail "+whereclouse;

   // val returnData = mutable.ArrayBuffer[Map[String,String]]()

    var revenueByCountry = Map[String,String]()

    val connection = Datasource.connectionPool.getConnection

    val stmt = connection.createStatement()

    val rs = stmt.executeQuery(queryString)

    while (rs.next()) {

      val stotecount = rs.getString("stotecount")
      val totalquantity= rs.getString("totalquantity")
      val totalsales = rs.getString("totalsales")

      revenueByCountry = Map("stotecount"->stotecount,"totalquantity"->totalquantity,"totalsales"->totalsales)

    }
    connection.close()
    revenueByCountry
  }

  def getGlobaDataDialog(dimention: String):mutable.Seq[Map[String,String]]={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var rs:ResultSet = null
    //select country,count(country) from demofinal group by country;
    val query = "select "+dimention+" as name ,count("+dimention+") as value from finalretail  group by "+dimention;
    //println("Bla Bla "+query);
    rs = stmt.executeQuery(query);
    while (rs.next()) {
      val name = rs.getString("name")
      val value = rs.getString("value")
      val revenueByCountry = Map("name"->name,"value"->value)
      returnData+=revenueByCountry
    }

    connection.close()
    returnData
  }

}
