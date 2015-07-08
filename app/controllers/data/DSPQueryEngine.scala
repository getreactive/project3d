package controllers.data

import org.h2.api.Aggregate

import scala.collection.mutable

/**
 * Created by rahul on 02/07/15.
 */
object DSPQueryEngine {

  def main(args: Array[String]) {
    //val a = getRevenueByCountry("IN")
   //     getGlobalTotalRevenue
     val a =getGlobalBrowserStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"))
     val b =getGlobalCountryStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"))
     val c =getGlobalDeviceStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"))
     val d = getGlobalCampaignStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"))
     val e = getGlobalSiteStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"))
     val f = getGlobalCreativeStats("",Array("IN","US"),Array("safari","opera","IE"),Array("Connected TV"),Array("fb.com"),Array(),Array("21314"))
    println(a)
    println(b)
    println(c)
    println(d)
    println(e)
    println(f)
    /*    getGlobalDeviceStats("revenue")
    getGlobalTotalRevenue(Array(),Array(),Array())
    getGlobalTotalRevenue(Array("IN","US"),Array("safari","opera","IE"),Array())
    getGlobalTotalFilledImpression(Array(),Array("safari","opera","IE"),Array("PC"))
    getGlobalTotaleCPM(Array("IN","US"),Array("safari","opera","IE"),Array("PC","Mobile"))
    getGlobalTotaleCPM("US","opera","PC")
    println(a)*/
    getQueryParam(Array("IN","US"),Array("safari","opera","IE"),Array(),Array(),Array(),Array())
    getQueryParam(Array(),Array(),Array(),Array(),Array(),Array())
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

  def getQueryParam(country: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String], creative: Array[String]): String= {

    var queryParam = " "
    val countryStr = giveMeQueryString("country",country)
    val browserStr = giveMeQueryString("browser",browser)
    val deviceStr = giveMeQueryString("device",device)
    val siteStr = giveMeQueryString("site",site)
    val campaignStr = giveMeQueryString("campaign",campaign)
    val creativeStr = giveMeQueryString("creative",creative)
    var result  = List[String]()
    result ::= countryStr
    result ::= browserStr
    result ::= deviceStr
    result ::= siteStr
    result ::= campaignStr
    result ::= creativeStr
    val _tmp = result.filter(_.nonEmpty)
    println("_tmp ",_tmp)
    if(_tmp.length != 0){
    queryParam = " where "+_tmp.mkString(" and ")
    }else{
      queryParam=""
    }
    queryParam
  }

  //Chart : 1

  def getGlobalTotalImpression(countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection

    val stmt = connection.createStatement()

    val _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative

    val whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative)

    println(whereclouse)

    //select timestamp,day,sum(impressioncount) from demofinal where country='US' or country='IN' group by day,timestamp;
    val queryString = "select timestamp,day,sum(impressioncount) as impression from demofinal "+whereclouse+" group by day,timestamp"
    println("###### "+queryString)
    //SELECT date,sum(revenue) as revenue from finaldemo where country='IN' and device='PC' and browser='IE' group by date;

    val rs = stmt.executeQuery(queryString)

    while (rs.next()) {
      println("Read from DB: " + rs.getString("timestamp") + "\t"+ rs.getString("impression"))
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

  def getGlobalClickCount(countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection

    val stmt = connection.createStatement()

    val _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative

    val whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative)

    println(whereclouse)

    //select timestamp,day,sum(impressioncount) from demofinal where country='US' or country='IN' group by day,timestamp;
    val queryString = "select timestamp,day,sum(clickcount) as clickcount from demofinal "+whereclouse+" group by day,timestamp"
    println("###### "+queryString)
    //SELECT date,sum(revenue) as revenue from finaldemo where country='IN' and device='PC' and browser='IE' group by date;

    val rs = stmt.executeQuery(queryString)

    while (rs.next()) {
      println("Read from DB: " + rs.getString("timestamp") + "\t"+ rs.getString("clickcount"))
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

  def getGlobalConversionCount(countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection

    val stmt = connection.createStatement()

    val _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative

    val whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative)

    println(whereclouse)

    //select timestamp,day,sum(impressioncount) from demofinal where country='US' or country='IN' group by day,timestamp;
    val queryString = "select timestamp,day,sum(conversioncount) as conversioncount from demofinal "+whereclouse+" group by day,timestamp"
    println("###### "+queryString)
    //SELECT date,sum(revenue) as revenue from finaldemo where country='IN' and device='PC' and browser='IE' group by date;

    val rs = stmt.executeQuery(queryString)

    while (rs.next()) {
      println("Read from DB: " + rs.getString("timestamp") + "\t"+ rs.getString("conversioncount"))
      val timestamp = rs.getString("timestamp")
      val day = rs.getString("day")
      val conversioncount = rs.getString("conversioncount")

      val revenueByCountry = Map("timestamp"->timestamp,"day"->day,"value"->conversioncount)
      returnData+=revenueByCountry
    }
    connection.close()

    returnData
  };


  // Table : 1
  def getGlobalBrowserStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _aggregate = aggregate
    val _countryCode = countryCode
    val _browser = browser
    val _device = device
    val _site = site
    val _campaign = campaign
    val _creative = creative

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative)

