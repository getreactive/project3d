package controllers

import api.query.RetailQueryEngine._
import play.api.mvc.{BodyParsers, Action, Controller}
import play.api.libs.json._
import play.api.libs.functional.syntax._

/**
 * Created by rahul on 28/08/15.
 */
case class RetailRequestParam(state: Array[String],
                           store: Array[String],
                           category: Array[String],
                           timerange: Array[String],
                           argmetrics: Array[String])

case class MultiSelectParam(id:String,
                   name: String)

class RetailApplication extends Controller {

  implicit val DSPParaReads: Reads[MultiSelectParam] = (
    (JsPath \ "id").read[String] and
      (JsPath \ "name").read[String]
    )(MultiSelectParam.apply _)

  implicit val RetailRequestParamReads: Reads[RetailRequestParam] = (
    (JsPath \ "state").read[Array[String]] and
      (JsPath \ "store").read[Array[String]] and
      (JsPath \ "category").read[Array[String]] and
      (JsPath \ "timerange").read[Array[String]]and
      (JsPath \ "argmetrics").read[Array[String]]
    )(RetailRequestParam.apply _)

  def retail = Action {

    Ok(views.html.retail())
  }

  def getGlobalStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RetailRequestParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {
        val _state = requestparam.state.toList.toArray
        val _store = requestparam.store.toList.toArray
        val _category = requestparam.category.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val finalResult = getGlobalStats(_state,_store,_category,_timerange)
        Ok(Json.toJson(finalResult))
  })
  }

  def getStateStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RetailRequestParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        val _state = requestparam.state.toList.toArray
        val _store = requestparam.store.toList.toArray
        val _category = requestparam.category.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val _argmetrics = requestparam.argmetrics.toList.toArray

        val finalResult = getGlobalStateStats(_state,_store,_category,_timerange,_argmetrics)
        Ok(Json.toJson(finalResult))
      })
  }

  def getCategoryStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RetailRequestParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        val _state = requestparam.state.toList.toArray
        val _store = requestparam.store.toList.toArray
        val _category = requestparam.category.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val _argmetrics = requestparam.argmetrics.toList.toArray

        val finalResult = getGlobalCategoryStats(_state,_store,_category,_timerange,_argmetrics)
        Ok(Json.toJson(finalResult))
      })
  }

  def getTotalSalesStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RetailRequestParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        val _state = requestparam.state.toList.toArray
        val _store = requestparam.store.toList.toArray
        val _category = requestparam.category.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val _argmetrics = requestparam.argmetrics.toList.toArray

        val finalResult = getTotalSalesStats(_state,_store,_category,_timerange)
        Ok(Json.toJson(finalResult))
      })
  }

  def getTotalQuantityStatsAction = Action(BodyParsers.parse.json) { request =>

    val requestParamResult = request.body.validate[RetailRequestParam]
    requestParamResult.fold(
      errors => {
        BadRequest(Json.obj("status" ->"KO", "message" -> JsError.toJson(errors)))
      },
      requestparam => {

        val _state = requestparam.state.toList.toArray
        val _store = requestparam.store.toList.toArray
        val _category = requestparam.category.toList.toArray
        val _timerange = requestparam.timerange.toList.toArray
        val _argmetrics = requestparam.argmetrics.toList.toArray

        val finalResult = getTotalQuantityStats(_state,_store,_category,_timerange)
        Ok(Json.toJson(finalResult))
      })
  }

  def getMultiSelectDialogData = Action(BodyParsers.parse.json) { request =>
    val requestParamResult = request.body.validate[MultiSelectParam]
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



}
