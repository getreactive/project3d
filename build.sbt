import java.io.File

name := """project3d"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.6"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  specs2 % Test
)

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

libraryDependencies += "org.mindrot" % "jbcrypt" % "0.3m"

libraryDependencies += "com.typesafe.play" %% "play-mailer" % "3.0.1"

libraryDependencies += "org.apache.commons" % "commons-email" % "1.4"

libraryDependencies ++= Seq(

  "org.webjars" %% "webjars-play" % "2.4.0-1",
  "org.webjars" % "jquery" % "2.1.4",
  "org.webjars" % "jquery-ui" % "1.11.4",
  "org.webjars" % "bootstrap" % "3.1.1-2",
  "org.webjars.bower" % "angularjs" % "1.4.1",
  "org.webjars.bower" % "angular-route" % "1.4.1",
  "org.webjars" % "ng-table" % "0.3.3",
  "org.webjars" % "angular-strap" % "2.2.3",
  "org.webjars" % "angular-material" % "0.10.0",
  "org.webjars.bower" % "bootstrap-daterangepicker" % "1.3.22",
  "org.webjars" % "d3js" % "3.5.5-1",
  "org.webjars" % "underscorejs" % "1.8.3",
  "org.webjars" % "jQuery-slimScroll" % "1.3.3",
  "org.webjars.bower" % "momentjs" % "2.10.3",
  "org.webjars" % "gridster.js" % "0.5.6",
  "org.webjars" % "datatables" % "1.10.7"
)

libraryDependencies += "mysql" % "mysql-connector-java" % "5.1.35"

libraryDependencies += "org.apache.commons" % "commons-dbcp2" % "2.1"

libraryDependencies += "com.google.guava" % "guava" % "18.0"

resolvers += Resolver.file("LocalIvy", file(Path.userHome + File.separator + ".ivy2" + File.separator + "local"))(Resolver.ivyStylePatterns)

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator




