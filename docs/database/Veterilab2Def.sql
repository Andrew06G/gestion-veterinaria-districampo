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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Administrador','Sistema','2Nj1D9dYS76iZKWoTEEgFg==:QqLV/rujaqyOQ22Y5mzJM9GOK+69Z+/j4QH57q/29u4=','QIUsnn4uWlm5ansQK3hhvQ==:ALsAlGAI87YiqB/8XRDoPQ==','DhjSSF/o79853JUwuwc16A==:2KRCp+Xa8Fe5fUE4/dwHvt7Ib32aqoezy1EwyWLwqas=','$2b$12$DrSdOFToAB9m.7.IGJQjbeDW8tREIAbrnbkDRDfc1d8F44Abd/vCa','super_admin',1,'2025-09-25 01:51:43','2025-10-15 00:02:15'),(2,'Andrew','Loaiza Guzmán','H+8maS64iNCHAl+UFfzgpA==:4Sqw1T9XBgSb9IKS44QKqXlgio5/xqd0YI9mXar4LEA=','x9BM7n6Q5Z4r9LsNx0MDEw==:Ehn1X/m+05aUDhLHbYQPVg==','FI2SWgHoK6eiAEPDq6oKAA==:6Cm1/THccWIwm7rGx9M0iqhmAgz8oelurhVaYUIIJ9DZwVBuVma3XHkKaDYhqL1u','$2b$12$6Kokc3KD9ZmBUMs.J9xJwO/EHDcbh88DCr.bY8ZiRf8CoYgp3sYgO','super_admin',1,'2025-10-04 03:53:32','2025-10-14 17:53:05'),(3,'Juan Esteban','Buritica Garcia','hvc5XjFGdScber64ejxwbQ==:XzZeOIcl9Q5ET2JhL6N6VUJKamNooPdWp0Lfkv0rU+k=','+cV6NlkQLIYYtnS11wJoPw==:Tfp3SXvXvWOssIqmbCHLSA==','imdmM2ca70LCy8DnAP+AUA==:QcO3NjPKeZpQH3AKhhm6h59TMHXM65If/gWA3tKn0cA=','$2b$12$8DWdnFCYQ9x6voMmmT0B3eqJMSg5zjowuAkfTrmqcsKv8mdfPK31q','super_admin',1,'2025-10-04 04:02:46','2025-10-04 04:03:10');
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
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
INSERT INTO `animal` VALUES (16,'5Vbkd7t32oEIL6WbErB3WQ==:9IxvGEm6nVlSDQW7aR+edQ==',5,6,2,11),(22,'U+ANh103lngWuZvldG3+/A==:MHZgVJ4Kg+ZZ/dJucmH4gg==',6,10,4,11),(23,'riK94/PeaVz8yIptuoIEWg==:jM9KnmiFRg1Y6G6qFbE/zA==',7,12,5,11),(27,'krYxUVcJkdFpVGGq3nq99g==:QH6wIvCig7WGH9J+qgeQkw==',6,3,1,11),(32,'FAGwlTeNwwfhOuqH5ENfCw==:QONtDZvh4y8CbSWGcJPHhA==',7,8,3,21),(33,'OFhqYaRNI1Xiv0lOWsCc1A==:ymbUrK889fjo+3lKkfU/Tg==',5,7,2,11),(34,'IId91vx5GqkNSvC0OrpJjA==:ohbdKWa6TWfTIyVPIdfTpQ==',7,7,2,11),(38,'6TNoZhtIWOYkAB1dUEW9yg==:3zVDKLBeFx+d6nGVyuvDuQ==',7,21,10,22),(39,'AIWPTF3vsHmO6VKdUwxacw==:IsK5UA6x+cXmox2TtTOUpw==',9,20,9,22),(44,'uSC5hVCvOrsbwTqHbWNb0g==:A9yaIe13Qvd9hhrtj9JyjA==',5,9,3,11),(46,'t8iSt6Dvjvv7mKSAg3wRCQ==:lAwPeMJyR5NAFXbnDuSLgw==',2,7,2,23),(47,'OcOn/GdA9sEvS0krra70Ag==:OEoAthl2NX2TbpPjgojW4w==',5,9,3,22),(48,'2Jzfbp3qoQKAfI3M6Tb2Yw==:gJE7SJsJ+fE168PixKAOgw==',7,19,8,23),(49,'gHinqjmUbMyhh056ucFuXQ==:evzzX4cSYOjAM4LRWpsvMQ==',8,8,3,23),(53,'YqtEDgHC7AxTeOPbqsogdA==:JnZdxBTRQ4C6BnCt2XXTyg==',8,10,4,22),(54,'3/YULsFfepoffa2LUcTaYQ==:Yrz/aEHJsYJccq+DdvdqSw==',5,4,1,23),(55,'eejKPIk+cAp4j7brppz3cA==:LmYE1lgAFlKFLYy1xURD9w==',4,20,9,24),(56,'jG0fE7DvPmtWp+NYfmLtiw==:oLYhzm9/0bF4ZjEGmCPr1Q==',7,19,8,25),(57,'gRW2Y9ziEA5EbjpzEIKV+g==:rou+kfDiNEfsn2jb5ZTFJg==',9,1,1,25),(58,'NYgDauWcVIB0BwzxO71+sg==:Nx04Wk72Gd0zmNCn+kwM2w==',7,2,1,25),(60,'9gjVkcJRtFOl3G0S0OlmhQ==:BBPydyR1Ia2nX3t23eJCrg==',7,1,1,22),(61,'opG2mOhRnrxfF6doWOnDsw==:5WyNkCaU8KuG299uwv7TEg==',5,5,2,22),(63,'Q4SftKOEZVHi91zdQXYznQ==:eYJN2ThFGtgrUq+OTWo0cA==',7,1,1,28);
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
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muestra`
--

LOCK TABLES `muestra` WRITE;
/*!40000 ALTER TABLE `muestra` DISABLE KEYS */;
INSERT INTO `muestra` VALUES (19,1,'2025-09-24',NULL,16,1),(27,1,'4564-12-31',NULL,22,1),(28,1,'2025-09-22',NULL,23,1),(32,1,'2025-09-23',NULL,27,1),(37,1,'2025-10-03',NULL,32,1),(38,1,'2025-10-03',NULL,33,1),(40,1,'2025-10-03',NULL,34,1),(41,1,'2025-10-15',NULL,38,1),(42,1,'2025-10-14',NULL,39,1),(46,1,'2025-10-16',NULL,44,1),(49,1,'2025-10-07',NULL,46,4),(50,1,'2025-10-31',NULL,47,5),(51,1,'2025-10-16',NULL,48,3),(52,1,'2025-10-16',NULL,46,1),(53,1,'2025-10-01',NULL,48,3),(54,1,'2025-10-07',NULL,49,4),(55,1,'2025-10-03',NULL,49,2),(60,1,'2025-10-07','16:30:00',53,2),(61,1,'2025-10-06','16:58:00',54,3),(62,1,'2025-10-06','08:20:00',55,4),(63,1,'2025-10-07','16:25:00',56,6),(64,1,'2025-10-25','16:07:00',57,6),(65,1,'2025-10-07','17:50:00',58,3),(66,1,'2025-10-07','16:33:00',57,2),(68,1,'2025-10-08','12:53:00',38,4),(69,1,'2025-10-08','13:01:00',38,4),(70,1,'2025-10-08','13:37:00',38,1),(71,1,'2025-10-08','13:14:00',38,4),(72,1,'2025-10-08','14:03:00',60,4),(73,1,'2025-10-08','14:04:00',60,7),(74,1,'2025-10-08','15:47:00',47,4),(75,1,'2025-10-08','15:48:00',61,6),(76,1,'2025-10-08','08:02:00',38,6),(77,1,'2025-10-09','15:23:00',38,3),(79,1,'2025-10-10','13:25:00',38,4),(80,1,'2025-10-15','12:57:00',63,3);
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (26,22,'Análisis en proceso','Tu análisis de TIEMPO DE PROTROMBINA PT para Puerquito ha comenzado a procesarse.','info',1,'2025-10-14 19:03:27',NULL,NULL,41,'propietario'),(27,22,'Análisis finalizado','Tu análisis de TIEMPO DE PROTROMBINA PT para Puerquito ya tiene resultados disponibles.','success',1,'2025-10-14 19:04:28',NULL,NULL,41,'propietario');
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
INSERT INTO `propietario` VALUES (11,'Nilson','Bernal','GHgEXQvDmYWSmei1lj8jEQ==:qHlEunTy5jO396fSRvytC9gQo6MLskq98+qrzUzhXEM=','fJmFVhmzGHfsvuOYA9CLlg==:SsjT6toNshDyo57i1QB8Sg==','XIBRXQB4wmR9Cd1GkZZrvA==:Ag2mgAgVXCT7oh5+2gAcxmKzd18ufPrl29PIUKVwLc4=','$2b$12$37oYLKLViO4IAT/cOikZkO.yR8xh4ecsSERomdeVlbrXFE6UygzBi'),(21,'Prueba 1','Prueba 1','vu/rFbm4MfX4vT1NQCwA0Q==:t0IKpMyoZ4YoYknJAbua9A==','OAQxKl1r4L4fe9zxODZRgw==:M7tiFgfSHEvZrrC1xVKeYg==','mr3Kb6h5x6pkw3hGWXxaRg==:85/D6xk7xWvE3XWPH6gCxjkC3iOgf+TRBICHb/siKvg=','$2b$12$w5051DV4XJY8yvCtQSAO..no8nfcJ5vqJinMrtX5NvCBCnZzD/ZNu'),(22,'Andrew','Loaiza Guzmán','W5ftlX462khzuthd0EZJsA==:Tu/Q3Pm0cv93Wb/9fccFg/T6w0JYeJc7mm9LdGnhsEb6n7Kbc07RPxWndjiByNtE','o4Q64zvQEOuBWAIPX+mV2g==:1+tmMbG4vOKhDUu+ucm54Q==','2/j/fHDFmBR+T9z3881q/Q==:Vam+ycPm58yh4TwWDiyfBM1zwoE40eJL6WPZdVrrLxM=','$2b$12$SSemUAdIycIsDER9FF1Pz.pN32qNCskUiduUOvrNwaJIAteNR5jcm'),(23,'Juan Fernanado','Guzmán','9Xwx14hXZ2IgjtUgAdSWbg==:/F/UfgL4GAYtxeVgCz7wag==','2+V6h6sq6EA/dO4SynUUvw==:xAZeq1rsUMfwc5ibp2VsTw==','6e9EJ8EUD+vsoeZpmrd33g==:X0+t0S86GvfSzTgwN8AequD3K3tai7jRafiUL9RpcGk=','$2b$12$PNeZWHwAQo55derBwreYxOXpseZl3u1MpuoZFo.AXbsXfFQLC8nHq'),(24,'Juan','Gonzales','iaAt131wUNaKGsRoRoBNoA==:mPY3z8q81yCsEWbKd1srubmhta+az3ySkpj1fZS1RWGC5ymt1l6l/IKJKzRetUiY','qeWgzrgJooHRxQUltIeB2A==:X9WByRflxQyQHfR/ZiL+jw==','Soh/a4SGWNtNRQeJ34aZ4w==:yPDp7Pv3oR+/uBvEXCrlJRiZlhs1JIorla/nrwOPYGE=','$2b$12$9TuKRPME6GtzDbQ3ZxLx2u0K/bhsouA6PGWanNwAelgsKavkDoFHi'),(25,'Cristian Andres','Avalo Valencia','9xh7tADCqjpYk/cJTZNipg==:iLEuYA+MBjmxVnBK1L9JKuUtGSS3nw2jk+3EaQGPnzs=','1XoGWEmfIDc8151zasgUdQ==:ffmlLzdBwI3gcJ6a3meDhg==','7evnyfgfYA1ViWtVvHrTVw==:BdnC4lm6GM7Pt+e9Ru6d4mtAN9+62AeMvP7sgKsFRIA=','$2b$12$XeBymMCX1mVddpnkr2DchODuYBdceqrxVDllsU7C5OJ0Y.cIfOr6C'),(26,'Juan Esteban','Buritica Garcia','9Gdvtq2eK2WaqZxgMareBA==:6EKk4yQJH9QWXUh7sokhqFvyldbX2zru8i8qyCW3VrCubI3pwOkD6I305WeOsnmw','5kKXBEYFlwbM7tSbJwLcYg==:fCLJOcaAdzSgro2OKbr9cg==','+0w2Dwl/+25hARO6Nf5kbg==:UnbeVbJu5kzL3bDTORYSFqha/5cZWzlqhuHrd7wYuiI=','$2b$12$.dQn2DwL8lsH0osDTEMdb.xWuAEh83FU0hDAlvE./UTBAyN17trMu'),(27,'Andres Camilo','Lopez','fz67fM6GWIzP9jlmF/G6Lw==:uRIpeC3bq8GKCN+YPf3nzIAN3865EwA+ZflXRN+TY4I=','qAPc4F8DX3LPG4p7i7EfYw==:iHy4AGGmoX/bxm1zO60Mew==','EgY2tKviCro3zUHBwxmIYw==:b4vO2IPVbh5Z+0BYUaRb8SSvLU5M7NyTnKxHoUT2K8A=','$2b$12$n9wMo7NRbOxoHjByhDz6rOBGsNpK9mBqap7mB74.sgGL.44sIE0pu'),(28,'Luciana','Lopez','mW33QqtnjjDJ89OrqKiq2w==:ufCD5QibCFYGgzrzlcIgvUWw5QKzL1XVxFcqk5g+QL2dCOVDOrXTk3UQ9OcZXhiN','NpiyQ3U5fvMCEPIxevHLYg==:QijrGoQUHgtwMHRjJup5fA==','NfgbW6vftPXBNDJBOnuBXA==:YO9yKE1eDdvvog/I7KBrBXnj/aKyyB05mkIZravsu8E=','$2b$12$o1V/94woDQYCmDiHu06kPu9I0u9IQEq6oVzhNiD9jIHWFMc0m8K76');
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
INSERT INTO `raza` VALUES (1,'Criollo Canino',1),(2,'Labrador',1),(3,'Pastor Alemán',1),(4,'Pit Bull',1),(5,'Criollo Felino',2),(6,'Persa',2),(7,'Siamés',2),(8,'Mini Pig',3),(9,'Duroc',3),(10,'Árabe',4),(11,'Percherón',4),(12,'Brahman',5),(13,'Holstein',5),(14,'Hámster',6),(15,'Conejillo de Indias',6),(16,'Loro',7),(17,'Canario',7),(18,'Iguana',8),(19,'Tortuga',8),(20,'Merino',9),(21,'Saanen',10);
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
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado`
--

