package controllers

import java.io.File
import javax.inject.Inject

import org.apache.commons.mail.EmailAttachment
import play.api.Play.current
import play.api.libs.mailer._
import play.api.mvc.{Action, Controller}

/**
 * Created by rahul on 04/07/15.
 */
class DummyApplication @Inject()(mailerClient: MailerClient) extends Controller{


def dummyact = Action {
  sendEmail




  Ok(views.html.dummy())
}

  def sendEmail {
    val email = Email(
      "Simple email",
      "bigdatajungle@gmail.com",
      Seq("rahulkumar.aws@gmail.com"),
      // adds attachment
      attachments = Seq(
       // AttachmentFile("attachment.pdf", new File("/some/path/attachment.pdf")),
        // adds inline attachment from byte array
        AttachmentData("data.txt", "data".getBytes, "text/plain", Some("Simple data"), Some(EmailAttachment.INLINE))
      ),
      // sends text, HTML or both...
      bodyText = Some("A text message"),
      bodyHtml = Some("<html><body><p>An <b>html</b> message</p></body></html>")
    )
    mailerClient.send(email)
  }

}
