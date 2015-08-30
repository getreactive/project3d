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


  def getQueryParam(state: Array[String],store: Array[String],category: Array[String],timerange: Array[String]):String ={

    var subquery = ""


    subquery
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





  def getGlobalStateStats(state: Array[String],store: Array[String],category: Array[String],timerange: Array[String]):mutable.Seq[Map[String,String]] ={

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

    println("select state, sum(sales) as sales, sum(quantity) as quantity from finalretail "+whereclouse+" group by state Order by sales DESC")

    rs = stmt.executeQuery("select state, sum(sales) as sales, sum(quantity) as quantity from finalretail"+whereclouse+" group by state Order by sales DESC")

    var rsdata = Map[String,String]()

    while (rs.next()) {

      val state = rs.getString("state")
      val quantity = rs.getString("quantity")
      val sales = rs.getString("sales")

      rsdata += "name" -> state
      rsdata += "quantity" -> quantity
      rsdata += "sales" -> sales

      returnData += rsdata
    }

    //println("getGlobalBrowserStats returnData--> "+returnData)
    connection.close()
    returnData
  }



  def getGlobalCategoryStats(state: Array[String],store: Array[String],category: Array[String],timerange: Array[String]):mutable.Seq[Map[String,String]] ={

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

    println("select category, sum(sales) as sales, sum(quantity) as quantity from finalretail "+whereclouse+" group by category Order by sales DESC")

    rs = stmt.executeQuery("select category, sum(sales) as sales, sum(quantity) as quantity from finalretail"+whereclouse+" group by category Order by sales DESC")

    var rsdata = Map[String,String]()

    while (rs.next()) {

      val category = rs.getString("category")
      val quantity = rs.getString("quantity")
      val sales = rs.getString("sales")

      rsdata += "name" -> category
      rsdata += "quantity" -> quantity
      rsdata += "sales" -> sales

      returnData += rsdata
    }

    //println("getGlobalBrowserStats returnData--> "+returnData)
    connection.close()
    returnData
  }


 // Global Stats Total Store, Total quantity, Total Sales
  def getGlobalStats:Map[String,String] = {

    val queryString = "select count(distinct(store)) as stotecount, sum(quantity) as totalquantity, sum(sales) as totalsales from finalretail";

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

}
