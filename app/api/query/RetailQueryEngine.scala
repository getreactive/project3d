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

    println("select state, sum(sales) as sales, sum(quantity) as quentity from finalretail "+whereclouse+" group by state Order by sales DESC")

    rs = stmt.executeQuery("select state, sum(sales) as sales, sum(quantity) as quentity from finalretail"+whereclouse+" group by state Order by sales DESC")

    var rsdata = Map[String,String]()
    while (rs.next()) {

      val state = rs.getString("state")
      val quentity = rs.getString("quentity")
      val sales = rs.getString("sales")

      rsdata += "state" -> state
      rsdata += "quentity" -> quentity
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
