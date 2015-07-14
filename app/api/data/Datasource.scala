package api.data

/**
 * Created by rahul on 30/06/15.
 */
import java.net.URI

import org.apache.commons.dbcp2._

object Datasource {

/*  val driver = "com.mysql.jdbc.Driver"
  val url = "jdbc:mysql://localhost/project3d"
  val username = "root"
  val password = "031421158"*/
  //DATABASE URL [database type]://[username]:[password]@[host]:[port]/[database name]
  //postgres://foo:foo@heroku.com:5432/hellodb
  //jdbc:mysql://localhost:3306/sakila?profileSQL=true
  //jdbc:mysql://root:031421158@localhost:3306/project3d
  val dbUri = new URI(System.getenv("DATABASE_URL"))
  val dbUrl = s"jdbc:mysql://${dbUri.getHost}:${dbUri.getPort}${dbUri.getPath}"
  val connectionPool = new BasicDataSource()

  if (dbUri.getUserInfo != null) {
    println(dbUri.getUserInfo.split(":")(0))
    println(dbUri.getUserInfo.split(":")(1))

    connectionPool.setUsername(dbUri.getUserInfo.split(":")(0))
    connectionPool.setPassword(dbUri.getUserInfo.split(":")(1))
  }
  connectionPool.setDriverClassName("com.mysql.jdbc.Driver")
  connectionPool.setUrl(dbUrl)
  connectionPool.setInitialSize(3)

  def main(args: Array[String]) {
   // println(dbUri.getUserInfo.split(":")(0))
/*    println(dbUrl)
    println(dbUri.getUserInfo)
    connectionPool.getConnection("root","031421158")*/
  }
}
