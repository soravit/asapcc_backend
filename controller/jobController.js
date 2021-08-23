const bcrypt = require('bcrypt');
const axios = require('axios');
const FormData = require('form-data');
const jwt = require('jsonwebtoken') // ใช้ระบบ jwt token
const dotenv = require('dotenv'); // ดึงค่า .env ใช้
const nodemailer = require("nodemailer");
// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;
// กำหนดค่าเกี่ยวกับ email ที่จะใช้ส่ง
let transporter = nodemailer.createTransport({
    host: 'gmail',
    service: 'Gmail',
    auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPASS,
    },
});
 

const JobModel = require('../model/jobModel');
const CarsModel = require('../model/carsModel');
const EmployeeModel = require('../model/employeeModel');
const ServicePoint = require('../model/servicepointModel');

/* job_orderss:req.body.job_order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:req.body.servicetask1,servicetask2:req.body.servicetask2,servicenote:req.body.servicenote,custcare1:req.body.custcare1,custcare2:req.body.custcare2,custcare3:req.body.custcare3,custcarenote:req.body.custcarenote,car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote */

/*
exports.insertJob=(req,res,next)=> { 



    // 1 job 1 car , 1 request
   JobModel.insertJobs({job_orderss:req.body.job_order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:req.body.servicetask1,servicetask2:req.body.servicetask2,servicenote:req.body.servicenote,custcare1:req.body.custcare1,custcare2:req.body.custcare2,custcare3:req.body.custcare3,custcarenote:req.body.custcarenote,car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote}).then(([row]) => {


        res.status(200).json({
            message: 'insert job success ',
            result: 'true'
        });

  
    });

    
} */

 /* แก้เป็นแยก job job ให้ทับเลขเลย /1  /2  /3  /4  แล้วส่งเมลสรุปรายการให้ลูกค้าตอนนี้ด้วย */ 
/*
exports.confirmJob=(req,res,next)=> { 
    aaaaa=req.user.customer_code;
    JobModel.updatejobid_complete({customer_code:req.user.customer_code}).then(([row]) => {
        
        JobModel.updatejobid_complete2();

        JobModel.getjobid_complete({customer_code:aaaaa}).then(([row2]) => {


       
     a=row2[0].job_id;
     b=row2[0].customer_firstname;
     c=row2[0].customer_lastname;
     d=row2[0].customer_email;
     e="";
 
     JobModel.getcarlist_confirmed_sendmail({job_id:a}).then(([row3]) => {
     
             for(i=0;i<row3.length;i++){
                 e=e+"<li>"+row3[i].car_license+" : "+row3[i].final_job_id+""+"</li>";

                  // Update car info to job table

                 JobModel.findcarvininjobtable({final_job_id:row3[i].final_job_id}).then(([row4]) => {
                     
                     a=row4[0].job_car_vin_id
                     b=row4[0].final_job_id
                     c=row2[0].customer_firstname+' '+row2[0].customer_lastname
                     d=row2[0].customer_email
                     e=row2[0].customer_telephone
                     console.log(c)
              
                      
                     CarsModel.findCarByVin({vinid:a}).then(([row5]) => {
                         console.log(a)
                         console.log(b)
                         JobModel.updatecardatainjobtable({final_job_id:b,car_license:row5[0].car_license,car_brand:row5[0].car_brand,car_series:row5[0].car_series,car_model:row5[0].car_model,car_engine_no:row5[0].car_engine_no,car_customer_type:row5[0].car_customer_type,business_name:row5[0].business_name,contract_startdate:row5[0].contract_startdate,contract_enddate:row5[0].contract_enddate,customer_name:c,customer_email:d,customer_telephone:e})
                     });


             
                 });

                 // Update service point data

                 console.log(row3[i].final_job_id+'bbbb')
      
                 EmployeeModel.findservicepointcodeinjobtable_beforeconfirm({final_job_id:row3[i].final_job_id}).then(([row]) => {
                     console.log(row[0].final_job_id+'aaa')
                     a= row[0].job_service_point_code
                     b=row[0].final_job_id
             
                     ServicePoint.findServicePointByCode({code:a}).then(([row2]) => {
                         console.log(a)
                 
                       
                         EmployeeModel.updateservicepointdatainjobtable({final_job_id:b,service_point_name:row2[0].service_point_name,branch_name:row2[0].branch_name,full_address:row2[0].full_address,amphor_name_th:row2[0].amphor_name_th,province_name_th:row2[0].province_name_th,post_code:row2[0].post_code,telephone:row2[0].telephone,mobiletel:row2[0].mobiletel,lattitude:row2[0].lattitude,longtitude:row2[0].longtitude,service_group:row2[0].service_group})
             
                     });
      
                });
             
             }

            });


        

        


         

        res.status(200).json({
            message: 'confirm job success ',
            jobid: row2[0].job_id,
            result: 'true'
        });

       
    });
  
});

    
}*/

exports.lastServicePoint = (req,res,next) => {
    JobModel.getLastServicePoint({customer_code:req.user.customer_code}).then(([row]) => {
    
        if(row.length !== 0) {
            res.status(200).json({
                servicepoint: row
               });
        } else {
            res.status(401)
            .json({
                message: "notfound"
            });
        }

    
    })

    
    
}