    println("&&&& "+whereclouse)
    println("select browser, count(browser) as value from demofinal "+whereclouse+" group by browser")

    val rs = stmt.executeQuery("select browser, count(browser) as value from demofinal "+whereclouse+" group by browser")

    while (rs.next()) {
      println("Read from DB: " + rs.getString("browser") + "\t"+ rs.getString("value"))

      val browser = rs.getString("browser")
      val value = rs.getString("value")
      val revenueByCountry = Map("id"->browser,"name"->browser,"value"->value)
      returnData+=revenueByCountry
    }

    connection.close()
    returnData
  }


  // Table : 2
  def getGlobalDeviceStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String]):mutable.Seq[Map[String,String]] ={

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

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative)

    println(whereclouse)

    val rs = stmt.executeQuery("select device, count(device) as value from demofinal "+whereclouse+" group by device")

    while (rs.next()) {
      println("Read from DB: " + rs.getString("device") + "\t"+ rs.getString("value"))
      val device = rs.getString("device")
      val value = rs.getString("value")
      val revenueByCountry = Map("id"->device,"name"->device,"value"->value)
      returnData+=revenueByCountry
    }

    connection.close()
    returnData
  }

  //Table : 3
  def getGlobalCountryStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String]):mutable.Seq[Map[String,String]] ={

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

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative)

    println(whereclouse)

    val rs = stmt.executeQuery("select country, count(country) as value from demofinal "+whereclouse+" group by country")

    while (rs.next()) {
      println("Read from DB: " + rs.getString("country") + "\t"+ rs.getString("value"))
      val country = rs.getString("country")
      val value = rs.getString("value")
      val revenueByCountry = Map("id"->country,"name"->country,"value"->value)
      returnData+=revenueByCountry
    }

    connection.close()

    returnData
  }

  //Table : 4
  def getGlobalSiteStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String]):mutable.Seq[Map[String,String]] ={

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

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative)

    println(whereclouse)

    val rs = stmt.executeQuery("select site, sum(site) as value from demofinal "+whereclouse+" group by site")

    while (rs.next()) {
      println("Read from DB: " + rs.getString("site") + "\t"+ rs.getString("value"))
      val site = rs.getString("site")
      val value = rs.getString("value")
      val revenueByCountry = Map("id"->site,"name"->site,"value"->value)
      returnData+=revenueByCountry
    }

    connection.close()

    returnData
  }

  //Table : 5
  def getGlobalCampaignStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String]):mutable.Seq[Map[String,String]] ={

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

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative)

    println(whereclouse)

    val rs = stmt.executeQuery("select campaign, count(campaign) as value from demofinal "+whereclouse+" group by campaign")

    while (rs.next()) {
      println("Read from DB: " + rs.getString("campaign") + "\t"+ rs.getString("value"))
      val campaign = rs.getString("campaign")
      val value = rs.getString("value")
      val revenueByCountry = Map("id"->campaign,"name"->campaign,"value"->value)
      returnData+=revenueByCountry
    }

    connection.close()

    returnData
  }

  //Table : 6
  def getGlobalAdvertiserStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String]):mutable.Seq[Map[String,String]] ={

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

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative)

    println(whereclouse)

    val rs = stmt.executeQuery("select creative, count(creative) as value from demofinal "+whereclouse+" group by creative")

    while (rs.next()) {
      println("Read from DB: " + rs.getString("creative") + "\t"+ rs.getString("value"))
      val creative = rs.getString("creative")
      val value = rs.getString("value")
      val revenueByCountry = Map("id"->creative,"name"->creative,"value"->value)
      returnData+=revenueByCountry
    }

    connection.close()

    returnData
  }

  //Table : 7
  def getGlobalCreativeStats(aggregate: String,countryCode: Array[String],browser: Array[String],device: Array[String],site: Array[String],campaign: Array[String],creative: Array[String]):mutable.Seq[Map[String,String]] ={

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

    if(_aggregate==null && _countryCode==null){
      _aggregate = "count"
    }else{
      _aggregate = aggregate
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device,_site,_campaign,_creative)

    println(whereclouse)

    val rs = stmt.executeQuery("select campaign, count(campaign) as value from demofinal "+whereclouse+" group by campaign")

    while (rs.next()) {
      println("Read from DB: " + rs.getString("campaign") + "\t"+ rs.getString("value"))
      val campaign = rs.getString("campaign")
      val value = rs.getString("value")
      val revenueByCountry = Map("id"->campaign,"name"->campaign,"value"->value)
      returnData+=revenueByCountry
    }

    connection.close()

    returnData
  }


}
