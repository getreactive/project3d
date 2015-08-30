package controllers.data

import java.io.File
import java.sql.{ResultSet, SQLException}
import java.util.Random

import org.h2.api.Aggregate

import scala.collection.mutable
import scala.collection.mutable.ListBuffer

/**
 * Created by rahul on 02/07/15.
 */
object DSPQueryEngine {

  val globalstarttime = "1433117400"
  val globalendtime = "1435708800"

  def main(args: Array[String]) {
    //val a = getRevenueByCountry("IN")
   //     getGlobalTotalRevenue
    // val a =getConversion("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"),Array())
    //  val b =getImpression("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"),Array())
    // val c =getClick("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"),Array())

    // def getGlobalBrowserStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String],aggmetrics: Array[String]):mutable.Seq[Map[String,String]] ={

   // val d = getGlobalBrowserStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"),Array(globalstarttime,globalendtime),Array("impression","click"))
   // val e = getGlobalDeviceStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"),Array(globalstarttime,globalendtime),Array("impression","click"))
   // val f = getGlobalSiteStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"),Array(globalstarttime,globalendtime),Array("impression","click"))
   // val g = getGlobalCreativeStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"),Array(globalstarttime,globalendtime),Array("impression","click"))
   // val h = getGlobalCountryStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"),Array(globalstarttime,globalendtime),Array("impression","click"))
   // val i = getGlobalAdvertiserStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"),Array(globalstarttime,globalendtime),Array("impression","click"))
   // val j = getGlobalCampaignStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"),Array(globalstarttime,globalendtime),Array("impression","click"))
    val k =getCurrentDataDownload("",Array("HK"),Array("IE"),Array(),Array(),Array(),Array(),Array("1433117400","1435708800"),Array("impression","click","conversion"))

   /*  val d = getGlobalBrowserStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"))
     val e = getGlobalSiteStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"))
     val f = getGlobalCreativeStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"))*/
    println(k)

  //  println(b)
  //  println(c)
/*    println(d)
    println(e)
    println(f)*/
    /*    getGlobalDeviceStats("revenue")
    getGlobalTotalRevenue(Array(),Array(),Array())
    getGlobalTotalRevenue(Array("IN","US"),Array("safari","opera","IE"),Array())
    getGlobalTotalFilledImpression(Array(),Array("safari","opera","IE"),Array("PC"))
    getGlobalTotaleCPM(Array("IN","US"),Array("safari","opera","IE"),Array("PC","Mobile"))
    getGlobalTotaleCPM("US","opera","PC")
    println(a)*/
//    getQueryParam(Array("IN","US"),Array("safari","opera","IE"),Array(),Array(),Array(),Array(),Array())
  //  getQueryParam(Array(),Array(),Array(),Array(),Array(),Array(),Array())
  }


  // select country, count(*) from demotable where device=" " and device=" " and browser=" " and browser=" " and site=" "
  // and site= " " and advertiser=" " and advertiser=" " and campaign=" " and campaign=" ";
  // country
  // device
  // browser
  // site
  // advertiser
  // campaign

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

