CREATE DATABASE  IF NOT EXISTS `veterilab2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `veterilab2`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: veterilab2
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id_admin` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `correo_electronico` varchar(500) NOT NULL,
  `telefono` varchar(500) DEFAULT NULL,
  `direccion` varchar(1000) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('admin','super_admin') DEFAULT 'admin',
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `correo_electronico` (`correo_electronico`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Administrador','Sistema','2Nj1D9dYS76iZKWoTEEgFg==:QqLV/rujaqyOQ22Y5mzJM9GOK+69Z+/j4QH57q/29u4=','QIUsnn4uWlm5ansQK3hhvQ==:ALsAlGAI87YiqB/8XRDoPQ==','DhjSSF/o79853JUwuwc16A==:2KRCp+Xa8Fe5fUE4/dwHvt7Ib32aqoezy1EwyWLwqas=','$2b$12$DrSdOFToAB9m.7.IGJQjbeDW8tREIAbrnbkDRDfc1d8F44Abd/vCa','super_admin',1,'2025-09-25 01:51:43','2025-10-15 02:50:52'),(2,'Andrew','Loaiza Guzmán','H+8maS64iNCHAl+UFfzgpA==:4Sqw1T9XBgSb9IKS44QKqXlgio5/xqd0YI9mXar4LEA=','x9BM7n6Q5Z4r9LsNx0MDEw==:Ehn1X/m+05aUDhLHbYQPVg==','FI2SWgHoK6eiAEPDq6oKAA==:6Cm1/THccWIwm7rGx9M0iqhmAgz8oelurhVaYUIIJ9DZwVBuVma3XHkKaDYhqL1u','$2b$12$6Kokc3KD9ZmBUMs.J9xJwO/EHDcbh88DCr.bY8ZiRf8CoYgp3sYgO','super_admin',1,'2025-10-04 03:53:32','2025-10-28 21:36:49'),(3,'Juan Esteban','Buritica Garcia','hvc5XjFGdScber64ejxwbQ==:XzZeOIcl9Q5ET2JhL6N6VUJKamNooPdWp0Lfkv0rU+k=','+cV6NlkQLIYYtnS11wJoPw==:Tfp3SXvXvWOssIqmbCHLSA==','imdmM2ca70LCy8DnAP+AUA==:QcO3NjPKeZpQH3AKhhm6h59TMHXM65If/gWA3tKn0cA=','$2b$12$8DWdnFCYQ9x6voMmmT0B3eqJMSg5zjowuAkfTrmqcsKv8mdfPK31q','super_admin',1,'2025-10-04 04:02:46','2025-10-04 04:03:10'),(4,'Sergio Mario','Orozco','X1bn8A6p0YIlbyIcuUtHTQ==:sbhHsIr1P5rh5PIbM9ccm/lPgMm6lTZ3a/M2HBPrqaY=','TzyVV0f+p0s9bw6B9thIhw==:pjJccYgQZvuGndxEz0nC5A==','F8zEksqzCb53iZfhdYrKEg==:rOg6zqKf7GoB9jrhg+k8Wu52mda6u08nNActEG97Yaqy71VSWW6h02p3tcM2nyXP','$2b$12$Q3sXP32Po4g0rgQpptuqLOB813DwBZZt4Kfm7n0nUUNuYAvMcxeOq','super_admin',1,'2025-10-22 20:26:00','2025-10-23 00:26:07');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal`
--

DROP TABLE IF EXISTS `animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal` (
  `id_animal` int NOT NULL AUTO_INCREMENT,
  `nombre_animal` varchar(500) DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `id_raza` int DEFAULT NULL,
  `id_especie` int NOT NULL,
  `id_propietario` int NOT NULL,
  PRIMARY KEY (`id_animal`),
  KEY `id_raza` (`id_raza`),
  KEY `id_especie` (`id_especie`),
  KEY `id_propietario` (`id_propietario`),
  CONSTRAINT `animal_ibfk_1` FOREIGN KEY (`id_raza`) REFERENCES `raza` (`id_raza`),
  CONSTRAINT `animal_ibfk_2` FOREIGN KEY (`id_especie`) REFERENCES `especie` (`id_especie`),
  CONSTRAINT `animal_ibfk_3` FOREIGN KEY (`id_propietario`) REFERENCES `propietario` (`id_propietario`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
INSERT INTO `animal` VALUES (16,'5Vbkd7t32oEIL6WbErB3WQ==:9IxvGEm6nVlSDQW7aR+edQ==',5,6,2,11),(22,'U+ANh103lngWuZvldG3+/A==:MHZgVJ4Kg+ZZ/dJucmH4gg==',6,10,4,11),(23,'riK94/PeaVz8yIptuoIEWg==:jM9KnmiFRg1Y6G6qFbE/zA==',7,12,5,11),(27,'krYxUVcJkdFpVGGq3nq99g==:QH6wIvCig7WGH9J+qgeQkw==',6,3,1,11),(33,'OFhqYaRNI1Xiv0lOWsCc1A==:ymbUrK889fjo+3lKkfU/Tg==',5,7,2,11),(34,'IId91vx5GqkNSvC0OrpJjA==:ohbdKWa6TWfTIyVPIdfTpQ==',7,7,2,11),(38,'6TNoZhtIWOYkAB1dUEW9yg==:3zVDKLBeFx+d6nGVyuvDuQ==',7,21,10,22),(39,'AIWPTF3vsHmO6VKdUwxacw==:IsK5UA6x+cXmox2TtTOUpw==',9,20,9,22),(44,'uSC5hVCvOrsbwTqHbWNb0g==:A9yaIe13Qvd9hhrtj9JyjA==',5,9,3,11),(46,'t8iSt6Dvjvv7mKSAg3wRCQ==:lAwPeMJyR5NAFXbnDuSLgw==',2,7,2,23),(48,'2Jzfbp3qoQKAfI3M6Tb2Yw==:gJE7SJsJ+fE168PixKAOgw==',7,19,8,23),(49,'gHinqjmUbMyhh056ucFuXQ==:evzzX4cSYOjAM4LRWpsvMQ==',8,8,3,23),(53,'YqtEDgHC7AxTeOPbqsogdA==:JnZdxBTRQ4C6BnCt2XXTyg==',8,10,4,22),(54,'3/YULsFfepoffa2LUcTaYQ==:Yrz/aEHJsYJccq+DdvdqSw==',5,4,1,23),(55,'eejKPIk+cAp4j7brppz3cA==:LmYE1lgAFlKFLYy1xURD9w==',4,20,9,24),(56,'jG0fE7DvPmtWp+NYfmLtiw==:oLYhzm9/0bF4ZjEGmCPr1Q==',7,19,8,25),(57,'gRW2Y9ziEA5EbjpzEIKV+g==:rou+kfDiNEfsn2jb5ZTFJg==',9,1,1,25),(58,'NYgDauWcVIB0BwzxO71+sg==:Nx04Wk72Gd0zmNCn+kwM2w==',7,2,1,25),(60,'9gjVkcJRtFOl3G0S0OlmhQ==:BBPydyR1Ia2nX3t23eJCrg==',7,1,1,22),(61,'opG2mOhRnrxfF6doWOnDsw==:5WyNkCaU8KuG299uwv7TEg==',5,5,2,22),(63,'Q4SftKOEZVHi91zdQXYznQ==:eYJN2ThFGtgrUq+OTWo0cA==',7,1,1,28),(64,'3ugX03fJssE7MobkOogvdA==:G0Jy8cn9vWtIKwHPdoOR9A==',7,1,1,28),(65,'HmBTZJHkM1Q2s1Ssi2d5BA==:vIsSIfuWubLZmx8TyT7AnQ==',9,19,8,28),(66,'19Kunk5bj99FJYknrZcUIQ==:15psySvv5NRI7nUKgA4VCw==',5,8,3,28),(67,'E3AQuFIan0j900FVpZAwQw==:k0wCCfJD7JhExwXL3JCRqQ==',7,126,10,28),(69,'do0KKnoNP2exPYpsiqOJOQ==:daK+ULgTZ/ELx5dabN4eaA==',7,73,1,28),(70,'tUyM+YLX8TMl7h3y5CCxfg==:1n8Q+MJ/33y0pRqZiLhu1w==',7,25,1,28),(73,'Dz6/JW/QEN+0LdiwhzZcPA==:iRAuxTrtwKJ/eQZIYGGrRQ==',7,7,2,28),(74,'wYV/91s0DBFxHNc3/Xm5dw==:dUHCyOfbKPqSlB6hkzNwgg==',7,6,2,28),(75,'1I/RUR9xpVAkT5zDKiseyQ==:q3iJ79yItLkxfU1dS6MkIw==',7,61,2,28),(76,'UJUoOEyxNDkWkC74mwkryA==:UR6rT+Pcyd23K+iN6N+wjQ==',7,121,9,28),(78,'pWnzet5gCgqdUKa1pQqdJQ==:q4BISoXM71OGqoqA2hWC4g==',7,6,2,28),(79,'6EQ/6B0CkSXuxuimeHIuZQ==:mdTXHj+axkoBFvuaO+xRJg==',7,8,3,28),(80,'hVYBwKANVxxm8Obz4HootA==:UFTAVQ6eWjZ5thWe48W4EQ==',7,63,2,28),(82,'oLEfnNgeOvQCJhsEaWa6SQ==:hPJRyNI0SYvgTbUKF4z1bA==',9,115,8,29),(83,'UlQ72jVb1AWNr63ZdqkI0w==:P2w8vIB2/NRNChMerwdUBw==',7,32,1,28),(84,'ryut4OwEg1oYgHlmI8+Yaw==:hAxCyeGByjY3HMhnCSU28Q==',7,19,8,30),(85,'dDBwcYGfpKxlqLfqoGuluQ==:EGp90K103evksB//VSX7gA==',7,77,3,22),(86,'r8ueeI8cFlVOJaVz1rBg2g==:IVu7XiSfvp0HWI9DWa5vXw==',7,28,1,28),(87,'75W6KrHz8ysoqH9ylQD1wg==:FROUfa24JAiYwNR+zh8aZQ==',8,15,6,29),(88,'bKso8FAMPnR94OCv0pSvqw==:uSl6Y7+/q5rn3t/6Agk48A==',7,8,3,29);
/*!40000 ALTER TABLE `animal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especie`
--

DROP TABLE IF EXISTS `especie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especie` (
  `id_especie` int NOT NULL,
  `nombre_especie` varchar(50) NOT NULL,
  PRIMARY KEY (`id_especie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especie`
--

LOCK TABLES `especie` WRITE;
/*!40000 ALTER TABLE `especie` DISABLE KEYS */;
INSERT INTO `especie` VALUES (1,'Canino'),(2,'Felino'),(3,'Porcino'),(4,'Equino'),(5,'Bovino'),(6,'Roedor'),(7,'Ave'),(8,'Reptil'),(9,'Ovino'),(10,'Caprino');
/*!40000 ALTER TABLE `especie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura` (
  `id_factura` int NOT NULL AUTO_INCREMENT,
  `nombre_propietario` varchar(50) NOT NULL,
  `apellidos_propietario` varchar(50) NOT NULL,
  `id_propietario` int NOT NULL,
  `fecha` date NOT NULL,
  `nombre_analisis` varchar(50) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_factura`),
  KEY `id_propietario` (`id_propietario`),
  CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`id_propietario`) REFERENCES `propietario` (`id_propietario`)
) ENGINE=InnoDB AUTO_INCREMENT=987654322 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factura`
--

LOCK TABLES `factura` WRITE;
/*!40000 ALTER TABLE `factura` DISABLE KEYS */;
/*!40000 ALTER TABLE `factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `muestra`
--

DROP TABLE IF EXISTS `muestra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `muestra` (
  `id_muestra` int NOT NULL AUTO_INCREMENT,
  `id_estado` int NOT NULL,
  `fecha_toma` date NOT NULL,
  `hora_toma` time DEFAULT NULL,
  `id_animal` int NOT NULL,
  `id_tipo_muestra` int NOT NULL,
  PRIMARY KEY (`id_muestra`),
  KEY `id_estado` (`id_estado`),
  KEY `id_animal` (`id_animal`),
  KEY `id_tipo_muestra` (`id_tipo_muestra`),
  CONSTRAINT `muestra_ibfk_1` FOREIGN KEY (`id_estado`) REFERENCES `tipo_estado` (`id_tipo_estado`),
  CONSTRAINT `muestra_ibfk_2` FOREIGN KEY (`id_animal`) REFERENCES `animal` (`id_animal`),
  CONSTRAINT `muestra_ibfk_3` FOREIGN KEY (`id_tipo_muestra`) REFERENCES `tipo_muestra` (`id_tipo_muestra`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muestra`
--

LOCK TABLES `muestra` WRITE;
/*!40000 ALTER TABLE `muestra` DISABLE KEYS */;
INSERT INTO `muestra` VALUES (19,1,'2025-09-24',NULL,16,1),(27,1,'4564-12-31',NULL,22,1),(28,1,'2025-09-22',NULL,23,1),(32,1,'2025-09-23',NULL,27,1),(38,1,'2025-10-03',NULL,33,1),(40,1,'2025-10-03',NULL,34,1),(41,1,'2025-10-15',NULL,38,1),(42,1,'2025-10-14',NULL,39,1),(46,1,'2025-10-16',NULL,44,1),(49,1,'2025-10-07',NULL,46,4),(51,1,'2025-10-16',NULL,48,3),(52,1,'2025-10-16',NULL,46,1),(53,1,'2025-10-01',NULL,48,3),(54,1,'2025-10-07',NULL,49,4),(55,1,'2025-10-03',NULL,49,2),(60,1,'2025-10-07','16:30:00',53,2),(61,1,'2025-10-06','16:58:00',54,3),(62,1,'2025-10-06','08:20:00',55,4),(63,1,'2025-10-07','16:25:00',56,6),(64,1,'2025-10-25','16:07:00',57,6),(65,1,'2025-10-07','17:50:00',58,3),(66,1,'2025-10-07','16:33:00',57,2),(68,1,'2025-10-08','12:53:00',38,4),(72,1,'2025-10-08','14:03:00',60,4),(73,1,'2025-10-08','14:04:00',60,7),(75,1,'2025-10-08','15:48:00',61,6),(76,1,'2025-10-08','08:02:00',38,6),(77,1,'2025-10-09','15:23:00',38,3),(79,1,'2025-10-10','13:25:00',38,4),(80,1,'2025-10-15','12:57:00',63,3),(81,1,'2025-10-15','09:49:00',60,1),(83,1,'2025-10-17','13:33:00',64,3),(84,1,'2025-10-17','13:50:00',65,7),(86,1,'2025-10-17','14:27:00',65,7),(87,1,'2025-10-17','14:52:00',66,3),(88,1,'2025-10-18','16:45:00',69,3),(90,1,'2025-10-18','17:23:00',70,4),(92,1,'2025-10-21','17:06:00',73,4),(93,1,'2025-10-21','17:23:00',73,6),(94,1,'2025-10-21','16:03:00',74,4),(95,1,'2025-10-22','11:33:00',75,4),(96,1,'2025-10-22','11:50:00',76,4),(98,1,'2025-10-23','08:48:00',78,5),(99,1,'2025-10-24','11:28:00',66,5),(100,1,'2025-10-24','16:02:00',79,4),(101,1,'2025-10-24','16:59:00',80,6),(103,1,'2025-10-25','10:06:00',82,5),(104,1,'2025-10-25','11:04:00',83,7),(105,1,'2025-10-25','11:42:00',69,4),(106,1,'2025-10-25','12:03:00',84,5),(107,1,'2025-10-25','12:20:00',76,5),(108,1,'2025-10-26','12:15:00',85,6),(109,1,'2025-10-26','13:32:00',66,6),(110,1,'2025-11-03','13:07:00',86,3),(111,1,'2025-10-27','14:10:00',87,3),(112,1,'2025-10-28','14:34:00',87,5),(113,1,'2025-10-27','14:39:00',39,6),(114,1,'2025-10-29','16:38:00',88,5);
/*!40000 ALTER TABLE `muestra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('info','success','warning','error') DEFAULT 'info',
  `leida` tinyint(1) DEFAULT '0',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_animal` int DEFAULT NULL,
  `id_tipo_analisis` int DEFAULT NULL,
  `id_resultado` int DEFAULT NULL,
  `tipo_destinatario` enum('propietario','admin') DEFAULT 'propietario',
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_id` (`user_id`),
  KEY `idx_notifications_leida` (`leida`),
  KEY `idx_notifications_fecha` (`fecha_creacion`),
  KEY `idx_notifications_animal` (`id_animal`),
  KEY `idx_notifications_tipo_analisis` (`id_tipo_analisis`),
  KEY `idx_notifications_resultado` (`id_resultado`),
  KEY `idx_tipo_destinatario` (`tipo_destinatario`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `propietario` (`id_propietario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (86,29,'Próxima toma de muestra','Recuerda que pronto (menos de 24h) se realizará la toma de muestra de Sergiosito. [ID:111]','warning',1,'2025-10-26 14:20:00',NULL,NULL,NULL,'propietario'),(87,22,'Próxima toma de muestra','Recuerda que pronto (menos de 24h) se realizará la toma de muestra de Puerquito. [ID:113]','warning',0,'2025-10-26 18:40:00',NULL,NULL,NULL,'propietario'),(88,29,'Análisis en proceso','Tu análisis de CREATININA para Manu ha comenzado a procesarse.','info',1,'2025-10-28 16:39:46',NULL,NULL,113,'propietario');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `propietario`
--

DROP TABLE IF EXISTS `propietario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propietario` (
  `id_propietario` int NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `direccion` varchar(1000) DEFAULT NULL,
  `telefono` varchar(500) DEFAULT NULL,
  `correo_electronico` varchar(500) DEFAULT NULL,
  `contraseña` varchar(255) NOT NULL,
  PRIMARY KEY (`id_propietario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propietario`
--

LOCK TABLES `propietario` WRITE;
/*!40000 ALTER TABLE `propietario` DISABLE KEYS */;
INSERT INTO `propietario` VALUES (11,'Nilson','Bernal','GHgEXQvDmYWSmei1lj8jEQ==:qHlEunTy5jO396fSRvytC9gQo6MLskq98+qrzUzhXEM=','fJmFVhmzGHfsvuOYA9CLlg==:SsjT6toNshDyo57i1QB8Sg==','XIBRXQB4wmR9Cd1GkZZrvA==:Ag2mgAgVXCT7oh5+2gAcxmKzd18ufPrl29PIUKVwLc4=','$2b$12$37oYLKLViO4IAT/cOikZkO.yR8xh4ecsSERomdeVlbrXFE6UygzBi'),(22,'Andrew','Loaiza Guzmán','W5ftlX462khzuthd0EZJsA==:Tu/Q3Pm0cv93Wb/9fccFg/T6w0JYeJc7mm9LdGnhsEb6n7Kbc07RPxWndjiByNtE','o4Q64zvQEOuBWAIPX+mV2g==:1+tmMbG4vOKhDUu+ucm54Q==','2/j/fHDFmBR+T9z3881q/Q==:Vam+ycPm58yh4TwWDiyfBM1zwoE40eJL6WPZdVrrLxM=','$2b$12$SSemUAdIycIsDER9FF1Pz.pN32qNCskUiduUOvrNwaJIAteNR5jcm'),(23,'Juan Fernanado','Guzmán','9Xwx14hXZ2IgjtUgAdSWbg==:/F/UfgL4GAYtxeVgCz7wag==','2+V6h6sq6EA/dO4SynUUvw==:xAZeq1rsUMfwc5ibp2VsTw==','6e9EJ8EUD+vsoeZpmrd33g==:X0+t0S86GvfSzTgwN8AequD3K3tai7jRafiUL9RpcGk=','$2b$12$PNeZWHwAQo55derBwreYxOXpseZl3u1MpuoZFo.AXbsXfFQLC8nHq'),(24,'Juan','Gonzales','iaAt131wUNaKGsRoRoBNoA==:mPY3z8q81yCsEWbKd1srubmhta+az3ySkpj1fZS1RWGC5ymt1l6l/IKJKzRetUiY','qeWgzrgJooHRxQUltIeB2A==:X9WByRflxQyQHfR/ZiL+jw==','Soh/a4SGWNtNRQeJ34aZ4w==:yPDp7Pv3oR+/uBvEXCrlJRiZlhs1JIorla/nrwOPYGE=','$2b$12$9TuKRPME6GtzDbQ3ZxLx2u0K/bhsouA6PGWanNwAelgsKavkDoFHi'),(25,'Cristian Andres','Avalo Valencia','9xh7tADCqjpYk/cJTZNipg==:iLEuYA+MBjmxVnBK1L9JKuUtGSS3nw2jk+3EaQGPnzs=','1XoGWEmfIDc8151zasgUdQ==:ffmlLzdBwI3gcJ6a3meDhg==','7evnyfgfYA1ViWtVvHrTVw==:BdnC4lm6GM7Pt+e9Ru6d4mtAN9+62AeMvP7sgKsFRIA=','$2b$12$XeBymMCX1mVddpnkr2DchODuYBdceqrxVDllsU7C5OJ0Y.cIfOr6C'),(26,'Juan Esteban','Buritica Garcia','9Gdvtq2eK2WaqZxgMareBA==:6EKk4yQJH9QWXUh7sokhqFvyldbX2zru8i8qyCW3VrCubI3pwOkD6I305WeOsnmw','5kKXBEYFlwbM7tSbJwLcYg==:fCLJOcaAdzSgro2OKbr9cg==','+0w2Dwl/+25hARO6Nf5kbg==:UnbeVbJu5kzL3bDTORYSFqha/5cZWzlqhuHrd7wYuiI=','$2b$12$.dQn2DwL8lsH0osDTEMdb.xWuAEh83FU0hDAlvE./UTBAyN17trMu'),(27,'Andres Camilo','Lopez','fz67fM6GWIzP9jlmF/G6Lw==:uRIpeC3bq8GKCN+YPf3nzIAN3865EwA+ZflXRN+TY4I=','qAPc4F8DX3LPG4p7i7EfYw==:iHy4AGGmoX/bxm1zO60Mew==','EgY2tKviCro3zUHBwxmIYw==:b4vO2IPVbh5Z+0BYUaRb8SSvLU5M7NyTnKxHoUT2K8A=','$2b$12$n9wMo7NRbOxoHjByhDz6rOBGsNpK9mBqap7mB74.sgGL.44sIE0pu'),(28,'Luciana','Lopez','mW33QqtnjjDJ89OrqKiq2w==:ufCD5QibCFYGgzrzlcIgvUWw5QKzL1XVxFcqk5g+QL2dCOVDOrXTk3UQ9OcZXhiN','NpiyQ3U5fvMCEPIxevHLYg==:QijrGoQUHgtwMHRjJup5fA==','NfgbW6vftPXBNDJBOnuBXA==:YO9yKE1eDdvvog/I7KBrBXnj/aKyyB05mkIZravsu8E=','$2b$12$o1V/94woDQYCmDiHu06kPu9I0u9IQEq6oVzhNiD9jIHWFMc0m8K76'),(29,'Sergio Mario','Orozco','YJvymHNHIsqtI0YaQ+DnZg==:bLSYB2ReKtUjU0N7bZpelvUc2QPjH0DZM/zS4juiCAvnsRSAAXRO/wIrtx8hX6yl','CufOFbFTWXkv5MXB4BEJQg==:yY1k1eYC2ZIGtgP3UOoo9g==','HnoYI+J7JDTKG2ulxWu7rw==:Ur0s7X6zaA53Szb53id7BZEE+oQADP9iuEFy7l417vs=','$2b$12$8Gzg.EorHHbXdRv6tE3Kce8uiyPTbqt6EUfCrl2QZSgbyjcA3lIOW'),(30,'Anderson','Montoya Grajales','HxdXVSsqj7ZYMZvjBoFqnw==:fcFlbRPzJDwjdpE/uDCCCJlhHnVSt1qk4RhJdQI2Kds=','Ggm5+In5VenXxMQUG8Nx9g==:i7AhWhR4TmlrhQ+BMvIh0A==','jnTiILvrkAn+M6hYvIv3Cg==:VpotMSRhZ4KXqV5ayHfAqRwq+I0HwVpAwGmmJocUJd8=','$2b$12$nmgcpAElISj//ld38.ibWemrgKcXGkNE.2tTxwCReSsIxvFjcfSy2');
/*!40000 ALTER TABLE `propietario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `propietario_animal`
--

DROP TABLE IF EXISTS `propietario_animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propietario_animal` (
  `id_propietario` int DEFAULT NULL,
  `id_propietario_animal` int NOT NULL,
  `id_animal` int DEFAULT NULL,
  PRIMARY KEY (`id_propietario_animal`),
  KEY `id_propietario` (`id_propietario`),
  KEY `id_animal` (`id_animal`),
  CONSTRAINT `propietario_animal_ibfk_1` FOREIGN KEY (`id_propietario`) REFERENCES `propietario` (`id_propietario`),
  CONSTRAINT `propietario_animal_ibfk_2` FOREIGN KEY (`id_animal`) REFERENCES `animal` (`id_animal`),
  CONSTRAINT `propietario_animal_ibfk_3` FOREIGN KEY (`id_animal`) REFERENCES `animal` (`id_animal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propietario_animal`
--

LOCK TABLES `propietario_animal` WRITE;
/*!40000 ALTER TABLE `propietario_animal` DISABLE KEYS */;
/*!40000 ALTER TABLE `propietario_animal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raza`
--

DROP TABLE IF EXISTS `raza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raza` (
  `id_raza` int NOT NULL,
  `nombre_raza` varchar(50) NOT NULL,
  `id_especie` int NOT NULL,
  PRIMARY KEY (`id_raza`),
  KEY `id_especie` (`id_especie`),
  CONSTRAINT `raza_ibfk_1` FOREIGN KEY (`id_especie`) REFERENCES `especie` (`id_especie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raza`
--

LOCK TABLES `raza` WRITE;
/*!40000 ALTER TABLE `raza` DISABLE KEYS */;
INSERT INTO `raza` VALUES (1,'Criollo Canino',1),(2,'Labrador',1),(3,'Pastor Alemán',1),(4,'Pit Bull',1),(5,'Criollo Felino',2),(6,'Persa',2),(7,'Siamés',2),(8,'Mini Pig',3),(9,'Duroc',3),(10,'Árabe',4),(11,'Percherón',4),(12,'Brahman',5),(13,'Holstein',5),(14,'Hámster',6),(15,'Conejillo de Indias',6),(16,'Loro',7),(17,'Canario',7),(18,'Iguana',8),(19,'Tortuga',8),(20,'Merino',9),(21,'Saanen',10),(22,'Beagle',1),(23,'Bulldog Francés',1),(24,'Golden Retriever',1),(25,'Chihuahua',1),(26,'Rottweiler',1),(27,'Pomerania',1),(28,'Boxer',1),(29,'Husky Siberiano',1),(30,'Cocker Spaniel',1),(31,'Shih Tzu',1),(32,'Doberman',1),(33,'Dálmata',1),(34,'Pastor Australiano',1),(35,'Poodle',1),(36,'Schnauzer',1),(37,'San Bernardo',1),(38,'Border Collie',1),(39,'Akita Inu',1),(40,'Mastín Napolitano',1),(41,'Bichón Frisé',1),(42,'Bull Terrier',1),(43,'Terrier Escocés',1),(44,'Corgi Galés',1),(45,'Gran Danés',1),(46,'Boston Terrier',1),(47,'Shar Pei',1),(48,'Weimaraner',1),(49,'Vizsla',1),(50,'Basenji',1),(51,'Samoyedo',1),(52,'Bengalí',2),(53,'Maine Coon',2),(54,'British Shorthair',2),(55,'Sphynx',2),(56,'Ragdoll',2),(57,'Abisinio',2),(58,'Exótico de Pelo Corto',2),(59,'Bosque de Noruega',2),(60,'Angora Turco',2),(61,'Himalayo',2),(62,'Scottish Fold',2),(63,'Oriental',2),(64,'Burmés',2),(65,'Cornish Rex',2),(66,'Devon Rex',2),(67,'Azul Ruso',2),(68,'Savannah',2),(69,'Manx',2),(70,'Bombay',2),(71,'American Shorthair',2),(72,'Pincher',1),(73,'Pincher Miniatura',1),(74,'Yorkshire',3),(75,'Landrace',3),(76,'Pietrain',3),(77,'Large White',3),(78,'Hampshire',3),(79,'Berkshire',3),(80,'Spotted',3),(81,'Pura Sangre Inglés',4),(82,'Cuarto de Milla',4),(83,'Appaloosa',4),(84,'Frisón',4),(85,'Lusitano',4),(86,'Andaluz',4),(87,'Mustang',4),(88,'Silla Francés',4),(89,'Angus',5),(90,'Hereford',5),(91,'Simmental',5),(92,'Gyr',5),(93,'Jersey',5),(94,'Guernsey',5),(95,'Pardo Suizo',5),(96,'Normando',5),(97,'Hámster Sirio',6),(98,'Hámster Enano Ruso',6),(99,'Hámster Roborowski',6),(100,'Cuy Peruano',6),(101,'Cuy Abisinio',6),(102,'Cuy Crestado',6),(103,'Guacamayo Azulamarillo',7),(104,'Cacatúa',7),(105,'Periquito Australiano',7),(106,'Agapornis',7),(107,'Loro Amazona',7),(108,'Diamante Mandarín',7),(109,'Jilguero',7),(110,'Dragón Barbudo',8),(111,'Gecko Leopardo',8),(112,'Camaleón Velado',8),(113,'Tortuga de Orejas Rojas',8),(114,'Boa Constrictor',8),(115,'Pitón Real',8),(116,'Dorper',9),(117,'Romney Marsh',9),(118,'Suffolk',9),(119,'Texel',9),(120,'Corriedale',9),(121,'Santa Inés',9),(122,'Boer',10),(123,'Alpina',10),(124,'Nubia',10),(125,'Toggenburg',10),(126,'Angora',10),(127,'LaMancha',10);
/*!40000 ALTER TABLE `raza` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultado`
--

DROP TABLE IF EXISTS `resultado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultado` (
  `id_resultado` int NOT NULL AUTO_INCREMENT,
  `fecha_solicitud` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_tipo_analisis` int NOT NULL,
  `id_muestra` int NOT NULL,
  `resultado` varchar(50) NOT NULL,
  `observaciones` text,
  `fecha_emision` date NOT NULL,
  `hora_emision` time DEFAULT NULL,
  `id_animal` int NOT NULL,
  `id_estado` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_resultado`),
  KEY `id_tipo_analisis` (`id_tipo_analisis`),
  KEY `id_muestra` (`id_muestra`),
  KEY `id_animal` (`id_animal`),
  KEY `fk_estado` (`id_estado`),
  CONSTRAINT `fk_estado` FOREIGN KEY (`id_estado`) REFERENCES `tipo_estado` (`id_tipo_estado`),
  CONSTRAINT `resultado_ibfk_1` FOREIGN KEY (`id_tipo_analisis`) REFERENCES `tipo_analisis` (`id_tipo_analisis`),
  CONSTRAINT `resultado_ibfk_2` FOREIGN KEY (`id_muestra`) REFERENCES `muestra` (`id_muestra`),
  CONSTRAINT `resultado_ibfk_3` FOREIGN KEY (`id_animal`) REFERENCES `animal` (`id_animal`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado`
--

LOCK TABLES `resultado` WRITE;
/*!40000 ALTER TABLE `resultado` DISABLE KEYS */;
INSERT INTO `resultado` VALUES (18,'2025-10-26 14:29:06',14,19,'Pendiente',NULL,'2025-09-24',NULL,16,1),(26,'2025-10-26 14:29:06',1,27,'Pendiente','Muy buen estado de salud el del peoorrito','2025-10-30',NULL,22,3),(27,'2025-10-26 14:29:06',15,28,'Pendiente',NULL,'2025-09-22',NULL,23,1),(31,'2025-10-26 14:29:06',20,32,'Pendiente',NULL,'2025-09-23',NULL,27,1),(37,'2025-10-26 14:29:06',14,38,'Pendiente',NULL,'2025-10-03',NULL,33,1),(39,'2025-10-26 14:29:06',3,40,'Positivo','Madre mia willy','2025-10-03',NULL,34,3),(41,'2025-10-26 14:29:06',2,42,'Positivo','','2025-10-14','19:04:28',39,3),(45,'2025-10-26 14:29:06',11,46,'Pendiente',NULL,'2025-10-16',NULL,44,1),(48,'2025-10-26 14:29:06',10,49,'sadfsafdsa','chiolllll','2025-10-03',NULL,46,4),(50,'2025-10-26 14:29:06',4,51,'Hemoglobina 12/gl','tiene un buen estado de slaud','2025-10-16','18:38:53',48,3),(51,'2025-10-26 14:29:06',1,52,'','El análisis de Juliana ha comenzado a procesarce','2025-10-16',NULL,46,2),(52,'2025-10-26 14:29:06',5,53,'No Reactivo','','2025-10-01','18:39:37',48,3),(54,'2025-10-26 14:29:06',3,55,'Positivo','','2025-10-16',NULL,49,3),(59,'2025-10-26 14:29:06',3,60,'Negativo','kjhkjlhjkh','2025-10-09','16:43:26',53,3),(60,'2025-10-26 14:29:06',5,61,'','ff','2025-10-06','08:29:00',54,2),(61,'2025-10-26 14:29:06',13,62,'Pendiente','El pobre análisis le salio negativo, pero el perrito esta se ve feliz','2025-10-06','22:32:32',55,2),(62,'2025-10-26 14:29:06',16,63,'Pendiente','','2025-10-07','13:45:29',56,3),(63,'2025-10-26 14:29:06',15,64,'si','','2025-10-25','15:44:32',57,3),(64,'2025-10-26 14:29:06',5,65,'Positivo','','2025-10-07','15:50:08',58,3),(65,'2025-10-26 14:29:06',3,66,'Pendiente','','2025-10-07','15:07:11',57,3),(67,'2025-10-26 14:29:06',13,68,'No Reactivo','El examen ha sido correcto/exitoso','2025-10-08','22:28:28',38,3),(72,'2025-10-26 14:29:06',19,73,'No Reactivo','Muy buena salud','2025-10-08','16:29:47',60,3),(74,'2025-10-26 14:29:06',15,75,'Muy sano el animalito - Positivo','Muy sano el animalito','2025-10-08','15:51:36',61,3),(75,'2025-10-26 14:29:06',15,76,'Pendiente','','2025-10-08','23:01:02',38,2),(76,'2025-10-26 14:29:06',7,77,'Pendiente',NULL,'2025-10-09',NULL,38,1),(78,'2025-10-26 14:29:06',8,79,'Hemoglobina 12g/L','Normal en estado base','2025-10-10','18:43:21',38,3),(79,'2025-10-26 14:29:06',7,80,'Positivo','','2025-10-15','12:58:28',63,3),(80,'2025-10-26 14:29:06',1,81,'Pendiente','','2025-10-15','21:51:25',60,2),(82,'2025-10-26 14:29:06',5,83,'Hemoglobina: 12g/dL','Hemoglobina se encuentra en un estado natural.','2025-10-17','13:33:57',64,3),(83,'2025-10-26 14:29:06',18,84,'Negativo','El examen no resultó de forma exitosa, el animal presenta sintomas extraños para su raza y edad, es posible que requiera de otros análisis para saber la razón de este resultado.','2025-10-17','13:51:47',65,3),(85,'2025-10-26 14:29:06',21,86,'Pendiente','','2025-10-17','14:27:52',65,2),(86,'2025-10-26 14:29:06',4,87,'Pendiente','Excelente salud la del animal','2025-10-17','12:09:50',66,2),(87,'2025-10-26 14:29:06',4,88,'Positivo','','2025-10-18','14:38:57',69,3),(89,'2025-10-26 14:29:06',10,90,'Positivo','Excelente resultado, se recomienda tomar más análisis relacionadosa los riñones para evitar problemas futuros','2025-10-18','17:25:26',70,3),(91,'2025-10-26 14:29:06',13,92,'Positivo','Excelente salud, re recomienda seguir realizando análisis similares más de seguido','2025-10-21','17:08:18',73,3),(92,'2025-10-26 14:29:06',15,93,'Muy Positivo','Excelentes resultados','2025-10-21','17:40:59',73,3),(93,'2025-10-26 14:29:06',11,94,'Reactivo','','2025-10-21','18:04:43',74,3),(95,'2025-10-26 14:29:06',13,96,'Negativo','','2025-10-22','14:48:47',76,3),(97,'2025-10-26 14:29:06',14,98,'Positivo','','2025-10-23','20:51:05',78,3),(99,'2025-10-26 14:29:06',13,100,'Negativo','Realizar más análisis similares para descartar enfermades más agresivas','2025-10-24','16:03:41',79,3),(100,'2025-10-26 14:29:06',15,101,'Positivo','Muy buena la salud de su puerquito','2025-10-24','17:05:12',80,3),(102,'2025-10-26 14:29:06',14,103,'Hemoglobina 12g/dL','Niveles normales de Hemoglobina','2025-10-25','10:08:13',82,3),(103,'2025-10-26 14:29:06',21,104,'Anormal','','2025-10-25','11:12:39',83,3),(104,'2025-10-26 14:29:06',10,105,'Pendiente','','2025-10-25','11:45:16',69,2),(105,'2025-10-26 14:29:06',14,106,'Positivo','','2025-10-25','12:04:53',84,3),(107,'2025-10-26 14:29:06',15,108,'Negativo','','2025-10-26','12:19:35',85,3),(109,'2025-10-26 14:29:06',7,110,'Pendiente',NULL,'2025-11-03',NULL,86,1),(110,'2025-10-26 14:29:06',4,111,'Pendiente',NULL,'2025-10-27',NULL,87,1),(111,'2025-10-28 00:00:00',14,112,'Pendiente',NULL,'2025-10-28',NULL,87,1),(112,'2025-10-27 00:00:00',16,113,'Pendiente',NULL,'2025-10-27',NULL,39,1),(113,'2025-10-29 00:00:00',14,114,'Pendiente','','2025-10-29','16:39:46',88,2);
/*!40000 ALTER TABLE `resultado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_analisis`
--

DROP TABLE IF EXISTS `tipo_analisis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_analisis` (
  `id_tipo_analisis` int NOT NULL,
  `id_tipo_muestra` int NOT NULL,
  `nombre_analisis` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_tipo_analisis`),
  KEY `id_tipo_muestra` (`id_tipo_muestra`),
  CONSTRAINT `tipo_analisis_ibfk_1` FOREIGN KEY (`id_tipo_muestra`) REFERENCES `tipo_muestra` (`id_tipo_muestra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_analisis`
--

LOCK TABLES `tipo_analisis` WRITE;
/*!40000 ALTER TABLE `tipo_analisis` DISABLE KEYS */;
INSERT INTO `tipo_analisis` VALUES (1,1,'HEMOGRAMA',35.00),(2,2,'TIEMPO DE PROTROMBINA PT',35.00),(3,2,'TIEMPO DE TROMBOPLASTINA TPT',35.00),(4,3,'CORTISOL',50.00),(5,3,'HORMONA ESTIMULANTE DE TIROIDES TSH',70.00),(6,3,'HORMONA TIROXINA T4',60.00),(7,3,'HORMONA TRIYODOTIRONINA T3',60.00),(8,4,'PARVOVIRUS',30.00),(9,4,'TOXOPLASMA',60.00),(10,4,'LYME',72.00),(11,4,'LEPTOSPIRA',35.00),(12,7,'SIDA',35.00),(13,4,'LEUCEMIA',50.00),(14,5,'CREATININA',30.00),(15,6,'PROTEÍNA C REACTIVA PCR',45.00),(16,6,'COLESTEROL TOTAL',30.00),(17,7,'UROANALISIS',25.00),(18,7,'COPROLOGICO',25.00),(19,7,'PERFIL RENAL I',55.00),(20,7,'PERFIL PREQUIRURGICO I',65.00),(21,7,'PERFIL BIENESTAR GERIATRICO',85.00);
/*!40000 ALTER TABLE `tipo_analisis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_estado`
--

DROP TABLE IF EXISTS `tipo_estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_estado` (
  `id_tipo_estado` int NOT NULL,
  `nombre_estado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_estado`
--

LOCK TABLES `tipo_estado` WRITE;
/*!40000 ALTER TABLE `tipo_estado` DISABLE KEYS */;
INSERT INTO `tipo_estado` VALUES (1,'Pendiente'),(2,'En proceso'),(3,'Finalizado'),(4,'Cancelado');
/*!40000 ALTER TABLE `tipo_estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_muestra`
--

DROP TABLE IF EXISTS `tipo_muestra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_muestra` (
  `id_tipo_muestra` int NOT NULL,
  `nombre_tipo_muestra` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_muestra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_muestra`
--

LOCK TABLES `tipo_muestra` WRITE;
/*!40000 ALTER TABLE `tipo_muestra` DISABLE KEYS */;
INSERT INTO `tipo_muestra` VALUES (1,'Hematologia'),(2,'Coagulacion'),(3,'Hormonas'),(4,'Serologia'),(5,'Quimica'),(6,'Microscopia'),(7,'Perfiles');
/*!40000 ALTER TABLE `tipo_muestra` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-28 16:48:17
