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
INSERT INTO `device` VALUES (1,'water level sensor','grove','meet hoe hoog het water niveau is',9,'percentage'),(2,'tmp36','?','meet de temperatuur',0.97,'celcius'),(3,'fsr402','?','force sesitive sensor',4.6,'grams'),(4,'TC-9072472','TRU COMPONENTS','koffie maken',6.6,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES (1,'2022-03-04 00:00:00',84,'Aliquam vitae justo enim. Mauris.',1,3,NULL),(2,'2022-03-19 00:00:00',62,'Aliquam vitae justo enim. Mauris.',2,3,NULL),(3,'2022-03-07 00:00:00',50,NULL,1,2,NULL),(4,'2022-02-18 00:00:00',60,'Aliquam vitae justo enim. Mauris.',2,1,NULL),(5,'2022-03-11 00:00:00',92,'Aliquam vitae justo enim. Mauris.',4,3,NULL),(6,'2022-02-22 00:00:00',33,'Aliquam vitae justo enim. Mauris.',1,3,NULL),(7,'2022-02-02 00:00:00',55,'Aliquam vitae justo enim. Mauris.',2,2,NULL),(8,'2022-03-17 00:00:00',55,'Aliquam vitae justo enim. Mauris.',2,1,NULL),(9,'2022-02-28 00:00:00',34,'Aliquam vitae justo enim. Mauris.',4,1,NULL),(10,'2022-02-24 00:00:00',60,'Aliquam vitae justo enim. Mauris.',3,2,NULL),(11,'2022-02-22 00:00:00',88,'Aliquam vitae justo enim. Mauris.',1,2,NULL),(12,'2022-02-13 00:00:00',41,'Aliquam vitae justo enim. Mauris.',3,2,NULL),(13,'2022-03-19 00:00:00',86,'Aliquam vitae justo enim. Mauris.',1,3,NULL),(14,'2022-03-23 00:00:00',33,'Aliquam vitae justo enim. Mauris.',2,1,NULL),(15,'2022-02-02 00:00:00',27,'Aliquam vitae justo enim. Mauris.',4,3,NULL),(16,'2022-02-06 00:00:00',NULL,'Aliquam vitae justo enim. Mauris.',4,2,NULL),(17,'2022-03-13 00:00:00',69,'Aliquam vitae justo enim. Mauris.',4,1,NULL),(18,'2022-03-11 00:00:00',97,'Aliquam vitae justo enim. Mauris.',1,3,NULL),(19,'2022-02-09 00:00:00',75,'Aliquam vitae justo enim. Mauris.',3,1,NULL),(20,'2022-02-17 00:00:00',19,'Aliquam vitae justo enim. Mauris.',3,2,NULL),(21,'2022-02-05 00:00:00',55,'Aliquam vitae justo enim. Mauris.',3,1,NULL),(22,'2022-03-13 00:00:00',88,'Aliquam vitae justo enim. Mauris.',3,3,NULL),(23,'2022-03-20 00:00:00',74,'Aliquam vitae justo enim. Mauris.',2,1,NULL),(24,'2022-02-27 00:00:00',18,'Aliquam vitae justo enim. Mauris.',4,1,NULL),(25,'2022-03-04 00:00:00',38,'Aliquam vitae justo enim. Mauris.',2,3,NULL),(26,'2022-03-08 00:00:00',41,'Aliquam vitae justo enim. Mauris.',4,3,NULL),(27,'2022-03-14 00:00:00',12,'Aliquam vitae justo enim. Mauris.',3,2,NULL),(28,'2022-03-05 00:00:00',61,'Aliquam vitae justo enim. Mauris.',4,1,NULL),(29,'2022-02-06 00:00:00',78,'Aliquam vitae justo enim. Mauris.',4,3,NULL),(30,'2022-02-21 00:00:00',98,'Aliquam vitae justo enim. Mauris.',2,1,NULL),(31,'2022-03-14 00:00:00',43,'Aliquam vitae justo enim. Mauris.',3,2,NULL),(32,'2022-03-29 00:00:00',55,NULL,2,1,NULL),(33,'2022-02-02 00:00:00',73,'Aliquam vitae justo enim. Mauris.',2,3,NULL),(34,'2022-02-03 00:00:00',21,'Aliquam vitae justo enim. Mauris.',1,3,NULL),(35,'2022-02-21 00:00:00',68,NULL,1,1,NULL),(36,'2022-02-11 00:00:00',57,'Aliquam vitae justo enim. Mauris.',2,1,NULL),(37,'2022-02-04 00:00:00',93,'Aliquam vitae justo enim. Mauris.',1,1,NULL),(38,'2022-03-21 00:00:00',54,'Aliquam vitae justo enim. Mauris.',2,2,NULL),(39,'2022-02-25 00:00:00',50,'Aliquam vitae justo enim. Mauris.',1,3,NULL),(40,'2022-03-03 00:00:00',56,'Aliquam vitae justo enim. Mauris.',3,1,NULL),(41,'2022-03-04 00:00:00',29,'Aliquam vitae justo enim. Mauris.',3,3,NULL),(42,'2022-02-08 00:00:00',26,'Aliquam vitae justo enim. Mauris.',4,2,NULL),(43,'2022-02-12 00:00:00',35,NULL,4,3,NULL),(44,'2022-03-09 00:00:00',100,'Aliquam vitae justo enim. Mauris.',4,1,NULL),(45,'2022-02-08 00:00:00',19,'Aliquam vitae justo enim. Mauris.',1,1,NULL),(46,'2022-02-17 00:00:00',48,'Aliquam vitae justo enim. Mauris.',3,2,NULL),(47,'2022-02-16 00:00:00',77,'Aliquam vitae justo enim. Mauris.',2,2,NULL),(48,'2022-03-18 00:00:00',26,'Aliquam vitae justo enim. Mauris.',2,2,NULL),(49,'2022-02-21 00:00:00',77,'Aliquam vitae justo enim. Mauris.',2,3,NULL),(50,'2022-05-27 10:03:50',0,'water niveau ophalen',2,1,0),(51,'2022-05-27 10:03:50',1,'fsr uitlezen',3,3,1),(52,'2022-05-27 10:04:18',15,'water niveau ophalen',2,1,1),(53,'2022-05-27 10:04:18',0,'fsr uitlezen',3,3,0),(54,'2022-05-27 10:05:18',10,'water niveau ophalen',2,1,0),(55,'2022-05-27 10:05:18',1,'fsr uitlezen',3,3,1),(56,'2022-05-27 10:05:47',10,'water niveau ophalen',2,1,0),(57,'2022-05-27 10:05:47',0,'fsr uitlezen',3,3,0),(58,'2022-05-27 10:05:57',20,'water niveau ophalen',2,1,1),(59,'2022-05-27 10:05:58',1,'fsr uitlezen',3,3,1),(60,'2022-05-27 10:06:51',0,'water niveau ophalen',2,1,0),(61,'2022-05-27 10:06:51',1,'fsr uitlezen',3,3,1),(62,'2022-05-27 10:08:39',30,'water niveau ophalen',2,1,1),(63,'2022-05-27 10:08:39',0,'fsr uitlezen',3,3,0),(64,'2022-05-27 10:09:23',30,'water niveau ophalen',2,1,1),(65,'2022-05-27 10:09:23',0,'fsr uitlezen',3,3,0),(66,'2022-05-27 10:11:06',30,'water niveau ophalen',2,1,1),(67,'2022-05-27 10:11:06',0,'fsr uitlezen',3,3,0),(68,'2022-05-27 10:12:15',30,'water niveau ophalen',2,1,1),(69,'2022-05-27 10:12:15',0,'fsr uitlezen',3,3,0),(70,'2022-05-27 10:12:40',30,'water niveau ophalen',2,1,1),(71,'2022-05-27 10:12:40',0,'fsr uitlezen',3,3,0),(72,'2022-05-27 10:13:21',30,'water niveau ophalen',2,1,1),(73,'2022-05-27 10:13:21',0,'fsr uitlezen',3,3,0),(74,'2022-05-27 10:15:08',30,'water niveau ophalen',2,1,1),(75,'2022-05-27 10:15:08',0,'fsr uitlezen',3,3,0),(76,'2022-05-27 10:15:53',30,'water niveau ophalen',2,1,1),(77,'2022-05-27 10:15:53',0,'fsr uitlezen',3,3,0),(78,'2022-05-27 10:16:17',30,'water niveau ophalen',2,1,1),(79,'2022-05-27 10:16:17',0,'fsr uitlezen',3,3,0),(80,'2022-05-27 10:17:17',30,'water niveau ophalen',2,1,1),(81,'2022-05-27 10:17:17',0,'fsr uitlezen',3,3,0),(82,'2022-05-27 10:18:02',30,'water niveau ophalen',2,1,1),(83,'2022-05-27 10:18:02',0,'fsr uitlezen',3,3,0),(84,'2022-05-27 10:26:54',30,'water niveau ophalen',2,1,1),(85,'2022-05-27 10:26:54',0,'fsr uitlezen',3,3,0),(86,'2022-05-27 10:27:55',55,'water niveau ophalen',2,1,1),(87,'2022-05-27 10:27:55',0,'fsr uitlezen',3,3,0),(88,'2022-05-27 10:28:07',95,'water niveau ophalen',2,1,1),(89,'2022-05-27 10:28:07',0,'fsr uitlezen',3,3,0);
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

-- Dump completed on 2022-05-27 11:21:02