  def getQueryParam(country: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String], creative: Array[String],timerange: Array[String]): String= {

    var queryParam = " "
    val countryStr = giveMeQueryString("country",country)
    val browserStr = giveMeQueryString("browser",browser)
    val deviceStr = giveMeQueryString("device",device)
    val siteStr = giveMeQueryString("site",site)
    val campaignStr = giveMeQueryString("campaign",campaign)
    val creativeStr = giveMeQueryString("creative",creative)
    val timerangeStr = getTimeRangeString("timestamp",timerange);
    var result  = List[String]()
    result ::= countryStr
    result ::= browserStr
    result ::= deviceStr
    result ::= siteStr
    result ::= campaignStr
    result ::= creativeStr
    val _tmp = result.filter(_.nonEmpty)
   // println("_tmp ",_tmp)
    if(_tmp.length != 0){
      var str = ""
      _tmp.foreach{ e=>
        //println(e)
        str = str +" ("+e+") and "

      }
      //println(str)
      str = str.dropRight(4)
    queryParam = " where "+timerangeStr+" and "+str //_tmp.mkString(" and ")
    }else{
      queryParam=" where "+timerangeStr+" "
    }
    queryParam
  };

  def getAggMetrics(metrics:Array[String]): String ={

    var result  = List[String]()
    var queryParam = ""

    //sum(impressioncount) as value, sum(clickcount) as clickvalue, sum(conversioncount) as conversionvalue

    if(metrics.length != 0){

      var result  = List[String]()
      for(item <- metrics){
        var _tmp = ""
        if(item=="impression") {
          _tmp = "value"
          var _t = item+"count"
          queryParam = queryParam + "sum("+_t+") as value ,"
          result ::= queryParam
        }else{
          var _t = item+"count"
          _tmp = item+"value"
          queryParam = queryParam + "sum("+_t+") as "+_tmp+" ,"
          result ::= queryParam
        }
      }

    } else {
      queryParam = " "
    }

    queryParam.dropRight(1)
  }

  //Chart : 1

  def getGlobalTotalImpression(countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    val _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange
    val whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    var t1 = _timerange(0).toLong
    var t2 = _timerange(1).toLong

    var diff = t2 - t1;
    //println("GOGOGGO--> "+diff)

    var queryString = ""
    if(diff>=96400){
      queryString = "select timestamp,day,sum(impressioncount) as impression from demofinal "+whereclouse+" group by day,timestamp"
    }else {
      queryString = "select timestamp,day,sum(impressioncount) as impression from demofinal " + whereclouse + " group by timestamp"
    }
    //println("###### "+queryString)
    //SELECT date,sum(revenue) as revenue from finaldemo where country='IN' and device='PC' and browser='IE' group by date;

    val rs = stmt.executeQuery(queryString)

    while (rs.next()) {
      //println("Read from DB: " + rs.getString("timestamp") + "\t"+ rs.getString("impression"))
      val timestamp = rs.getString("timestamp")
      val day = rs.getString("day")
      val impression = rs.getString("impression")

      val revenueByCountry = Map("timestamp"->timestamp,"day"->day,"value"->impression)
      returnData+=revenueByCountry
    }
    connection.close()

    returnData
  };


  //Chart : 2

  def getGlobalClickCount(countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection

    val stmt = connection.createStatement()

    val _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange
    val whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)
    //select timestamp,day,sum(impressioncount) from demofinal where country='US' or country='IN' group by day,timestamp;
    val queryString = "select timestamp,day,sum(clickcount) as clickcount from demofinal "+whereclouse+" group by day,timestamp"
    println("###### "+queryString)
    //SELECT date,sum(revenue) as revenue from finaldemo where country='IN' and device='PC' and browser='IE' group by date;

    val rs = stmt.executeQuery(queryString)

    while (rs.next()) {
      //println("Read from DB: " + rs.getString("timestamp") + "\t"+ rs.getString("clickcount"))
      val timestamp = rs.getString("timestamp")
      val day= rs.getString("day")
      val clickcount = rs.getString("clickcount")

      val revenueByCountry = Map("timestamp"->timestamp,"day"->day,"value"->clickcount)
      returnData+=revenueByCountry
    }
    connection.close()

    returnData
  };

  //Chart : 3

  def getGlobalConversionCount(countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection

    val stmt = connection.createStatement()

    val _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange
    val whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    //select timestamp,day,sum(impressioncount) from demofinal where country='US' or country='IN' group by day,timestamp;
    val queryString = "select timestamp,day,sum(conversioncount) as conversioncount from demofinal "+whereclouse+" group by day,timestamp"
    println("###### "+queryString)
    //SELECT date,sum(revenue) as revenue from finaldemo where country='IN' and device='PC' and browser='IE' group by date;

    val rs = stmt.executeQuery(queryString)

    while (rs.next()) {
      //println("Read from DB: " + rs.getString("timestamp") + "\t"+ rs.getString("conversioncount"))
      val timestamp = rs.getString("timestamp")
      val day = rs.getString("day")
      val conversioncount = rs.getString("conversioncount")

      val revenueByCountry = Map("timestamp"->timestamp,"day"->day,"value"->conversioncount)
      returnData+=revenueByCountry
    }
    connection.close()

    returnData
  };

  def getDataDownloadFinalResult(rs: ResultSet)={

    while(rs.next()) {



    }

  }


  def getStatsFinalResult(selectedColumn: String,rs: ResultSet) = {
    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    while (rs.next()) {
      // println("Read from DB: " + rs.getString("browser") + "\t"+ rs.getString("value"))
      try {
        var rsdata = Map[String,String]()
        var value = ""
        var clickvalue = ""
        var conversionvalue = ""
        val count = rs.getMetaData.getColumnCount
        for( index <- 1 to count){

          if (rs.getMetaData.getColumnName(index).equals("value")){
            value = rs.getString("value")
            rsdata += "value" -> value

          }
          if (rs.getMetaData.getColumnName(index).equals("clickvalue")){
            clickvalue = rs.getString("clickvalue")
            rsdata += "clickvalue" -> clickvalue
          }
          if (rs.getMetaData.getColumnName(index).equals("conversionvalue")){
            conversionvalue = rs.getString("conversionvalue")
            rsdata += "conversionvalue" -> conversionvalue
          }
          if (rs.getMetaData.getColumnName(index).equals("browser")){
            val browser = rs.getString("browser")
            rsdata += "id" -> browser
            rsdata += "name" -> browser
          }
          if (rs.getMetaData.getColumnName(index).equals("site")){
            val site = rs.getString("site")
            rsdata += "id" -> site
            rsdata += "name" -> site
          }
          if (rs.getMetaData.getColumnName(index).equals("device")){
            val device = rs.getString("device")
            rsdata += "id" -> device
            rsdata += "name" -> device
          }
          if (rs.getMetaData.getColumnName(index).equals("country")){
            val country = rs.getString("country")
            rsdata += "id" -> country
            rsdata += "name" -> country
          }
          if (rs.getMetaData.getColumnName(index).equals("creative")){
            val creative = rs.getString("creative")
            rsdata += "id" -> creative
            rsdata += "name" -> creative
          }
          if (rs.getMetaData.getColumnName(index).equals("campaign")){
            val campaign = rs.getString("campaign")
            rsdata += "id" -> campaign
            rsdata += "name" -> campaign
          }
          if (rs.getMetaData.getColumnName(index).equals("advertiser")){
            val advertiser = rs.getString("advertiser")
            rsdata += "id" -> advertiser
            rsdata += "name" -> advertiser
          }
        }
        //val revenueByCountry = Map("id"->browser,"name"->browser,"value"->value,"clickvalue"->clickvalue,"conversionvalue"->conversionvalue)
        returnData+=rsdata

      }catch {
        case e: SQLException => println("oee oee oee")
      }

    }

    returnData
  }

  // Table : 1
  def getGlobalBrowserStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String],aggmetrics: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    val _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange
    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
    }

    val whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)
    val aggMetricsList = getAggMetrics(aggmetrics)
    val finalMetricsquery = aggMetricsList//.mkString(" , ")

    var rs:ResultSet = null
     println("select browser, "+aggMetricsList+" from demofinal "+whereclouse+" group by browser")
    if(aggMetricsList.length == 0){
      rs = stmt.executeQuery("select browser from demofinal " + whereclouse + " group by browser")
    }else {
       rs = stmt.executeQuery("select browser, " + aggMetricsList + " from demofinal " + whereclouse + " group by browser")
      println("select browser, " + aggMetricsList + " from demofinal " + whereclouse + " group by browser")
    }
    returnData = getStatsFinalResult("browser",rs)

    //println("getGlobalBrowserStats returnData--> "+returnData)
    connection.close()
    returnData
  }


  // Table : 2
  def getGlobalDeviceStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String],aggmetrics: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    var _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    val aggMetricsList = getAggMetrics(aggmetrics)

   // println("select device, sum(impressioncount) as value, sum(clickcount) as clickvalue, sum(conversioncount) as conversionvalue from demofinal "+whereclouse+" group by device")

    var rs:ResultSet = null
    println("select device, "+aggMetricsList+" from demofinal "+whereclouse+" group by device")
    if(aggMetricsList.length == 0){
      rs = stmt.executeQuery("select device from demofinal " + whereclouse + " group by device")
    }else {
      rs = stmt.executeQuery("select device, " + aggMetricsList + " from demofinal " + whereclouse + " group by device")
    }
    returnData = getStatsFinalResult("device",rs)

    //println("getGlobalDeviceStats returnData--> "+returnData)

    connection.close()
    returnData
  }


  def getGlobaDataDialog(dimention: String):mutable.Seq[Map[String,String]]={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var rs:ResultSet = null
    //select country,count(country) from demofinal group by country;
    val query = "select "+dimention+" as name ,count("+dimention+") as value from demofinal  group by "+dimention;
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



  //Table : 3
  def getGlobalCountryStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String],aggmetrics: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    var _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    val aggMetricsList = getAggMetrics(aggmetrics)

    //println("select country, count(country) as value from demofinal "+whereclouse+" group by country")

    var rs:ResultSet = null
    println("select country, "+aggMetricsList+" from demofinal "+whereclouse+" group by country")
    if(aggMetricsList.length == 0){
      rs = stmt.executeQuery("select country from demofinal " + whereclouse + " group by country")
    }else {
      rs = stmt.executeQuery("select country, " + aggMetricsList + " from demofinal " + whereclouse + " group by country")
    }
    returnData = getStatsFinalResult("country",rs)

    //println("getGlobalCountryStats returnData--> "+returnData)

    connection.close()

    returnData
  }

  //Table : 4
  def getGlobalSiteStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String],aggmetrics: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    var _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    val aggMetricsList = getAggMetrics(aggmetrics)

    var rs:ResultSet = null
    println("select site, "+aggMetricsList+" from demofinal "+whereclouse+" group by site")
    if(aggMetricsList.length == 0){
      rs = stmt.executeQuery("select site from demofinal " + whereclouse + " group by site")
    }else {
      rs = stmt.executeQuery("select site, " + aggMetricsList + " from demofinal " + whereclouse + " group by site")
    }
    returnData = getStatsFinalResult("site",rs)

    //println("getGlobalSiteStats returnData--> "+returnData)

    connection.close()

    returnData
  }

  //Table : 5
  def getGlobalCampaignStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String],aggmetrics: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    var _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    val aggMetricsList = getAggMetrics(aggmetrics)

    var rs:ResultSet = null
    println("select campaign, "+aggMetricsList+" from demofinal "+whereclouse+" group by campaign")
    if(aggMetricsList.length == 0){
      rs = stmt.executeQuery("select campaign from demofinal " + whereclouse + " group by campaign")
    }else {
      rs = stmt.executeQuery("select campaign, " + aggMetricsList + " from demofinal " + whereclouse + " group by campaign")
    }
    returnData = getStatsFinalResult("campaign",rs)
    //println("getGlobalCampaignStats returnData--> "+returnData)
    connection.close()

    returnData
  }

  //Table : 6
  def getGlobalAdvertiserStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String],aggmetrics: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    var _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    val aggMetricsList = getAggMetrics(aggmetrics)

    var rs:ResultSet = null
    println("select advertiser, "+aggMetricsList+" from demofinal "+whereclouse+" group by advertiser")
    if(aggMetricsList.length == 0){
      rs = stmt.executeQuery("select advertiser from demofinal " + whereclouse + " group by advertiser")
    }else {
      rs = stmt.executeQuery("select advertiser, " + aggMetricsList + " from demofinal " + whereclouse + " group by advertiser")
    }
    returnData = getStatsFinalResult("advertiser",rs)

    println("getGlobalAdvertiserStats returnData--> "+returnData)

    connection.close()

    returnData
  }

  //Table : 7
  def getGlobalCreativeStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String],aggmetrics: Array[String]):mutable.Seq[Map[String,String]] ={

    var returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    var _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange
    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    val aggMetricsList = getAggMetrics(aggmetrics)

    var rs:ResultSet = null
    println("select creative, "+aggMetricsList+" from demofinal "+whereclouse+" group by creative")
    if(aggMetricsList.length == 0){
      rs = stmt.executeQuery("select creative from demofinal " + whereclouse + " group by creative")
    }else {
      rs = stmt.executeQuery("select creative, " + aggMetricsList + " from demofinal " + whereclouse + " group by creative")
    }
    returnData = getStatsFinalResult("creative",rs)

    println("getGlobalCreativeStats returnData--> "+returnData)

    connection.close()

    returnData
  }

  //1. Box

  def getImpression(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    var _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange
    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    println("select sum(impressioncount) as value from demofinal "+whereclouse)

    val rs = stmt.executeQuery("select sum(impressioncount) as value from demofinal "+whereclouse)

    while (rs.next()) {
      //println("Read from DB: " + rs.getString("value"))
      val value = rs.getString("value")
      val revenueByCountry = Map("id"->"impressioncount","name"->"impressioncount","value"->value)
      returnData+=revenueByCountry
    }

    connection.close()

    returnData
  }

  //2. Box

  def getClick(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    var _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange
    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    println("select sum(clickcount) as value from demofinal "+whereclouse)

    val rs = stmt.executeQuery("select sum(clickcount) as value from demofinal "+whereclouse)

    while (rs.next()) {
     // println("Read from DB: " + rs.getString("value"))
      val value = rs.getString("value")
      val revenueByCountry = Map("id"->"clickcount","name"->"clickcount","value"->value)
      returnData+=revenueByCountry
    }

    connection.close()

    returnData
  }

  //3. Box


  def getConversion(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    var _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange
    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    println("select sum(conversioncount) as value from demofinal "+whereclouse)

    val rs = stmt.executeQuery("select sum(conversioncount) as value from demofinal "+whereclouse)

    while (rs.next()) {
      //println("Read from DB: " +  rs.getString("value"))
      val value = rs.getString("value")
      val revenueByCountry = Map("id"->"conversioncount","name"->"conversioncount","value"->value)
      returnData+=revenueByCountry
    }

    connection.close()

    returnData
  }

  def getCurrentDataDownload(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String],timerange: Array[String],aggmetrics: Array[String]):String ={

    /*var returnData = mutable.ArrayBuffer[Map[String,String]]()*/
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    var _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative
    val _timerange = timerange
    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative,_timerange)

    var rs:ResultSet = null

    var query = "select country, browser, device, site, creative, campaign, " +
      " sum(impressioncount) as impressioncount,sum(clickcount) as clickcount,sum(conversioncount) as conversioncount" +
      " from demofinal " + whereclouse + " group by country, browser, device, site, creative, campaign";

    println("Query -->"+query);

      rs = stmt.executeQuery("select country, browser, device, site, creative, campaign, " +
        " sum(impressioncount) as impressioncount,sum(clickcount) as clickcount,sum(conversioncount) as conversioncount" +
        " from demofinal " + whereclouse + " group by country, browser, device, site, creative, campaign")

    //var returnData = getDataDownloadFinalResult(rs)
    var header = "country,browser,device,site,creative,campaign,impression,click,conversion\n";
    var str =""
    //var listdata = Seq()

    var finalcsvdata = List[List[String]]()

    while (rs.next()) {
      var listdata = new ListBuffer[String]()
      listdata += rs.getString("country")
      listdata += rs.getString("browser")
      listdata += rs.getString("device")
      listdata += rs.getString("site")
      listdata += rs.getString("creative")
      listdata += rs.getString("campaign")
      listdata += rs.getString("impressioncount")
      listdata += rs.getString("clickcount")
      listdata += rs.getString("conversioncount")
     // finalcsvdata :::= listdata
     str = str + rs.getString("country") +","+ rs.getString("browser") +","+ rs.getString("device") +","+ rs.getString("site") +","+ rs.getString("creative")+","+ rs.getString("campaign")+","+ rs.getString("impressioncount")+","+ rs.getString("clickcount")+","+ rs.getString("conversioncount")+"\n"

    }

    var finaldata = header+str

    println("List data "+finalcsvdata)

    connection.close()

    finaldata

  }


}
