package controllers

import akka.actor.{PoisonPill, ActorRef, Actor, Props}
import akka.util.Timeout
import scala.concurrent.duration._
import play.api._
import play.api.libs.iteratee.{Enumerator, Iteratee, Concurrent}
import play.api.libs.json.{Json, JsValue}
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Play.current
import akka.pattern.ask
import controllers.data.QueryEngine._
import play.api.libs.json._
import play.api.libs.functional.syntax._

case class Para(id:String)
case class RequestParam(country: Array[String], browser: Array[String], device: Array[String])
case class RequestStatsParam(metrics:String,country: Array[String], browser: Array[String], device: Array[String])

class MyWebSocketActor(out: ActorRef) extends Actor {

  implicit val timeout = 5.seconds

  def getDatafromDB:String ={
    implicit val timeout = 5.seconds
    var senddata=0
/*      for( a <- 1 to 100){
        Thread.sleep(100)
        senddata =  a
        println(a)
      }*/
    println("Sum "+senddata)
    val a = Math.random()
    Thread.sleep(1000)
    a.toString

  }

  def receive = {
    case msg: String =>
      implicit val timeout = 5.seconds
      if(msg=="Rahul") out ! getDatafromDB
      if(msg=="kumar") out ! println("Kumar !!")
    case kk: Int =>
      out ! println("Fuck u !!")
    case _ =>
      self ! PoisonPill
  }
}

object MyWebSocketActor {
  def props(out: ActorRef) = Props(new MyWebSocketActor(out))
}

class Application extends Controller {

  val (dataEnumerator, dataChannel) = Concurrent.broadcast[JsValue]
  implicit val timeout = 5.seconds

  implicit val RequestParamReads: Reads[RequestParam] = (
    (JsPath \ "country").read[Array[String]] and
      (JsPath \ "browser").read[Array[String]] and
       (JsPath \ "device").read[Array[String]]
    )(RequestParam.apply _)

  implicit val RequestStatsParamReads: Reads[RequestStatsParam] = (
    (JsPath \ "metrics").read[String] and
    (JsPath \ "country").read[Array[String]] and
      (JsPath \ "browser").read[Array[String]] and
      (JsPath \ "device").read[Array[String]]
    )(RequestStatsParam.apply _)

  def indexsession = Action { request =>
    request.session.get("connected").map { user =>
      Ok("Hello " + user)
    }.getOrElse {
      Unauthorized("Oops, you are not connected")
    }
  }

  def saveInSession = Action {

    Ok("Welcome!").withSession(
      "connected" -> "user@gmail.com"
    )
  }

  def index = Action {
    //println(getIpAddresses())
    println(Runtime.getRuntime().availableProcessors())
    Ok(views.html.index("Welcome! Let's Play with your brand new stateless websocket!")).withSession(
      ("uuid" -> java.util.UUID.randomUUID.toString)
    )
  }

  def socket = WebSocket.using[String] { request =>
    // Log events to the console

    val in = Iteratee.foreach[String](println).map { _ =>
      println("Disconnected")
    }

    // Send a single 'Hello!' message
    val out = Enumerator("Hello!")
    (in, out)
  }

  def socket1 = WebSocket.acceptWithActor[String, String] { request => out =>
    println("websocket1 called !!")

    MyWebSocketActor.props(out)
  }

  def app = Action {

    Ok(views.html.app())
  }


  def getGlobalTotalRevenueAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RequestParam]

    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        println(requestparam.browser.toSeq)
        println(requestparam.country.toSeq)
        println(requestparam.device.toSeq)

        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val currentValue = getGlobalTotalRevenue(_country,_browser,_device)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };

  def getGlobalTotalFilledImpressionAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RequestParam]

    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        println(requestparam.browser.toSeq)
        println(requestparam.country.toSeq)
        println(requestparam.device.toSeq)

        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val currentValue = getGlobalTotalFilledImpression(_country,_browser,_device)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };

  def getGlobalTotaleCPMAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RequestParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        println(requestparam.browser.toSeq)
        println(requestparam.country.toSeq)
        println(requestparam.device.toSeq)

        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val currentValue = getGlobalTotaleCPM(_country,_browser,_device)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };

  def getGlobalBrowserStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RequestStatsParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        println(requestparam.browser.toSeq)
        println(requestparam.country.toSeq)
        println(requestparam.device.toSeq)

        val _metrics = requestparam.metrics.toString
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val currentValue = getGlobalBrowserStats(_metrics,_country,_browser,_device)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };

  def getGlobalDeviceStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RequestStatsParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        println(requestparam.browser.toSeq)
        println(requestparam.country.toSeq)
        println(requestparam.device.toSeq)

        val _metrics = requestparam.metrics.toString
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val currentValue = getGlobalDeviceStats(_metrics,_country,_browser,_device)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  }

  def getGlobalCountryStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RequestStatsParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        println(requestparam.browser.toSeq)
        println(requestparam.country.toSeq)
        println(requestparam.device.toSeq)

        val _metrics = requestparam.metrics.toString
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val currentValue = getGlobalCountryStats(_metrics,_country,_browser,_device)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  }

  def getGlobalCampaignStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RequestStatsParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        println(requestparam.browser.toSeq)
        println(requestparam.country.toSeq)
        println(requestparam.device.toSeq)

        val _metrics = requestparam.metrics.toString
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val currentValue = getGlobalCountryStats(_metrics,_country,_browser,_device)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  }


}