const express = require('express');
const router  = express.Router()

const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const dotenv = require('dotenv'); // ดึงค่า .env ใช้
// get config vars
dotenv.config();
// Set global directory
global.__basedir = process.env.ROOTDIR;
 
// Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

// Filter for CSV file
const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
        cb(null, true);
    } else {
        cb("Please upload only csv file.", false);
    }
};
const upload = multer({ storage: storage, fileFilter: csvFilter });

const { carsGet,carsGetByLicense,carCheckRegister,carConfirmRegister,carsRemove,getMyCar } = require('../controller/carsController')
const { servicePointAll,servicePointSearchName,servicePointSearchLocation,servicePointProvince,servicePointAmphor } = require('../controller/servicepointController')
const { CustomerGet,CustomerProfile,CustomerLogin,CustomerProfileEdit } = require('../controller/customerController')
const { lastServicePoint,insertJob,confirmJob } = require('../controller/jobController')
const { loginEmp,genHash,getAllJob,getAllJobOrderByJobNo,jobcreateticket,jobsummary,jobclose,jobupdate,custgroup,success,getAllJobOrderByJobNo2,csvcar,csvservicepoint,getJobSingle,searchjob} = require('../controller/backendController')
const { verifyUserToken } = require("../middleware/auth");
 

router.get('/', (req, res, next) => {
    res.send('cars api')
})   

// CARS  (req res next,1next,2next,3next)
router.get('/getallcar',verifyUserToken, carsGet); // ดึงข้อมูลรถทั้งหมด
router.get('/getcars/:licenseId',verifyUserToken, carsGetByLicense); // ดึงข้อมูลรถโดยค้นหาจากเลขทะเบียน เพื่อเอาไปลงทะเบียน
router.get('/checkcarregister/:vinId',verifyUserToken, carCheckRegister); // เช็ครถว่าได้ลงทะเบียนแล้วหรือยัง
router.get('/carconfirmregister/:vinId',verifyUserToken, carConfirmRegister); // ลงทะเบียนรถ 
router.get('/carunsubscribe/:vinId',verifyUserToken, carsRemove); // ลบรถที่ลงทะเบียน  
router.get('/getmycar',verifyUserToken, getMyCar)// ดึงข้อมูลรถของฉัน เรียงตามวันที่รับบริการ 

// CUSTOMER
router.get('/loginasapcc', CustomerGet); // ล็อคอินจาก Token ID ที่รับมาจาก App ASAP
router.get('/customerprofile',verifyUserToken,CustomerProfile); // ดึงข้อมูลลูกค้า
router.post('/login',CustomerLogin); // ล็อคอินโดยใช้ Username,Password ใช้สำหรับหน้าจอ Login Direct Desktop ที่ไม่ได้ส่งต่อจาก App ASAP
router.post('/editprofile',verifyUserToken,CustomerProfileEdit); // แก้ไขข้อมูลลูกค้า รอ Confirm ว่ายังมี feature นี้ไหม

// SERVICE POINT
router.get('/getallservicepoint',verifyUserToken,servicePointAll); // ดึงข้อมูลศูนย์บริการทั้งหมด
router.get('/searchservicepointbyname/:name',verifyUserToken,servicePointSearchName); // ค้นหาข้อมูลศูนย์บริการโดยใช้ชื่อ
router.get('/searchservicepointbyloc',verifyUserToken,servicePointSearchLocation); // ค้นหาข้อมูลศูนย์บริการโดยใช้ เขต และ จังหวัด
router.get('/getservicepointprovince',verifyUserToken,servicePointProvince); // ดึงข้อมูลชื่อจังหวัดทั้งหมด
router.get('/getservicepointamphor',verifyUserToken,servicePointAmphor); // ดึงข้อมูลเขต/อำเภอทั้งหมด

// JOBs
router.get('/getlastservicepoint',verifyUserToken,lastServicePoint); // ดึงประวัติศูนย์บริการที่ได้ใช้บริการล่าสุด 3 แห่ง เรียงตามวันที่
router.post('/insertjob',verifyUserToken,insertJob); // ส่งข้อมูลการนัดหมาย รายคัน
router.get('/confirmjob',verifyUserToken,confirmJob); // cf job , run id ,send mail

// Backend
router.post('/back/login',loginEmp); // พนง. เข้าสู่ระบบ
router.post('/back/genhash',genHash); // สร้างรหัส hash ใช้ตั้ง password employee
router.get('/back/getalljob/:cust_type/:startdate/:enddate',verifyUserToken,getAllJob); // ดูjobทั้งหมด เรียงตาม job create date
router.get('/back/getalljob_orderbyjobno/:cust_type/:startdate/:enddate',verifyUserToken,getAllJobOrderByJobNo); //ดู jobทั้งหมด เรียงตาม jobno
router.post('/back/jobcreateticket',verifyUserToken,jobcreateticket); // เปิดticket
router.post('/back/jobsummary',verifyUserToken,jobsummary); //สรุปเรื่อง
router.post('/back/jobclose',verifyUserToken,jobclose); //ปิดเรื่อง
router.post('/back/jobupdate',verifyUserToken,jobupdate); //// อัพเดทข้อมูลจ๊อบนั้นๆ
router.get('/back/getcustomergroup',verifyUserToken,custgroup); //// 
router.get('/back/checktokenexpire',verifyUserToken,success)// api ดึงรายการแบบทั้งหมด
router.get('/back/getalljob_orderbyjobno/:startdate/:enddate',verifyUserToken,getAllJobOrderByJobNo2); //ดู jobทั้งหมด เรียงตาม jobno 2

// api check token
// api service point ใช้ ร่วมกันกับหน้า frontend ลูกค้า
router.post('/back/uploadcsvcar',verifyUserToken,upload.single("file"),csvcar); // 
router.post('/back/uploadcsvservicepoint',verifyUserToken,upload.single("file"),csvservicepoint); // 

// api export excel

// api getjobinfo by jobid
router.post('/back/getjobsingle',verifyUserToken,getJobSingle); //// แสดง job เดี่ยวๆ
// api filter ยกชุด
router.post('back/searchjob',verifyUserToken,searchjob); // ค้นหา job

module.exports = router;