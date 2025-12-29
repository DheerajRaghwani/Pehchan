-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: penchan
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `childrecord`
--

DROP TABLE IF EXISTS `childrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `childrecord` (
  `SNo` int(11) NOT NULL,
  `District` varchar(100) DEFAULT NULL,
  `HealthBlock` varchar(100) DEFAULT NULL,
  `HealthSubfacility` varchar(100) DEFAULT NULL,
  `Village` varchar(100) DEFAULT NULL,
  `RCHID` bigint(30) NOT NULL,
  `MotherName` varchar(100) DEFAULT NULL,
  `HusbandName` varchar(100) DEFAULT NULL,
  `Mobileof` varchar(45) DEFAULT NULL,
  `MobileNo` varchar(45) DEFAULT NULL,
  `AgeasperRegistration` decimal(10,2) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Delivery` date DEFAULT NULL,
  `MaternalDeath` varchar(10) DEFAULT NULL,
  `DeliveryPlace` varchar(150) DEFAULT NULL,
  `DeliveryPlaceName` varchar(150) DEFAULT NULL,
  `BirthCertificateId` varchar(45) DEFAULT NULL,
  `AadhaarCardNumber` varchar(12) DEFAULT NULL,
  `RationCardNumber` varchar(45) DEFAULT NULL,
  `CasteCertificateNumber` varchar(45) DEFAULT NULL,
  `AyushmanCardNumber` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`RCHID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `childrecord`
--

LOCK TABLES `childrecord` WRITE;
/*!40000 ALTER TABLE `childrecord` DISABLE KEYS */;
INSERT INTO `childrecord` VALUES (1,'Raipur(11)','TILDA(104)','SHC Khaprikala(2477)','Khapri Kalan  (13856)',122002716236,'SAVITRI SAHU','GANESH SAHU','Others','7771095910',35.69,'Dera pARA','2025-11-14','No','Community Health Centre','CHC Tilda',NULL,NULL,NULL,NULL,NULL),(2,'Raipur(11)','DHARSEEVA(102)','SHC Dhaneli(RPR)(2452)','Dhaneli-2 (Dhaneli)  (13705)',122010097247,'Girja Nishad','Tikendra singh Nishad','Wife','8319487770',26.72,'Dhaneli','2025-11-08','No','Medical College Hospital','Medical College Raipur',NULL,NULL,NULL,NULL,NULL),(3,'Raipur(11)','DHARSEEVA(102)','SSK Aamaseoni(2210)','Ama Seoni  (13683)',122010512551,'NEHA SAHU','INDRAKUMAR','Wife','7828656266',27.23,'BHATAPARA, AMASEONI','2025-11-07','No','Medical College Hospital','Medical College Raipur',NULL,NULL,NULL,NULL,NULL),(4,'Raipur(11)','ABHANPUR(101)','SHC Tila(2030)','Tila  (13562)',122011033140,'SANTOSHI SAGARVANSI','Tumeshvar','Husband','8462800615',22.00,'Teela','2025-11-05','No','Other Public Facility','AAM BORI DURG',NULL,NULL,NULL,NULL,NULL),(5,'Raipur(11)','ABHANPUR(101)','SHC Hasda(RAIPUR)(2040)','Tokaro  (13517)',122011614577,'SONIYA YADAV','TILAK YADAV','Husband','6268889054',24.13,'tokro','2025-11-04','No','Primary Health Centre','PHC Manikchauri',NULL,NULL,NULL,NULL,NULL),(6,'Raipur(11)','TILDA(104)','SHC Tarpongi(2479)','Mohada  (13822)',122011642838,'KHILESHWARI DHIWAR','SANT KUMAR DHIWAR','Husband','9522191061',24.34,'BHATTA PARA MOHADA','2025-11-14','No','Community Health Centre','CHC DHARSIWA',NULL,NULL,NULL,NULL,NULL),(7,'Raipur(11)','AARNG(100)','SHC Chorbhatti(5449)','Pirda-I (Pirda)  (13342)',122011852138,'DIGESHWARI PATEL','PUNANAND','Husband','9630826247',21.96,'pirda','2025-11-17','No','Community Health Centre','CHC Kharora',NULL,NULL,NULL,NULL,NULL),(8,'Raipur(11)','TILDA(104)','SHC Khaprikala(2477)','Khapri Kalan  (13856)',122012462487,'RADHA NETAM','AJAY NETAM','Husband','9399706890',24.10,'durga chouk','2025-11-13','No','Medical College Hospital','Medical College Raipur',NULL,NULL,NULL,NULL,NULL),(9,'Raipur(11)','DHARSEEVA(102)','SSK Prayas Hostal Samudayik Bhawan Ward-10(5280)','BAL  GANAGADHAR TILAK  (35177)',122012878544,'BINDRA','YOGESHWAR','Wife','7229921071',30.61,'GUDHIYARI RAIPUR','2025-11-10','No','Other Public Facility','AAIMS',NULL,NULL,NULL,NULL,NULL),(10,'Raipur(11)','DHARSEEVA(102)','SSK Ram Nagar-1 Ward-19(5515)','SANTH RAMDAS WARD  (35186)',122012888567,'Yamni Thakur','Santosh','Husband','9827821148',30.98,'RAMNAGAR','2025-11-06','No','Other Private Hospital','P',NULL,NULL,NULL,NULL,NULL),(11,'Raipur(11)','DHARSEEVA(102)','SSK Ram Nagar-1 Ward-19(5515)','SANTH RAMDAS WARD  (35186)',122012888597,'KHEMIN','VIMAL','Husband','9690208204',24.01,'RAMNAGAR','2025-11-04','No','Other Private Hospital','P',NULL,NULL,NULL,NULL,NULL),(12,'Raipur(11)','DHARSEEVA(102)','SSK Bharat Nagar(5268)','SANTH RAMDAS WARD  (35186)',122012889340,'POOJA RATRE','RAJKUMAR','Wife','9109391374',29.23,'KALING NAGAR','2025-11-03','No','District Hospital','DH RAIPUR',NULL,NULL,NULL,NULL,NULL),(13,'Raipur(11)','ABHANPUR(101)','SHC Chandi(2038)','Nahana Chandi  (13511)',122012890974,'Rupeshawari Banjare','Niranjan Banjare','Husband','7805060282',23.31,'CHANDI','2025-11-01','No','Other Private Hospital','Soni Multi Hospital Abhanpur',NULL,NULL,NULL,NULL,NULL),(14,'Raipur(11)','DHARSEEVA(102)','SHC Guma(2242)','Tendua-1  (13664)',122012891201,'Devki Sahu','Gajendra','Wife','9575796650',21.00,'Tendua','2025-11-01','No','Medical College Hospital','Medical College Raipur',NULL,NULL,NULL,NULL,NULL),(15,'Raipur(11)','DHARSEEVA(102)','SSK Bharat Nagar(5268)','SANTH RAMDAS WARD  (35186)',122012893394,'Anita Nayak','Ajay Nayak','Wife','8817218557',33.57,'Gogaon raipur','2025-11-12','No','District Hospital','DH RAIPUR',NULL,NULL,NULL,NULL,NULL),(16,'Raipur(11)','DHARSEEVA(102)','SSK Rajbandha Maidan(5239)','ABDUL HAMID WARD   (35203)',122012893466,'Saabnoor Khan','Ahad Ahamad','Wife','9340234760',28.12,'Moudhapara','2025-11-08','No','District Hospital','DH RAIPUR',NULL,NULL,NULL,NULL,NULL),(17,'Raipur(11)','DHARSEEVA(102)','SSK Sindhi Nagar(5243)','CIVIL LINES WARD  (35209)',122012893608,'MALA YADAV','GOPAL YADAV','Wife','8770982907',25.37,'nahar para shyam nagar','2025-11-01','No','District Hospital','',NULL,NULL,NULL,NULL,NULL),(18,'Raipur(11)','ABHANPUR(101)','SHC Chandi(2038)','Nahana Chandi  (13511)',122012894861,'Lomeshwari Sonwani','Tukeshwar Kumar Sonwani','Wife','7880064305',24.99,'Chandi','2025-11-04','No','Community Health Centre','CHC ABHANPUR',NULL,NULL,NULL,NULL,NULL),(19,'Raipur(11)','DHARSEEVA(102)','SSK Sunder Nagar(5261)','PANDIT SUNDAR LAL SHARMA  (35233)',122012896568,'CHANCHAL DEWANGAN','HIMANSHU DEWANGAN','Wife','8871934255',26.12,'SUNDER NAGAR','2025-11-12','No','Other Private Hospital','OM HOSPITAL',NULL,NULL,NULL,NULL,NULL),(20,'Raipur(11)','DHARSEEVA(102)','SSK KushalPur Yadav Para(5350)','VAMANRAO  LAKHE  (35231)',122012897545,'Kritika Baghel','Vikram','Wife','9304012006',22.65,'Udiya para','2025-11-06','No','District Hospital','DH RAIPUR',NULL,NULL,NULL,NULL,NULL),(21,'Raipur(11)','DHARSEEVA(102)','SSK Birgaon(5595)','dr. khubchand azad ward (10000015)*',122012898245,'MANISHA KUMHAR','MANISHANKAR KUMHAR','Husband','8889417943',23.20,'shahid nagar','2025-11-02','No','Other Public Facility','PAMGHAGD JANGJIR ',NULL,NULL,NULL,NULL,NULL),(22,'Raipur(11)','DHARSEEVA(102)','SSK Dubey Colony (Ward No. 27)(5632)','DR BHIMRAO ABEDKAR  (35194)',122012898270,'Pinki Chandrakar','Bhuneshwar','Wife','9516850386',24.56,'Ram mandir mowa','2025-11-10','No','Urban Health Centre','UPHC Mova',NULL,NULL,NULL,NULL,NULL),(23,'Raipur(11)','AARNG(100)','SHC New Sankri(5451)','Nagpura  (13413)',122012900391,'Aarti Nishad','Hemant Nishad','Husband','9691486246',20.92,'Nagpura','2025-11-09','No','Other Public Facility','DK Hospital',NULL,NULL,NULL,NULL,NULL),(24,'Raipur(11)','DHARSEEVA(102)','SSK Birgaon(5595)','shahid chandrashekhar  azad ward (10000014)*',122012901009,'BHUMESHWARI TAMRKAR','AJAY TAMRKAR','Husband','9301125392',20.90,'shashid nagar','2025-11-04','No','Community Health Centre','UCHC Birgaon',NULL,NULL,NULL,NULL,NULL),(25,'Raipur(11)','DHARSEEVA(102)','SSK Bharat Nagar(5268)','SANTH RAMDAS WARD  (35186)',122012901370,'GAYTRI PAIKRA','VIJAY KUMAR','Wife','9755017199',31.81,'KALING NAGAR','2025-11-13','No','District Hospital','DH RAIPUR',NULL,NULL,NULL,NULL,NULL),(26,'Raipur(11)','DHARSEEVA(102)','SSK Bharat Nagar(5268)','SANTH RAMDAS WARD  (35186)',122012901374,'PUJA GAYKWAD','SONU GAYKWAD','Wife','8232781222',20.95,'BHARAT NAGAR','2025-11-18','No','District Hospital','DH RAIPUR',NULL,NULL,NULL,NULL,NULL),(27,'Raipur(11)','ABHANPUR(101)','SHC Manikchauri(2039)','Thelka Bhandha (Thelka)  (13521)',122012902111,'Devnandani Tarak','Puspendra Tarak','Wife','9302677274',23.16,'Thelkabandha','2025-11-04','No','Community Health Centre','CHC ABHANPUR',NULL,NULL,NULL,NULL,NULL),(28,'Raipur(11)','DHARSEEVA(102)','SSK Santoshi Nagar Ward-53(5520)','MURESHWAR RAO GADRE  (35220)',122012902508,'ANJALI BANDHE','AJAY','Husband','9343863112',25.70,'SANTOSHI NAGAR','2025-11-14','No','District Hospital','DH MUNGELI',NULL,NULL,NULL,NULL,NULL),(29,'Raipur(11)','DHARSEEVA(102)','SSK Shree Ram Chowk TikraPara(5296)','SH.BRIGADIER USMAN  (35222)',122012902933,'Kaveri Sahu','Srju Sahu','Wife','7805251967',32.79,'Yadavpara','2025-11-01','No','SubCentre','SSK Shree Ram Chowk TikraPara',NULL,NULL,NULL,NULL,NULL),(30,'Raipur(11)','AARNG(100)','SHC Badgaon(RAIPUR)(2064)','Badgaon  (13427)',122012902977,'Rakhi Nishad','Khomesh','Husband','6268754463',19.94,'Badgaon','2025-11-07','No','Other Private Hospital','Rims Godhi',NULL,NULL,NULL,NULL,NULL),(31,'Raipur(11)','DHARSEEVA(102)','SHC Datrenga(2213)','Datrenga  (13710)',122012903440,'Jaymati Yadav','Haro Yadav','Husband','8839575168',24.36,'Datrenga','2025-11-13','No','Medical College Hospital','Medical College Raipur',NULL,NULL,NULL,NULL,NULL),(32,'Raipur(11)','AARNG(100)','SHC Kurud (Kutela)(2065)','Semariya -1  (13362)',122012903830,'Rani Sahu','Tukaram Sahu','Husband','9669193976',28.13,'Semariya','2025-11-11','No','Medical College Hospital','Medical College Raipur',NULL,NULL,NULL,NULL,NULL),(33,'Raipur(11)','AARNG(100)','SHC Pacheda(RPR)(2063)','Mungi  (13418)',122012903984,'Dhamini Verma','Raghunndan Verma','Husband','6266651074',23.77,'Hausing bord Mungi','2025-11-10','No','Other Public Facility','Rims Hospital Raipur',NULL,NULL,NULL,NULL,NULL),(34,'Raipur(11)','TILDA(104)','SHC Tandwa(2474)','Tandawa  (13835)',122012904203,'Priyanka Ray','Padbhushan Ray','Husband','6269957435',24.06,'Tandwa','2025-11-02','No','Community Health Centre','CHC Tilda',NULL,NULL,NULL,NULL,NULL),(35,'Raipur(11)','DHARSEEVA(102)','SHC Guma(2242)','Kara  (13661)',122012905061,'Hemlta Chauhan','Vicky Singh','Wife','7898440778',29.16,'Kara','2025-11-13','No','Urban Health Centre','UPHC-Urla',NULL,NULL,NULL,NULL,NULL),(36,'Raipur(11)','DHARSEEVA(102)','SSK Gogaon(5608)','SANTH KABIR DAS  (35170)',122012905196,'MANJU GAYAKWAD','CHAMAN GAYAKWAD','Wife','8717254601',23.18,'PURANI BASTI GOGAON','2025-11-01','No','District Hospital','DH RAIPUR',NULL,NULL,NULL,NULL,NULL),(37,'Raipur(11)','AARNG(100)','SHC Krud (Mandir Hasaud)(2072)','Mandir Hasaud (Ct)  (*)',122012905635,'Poshan Yadav','Sanjay','Wife','6268709899',28.01,'Naveen chowk Mandir hasoud','2025-11-14','No','Other Private Hospital','Private',NULL,NULL,NULL,NULL,NULL),(38,'Raipur(11)','AARNG(100)','SHC Krud (Mandir Hasaud)(2072)','Mandir Hasaud (Ct)  (*)',122012905646,'Rajnandini Dheever','Mahendra','Wife','9981755116',30.97,'Andaz colony Mandir hasoud','2025-11-01','No','Primary Health Centre','PHC Mandir Hasaud',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `childrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `motherschemerecord`
--

