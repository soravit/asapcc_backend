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

exports.insertJob=(req,res,next)=> { 



    // 1 job 1 car , 1 request
   JobModel.insertJobs({job_orderss:req.body.job_order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:req.body.servicetask1,servicetask2:req.body.servicetask2,servicenote:req.body.servicenote,custcare1:req.body.custcare1,custcare2:req.body.custcare2,custcare3:req.body.custcare3,custcarenote:req.body.custcarenote,car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote}).then(([row]) => {


        res.status(200).json({
            message: 'insert job success ',
            result: 'true'
        });

  
    });

    
} 

exports.confirmJob=(req,res,next)=> { 
    JobModel.updatejobid_complete({customer_code:req.user.customer_code}).then(([row]) => {
        
        JobModel.updatejobid_complete2();

        JobModel.getjobid_complete({customer_code:req.user.customer_code}).then(([row2]) => {


       

        

        


         

        res.status(200).json({
            message: 'confirm job success ',
            jobid: row2[0].job_id,
            result: 'true'
        });

        ///// EMAIL SENDER
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
                
                }

                // รายละเอียดอีเมล
                    transporter.sendMail({
                        from: 'ASAP_CallCenter <'+process.env.GMAILUSER+'>',   // ผู้ส่ง
                        to: ""+b+" "+c+" <"+d+">",// ผู้รับ
                        subject: "ASAP Call Center : Confirm Job "+a+"",                      // หัวข้อ
                        text: "Hello,",                         // ข้อความ
                        html: "<b>คำนัดหมายของท่านคือหมายเลข "+a+" ได้นัดหมายเรียบร้อยแล้ว มีทะเบียนรถที่เข้ารับบริการดังนี้ <br><ol>"+e+"</ol> <br>หากมีข้อสงสัยให้ติดต่อกลับที่ โทรศัพท์ 0-12-345678 </b><br>ASAP Call Center",                
                    // ข้อความ
                    }, (err, info) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(info.messageId);
                        }
                    });
        
            });
            ////// END EMAIL


            ////// SMS


            ////// END SMS

    });
  
});

    
}

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

