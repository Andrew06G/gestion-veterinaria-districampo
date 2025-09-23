-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
INSERT INTO `animal` VALUES (1,'zdin4ORNoHVxIEauBsrn5g==:BU/I8D97nB8cDwEgcGDkJg==',5,2,1,1),(2,'j+LClOrkjIuJjdtk1andXA==:VIEjsTPQ129PliD81lGjVw==',2,6,2,2),(3,'EfgGQK1oBrNkJf+JEnLBNQ==:oQuNoLLOQG6plyvIIQh43w==',3,8,3,3),(4,'5my5CStCOeig8WCymZ5exA==:p/3h8CMYZEz//9PILHhpKA==',8,10,4,4),(5,'/BnzHI1ebGqjIxJc6ES6ww==:xCeLPhWT3KotDVuJtC1y5Q==',4,12,5,5),(6,'1DEH8YPamyuN/jtsIxUGmg==:Rz3wSLBzTkuFRN9tBO4srg==',1,14,6,6),(7,'cth4LH2TowSvXb9w1BUUSg==:G7kxg5xcgzBGtph/WjEbDw==',3,16,7,7),(8,'aG4NqnecpgBsJLFOzLkJjQ==:sYYyZLxEHjHcKLpMXGT8ew==',6,18,8,8),(9,'wxGk2AP9nEdP0EoKnvM56g==:OQOZ0ABkcUw+nt2UQe3peA==',7,20,9,9),(10,'zvOTrvCZ//1sXw9yaCaLUw==:Cerkm1a5GGXW/twyFVI2mg==',2,21,10,10),(11,'Zu+m7Ecftwi2bH7j5I1wtA==:MCL8whdAbxI0VAM2bJRzaw==',2,2,1,1),(12,'INK1VltNDo/EUMWzWQ3MDA==:fz8K9lrDvOJPvxStrcqW1w==',3,3,1,1),(13,'Iwrf0XXuGaqkOGPyZheOSQ==:1NG/uETOGtpd35w0y9rUSQ==',6,10,4,1),(14,'LOb8JOUo7sXwlCvrzx1KyA==:MCL8whdAbxI0VAM2bJRzaw==',5,12,5,1),(15,'PJqBPTTC7/3f9EdqybagBQ==:MCL8whdAbxI0VAM2bJRzaw==',6,3,1,11),(16,'5Vbkd7t32oEIL6WbErB3WQ==:9IxvGEm6nVlSDQW7aR+edQ==',5,6,2,11),(17,'ek7WNpi97c2kL8Y1uhG1pQ==:oLwZxaqNDSV1BgaovS/ymQ==',5,11,4,13),(18,'7IrgGBGXR5QHZ6/hSJSMDg==:fyVyLSeBQ8G+D5RldkXRzw==',1,12,5,13),(20,'yhKmMjf+K2AUiln0OxXjkw==:HAdmZZh6bigaO+aJgtQdAg==',7,20,9,1),(21,'h97e5DU3DDCMWTXs2F/VdQ==:CcaOUXXfbKAU4J+8mug4Og==',5,5,2,1),(22,'U+ANh103lngWuZvldG3+/A==:MHZgVJ4Kg+ZZ/dJucmH4gg==',6,10,4,11),(23,'riK94/PeaVz8yIptuoIEWg==:jM9KnmiFRg1Y6G6qFbE/zA==',7,12,5,11),(27,'krYxUVcJkdFpVGGq3nq99g==:QH6wIvCig7WGH9J+qgeQkw==',6,3,1,11);
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
INSERT INTO `factura` VALUES (1,'Andrea','López',1,'2025-08-16','Hemograma Completo',50000.00),(2,'Carlos','Gómez',2,'2025-08-17','Uroanálisis',35000.00),(3,'María','Rodríguez',3,'2025-08-16','Análisis de parásitos',30000.00),(4,'Juan','Pérez',4,'2025-08-17','Biopsia',150000.00),(5,'Ana','Martínez',5,'2025-08-17','Análisis bioquímico',80000.00),(6,'Diego','Hernández',6,'2025-08-16','Cultivo bacteriano',60000.00),(7,'Sofía','Ramírez',7,'2025-08-17','Frotis de sangre',45000.00),(8,'Laura','Castro',8,'2025-08-17','Análisis hormonal',90000.00),(9,'Felipe','Muñoz',9,'2025-08-16','Detección de virus',120000.00),(10,'Valeria','Osorio',10,'2025-08-17','Análisis de histopatología',200000.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muestra`
--

LOCK TABLES `muestra` WRITE;
/*!40000 ALTER TABLE `muestra` DISABLE KEYS */;
INSERT INTO `muestra` VALUES (1,1,'2025-08-15',1,1),(2,2,'2025-08-16',2,2),(3,3,'2025-08-15',3,3),(4,1,'2025-08-16',4,1),(5,2,'2025-08-16',5,4),(6,3,'2025-08-15',6,1),(7,1,'2025-08-16',7,3),(8,2,'2025-08-16',8,2),(9,3,'2025-08-15',9,4),(10,1,'2025-08-16',10,1),(11,3,'2025-08-28',12,7),(12,3,'2025-08-22',12,1),(13,3,'2025-08-27',12,7),(14,1,'2025-08-22',13,1),(15,1,'2025-08-22',13,1),(16,1,'2025-08-22',13,1),(17,1,'2025-09-18',13,1),(18,1,'2025-09-09',15,1),(19,1,'2025-09-24',16,1),(20,1,'2025-09-23',17,1),(22,1,'2025-09-17',15,1),(23,1,'2025-09-19',20,1),(24,1,'2025-09-24',20,1),(25,1,'2025-09-24',21,1),(26,1,'2025-09-23',15,1),(27,1,'4564-12-31',22,1),(28,1,'2025-09-22',23,1),(32,1,'2025-09-23',27,1);
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
INSERT INTO `propietario` VALUES (1,'Andrea','López','RZ/aXXk//eVWoGudsfVnEQ==:v0+ldwqOAMKsu641dAYe1Fo0cmisC/R+16lIBLQhoE8=','PuAbstsfcfQN+JgCEq0VtQ==:Rb59dkssbpNfEDS/T5dQ7w==','BwYK0K3dg2SNyURCeBHZfA==:GxnEKzd33B68WblCu+Ql3zaLCNSHqG8Y8XllW4MuaT0=','$2b$12$LBBcuYR9KH2ROAvMldSKG.zjg6sXt.dsNutUneWOJFh7rTJoIf0dO'),(2,'Carlos','Gómez','uV2bTxecQrKi557fl5SObQ==:voy/DM5s6jkVukdWW+2izO4ncRumBG6FNqubiqHg4Nw=','4YVN8U5//69Ol3pm4bzo9A==:BKYXpSUI4f3p+Bo7fO+1wg==','s/ygRqCuJMVL1fDElIXtAg==:GCoMYlPzcdwmOtHhO0y1M9ZIBgwJ1reqSW83pFLNzMA=','$2b$12$WrCpxnRT3hriofh.cSKTK.W2jhh.pG2AS2AChE7f03RRnCigy.JHS'),(3,'María','Rodríguez','KSI4xid9k7rwvo1bYliBLg==:JVoaz/OZnukvQDNFItbXZkQ9dwP3qN7kvUgOS1kfWV8Zjx5Rz6SwR02M68tc655i','I2xLrMi73ccIwPawFAHMXg==:KVH0//fKacsxpf3VIPLY/A==','w/QLoYpl18ecD1ww76UsCQ==:49eoXYxrZjHqA2DK4Okg0/ZDxVw4iVac6dQToiiZOkU=','$2b$12$85WXiMnqcgnDTCAJWRzI3uDi4yZkfD20ZOrvabInVYXX8B5tcaR7G'),(4,'Juan','Pérez','NNEvvve71Tuv13fn7OQVcA==:GZlrnJTgzQg7deRsw6LRrJy1yUcif+AEhIvmbrRg5bU=','D3OJJ2elcXUfbYAR7BWmKQ==:qP/KT+VOIsFWqdg1cGJmtw==','JCnbNtlN+z87fXrx4cZaIQ==:mSLu/Kr3tDR+aLynERYZsIhuDTHR+wMAVVppp7Onh40=','$2b$12$FrCNnTulUZ4R8tZaBujzAeKaZcPya60RG99UibL/jYK8tSU2GUn2y'),(5,'Ana','Martínez','6A815EQfMhHcwOa3f3prIg==:/i6qSUEkKwgi+FkcKn33GZ6qy3XSGxlHfORLtXyw8FQ=','A+6rp8aMJAHDHxNA2sI05A==:I7kBusSXM7GnFvgzZV/QBA==','BLYt/tytL50QKCNLOLVFPQ==:F2C6ajcNNiV7s2R8fDGeQ8NShXwt2+6SPJrtlJnVh+E=','$2b$12$AkFR3bhb2OIs0QtPPLuI6uyJNQbwPYKWyE4TyQtZaSvNMJg4T0ZNC'),(6,'Diego','Hernández','CCqyGMLIzEpSItVALTP8Kg==:y+7YD6iH07S4IeHqtI9VoCSGUvTpcW8sz6mgmFHkxRI=','8nqmjEbOhCbke3H9hV7LfA==:gMEHn/POO/1R+HeMTHcZNw==','EPlPdU3fJMhWhwAk7aQWwA==:QT4SXHZIQ6h4ryzRYjUrx5Ikl9rSt9qdlT7T61a4LOo=','$2b$12$x34dGjlGZNJfEKM5vPFiZeSX89zSAYYnIeP6fYORLZwwfdFYR3pAW'),(7,'Sofía','Ramírez','gJhgauGoVGAhMxU5qEFUhw==:hahMTfYrEK87EyODrqj8f/ejLJk4l8DF42qQqxX6Deo=','FRWqdnbcMk/y1kft0pL+BQ==:ONXhaeTyN7bPlYIkeWynIQ==','lKLcwhTvIRuAaZE5Bt9nXg==:XXNt/7bBuTm19ML2XKiGYyEYduQ2nWlP9iGU337683c=','$2b$12$Vl09lze5kd3mw3CyD2S/e.CsQZYgu9GP0IFL1MLkGSBMA.J0Wlhd2'),(8,'Laura','Castro','dvNNP67TzTL5ZMsbUXz+cQ==:+uxWW67eUxIP1cOq+JtuWub0ny+pWc0T/GvYfLhYD6Ln72jIub9A8QMzBEDG6DpK','039wBdEdFcA71asIrgAFfQ==:Zi/r9Y4SUoelXqh6L6rt/w==','NhT0HQRMPPsEckco2NMAYw==:Cn130SG00QQp5dYoCgQ6SqaBhwGkUv1EqeE791klQ+I=','$2b$12$6axbaEIe1SZkfJAxhi6T2uoR/8czYlqBkEBudmBJ1I3Axy8AJ/NBO'),(9,'Felipe','Muñoz','rL/uEP87a8N/jqsdIuJ9Nw==:Ai4M/tq+wUHF+NX3zWG1HtG+vzbtE8is+X948WtAzro=','GqAjqyBAbIWNyuGD6SyTrw==:+l/+oRDG5K9+QlKfMxo7rw==','XuFJkZpc2ZMStfrOFkyQqQ==:aoy5fLcBSm+iBNzEbad0MzgJY412RlCCxpjbTuOVw/4=','$2b$12$iNskKrE3GxLu6aeRj9OKfeVz8dFrecBvzBnnE4kwg6nTbgzvIpphm'),(10,'Valeria','Osorio','ot81/Qa/hP22fqjdMQfP9g==:9R+MFu9SgkCup1Ynyd8GZVvRBa5KwxBFPROyslY9FX8=','coZgLgApw/38MBCUzsWpCw==:O/rcFbFFEStNE4C91MlelQ==','m+ok6LlqMTn5cHGJLJGVzA==:taj80KvxHV65ZYT9XmFGXIX/GVh9RFhFOV0IOpj8rXs=','$2b$12$z1vM6i/Mw0hL2h0Rr1LKxelbLoNp4A/jpMz6dCyaJ/V4542atxCDu'),(11,'Nilson','Bernal','c9valMHsKlD5bExXyBiWhQ==:3S/Ymv/kdoqHKnb880FnvpoN2RL2S/rJpPlXWs814AU=','mwjvV+IAkTOJ5Ux45MJ4DA==:xgE5cdu0in7s9/sfHSW4SA==','kV/iK91DCEgluoBU0RvleA==:yXNvxLKYOi9/nVLU+uUJBOkXuL81wGVcmXM6d5ASnhA=','$2b$12$37oYLKLViO4IAT/cOikZkO.yR8xh4ecsSERomdeVlbrXFE6UygzBi'),(12,'Cristian Andres','Avalo Valencia','Gi1Fev7SWQZNfTitfrPnOA==:2QI+WMsG8n3HzRXfHrR0A8sCTu3HlL7UjIYocjbG2oU=','4xrUDrbxvWv4K+pg1uz8WA==:J9Qb0UoZyWPvJJN96s0CLA==','ftBACFuDL6KYQep6NHSoVA==:5CywPFsXQRZsc+5sQ/WLElrKkcivqSXOyvZGnRMuHso=','$2b$12$rvLQcgo4xzBHs2Z/bpiQ3.uhaynwlCljK6RmPlobQ.mjQ1mK5PvKi'),(13,'Andrew','Loaiza Guzmán','FLmeziIIWCUm+5Hkc1WLVw==:N/MR/fjwVUn6KYr6cgzXtajBOvx+wEMs9OGtRUgDxg8=','aen75WOBweEF9S3pRIpHpg==:PQZCtf0b2W/SJ5WVx7m+5A==','fMTN+Qd9HMr3qblI+cpNQg==:ycLbhGpylVGOCmqUpD1pcPWw5R1MjNdJnY+09Yhtn9U=','$2b$12$plqP/FX3RiCMZopGErboIeSpgpBW5rDPRvQ.V5436lwwN.cToun56'),(14,'Andres Camilo','López López','uHItZCfTnFxlaca8ywkvwg==:rZhO3BP8WEZAgv1AqzgMJtW7+YI0l34twFDoPxuOTJs=','pXjRDX524HnFfLZlPq4o8g==:J9Qb0UoZyWPvJJN96s0CLA==','5UXzW6AHp3E8sfapvezoxQ==:frMkKd9AzkTkqC37Nm3wUMlBrggTAk+ZMDKs8cSuSEc=','$2b$12$hbOPuoA9w1/DNow/0ro93esvNYaEuMndl5AhOLhcqoLYl1G2Jh4Vi'),(15,'usuario','prueba','RqpEoeArKd310hTCEBUL0A==:O04mat3KKvxss6zA/NvTnCbEVfah/l1mPD79PLJ13IA=','VNUw83qMOPkAx8UkY8wNDw==:/0nIoYJahuVRqGNPJ83hoA==','IHRuev9lip0bI96pECxO8w==:R82YFV4+fboCHzHHzCu7q12Kkr+KEMF+liQUJ4wBOoU=','$2b$12$JUqqtpUPOc5Kdhg6T5Zjx.njzxiciiKMMWXj.jZq0hfvj5J2y0OCO'),(16,'Juan Jose','López','bPB432NEcGVf9hMCRw8CFA==:6fQscDM5Usu1Eud9/HFWw2XxPVDrwYSD4/2aJ/dedmY=','USxMkrG817diPrwlrduVqA==:f/q0CkL7w4TZuBgkujwNrA==','Gx+SBPnzgvJ7kSq159QX9g==:pez15j7YHhaj4N0ex43KOYfqH4XCf9yMwQzp32qVPac=','$2b$12$WU3AZYwzOzhwO/wCQMb8UOimp4.ItAwe13bMVnlfJvWSFr0evw1ZK'),(17,'Jose','Jose','PF75sICvIo0C6VpUHW26Cw==:2Vjq8vYAtTRgFLfeoLJxZ89JFVl38nlLF6Mj3DUik/w=','emaO1foiKQGMszKjZCMj1w==:v/ggyuNTY0sslgfRpIt8IQ==','CrxOBVKtTHpv2NHF8+NXTw==:qz3tYhGmyqA+9SN9W6AYsg==','$2b$12$VwdrANPMO8foGEEz7Z3xVOZgP3cXami4khOx9ZIE60l63z94CpWqO');
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
INSERT INTO `propietario_animal` VALUES (1,1,1),(2,2,2),(3,3,3),(4,4,4),(5,5,5),(6,6,6),(7,7,7),(8,8,8),(9,9,9),(10,10,10);
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
  `fecha_emision` date NOT NULL,
  `id_animal` int NOT NULL,
  PRIMARY KEY (`id_resultado`),
  KEY `id_tipo_analisis` (`id_tipo_analisis`),
  KEY `id_muestra` (`id_muestra`),
  KEY `id_animal` (`id_animal`),
  CONSTRAINT `resultado_ibfk_1` FOREIGN KEY (`id_tipo_analisis`) REFERENCES `tipo_analisis` (`id_tipo_analisis`),
  CONSTRAINT `resultado_ibfk_2` FOREIGN KEY (`id_muestra`) REFERENCES `muestra` (`id_muestra`),
  CONSTRAINT `resultado_ibfk_3` FOREIGN KEY (`id_animal`) REFERENCES `animal` (`id_animal`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado`
--

LOCK TABLES `resultado` WRITE;
/*!40000 ALTER TABLE `resultado` DISABLE KEYS */;
INSERT INTO `resultado` VALUES (1,1,1,'Neutrófilos altos','2025-08-16',1),(2,2,2,'Infección urinaria','2025-08-17',2),(3,3,3,'Parásitos detectados','2025-08-16',3),(4,4,4,'Tumor benigno','2025-08-17',4),(5,5,5,'Glucosa alta','2025-08-17',5),(6,6,6,'Bacterias presentes','2025-08-16',6),(7,7,7,'Frotis normal','2025-08-17',7),(8,8,8,'Hormonas desbalanceadas','2025-08-17',8),(9,9,9,'Resultado positivo','2025-08-16',9),(10,10,10,'Tejido sano','2025-08-17',10),(11,12,11,'Pendiente','2025-08-28',12),(12,1,12,'Pendiente','2025-08-22',12),(13,12,13,'Pendiente','2025-08-27',12),(14,1,15,'Pendiente','2025-08-22',13),(15,13,16,'Pendiente','2025-08-22',13),(16,10,17,'Pendiente','2025-09-18',13),(17,12,18,'Pendiente','2025-09-09',15),(18,14,19,'Pendiente','2025-09-24',16),(19,12,20,'Pendiente','2025-09-23',17),(21,12,22,'Pendiente','2025-09-17',15),(22,13,23,'Pendiente','2025-09-19',20),(23,14,24,'Pendiente','2025-09-24',20),(24,12,25,'Pendiente','2025-09-24',21),(25,14,26,'Pendiente','2025-09-23',15),(26,1,27,'Pendiente','4564-12-31',22),(27,15,28,'Pendiente','2025-09-22',23),(31,20,32,'Pendiente','2025-09-23',27);
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

-- Dump completed on 2025-09-23 15:55:19