DROP TABLE IF EXISTS `motherschemerecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `motherschemerecord` (
  `SNo` int(11) NOT NULL,
  `District` varchar(100) DEFAULT NULL,
  `HealthBlock` varchar(100) DEFAULT NULL,
  `HealthFacility` varchar(100) DEFAULT NULL,
  `HealthSubFacility` varchar(100) DEFAULT NULL,
  `Village` varchar(100) DEFAULT NULL,
  `RCHID` bigint(30) NOT NULL,
  `MotherName` varchar(100) DEFAULT NULL,
  `HusbandName` varchar(100) DEFAULT NULL,
  `Mobileof` varchar(45) DEFAULT NULL,
  `MobileNo` varchar(45) DEFAULT NULL,
  `AgeAsPerRegistration` decimal(10,2) DEFAULT NULL,
  `MotherBirthDate` date DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `ANMName` varchar(100) DEFAULT NULL,
  `ASHAName` varchar(100) DEFAULT NULL,
  `RegistrationDate` date DEFAULT NULL,
  `LMD` date DEFAULT NULL,
  `EDD` date DEFAULT NULL,
  `MBY` tinyint(4) DEFAULT NULL,
  `RemarkMBY` varchar(255) DEFAULT NULL,
  `JSY` tinyint(4) DEFAULT NULL,
  `RemarkJSY` varchar(255) DEFAULT NULL,
  `JSSY` tinyint(4) DEFAULT NULL,
  `RemarkJSSY` varchar(255) DEFAULT NULL,
  `PMMVY` tinyint(4) DEFAULT NULL,
  `RemarkPMMVY` varchar(255) DEFAULT NULL,
  `MMJY` tinyint(4) DEFAULT NULL,
  `RemarkMMJY` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`RCHID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `motherschemerecord`
