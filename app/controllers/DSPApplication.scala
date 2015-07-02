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
import controllers.data.DSPQueryEngine._
import play.api.libs.json._
import play.api.libs.functional.syntax._

/**
 * Created by rahul on 02/07/15.
 */

case class DSPPara(id:String)
case class DSPRequestParam(country: Array[String],
                           browser: Array[String],
                           device: Array[String],
                           site: Array[String],
                           campaign: Array[String],
                           advertiser: Array[String])

case class DSPRequestStatsParam(metrics:String,
                                country: Array[String],
                                browser: Array[String],
                                device: Array[String],
                                 site: Array[String],
                                campaign: Array[String],
                                advertiser: Array[String])


class DSPApplication extends Controller{

  implicit val DSPRequestParamReads: Reads[DSPRequestParam] = (
    (JsPath \ "country").read[Array[String]] and
      (JsPath \ "browser").read[Array[String]] and
      (JsPath \ "device").read[Array[String]] and
      (JsPath \ "site").read[Array[String]] and
      (JsPath \ "campaign").read[Array[String]] and
      (JsPath \ "advertiser").read[Array[String]]
    )(DSPRequestParam.apply _)

  implicit val DSPRequestStatsParamReads: Reads[DSPRequestStatsParam] = (
    (JsPath \ "metrics").read[String] and
      (JsPath \ "country").read[Array[String]] and
      (JsPath \ "browser").read[Array[String]] and
      (JsPath \ "device").read[Array[String]] and
      (JsPath \ "site").read[Array[String]] and
      (JsPath \ "campaign").read[Array[String]] and
      (JsPath \ "advertiser").read[Array[String]]
    )(DSPRequestStatsParam.apply _)

  def demo = Action {

    Ok(views.html.demo())
  }



// Table Right Side

  //Table 1

  def getGlobalBrowserStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestStatsParam]
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
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _advertiser = requestparam.advertiser.toList.toArray
        val currentValue = getGlobalBrowserStats(_metrics,_country,_browser,_device,_site,_campaign,_advertiser)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };

  // Table -2

  def getGlobalDeviceStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestStatsParam]
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
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _advertiser = requestparam.advertiser.toList.toArray
        val currentValue = getGlobalDeviceStats(_metrics,_country,_browser,_device,_site,_campaign,_advertiser)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  }

  // Table - 3

  def getGlobalCountryStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestStatsParam]
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
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _advertiser = requestparam.advertiser.toList.toArray
        val currentValue = getGlobalCountryStats(_metrics,_country,_browser,_device,_site,_campaign,_advertiser)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  }

  //Table -4

  def getGlobalSiteStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestStatsParam]
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
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _advertiser = requestparam.advertiser.toList.toArray
        val currentValue = getGlobalSiteStats(_metrics,_country,_browser,_device,_site,_campaign,_advertiser)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  }

  //Table -5

  def getGlobalCampaignStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestStatsParam]
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
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _advertiser = requestparam.advertiser.toList.toArray
        val currentValue = getGlobalCampaignStats(_metrics,_country,_browser,_device,_site,_campaign,_advertiser)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  }

  //Table -6

  def getGlobalAdvertiserStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestStatsParam]
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
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _advertiser = requestparam.advertiser.toList.toArray
        val currentValue = getGlobalAdvertiserStats(_metrics,_country,_browser,_device,_site,_campaign,_advertiser)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  }


  def getGlobalTotalImpressionAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestParam]

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
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _advertiser = requestparam.advertiser.toList.toArray
        val currentValue = getGlobalTotalImpression(_country,_browser,_device,_site,_campaign,_advertiser)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };

  def getGlobalClickCountAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestParam]

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
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _advertiser = requestparam.advertiser.toList.toArray
        val currentValue = getGlobalClickCount(_country,_browser,_device,_site,_campaign,_advertiser)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };

  def getGlobalConversionCountAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestParam]

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
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _advertiser = requestparam.advertiser.toList.toArray
        val currentValue = getGlobalConversionCount(_country,_browser,_device,_site,_campaign,_advertiser)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };



}
