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

case class DSPPara(id:String,
                    name: String)
case class DSPRequestParam(country: Array[String],
                           browser: Array[String],
                           device: Array[String],
                           site: Array[String],
                           campaign: Array[String],
                           creative: Array[String],
                           timerange: Array[String])

case class DSPRequestStatsParam(metrics:String,
                                country: Array[String],
                                browser: Array[String],
                                device: Array[String],
                                 site: Array[String],
                                campaign: Array[String],
                                creative: Array[String],
                                timerange: Array[String],
                                argmetrics: Array[String])


class DSPApplication extends Controller{

  implicit val DSPParaReads: Reads[DSPPara] = (
    (JsPath \ "id").read[String] and
      (JsPath \ "name").read[String]
    )(DSPPara.apply _)


  implicit val DSPRequestParamReads: Reads[DSPRequestParam] = (
    (JsPath \ "country").read[Array[String]] and
      (JsPath \ "browser").read[Array[String]] and
      (JsPath \ "device").read[Array[String]] and
      (JsPath \ "site").read[Array[String]] and
      (JsPath \ "campaign").read[Array[String]] and
      (JsPath \ "creative").read[Array[String]] and
      (JsPath \ "timerange").read[Array[String]]
    )(DSPRequestParam.apply _)

  implicit val DSPRequestStatsParamReads: Reads[DSPRequestStatsParam] = (
    (JsPath \ "metrics").read[String] and
      (JsPath \ "country").read[Array[String]] and
      (JsPath \ "browser").read[Array[String]] and
      (JsPath \ "device").read[Array[String]] and
      (JsPath \ "site").read[Array[String]] and
      (JsPath \ "campaign").read[Array[String]] and
      (JsPath \ "creative").read[Array[String]] and
      (JsPath \ "timerange").read[Array[String]] and
      (JsPath \ "argmetrics").read[Array[String]]
    )(DSPRequestStatsParam.apply _)

  def demo = Action {

    Ok(views.html.demo())
  }



// Table Right Side

  def getMultiSelectDialogData = Action(BodyParsers.parse.json) { request =>
    val requestParamResult = request.body.validate[DSPPara]
    requestParamResult.fold(
     errors => {
       BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
     },
    requestparam => {
      val id = requestparam.id.toString
      val name = requestparam.name.toString

      var currentValue = getGlobaDataDialog(name)
      Ok(Json.toJson(currentValue.toSeq))
    }
    )
  }



  //Table 1

  def getGlobalBrowserStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestStatsParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        val _metrics = requestparam.metrics.toString
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val _argmetrics = requestparam.argmetrics.toList.toArray
        println("KLKL -->"+_argmetrics)
        val currentValue = getGlobalBrowserStats(_metrics,_country,_browser,_device,_site,_campaign,_creative,_timerange,_argmetrics)

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

        val _metrics = requestparam.metrics.toString
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val _argmetrics = requestparam.argmetrics.toList.toArray
        val currentValue = getGlobalDeviceStats(_metrics,_country,_browser,_device,_site,_campaign,_creative,_timerange,_argmetrics)

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

        val _metrics = requestparam.metrics.toString
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val _argmetrics = requestparam.argmetrics.toList.toArray
        val currentValue = getGlobalCountryStats(_metrics,_country,_browser,_device,_site,_campaign,_creative,_timerange,_argmetrics)

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

        val _metrics = requestparam.metrics.toString
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val _argmetrics = requestparam.argmetrics.toList.toArray
        val currentValue = getGlobalSiteStats(_metrics,_country,_browser,_device,_site,_campaign,_creative,_timerange,_argmetrics)

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


        val _metrics = requestparam.metrics.toString
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val _argmetrics = requestparam.argmetrics.toList.toArray
        val currentValue = getGlobalCampaignStats(_metrics,_country,_browser,_device,_site,_campaign,_creative,_timerange,_argmetrics)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  }

  //Table -6

  def getGlobalCreativeStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestStatsParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {


        val _metrics = requestparam.metrics.toString
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val _argmetrics = requestparam.argmetrics.toList.toArray
        val currentValue = getGlobalCreativeStats(_metrics,_country,_browser,_device,_site,_campaign,_creative,_timerange,_argmetrics)

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

        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val currentValue = getGlobalTotalImpression(_country,_browser,_device,_site,_campaign,_creative,_timerange)

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
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val currentValue = getGlobalClickCount(_country,_browser,_device,_site,_campaign,_creative,_timerange)

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
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val currentValue = getGlobalConversionCount(_country,_browser,_device,_site,_campaign,_creative,_timerange)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };

  def getGlobalCampaignCountAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestParam]

    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val currentValue = getGlobalConversionCount(_country,_browser,_device,_site,_campaign,_creative,_timerange)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };


  def getImpressionAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestParam]

    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val currentValue = getImpression("sum",_country,_browser,_device,_site,_campaign,_creative,_timerange)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };

  def getClickAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestParam]

    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {
        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val currentValue = getClick("sum",_country,_browser,_device,_site,_campaign,_creative,_timerange)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };
  def getConversionAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[DSPRequestParam]

    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        val _browser = requestparam.browser.toList.toArray
        val _country = requestparam.country.toList.toArray
        val _device  = requestparam.device.toList.toArray
        val _site = requestparam.site.toList.toArray
        val _campaign = requestparam.campaign.toList.toArray
        val _creative = requestparam.creative.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val currentValue = getConversion("sum",_country,_browser,_device,_site,_campaign,_creative,_timerange)

        Ok(Json.toJson(currentValue.toSeq))
      }
    )
  };
}
