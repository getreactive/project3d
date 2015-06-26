package controllers

import akka.actor.{PoisonPill, ActorRef, Actor, Props}
import akka.util.Timeout
import scala.concurrent.duration._
import play.api._
import play.api.libs.iteratee.{Enumerator, Iteratee, Concurrent}
import play.api.libs.json.JsValue
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Play.current
import akka.pattern.ask

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

  def demo = Action {

    Ok(views.html.demo())
  }
}