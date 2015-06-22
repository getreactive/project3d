/**
 * Created by rahul on 18/06/15.
 */
import play.api._

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    Logger.debug("Project 3D Started")
  }

}