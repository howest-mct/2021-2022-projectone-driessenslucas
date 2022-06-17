CREATE DATABASE  IF NOT EXISTS `coffeedb` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `coffeedb`;
-- MySQL dump 10.13  Distrib 5.7.37, for Win64 (x86_64)
--
-- Host: localhost    Database: coffeedb
-- ------------------------------------------------------
-- Server version	5.5.5-10.5.15-MariaDB-0+deb11u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actie`
--

DROP TABLE IF EXISTS `actie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actie` (
  `actieID` int(11) NOT NULL AUTO_INCREMENT,
  `actiebeschrijving` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`actieID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actie`
--

LOCK TABLES `actie` WRITE;
/*!40000 ALTER TABLE `actie` DISABLE KEYS */;
INSERT INTO `actie` VALUES (1,'temperatuur uitlezen'),(2,'water niveau controlleren'),(3,'controlleren of koffie pot er staat'),(4,'gewicht van koffiepot uitlezen'),(5,'koffie maken'),(6,'koffie machine aanzetten');
/*!40000 ALTER TABLE `actie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `device` (
  `deviceID` int(11) NOT NULL AUTO_INCREMENT,
  `naam` varchar(45) DEFAULT NULL,
  `merk` varchar(45) DEFAULT NULL,
  `beschrijving` varchar(45) DEFAULT NULL,
  `aankoopKost` double DEFAULT NULL,
  `meeteenheid` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`deviceID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device`
--

LOCK TABLES `device` WRITE;
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
INSERT INTO `device` VALUES (1,'water level sensor','grove','meet hoe hoog het water niveau is',9,'percentage'),(2,'tmp36','?','meet de temperatuur',0.97,'celcius'),(3,'load cell','?','meet het gewicht van de koffie pot',16,'grams'),(4,'TC-9072472','TRU COMPONENTS','koffie maken',6.6,NULL);
/*!40000 ALTER TABLE `device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logs` (
  `volgnummer` int(11) NOT NULL AUTO_INCREMENT,
  `actiedatum` datetime DEFAULT current_timestamp(),
  `Waarde` float DEFAULT NULL,
  `commentaar` varchar(45) DEFAULT NULL,
  `actieID` int(11) DEFAULT NULL,
  `deviceID` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`volgnummer`),
  KEY `fk_historiek_actie_idx` (`actieID`),
  KEY `fk_historiek_device1_idx` (`deviceID`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES (1,'2022-05-30 00:00:00',1093,'read coffee pot weight',4,3,1),(2,'2022-05-30 00:00:00',1,'coffee gemaakt',5,4,1),(3,'2022-05-30 00:00:00',1094,'read coffee pot weight',4,3,1),(4,'2022-05-30 00:00:00',0,'coffee gemaakt',5,4,1),(5,'2022-06-01 00:00:00',1098,'read coffee pot weight',4,3,1),(6,'2022-06-01 00:00:00',0,'coffee gemaakt',5,4,1),(7,'2022-06-01 00:00:00',1094,'read coffee pot weight',4,3,1),(8,'2022-06-01 00:00:00',0,'coffee gemaakt',5,4,1),(9,'2022-06-01 00:00:00',1094,'read coffee pot weight',4,3,1),(10,'2022-06-01 00:00:00',1,'coffee gemaakt',5,4,1),(11,'2022-06-02 00:00:00',1091,'read coffee pot weight',4,3,1),(12,'2022-06-02 00:00:00',1,'coffee gemaakt',5,4,1),(13,'2022-06-02 00:00:00',1099,'read coffee pot weight',4,3,1),(14,'2022-06-02 00:00:00',1,'coffee gemaakt',5,4,1),(15,'2022-06-03 00:00:00',1094,'read coffee pot weight',4,3,1),(16,'2022-06-03 00:00:00',1,'coffee gemaakt',5,4,1),(17,'2022-06-04 00:00:00',1093,'read coffee pot weight',4,3,1),(18,'2022-06-04 00:00:00',1,'coffee gemaakt',5,4,1),(19,'2022-06-04 00:00:00',1095,'read coffee pot weight',4,3,1),(20,'2022-06-04 00:00:00',1,'coffee gemaakt',5,4,1),(21,'2022-06-05 00:00:00',1097,'read coffee pot weight',4,3,1),(22,'2022-06-05 00:00:00',1,'coffee gemaakt',5,4,1),(23,'2022-06-06 00:00:00',1099,'read coffee pot weight',4,3,1),(24,'2022-06-06 00:00:00',1,'coffee gemaakt',5,4,1),(25,'2022-06-06 00:00:00',1092,'read coffee pot weight',4,3,1),(26,'2022-06-06 00:00:00',1,'coffee gemaakt',5,4,1),(27,'2022-06-07 00:00:00',1091,'read coffee pot weight',4,3,1),(28,'2022-06-07 00:00:00',1,'coffee gemaakt',5,4,1),(29,'2022-06-07 00:00:00',1095,'read coffee pot weight',4,3,1),(30,'2022-06-07 00:00:00',1,'coffee gemaakt',5,4,1),(31,'2022-06-07 00:00:00',1091,'read coffee pot weight',4,3,1),(32,'2022-06-07 00:00:00',1,'coffee gemaakt',5,4,1),(33,'2022-06-07 00:00:00',1095,'read coffee pot weight',4,3,1),(34,'2022-06-08 00:00:00',1095,'read coffee pot weight',4,3,1),(35,'2022-06-08 00:00:00',1,'coffee gemaakt',5,4,1),(36,'2022-06-08 00:00:00',1096,'read coffee pot weight',4,3,1),(37,'2022-06-08 00:00:00',1,'coffee gemaakt',5,4,1),(38,'2022-06-09 00:00:00',1091,'read coffee pot weight',4,3,1),(39,'2022-06-09 00:00:00',0,'coffee gemaakt',5,4,1),(40,'2022-06-10 00:00:00',1095,'read coffee pot weight',4,3,1),(41,'2022-06-10 00:00:00',1,'coffee gemaakt',5,4,1),(42,'2022-06-10 00:00:00',1092,'read coffee pot weight',4,3,1),(43,'2022-05-23 00:00:00',1,'coffee gemaakt',5,4,1),(44,'2022-05-23 00:00:00',1091,'read coffee pot weight',4,3,1),(45,'2022-05-23 00:00:00',0,'coffee gemaakt',5,4,1),(46,'2022-05-23 00:00:00',1091,'read coffee pot weight',4,3,1),(47,'2022-05-24 00:00:00',1,'coffee gemaakt',5,4,1),(48,'2022-05-24 00:00:00',1090,'read coffee pot weight',4,3,1),(49,'2022-05-24 00:00:00',1,'coffee gemaakt',5,4,1),(50,'2022-05-24 00:00:00',1100,'read coffee pot weight',4,3,1),(51,'2022-05-26 00:00:00',1,'coffee gemaakt',5,4,1),(52,'2022-05-26 00:00:00',1098,'read coffee pot weight',4,3,1),(53,'2022-05-26 00:00:00',1,'coffee gemaakt',5,4,1),(54,'2022-05-26 00:00:00',1098,'read coffee pot weight',4,3,1),(55,'2022-05-27 00:00:00',1,'coffee gemaakt',5,4,1),(56,'2022-05-27 00:00:00',1100,'read coffee pot weight',4,3,1),(57,'2022-05-27 00:00:00',1,'coffee gemaakt',5,4,1),(58,'2022-06-10 10:20:14',1,'coffee machine aan',6,4,1),(59,'2022-06-10 10:20:17',1,'coffee machine uit',6,4,0),(60,'2022-06-10 10:20:52',1,'coffee machine aan',6,4,1),(61,'2022-06-10 10:54:15',1,'coffee machine aan',6,4,1),(62,'2022-06-10 11:39:19',1,'coffee machine aan',6,4,1),(63,'2022-06-10 11:39:24',1,'coffee machine uit',6,4,0),(64,'2022-06-10 11:40:12',1,'coffee machine aan',6,4,1),(69,'2022-06-13 14:36:06',0,'get water level',2,1,0),(70,'2022-06-13 14:36:06',21.2903,'get current temperature',1,2,1),(71,'2022-06-13 14:36:35',0,'get water level',2,1,0),(72,'2022-06-13 14:36:35',21.2903,'get current temperature',1,2,1),(73,'2022-06-13 14:39:04',50,'get water level',2,1,1),(74,'2022-06-13 14:39:04',20,'get current temperature',1,2,1),(75,'2022-06-13 14:39:37',1,'coffee machine aan',6,4,1),(76,'2022-06-13 14:40:05',50,'get water level',2,1,1),(77,'2022-06-13 14:40:05',20.3226,'get current temperature',1,2,1),(78,'2022-06-13 14:41:05',50,'get water level',2,1,1),(79,'2022-06-13 14:41:05',20,'get current temperature',1,2,1),(80,'2022-06-13 14:42:05',50,'get water level',2,1,1),(81,'2022-06-13 14:42:05',20.9677,'get current temperature',1,2,1),(82,'2022-06-13 14:43:06',50,'get water level',2,1,1),(83,'2022-06-13 14:43:06',20.3226,'get current temperature',1,2,1),(84,'2022-06-13 14:49:00',50,'get water level',2,1,1),(85,'2022-06-13 14:49:00',20.6452,'get current temperature',1,2,1),(86,'2022-06-13 14:50:01',50,'get water level',2,1,1),(87,'2022-06-13 14:50:01',20.9677,'get current temperature',1,2,1),(88,'2022-06-13 14:51:01',50,'get water level',2,1,1),(89,'2022-06-13 14:51:01',20.6452,'get current temperature',1,2,1),(90,'2022-06-13 14:52:59',20,'get water level',2,1,1),(91,'2022-06-13 14:52:59',20.6452,'get current temperature',1,2,1),(92,'2022-06-13 14:53:59',20,'get water level',2,1,1),(93,'2022-06-13 14:54:00',20.6452,'get current temperature',1,2,1),(94,'2022-06-13 14:55:00',20,'get water level',2,1,1),(95,'2022-06-13 14:55:00',21.2903,'get current temperature',1,2,1),(96,'2022-06-13 14:56:00',20,'get water level',2,1,1),(97,'2022-06-13 14:56:00',20.6452,'get current temperature',1,2,1),(98,'2022-06-13 14:57:01',20,'get water level',2,1,1),(99,'2022-06-13 14:57:01',20.6452,'get current temperature',1,2,1),(100,'2022-06-13 14:58:01',20,'get water level',2,1,1),(101,'2022-06-13 14:58:01',20.6452,'get current temperature',1,2,1),(102,'2022-06-13 14:59:01',20,'get water level',2,1,1),(103,'2022-06-13 14:59:02',20.6452,'get current temperature',1,2,1),(104,'2022-06-13 15:00:02',20,'get water level',2,1,1),(105,'2022-06-13 15:00:02',20.6452,'get current temperature',1,2,1),(106,'2022-06-13 15:01:02',20,'get water level',2,1,1),(107,'2022-06-13 15:01:02',21.2903,'get current temperature',1,2,1),(108,'2022-06-13 15:02:02',20,'get water level',2,1,1),(109,'2022-06-13 15:02:02',20.6452,'get current temperature',1,2,1),(110,'2022-06-13 15:03:02',20,'get water level',2,1,1),(111,'2022-06-13 15:03:03',20.6452,'get current temperature',1,2,1),(112,'2022-06-13 15:04:37',15,'get water level',2,1,1),(113,'2022-06-13 15:04:37',20.6452,'get current temperature',1,2,1),(114,'2022-06-13 15:04:54',10,'get water level',2,1,0),(115,'2022-06-13 15:04:54',21.2903,'get current temperature',1,2,1),(116,'2022-06-13 15:06:36',20,'get water level',2,1,1),(117,'2022-06-13 15:06:36',20.6452,'get current temperature',1,2,1),(118,'2022-06-13 15:07:36',10,'get water level',2,1,0),(119,'2022-06-13 15:07:36',21.2903,'get current temperature',1,2,1),(120,'2022-06-13 15:08:36',5,'get water level',2,1,1),(121,'2022-06-13 15:08:36',1,'coffee machine aan',6,4,1),(122,'2022-06-13 15:08:36',20.6452,'get current temperature',1,2,1),(123,'2022-06-13 15:09:36',0,'get water level',2,1,0),(124,'2022-06-13 15:09:37',21.2903,'get current temperature',1,2,1),(125,'2022-06-13 15:10:37',0,'get water level',2,1,0),(126,'2022-06-13 15:10:37',21.2903,'get current temperature',1,2,1),(127,'2022-06-13 15:11:37',0,'get water level',2,1,0),(128,'2022-06-13 15:11:37',20.6452,'get current temperature',1,2,1),(129,'2022-06-13 15:12:20',0,'get water level',2,1,0),(130,'2022-06-13 15:12:20',20.9677,'get current temperature',1,2,1),(131,'2022-06-13 15:13:46',0,'get water level',2,1,0),(132,'2022-06-13 15:13:46',20.6452,'get current temperature',1,2,1),(133,'2022-06-13 15:14:46',0,'get water level',2,1,0),(134,'2022-06-13 15:14:46',20.9677,'get current temperature',1,2,1),(135,'2022-06-13 15:15:47',0,'get water level',2,1,0),(136,'2022-06-13 15:15:47',21.6129,'get current temperature',1,2,1),(137,'2022-06-13 16:17:58',45,'get water level',2,1,1),(138,'2022-06-13 16:17:58',21.2903,'get current temperature',1,2,1),(139,'2022-06-13 16:18:10',1,'coffee machine aan',6,4,1),(140,'2022-06-13 16:18:27',1,'coffee gemaakt',5,4,1),(141,'2022-06-13 16:18:30',172.49,'read coffee pot weight',3,3,1),(142,'2022-06-13 16:18:50',1,'coffee gemaakt',5,4,1),(143,'2022-06-13 16:18:52',319.987,'read coffee pot weight',3,3,1),(144,'2022-06-13 16:18:59',45,'get water level',2,1,1),(145,'2022-06-13 16:18:59',21.2903,'get current temperature',1,2,1),(146,'2022-06-13 16:19:59',45,'get water level',2,1,1),(147,'2022-06-13 16:19:59',21.2903,'get current temperature',1,2,1),(148,'2022-06-14 09:42:37',1,'coffee machine aan',6,4,1),(149,'2022-06-14 09:42:39',1,'coffee machine uit',6,4,0),(150,'2022-06-14 09:42:41',1,'coffee machine aan',6,4,1);
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-16 11:00:04
