-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `BookID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(45) NOT NULL,
  `Author` varchar(45) NOT NULL,
  `Genre` varchar(45) DEFAULT NULL,
  `Pages` int DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Stock` int DEFAULT NULL,
  PRIMARY KEY (`BookID`),
  UNIQUE KEY `BookID_UNIQUE` (`BookID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'brott och straff','Fyodor Dostoevsky','Crime',633,100.00,0),(2,'Världens bästa björn','A. A. Milne','Children\'s',10,56.00,4),(3,'The Hobbit','J.R.R. Tolkien','Fantasy',310,15.00,13),(4,'1984','George Orwell','Dystopian',328,9.99,9),(5,'To Kill a Mockingbird','Harper Lee','Classic',281,7.99,11),(6,'The Catcher in the Rye','J.D. Salinger','Fiction',277,8.49,10),(7,'The Great Gatsby','F. Scott Fitzgerald','Classic',180,10.99,15),(8,'Harry Potter and the Sorcerer Stone','J.K. Rowling','Fantasy',309,14.99,5),(9,'The Lord of the Rings','J.R.R. Tolkien','Fantasy',1178,22.99,1),(10,'Pride and Prejudice','Jane Austen','Romance',432,6.99,12),(11,'The Da Vinci Code','Dan Brown','Thriller',454,11.99,12),(12,'Moby-Dick','Herman Melville','Adventure',635,9.49,0),(13,'Brave New World','Aldous Huxley','Dystopian',311,8.99,6),(14,'The Shining','Stephen King','Horror',447,13.49,6),(15,'Dune','Frank Herbert','Science Fiction',412,15.99,5),(16,'The Hunger Games','Suzanne Collins','Dystopian',374,12.49,0),(17,'Frankenstein','Mary Shelley','Horror',280,7.49,5),(18,'The Martian','Andy Weir','Science Fiction',369,10.99,8),(19,'Sherlock Holmes: A Study in Scarlet','Arthur Conan Doyle','Mystery',108,5.99,21),(20,'Dracula','Bram Stoker','Horror',418,8.99,5),(21,'The Alchemist','Paulo Coelho','Fiction',208,9.49,13),(22,'Crime and Punishment','Fyodor Dostoevsky','Classic',671,11.49,24);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `CartID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  PRIMARY KEY (`CartID`),
  UNIQUE KEY `CartID_UNIQUE` (`CartID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (5,NULL),(6,NULL),(2,1),(4,2),(7,3),(8,4),(3,5);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `Cart_item_id` int NOT NULL AUTO_INCREMENT,
  `CartID` int DEFAULT NULL,
  `BookID` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  PRIMARY KEY (`Cart_item_id`),
  KEY `BookID` (`BookID`),
  KEY `cart_items_ibfk_1` (`CartID`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`CartID`) REFERENCES `cart` (`CartID`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`BookID`) REFERENCES `books` (`BookID`)
) ENGINE=InnoDB AUTO_INCREMENT=620 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (446,3,1,9),(453,3,9,4),(455,3,13,7),(457,3,4,5),(459,3,16,8),(461,3,21,8),(473,3,11,8),(481,3,12,8),(488,3,14,10),(491,3,7,5),(496,3,15,6),(498,3,20,12),(503,8,18,9),(505,8,12,5),(506,3,3,8),(510,8,15,7),(511,3,10,4),(512,2,5,9),(513,2,1,8),(514,7,16,4),(515,8,10,7),(516,7,9,6),(517,7,14,9),(518,2,12,12),(519,7,20,11),(521,8,1,9),(523,7,21,11),(524,8,4,10),(525,3,6,6),(527,2,20,13),(528,7,15,6),(529,8,2,10),(530,3,18,7),(531,7,7,14),(532,3,5,3),(534,2,16,3),(535,7,18,9),(540,8,9,10),(541,2,2,7),(544,8,19,6),(545,8,14,8),(547,2,11,9),(548,2,21,2),(549,2,14,6),(550,7,19,6),(552,7,6,11),(553,2,3,9),(554,8,8,7),(555,2,13,5),(556,7,5,3),(557,2,8,12),(558,7,2,5),(559,3,2,5),(560,3,19,9),(561,8,5,5),(562,2,10,10),(563,7,17,7),(564,7,3,6),(566,7,4,8),(569,7,8,6),(570,7,10,3),(571,3,8,2),(574,8,21,7),(575,2,15,4),(576,2,19,5),(577,7,11,5),(579,2,4,6),(580,2,18,8),(583,7,1,4),(584,8,11,5),(585,4,1,6),(586,2,17,7),(587,3,17,4),(588,4,16,6),(589,8,16,6),(590,8,20,6),(591,4,3,3),(592,7,12,5),(593,4,9,8),(594,4,20,7),(595,4,17,5),(596,4,21,8),(597,2,9,4),(598,4,10,6),(599,8,7,5),(600,4,14,6),(601,4,8,2),(602,4,6,5),(603,2,7,2),(604,4,12,3),(605,2,6,6),(606,4,13,3),(607,4,5,5),(608,8,3,3),(609,8,17,3),(610,4,11,6),(611,4,19,3),(612,4,2,4),(613,4,15,5),(614,8,6,4),(615,4,18,4),(616,8,13,3),(617,7,13,5),(618,4,7,4),(619,4,4,2);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `Order_item_id` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `BookID` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`Order_item_id`),
  KEY `BookID` (`BookID`),
  KEY `order_items_ibfk_1` (`OrderID`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`BookID`) REFERENCES `books` (`BookID`)
) ENGINE=InnoDB AUTO_INCREMENT=286 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (204,124,8,1,14.99),(205,124,5,1,7.99),(206,125,11,1,11.99),(207,125,14,1,13.49),(208,126,13,1,8.99),(209,127,20,1,8.99),(210,128,10,2,6.99),(211,128,18,1,10.99),(212,129,13,1,8.99),(213,130,14,1,13.49),(214,131,15,1,15.99),(215,131,19,1,5.99),(216,131,5,1,7.99),(217,131,14,1,13.49),(218,132,2,1,56.00),(219,133,17,1,7.49),(220,133,11,1,11.99),(221,134,21,1,9.49),(222,134,13,1,8.99),(223,134,16,1,12.49),(224,135,20,1,8.99),(225,136,15,1,15.99),(226,136,14,1,13.49),(227,137,20,1,8.99),(228,137,16,1,12.49),(229,138,12,1,9.49),(230,139,20,1,8.99),(231,139,3,1,15.00),(232,139,12,1,9.49),(233,140,4,1,9.99),(234,140,17,1,7.49),(235,140,19,1,5.99),(236,141,15,1,15.99),(237,142,17,1,7.49),(238,142,2,1,56.00),(239,143,2,1,56.00),(240,144,5,1,7.99),(241,145,5,1,7.99),(242,145,7,1,10.99),(243,145,20,1,8.99),(244,146,18,1,10.99),(245,147,14,1,13.49),(246,148,18,1,10.99),(247,149,11,1,11.99),(248,150,17,1,7.49),(249,150,18,1,10.99),(250,151,20,1,8.99),(251,151,19,1,5.99),(252,152,12,1,9.49),(253,153,17,1,7.49),(254,154,2,1,56.00),(255,154,11,1,11.99),(256,155,14,1,13.49),(257,155,20,1,8.99),(258,155,17,1,7.49),(259,156,4,1,9.99),(260,157,8,1,14.99),(261,158,11,1,11.99),(262,158,7,1,10.99),(263,159,6,1,8.49),(264,159,8,2,14.99),(265,160,6,1,8.49),(266,161,7,1,10.99),(267,161,13,1,8.99),(268,161,4,1,9.99),(269,162,8,1,14.99),(270,162,15,1,15.99),(271,162,5,1,7.99),(272,162,9,1,22.99),(273,163,10,1,6.99),(274,164,14,1,13.49),(275,165,5,1,7.99),(276,165,21,1,9.49),(277,166,19,1,5.99),(278,167,9,1,22.99),(279,167,5,1,7.99),(280,168,14,1,13.49),(281,168,3,1,15.00),(282,169,4,1,9.99),(283,170,13,2,8.99),(284,170,5,1,7.99),(285,171,8,1,14.99);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Order_date` date DEFAULT NULL,
  `Total_cost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (124,4,'2025-03-06',22.98),(125,2,'2025-03-06',25.48),(126,1,'2025-03-06',8.99),(127,4,'2025-03-06',8.99),(128,5,'2025-03-06',24.97),(129,3,'2025-03-06',8.99),(130,4,'2025-03-06',13.49),(131,1,'2025-03-06',43.46),(132,1,'2025-03-06',56.00),(133,2,'2025-03-06',19.48),(134,4,'2025-03-06',30.97),(135,2,'2025-03-06',8.99),(136,2,'2025-03-06',29.48),(137,1,'2025-03-06',21.48),(138,4,'2025-03-06',9.49),(139,3,'2025-03-06',33.48),(140,1,'2025-03-06',23.47),(141,1,'2025-03-06',15.99),(142,2,'2025-03-06',63.49),(143,3,'2025-03-06',56.00),(144,2,'2025-03-06',7.99),(145,4,'2025-03-06',27.97),(146,3,'2025-03-06',10.99),(147,2,'2025-03-06',13.49),(148,4,'2025-03-06',10.99),(149,4,'2025-03-06',11.99),(150,1,'2025-03-06',18.48),(151,3,'2025-03-06',14.98),(152,2,'2025-03-06',9.49),(153,4,'2025-03-06',7.49),(154,1,'2025-03-06',67.99),(155,3,'2025-03-06',29.97),(156,2,'2025-03-06',9.99),(157,3,'2025-03-06',14.99),(158,1,'2025-03-06',22.98),(159,1,'2025-03-06',38.47),(160,2,'2025-03-06',8.49),(161,2,'2025-03-06',29.97),(162,2,'2025-03-06',61.96),(163,2,'2025-03-06',6.99),(164,2,'2025-03-06',13.49),(165,2,'2025-03-06',17.48),(166,2,'2025-03-06',5.99),(167,2,'2025-03-06',30.98),(168,2,'2025-03-06',28.49),(169,2,'2025-03-06',9.99),(170,2,'2025-03-06',25.97),(171,2,'2025-03-06',14.99);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `ReviewID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `BookID` int NOT NULL,
  `Rating` int NOT NULL,
  `Comment` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`ReviewID`),
  UNIQUE KEY `ReviewID_UNIQUE` (`ReviewID`),
  KEY `UserID_idx` (`UserID`),
  KEY `BookID_idx` (`BookID`),
  CONSTRAINT `BookID` FOREIGN KEY (`BookID`) REFERENCES `books` (`BookID`),
  CONSTRAINT `UserID` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,5,1,3,'12'),(2,1,2,3,''),(3,1,13,3,''),(4,1,15,3,'');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(45) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  `Password` varchar(45) DEFAULT NULL,
  `Role` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `UserID_UNIQUE` (`UserID`),
  UNIQUE KEY `Username_UNIQUE` (`Username`),
  UNIQUE KEY `Email_UNIQUE` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Maxi','maxi@exaple.com','123','Admin'),(2,'matti','matti@gmail.com','123','Customer'),(3,'steffe','steffe@gmail.com','123','customer'),(4,'Holm','holm@gmail.com','123','Customer'),(5,'gg','gg@gmail.com','123','Customer');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-06 18:47:40
