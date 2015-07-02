package controllers.data

import java.sql.DriverManager
import java.sql.Connection

import com.google.common.base.Joiner

import scala.collection.mutable
import play.api.db._
/**
 * Created by rahul on 28/06/15.
 */
object QueryEngine {

  def main(args: Array[String]) {
    //val a = getRevenueByCountry("IN")
/*    getGlobalTotalRevenue
    getGlobalBrowserStats("revenue")
    getGlobalDeviceStats("revenue")*/
    getGlobalTotalRevenue(Array(),Array(),Array())
    getGlobalTotalRevenue(Array("IN","US"),Array("safari","opera","IE"),Array())
    getGlobalTotalFilledImpression(Array(),Array("safari","opera","IE"),Array("PC"))
    getGlobalTotaleCPM(Array("IN","US"),Array("safari","opera","IE"),Array("PC","Mobile"))
    /*getGlobalTotaleCPM("US","opera","PC")*/
    //println(a)
  }

  //Get total revnue by country

  def getQueryParam(countryCode: Array[String],browser: Array[String],device: Array[String]): String= {

    var queryParam = " "
    if(countryCode.length != 0 && browser.length == 0 && device.length == 0){

      var result  = List[String]()
      for(item <- countryCode){

        result ::= "country='"+item+"'"
      }
      println(result)
      val finalResult = result.mkString(" or ")
      queryParam = " where "+ finalResult+" "
      println(result)
    }
    else if(countryCode.length == 0 && browser.length != 0 && device.length == 0){
      var result  = List[String]()
      for(item <- browser){

        result ::= "browser='"+item+"'"
      }
      println(result)
      val finalResult = result.mkString(" or ")
      queryParam = " where "+ finalResult+" "
      println(result)
    }
    else if(countryCode.length == 0 && browser.length == 0 && device.length != 0){

      var result  = List[String]()
      for(item <- device){

        result ::= "device='"+item+"'"
      }
      println(result)
      val finalResult = result.mkString(" or ")
      queryParam = " where "+ finalResult+" "
      println(result)

    }
    else if(countryCode.length != 0 && browser.length !=0 && device.length == 0){
      //queryParam = " where country='"+countryCode+"' and browser='"+browser+"' "

      var countryresult  = List[String]()
      for(item <- countryCode){

        countryresult ::= "country='"+item+"'"
      }
      println(countryresult)
      val partResult1 = countryresult.mkString(" or ")


      var browserresult  = List[String]()
      for(item <- browser){

        browserresult ::= "browser='"+item+"'"
      }
      println(browserresult)
      val partResult2 = browserresult.mkString(" or ")
      println(partResult2)

      queryParam = "where "+partResult1+" and "+partResult2+" "

    }
    else if(countryCode.length != 0 && browser.length == 0 && device.length != 0){

      println("countryCode.length != 0 && browser.length == 0 && device.length != 0")
      var countryresult  = List[String]()

      for(item <- countryCode){

        countryresult ::= "country='"+item+"'"
      }
      println(countryresult)
      val partResult1 = countryresult.mkString(" or ")

      var deviceresult  = List[String]()
      for(item <- device){

        deviceresult ::= "device='"+item+"'"
      }
      println(deviceresult)
      val partResult2 = deviceresult.mkString(" or ")
      println(partResult2)

      queryParam = " "
      queryParam = "where "+partResult1+" and "+partResult2+" "

    }
    else if(countryCode.length == 0 && browser.length != 0 && device.length != 0){

      println("countryCode.length == 0 && browser.length != 0 && device.length != 0")
      var browserresult  = List[String]()
      for(item <- browser){

        browserresult ::= "browser='"+item+"'"
      }
      println(browserresult)
      val partResult1 = browserresult.mkString(" or ")

      var deviceresult  = List[String]()
      for(item <- device){

        deviceresult ::= "device='"+item+"'"
      }
      println(deviceresult)
      val partResult2 = deviceresult.mkString(" or ")

      queryParam = " "
      queryParam = "where "+partResult1+" and "+partResult2+" "
    }
    else if(countryCode.length != 0 && browser.length != 0 && device.length != 0){

      println("countryCode.length != 0 && browser.length != 0 && device.length != 0")
      var countryresult  = List[String]()
      for(item <- countryCode){

        countryresult ::= "country='"+item+"'"
      }
      println(countryresult)
      val partResult1 = countryresult.mkString(" or ")


      var browserresult  = List[String]()
      for(item <- browser){

        browserresult ::= "browser='"+item+"'"
      }
      println(browserresult)
      val partResult2 = browserresult.mkString(" or ")
      println(partResult2)


      var deviceresult  = List[String]()
      for(item <- device){

        deviceresult ::= "device='"+item+"'"
      }
      println(deviceresult)
      val partResult3 = deviceresult.mkString(" or ")

      queryParam = " "
      queryParam = "where "+partResult1+" and "+partResult2+" and "+partResult3+" "
    }
    else{
      queryParam = " "
    }

    queryParam
  }


  //Chart : 1

