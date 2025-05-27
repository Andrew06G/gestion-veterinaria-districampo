CREATE DATABASE  IF NOT EXISTS `veterilab2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `veterilab2`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: veterilab2
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `animal`
--

DROP TABLE IF EXISTS `animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal` (
  `id_animal` int NOT NULL AUTO_INCREMENT,
  `nombre_animal` varchar(50) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
INSERT INTO `animal` VALUES (3,'Fido',2,1,1,987654321),(4,'Whiskers',3,2,2,1234567890);
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
INSERT INTO `especie` VALUES (1,'Canino'),(2,'Felino'),(3,'Porcino'),(4,'Equino'),(5,'Bovino');
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
INSERT INTO `factura` VALUES (1,'Andrew','Loaiza',987654321,'2022-01-01','HEMOGRAMA',100.00),(2,'Ledesma','Dominicano',1234567890,'2022-01-02','TIEMPO DE PROTROMBINA PT',200.00);
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
  `id_animal` int NOT NULL,
  `id_tipo_muestra` int NOT NULL,
  PRIMARY KEY (`id_muestra`),
  KEY `id_estado` (`id_estado`),
  KEY `id_animal` (`id_animal`),
  KEY `id_tipo_muestra` (`id_tipo_muestra`),
  CONSTRAINT `muestra_ibfk_1` FOREIGN KEY (`id_estado`) REFERENCES `tipo_estado` (`id_tipo_estado`),
  CONSTRAINT `muestra_ibfk_2` FOREIGN KEY (`id_animal`) REFERENCES `animal` (`id_animal`),
  CONSTRAINT `muestra_ibfk_3` FOREIGN KEY (`id_tipo_muestra`) REFERENCES `tipo_muestra` (`id_tipo_muestra`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muestra`
--

LOCK TABLES `muestra` WRITE;
/*!40000 ALTER TABLE `muestra` DISABLE KEYS */;
INSERT INTO `muestra` VALUES (1,1,'2022-01-01',3,1),(2,2,'2022-01-02',4,2);
/*!40000 ALTER TABLE `muestra` ENABLE KEYS */;
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
  `direccion` varchar(100) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `correo_electronico` varchar(50) NOT NULL,
  `contraseña` varchar(50) NOT NULL,
  PRIMARY KEY (`id_propietario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propietario`
--

LOCK TABLES `propietario` WRITE;
/*!40000 ALTER TABLE `propietario` DISABLE KEYS */;
INSERT INTO `propietario` VALUES (3,'Andrew','Loaiza','Parque Industrial','3003003000','Correo1@ejemplo.com','andrew'),(4,'LEANDRO','LEDESMA','BASE DATOS1','3013013011','Correo2@ejemplo.com','leandro'),(987654321,'Luis','Ledesma','CALLE 123','3105105100','luis.ledesma@ejemplo.com','luis'),(1234567890,'Alberto','Ledesma','CARRERA 321','3115115111','alberto.ledesma@ucp.edu.co','alberto');
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
INSERT INTO `propietario_animal` VALUES (987654321,1,3),(1234567890,2,4);
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
INSERT INTO `raza` VALUES (1,'Criollo Canino',1),(2,'Pit Bull',1),(3,'Labrador',1),(4,'Doberman',1),(5,'Criollo Felino',2),(6,'Persa',2),(7,'Siamés',2),(8,'Angora',2),(9,'Criollo Porcino',3),(10,'minipig',3),(11,'Criollo Equino',4),(12,'Percheron',4),(13,'Arabe',4),(14,'Criollo Bovino',5),(15,'Blanco Orejinegro',5),(16,'Brahman',5),(17,'Holstein',5);
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
  `fecha_emision` date NOT NULL,
  `id_animal` int NOT NULL,
  PRIMARY KEY (`id_resultado`),
  KEY `id_tipo_analisis` (`id_tipo_analisis`),
  KEY `id_muestra` (`id_muestra`),
  KEY `id_animal` (`id_animal`),
  CONSTRAINT `resultado_ibfk_1` FOREIGN KEY (`id_tipo_analisis`) REFERENCES `tipo_analisis` (`id_tipo_analisis`),
  CONSTRAINT `resultado_ibfk_2` FOREIGN KEY (`id_muestra`) REFERENCES `muestra` (`id_muestra`),
  CONSTRAINT `resultado_ibfk_3` FOREIGN KEY (`id_animal`) REFERENCES `animal` (`id_animal`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado`
--

LOCK TABLES `resultado` WRITE;
/*!40000 ALTER TABLE `resultado` DISABLE KEYS */;
INSERT INTO `resultado` VALUES (1,1,1,'Resultado1','2022-01-01',3),(2,2,2,'Resultado2','2022-01-02',4);
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
INSERT INTO `tipo_estado` VALUES (1,'Procesado'),(2,'Tomado'),(3,'Pendiente');
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

-- Dump completed on 2025-05-27  3:12:14