LOCK TABLES `resultado` WRITE;
/*!40000 ALTER TABLE `resultado` DISABLE KEYS */;
INSERT INTO `resultado` VALUES (18,14,19,'Pendiente',NULL,'2025-09-24',NULL,16,1),(26,1,27,'Pendiente','Muy buen estado de salud el del peoorrito','2025-10-30',NULL,22,3),(27,15,28,'Pendiente',NULL,'2025-09-22',NULL,23,1),(31,20,32,'Pendiente',NULL,'2025-09-23',NULL,27,1),(36,13,37,'Pendiente',NULL,'2025-10-03',NULL,32,1),(37,14,38,'Pendiente',NULL,'2025-10-03',NULL,33,1),(39,3,40,'Positivo','Madre mia willy','2025-10-03',NULL,34,3),(41,2,42,'Positivo','','2025-10-14','19:04:28',39,3),(45,11,46,'Pendiente',NULL,'2025-10-16',NULL,44,1),(48,10,49,'sadfsafdsa','chiolllll','2025-10-03',NULL,46,4),(49,14,50,'Vegetta777 Es el mejor youtuber','Las capacidades con las que cuenta Juanito reflejan una gran alimentación y buen juicio','2025-10-10',NULL,47,3),(50,4,51,'Hemoglobina 12/gl','tiene un buen estado de slaud','2025-10-16','18:38:53',48,3),(51,1,52,'','El análisis de Juliana ha comenzado a procesarce','2025-10-16',NULL,46,2),(52,5,53,'No Reactivo','','2025-10-01','18:39:37',48,3),(54,3,55,'Positivo','','2025-10-16',NULL,49,3),(59,3,60,'Negativo','kjhkjlhjkh','2025-10-09','16:43:26',53,3),(60,5,61,'','ff','2025-10-06','08:29:00',54,2),(61,13,62,'Pendiente','El pobre análisis le salio negativo, pero el perrito esta se ve feliz','2025-10-06','22:32:32',55,2),(62,16,63,'Pendiente','','2025-10-07','13:45:29',56,3),(63,15,64,'si','','2025-10-25','15:44:32',57,3),(64,5,65,'Positivo','','2025-10-07','15:50:08',58,3),(65,3,66,'Pendiente','','2025-10-07','15:07:11',57,3),(67,13,68,'No Reactivo','El examen ha sido correcto/exitoso','2025-10-08','22:28:28',38,3),(68,8,69,'Pendiente',NULL,'2025-10-08',NULL,38,4),(69,1,70,'Pendiente',NULL,'2025-10-08',NULL,38,4),(70,9,71,'Pendiente',NULL,'2025-10-08',NULL,38,4),(72,19,73,'No Reactivo','Muy buena salud','2025-10-08','16:29:47',60,3),(74,15,75,'Muy sano el animalito - Positivo','Muy sano el animalito','2025-10-08','15:51:36',61,3),(75,15,76,'Pendiente','','2025-10-08','23:01:02',38,2),(76,7,77,'Pendiente',NULL,'2025-10-09',NULL,38,1),(78,8,79,'Pendiente',NULL,'2025-10-10',NULL,38,1),(79,7,80,'Positivo','','2025-10-15','12:58:28',63,3);
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

-- Dump completed on 2025-10-14 19:13:00