  def getGlobalTotalRevenue(countryCode: Array[String],browser: Array[String],device: Array[String]):mutable.Seq[Map[String,String]] = {

    val returnData = mutable.ArrayBuffer[Map[String,String]]()

    val connection = Datasource.connectionPool.getConnection

    val stmt = connection.createStatement()

    val _countryCode = countryCode
    val _browser = browser
    val _device = device

   val  whereclouse = getQueryParam(_countryCode,_browser,_device)

    println(whereclouse)

    val queryString = "SELECT day,sum(revenue) as revenue from finaldemo "+whereclouse+" group by day"
    println("###### "+queryString)
    //SELECT date,sum(revenue) as revenue from finaldemo where country='IN' and device='PC' and browser='IE' group by date;

    val rs = stmt.executeQuery(queryString)

    while (rs.next()) {
      println("Read from DB: " + rs.getString("day") + "\t"+ rs.getString("revenue"))
      val date = rs.getString("day")
      val revenue = rs.getString("revenue")

      val revenueByCountry = Map("day"->date,"value"->revenue)
      returnData+=revenueByCountry
    }
    connection.close()

    returnData
  };

  //Chart : 2
  def getGlobalTotalFilledImpression(countryCode: Array[String],browser: Array[String],device: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()

    val _countryCode = countryCode
    val _browser = browser
    val _device = device


    val  whereclouse = getQueryParam(_countryCode,_browser,_device)

    println(whereclouse)

    val queryString = "SELECT day,sum(filledimpressions) as impressions from finaldemo "+whereclouse+" group by day"
    println("###### "+queryString)
    //SELECT date,sum(revenue) as revenue from finaldemo where country='IN' and device='PC' and browser='IE' group by date;

    val rs = stmt.executeQuery(queryString)

    while (rs.next()) {
      println("Read from DB: " + rs.getString("day") + "\t"+ rs.getString("impressions"))
      val date = rs.getString("day")
      val impressions = rs.getString("impressions")
      val _temp = BigDecimal(impressions.toDouble).setScale(2, BigDecimal.RoundingMode.HALF_UP).toDouble

      val _tm = _temp

      val revenueByCountry = Map("name"->date,"value"->_tm.toString)
      returnData+=revenueByCountry
    }

    connection.close()
    returnData
  };


  //Chart : 3
  def getGlobalTotaleCPM(countryCode: Array[String],browser: Array[String],device: Array[String]):mutable.Seq[Map[String,String]] = {

    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()

    val _countryCode = countryCode
    val _browser = browser
    val _device = device

    val  whereclouse = getQueryParam(_countryCode,_browser,_device)

    println(whereclouse)

    val queryString = "SELECT date,sum(ecpm) as ecpm from finaldemo "+whereclouse+" group by date"
    println("###### "+queryString)
    //SELECT date,sum(revenue) as revenue from finaldemo where country='IN' and device='PC' and browser='IE' group by date;
    val rs = stmt.executeQuery(queryString)

    while (rs.next()) {
      println("Read from DB: " + rs.getString("date") + "\t"+ rs.getString("ecpm"))
      val date = rs.getString("date")
      val ecpm = rs.getString("ecpm")

      val revenueByCountry = Map("date"->date,"value"->ecpm)
      returnData+=revenueByCountry
    }

    connection.close()
    returnData
  };


  // Table : 1
  def getGlobalBrowserStats(metrics: String,countryCode: Array[String],browser: Array[String],device: Array[String]):mutable.Seq[Map[String,String]] ={

    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _metrics = metrics
    var _countryCode = countryCode
    var _browser = browser
    var _device = device

    if(_metrics==null && _countryCode==null){
      _metrics = "revenue"
    }else{
      _metrics = metrics
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device)

    println(whereclouse)

    val rs = stmt.executeQuery("select browser, count(browser) as value from finaldemo "+whereclouse+" group by browser")

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
  def getGlobalDeviceStats(metrics: String,countryCode: Array[String],browser: Array[String],device: Array[String]):mutable.Seq[Map[String,String]] = {

    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _metrics = metrics
    var _countryCode = countryCode
    var _browser = browser
    var _device = device

    if(_metrics==null && _countryCode==null){
      _metrics = "revenue"
    }else{
      _metrics = metrics
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device)

    println(whereclouse)

    val rs = stmt.executeQuery("select device, count(device) as value from finaldemo "+whereclouse+" group by device")

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
  def getGlobalCountryStats(metrics: String,countryCode: Array[String],browser: Array[String],device: Array[String]):mutable.Seq[Map[String,String]] = {

    val returnData = mutable.ArrayBuffer[Map[String,String]]()
    val connection = Datasource.connectionPool.getConnection
    val stmt = connection.createStatement()
    var _metrics = metrics
    var _countryCode = countryCode
    var _browser = browser
    var _device = device

    if(_metrics==null && _countryCode==null){
      _metrics = "revenue"
    }else{
      _metrics = metrics
      _countryCode = countryCode
    }

    val  whereclouse = getQueryParam(_countryCode,_browser,_device)

    println(whereclouse)

    val rs = stmt.executeQuery("select country, sum("+_metrics+") as value from finaldemo "+whereclouse+" group by country")

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




}
