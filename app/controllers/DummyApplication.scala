package controllers

import play.api.mvc._
/**
 * Created by rahul on 04/07/15.
 */
class DummyApplication extends Controller{


def dummyact = Action {

  Ok(views.html.dummy())
}

}