--

LOCK TABLES `motherschemerecord` WRITE;
/*!40000 ALTER TABLE `motherschemerecord` DISABLE KEYS */;
INSERT INTO `motherschemerecord` VALUES (11,'Raipur(11)','AARNG(100)','CHC Arang(65)','SHC Korasi(2071)','Korasi  (13336)',122002479762,'CHAITI VERMA','NAROTTAM VERMA','Wife','9344238448',35.57,'1990-04-11','BASTIPARA','Ashwani Kumar Sahu(ID-72201642)(MobNo.-8959266614)',' SUSHILA SAHU(ID-44030362)(MobNo.-9165525857)','2025-11-03','2025-07-14','2026-04-20',1,'hehe',NULL,NULL,1,'none',1,'None',1,'none'),(12,'Raipur(11)','AARNG(100)','CHC Arang(65)','SHC Korasi(2071)','Korasi  (13336)',122002479774,'LALITA DEWAGAN','NARENDR DEWAGAN','Others','9754015191',27.63,'1997-12-16','BASTIPARA','Ashwani Kumar Sahu(ID-72201642)(MobNo.-8959266614)','SANGEETA DEVI PATE(ID-44030358)(MobNo.-9009809144)','2025-08-01','2025-05-19','2026-02-23',1,'haha',1,'None',NULL,NULL,NULL,NULL,NULL,NULL),(13,'Raipur(11)','AARNG(100)','CHC Arang(65)','SHC Korasi(2071)','Korasi  (13336)',122002479811,'MADHU DHIWAR','HARISH DHIWER','Others','7722934749',27.33,'1998-01-09','BASTIPARA','Ashwani Kumar Sahu(ID-72201642)(MobNo.-8959266614)','SANGEETA DEVI PATE(ID-44030358)(MobNo.-9009809144)','2025-05-09','2025-02-26','2025-12-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Raipur(11)','AARNG(100)','CHC Arang(65)','SHC Charaudahat(2387)','Khapri-2 (Khapri)  (13449)',122002504151,'JKAGESHWARI','MADHAV','Wife','9770676504',32.17,'1993-04-10','खपरी शीतला पारा','Smt. Uma Sahu(ID-6534)(MobNo.-9754250850)','JAYANTI SAHU(ID-44030191)(MobNo.-9399543975)','2025-06-10','2025-04-06','2026-01-11',0,'idk',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'Raipur(11)','AARNG(100)','PHC Reewa(483)','SHC Gujara (Parsada)(4863)','Gujra  (13460)',122002511334,'Rekha Nirmalkar','Nikesh Nirmalkar','Husband','9201369363',32.72,'1992-08-26','Gujra badtipara',' KULESWARI SAHU(ID-72193414)(MobNo.-8889111594)','chandrika miri(ID-44030007)(MobNo.-7354562098)','2025-05-15','2025-03-23','2025-12-28',NULL,NULL,0,'meri mrzi',NULL,NULL,NULL,NULL,NULL,NULL),(6,'Raipur(11)','AARNG(100)','PHC Reewa(483)','SHC Gujara (Parsada)(4863)','Sonpairi-3 (Sonpairi)  (13465)',122002511341,'TORAN PATLE','Dilesh Kumar','Relative','9165861166',37.37,'1988-04-10','sonpairy',' KULESWARI SAHU(ID-72193414)(MobNo.-8889111594)','yogani ghritlahare(ID-44030828)(MobNo.-9753690104)','2025-08-23','2025-05-30','2026-03-06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'Raipur(11)','AARNG(100)','CHC Arang(65)','SHC Chorbhatti(5449)','Ghorbhatti  (13332)',122002511828,'RADHIKA VERMA','HIRA VERMA','Husband','9356381757',34.25,'1991-01-01','SADAK PARA ghorbhatti ','YASODA NISAD(ID-72224183)(MobNo.-8462809654)','SARASWATI SAHU (ID-44030414)(MobNo.-8120403656)','2025-04-01','2025-01-01','2025-10-08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'Raipur(11)','AARNG(100)','CHC Arang(65)','SHC Chorbhatti(5449)','Chorbhatti  (13367)',122002511933,'ANUSUYA GAYAKWAD','DEV KUMAR','Wife','7724061524',37.67,'1988-03-06','chorbhatti','YASODA NISAD(ID-72224183)(MobNo.-8462809654)',' KUMARI BAI SAHU(ID-44030366)(MobNo.-9669459336)','2025-11-04','2025-08-08','2026-05-15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'Raipur(11)','ABHANPUR(101)','PHC Champaran(472)','SHC Paragaon(2029)','Paragaon-2(Paragaon)  (13588)',122002515458,'DROPATI SONKAR','VIJAYA SONKAR','Husband','9340153188',32.50,'1993-03-03','paragaon','Smt. Savita Sarkar(ID-2548)(MobNo.-7974397489)','manisha sakare(ID-44020259)(MobNo.-7974713637)','2025-09-02','2025-06-10','2026-03-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'Raipur(11)','ABHANPUR(101)','PHC Champaran(472)','SHC Paragaon(2029)','Paragaon-2(Paragaon)  (13588)',122002515594,'Rani Dhruw','Babla Dhruw','Others','9201229646',29.47,'1995-12-13','paragaon','Smt. Savita Sarkar(ID-2548)(MobNo.-7974397489)','Yasoda Dewangan (ID-44020255)(MobNo.-9977599355)','2025-06-03','2025-03-15','2025-12-20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `motherschemerecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userlogin`
--

DROP TABLE IF EXISTS `userlogin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userlogin` (
  `Id` int(11) NOT NULL,
  `UserName` varchar(45) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `LoginRole` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userlogin`
--

LOCK TABLES `userlogin` WRITE;
/*!40000 ALTER TABLE `userlogin` DISABLE KEYS */;
INSERT INTO `userlogin` VALUES (1,'admin','admin123','ADMIN'),(2,'user1','user123','USER');
/*!40000 ALTER TABLE `userlogin` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-29 15:04:53
