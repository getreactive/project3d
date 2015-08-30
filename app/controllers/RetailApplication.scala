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
                           timerange: Array[String])

class RetailApplication extends Controller {

  implicit val RetailRequestParamReads: Reads[RetailRequestParam] = (
    (JsPath \ "state").read[Array[String]] and
      (JsPath \ "store").read[Array[String]] and
      (JsPath \ "category").read[Array[String]] and
      (JsPath \ "timerange").read[Array[String]]
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
        val finalResult = getGlobalStats
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

        val finalResult = getGlobalStateStats(_state,_store,_category,_timerange)
        Ok(Json.toJson(finalResult))
      })
  }



}