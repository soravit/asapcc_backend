const bcrypt = require('bcrypt');
const axios = require('axios');
const FormData = require('form-data');
const jwt = require('jsonwebtoken') // ใช้ระบบ jwt token
const dotenv = require('dotenv'); // ดึงค่า .env ใช้
// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;
 

const EmployeeModel = require('../model/employeeModel');

exports.loginEmp=(req,res,next) => {
    const { emp_code='', password} = req.body;
    EmployeeModel.findEmpByCode({emp_code:emp_code})
    .then(([row]) => {
        if(row.length !== 0) {
            return bcrypt.compare(password, row[0].password)
                .then((result) => {
                    if(!result) {
                        res.status(401)
                            .json({
                                message: "Authentication failed"
                            })
                    } else {
                        let jwtToken = jwt.sign({
                            emp_code: row[0].employee_code
                        },process.env.TOKEN_SECRET, {
                            expiresIn: process.env.TOKEN_EXPIRE_IN
                        });
                  

                        res.status(200).json({
                            token: jwtToken,
                            expiresIn: 3600,
                            emp_code: row[0].employee_code,
                            employee_default_customer_type: row[0].employee_default_customer_type,
                            employee_fullname: row[0].employee_fullname
                        });
                    }
                }).catch((error) => {
                    res.status(401)
                        .json({
                            message: "Authentication failed",
                            error:error
                        })
                })
        } else {
            res.status(401)
            .json({
                message: "Authentication failed"
            })
        }
    })
    .catch((error) => {
        res.status(500)
        .json({
            message:error
        })
    })
}


exports.genHash=(req,res,next) => {
    bcrypt.hash(req.body.password, 10)
    .then((hash) => {

    res.status(200).json({
        passwordhash: hash
    });

})
}

exports.getAllJob=(req,res,next) => {
    EmployeeModel.findJobByCustTypeAlldate({cust_type:req.params.cust_type,startdate:req.params.startdate,enddate:req.params.enddate}).then(([row]) => {
        //console.log(req.params.licenseId)
        
        if(row.length !== 0) {

            EmployeeModel.getstatJob({cust_type:req.params.cust_type,startdate:req.params.startdate,enddate:req.params.enddate}).then(([row2]) => {

            res.status(200).json({
                joblist: row,
                length:row.length,
                jobstat: row2
                
            });

        });

        } else {
            res.status(401)
            .json({
                message: "notfound"
            });
        }

    })

}

exports.getAllJobOrderByJobNo=(req,res,next) => {
    EmployeeModel.findJobByCustTypeAlldate({cust_type:req.params.cust_type,startdate:req.params.startdate,enddate:req.params.enddate}).then(([row]) => {
        //console.log(req.params.licenseId)
        
        if(row.length !== 0) {

            EmployeeModel.getstatJob({cust_type:req.params.cust_type,startdate:req.params.startdate,enddate:req.params.enddate}).then(([row2]) => {
                //console.log(req.params.licenseId)
                
                if(row.length !== 0) {
        
                    res.status(200).json({
                        joblist: row,
                        length:row.length,
                        jobstat: row2
                    });
        
        
                } else {
                    res.status(401)
                    .json({
                        message: "notfound"
                    });
                }
        
            })

           


        } else {
            res.status(401)
            .json({
                message: "notfound"
            });
        }

    })

}

exports.jobcreateticket=(req,res,next)=>{
    // รับเรื่อง

    EmployeeModel.updateJobTicketCreate({final_job_id:req.body.final_job_id,emp_code:req.user.emp_code});
    res.status(200).json({
        message:"success"
    });
}

exports.jobsummary=(req,res,next)=>{
    // สรุปเรื่อง

    EmployeeModel.updateJobSummary({final_job_id:req.body.final_job_id,emp_code:req.user.emp_code});
    res.status(200).json({
        message:"success"
    });
}

exports.jobclose=(req,res,next)=>{
    // สรุปเรื่อง

    EmployeeModel.updateJobClose({final_job_id:req.body.final_job_id,emp_code:req.user.emp_code});
    res.status(200).json({
        message:"success"
    });
}