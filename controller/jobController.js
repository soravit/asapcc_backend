const bcrypt = require('bcrypt');
const axios = require('axios');
const FormData = require('form-data');
const jwt = require('jsonwebtoken') // ใช้ระบบ jwt token
const dotenv = require('dotenv'); // ดึงค่า .env ใช้
// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;
 

const JobModel = require('../model/jobModel');

exports.insertJob=(req,res,next)=> { 

    // 1 job 1 car , 1 request
   JobModel.insertJobs({job_orderss:req.body.job_order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:req.body.servicetask1,servicetask2:req.body.servicetask2,servicenote:req.body.servicenote,custcare1:req.body.custcare1,custcare2:req.body.custcare2,custcare3:req.body.custcare3,custcarenote:req.body.custcarenote,car_odo_mile:req.body.car_odo_mile}).then(([row]) => {


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
            jobid: row2[0].final_job_id,
            result: 'true'
        });
    });
  
    });
}

exports.lastServicePoint = (req,res,next) => {
    JobModel.getLastServicePoint({cust_code:req.user.customer_code}).then(([row]) => {
    
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

