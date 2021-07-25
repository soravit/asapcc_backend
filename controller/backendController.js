const bcrypt = require('bcrypt');
const axios = require('axios');
const FormData = require('form-data');
const jwt = require('jsonwebtoken') // ใช้ระบบ jwt token
const dotenv = require('dotenv'); // ดึงค่า .env ใช้
const fs = require('fs');

// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;
 

const multer = require('multer');
const csv = require('fast-csv');
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

const EmployeeModel = require('../model/employeeModel');
const ServicePoint = require('../model/servicepointModel');

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
                            emp_code: row[0].employee_code,
                            employee_fullname: row[0].employee_fullname,
                            employee_default_customer_type: row[0].employee_default_customer_type
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

exports.success=(req,res,next) => {
   
    res.status(200).json({
      message: "success"
    });

 
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


exports.getAllJobOrderByJobNo2=(req,res,next) => {
    EmployeeModel.findJobByCustTypeAlldate2({startdate:req.params.startdate,enddate:req.params.enddate}).then(([row]) => {
        //console.log(req.params.licenseId)
        
        if(row.length !== 0) {

            EmployeeModel.getstatJob2({startdate:req.params.startdate,enddate:req.params.enddate}).then(([row2]) => {
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

    

    EmployeeModel.updateJobTicketCreate({final_job_id:req.body.final_job_id,emp_code:req.user.emp_code,empname:req.user.employee_fullname});
    res.status(200).json({
        message:"success"
    });
}

exports.jobsummary=(req,res,next)=>{
    // สรุปเรื่อง

  

    EmployeeModel.updateJobSummary({final_job_id:req.body.final_job_id,emp_code:req.user.emp_code,empname:req.user.employee_fullname});
    res.status(200).json({
        message:"success"
    });
}

exports.jobclose=(req,res,next)=>{
    // ปิดเรื่อง

  



    // send sms/email confirm อีกรอบ

    EmployeeModel.updateJobClose({final_job_id:req.body.final_job_id,emp_code:req.user.emp_code,empname:req.user.employee_fullname});
    res.status(200).json({
        message:"success"
    });
}


//job_note,job_service_point_code_confirm,job_appoint_confirm_datetime,servicetask1,servicetask2,servicenote,custcare1,custcare2,custcare3,custcarenote,car_odo_mile
exports.jobupdate=(req,res,next)=>{

      // insert final service point data
      EmployeeModel.findservicepointcodeinjobtable({final_job_id:req.body.final_job_id}).then(([row]) => {
        a= row[0].job_service_point_code_confirm
 
        ServicePoint.findServicePointByCode({code:a}).then(([row2]) => {
    
            /*`service_point_name` = '1', `branch_name` = '1', `full_address` = '1', `amphor_name_th` = '1', `province_name_th` = '1', `post_code` = '1', `telephone` = '1', `mobiletel` = '1', `lattitude` = '1', `longtitude` = '1', `service_group`*/
             EmployeeModel.updateservicepointdatainjobtable({final_job_id:req.body.final_job_id,service_point_name:row2[0].service_point_name,branch_name:row2[0].branch_name,full_address:row2[0].full_address,amphor_name_th:row2[0].amphor_name_th,province_name_th:row2[0].province_name_th,post_code:row2[0].post_code,telephone:row2[0].telephone,mobiletel:row2[0].mobiletel,lattitude:row2[0].lattitude,longtitude:row2[0].longtitude,service_group:row2[0].service_group})
 
        });
         
     });
     
//อัพเดทข้อมูลจ๊อบนั้นๆ
    EmployeeModel.updateJob({job_note:req.body.job_note,job_service_point_code_confirm:req.user.job_service_point_code_confirm,job_appoint_confirm_datetime:req.user.job_appoint_confirm_datetime,servicetask1:req.body.servicetask1,servicetask2:req.body.servicetask2,servicenote:req.body.servicenote,custcare1:req.body.custcare1,custcare2:req.body.custcare2,custcare3:req.body.custcare3,custcarenote:req.body.custcarenote,car_odo_mile:req.body.car_odo_mile,final_job_id:req.body.final_job_id});
    res.status(200).json({
        message:"success"
    });
}


exports.custgroup=(req,res,next)=>{
 

    EmployeeModel.findcustgroup().then(([row2]) => {

        res.status(200).json({

            custgroup: row2
            
        });

    });



}



exports.csvcar=(req,res,next)=>{
    try {
        if (req.file == undefined) {
            return res.status(400).send({
                message: "Please upload a CSV file!"
            });
        }

        // Import CSV File to MongoDB database
        let csvData = [];
        let filePath = __basedir + '/uploads/' + req.file.filename;
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                console.log("err")
                throw error.message;
                
            })
            .on("data", (row) => {
                csvData.push(row);
            })
            .on("end", () => {

                fs.unlinkSync(filePath);   // remove temp file
                //EmployeeModel.clearcartable(); // clear car table
                
                for(i=0;i<csvData.length;i++){
              
                   EmployeeModel.insertcarimport({car_license:csvData[i].car_license,car_brand:csvData[i].car_brand,car_series:csvData[i].car_series,car_model:csvData[i].car_model,car_vin:csvData[i].car_vin,car_engine_no:csvData[i].car_engine_no,car_customer_type:csvData[i].car_customer_type,business_name:csvData[i].business_name,contract_startdate:csvData[i].contract_startdate,contract_enddate:csvData[i].contract_enddate});
                }

                console.log(csvData)

                res.status(200).send({
                    message:
                        "Upload/import the CSV data into database successfully: " + req.file.originalname,
                });

            });
    } catch (error) {
        console.log("catch error-", error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
}

exports.csvservicepoint=(req,res,next)=>{
    try {
        if (req.file == undefined) {
            return res.status(400).send({
                message: "Please upload a CSV file!"
            });
        }

        // Import CSV File to MongoDB database
        let csvData = [];
        let filePath = __basedir + '/uploads/' + req.file.filename;
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                console.log("err")
                throw error.message;
                
            })
            .on("data", (row) => {
                csvData.push(row);
            })
            .on("end", () => {

                fs.unlinkSync(filePath);   // remove temp file
                //EmployeeModel.clearservicepointable(); // clear  table
                
                for(i=0;i<csvData.length;i++){
              
                   EmployeeModel.insertservicepointimport({service_code:csvData[i].service_code,service_point_name:csvData[i].service_point_name,branch_name:csvData[i].branch_name,full_address:csvData[i].full_address,amphor_name_th:csvData[i].amphor_name_th,province_name_th:csvData[i].province_name_th,post_code:csvData[i].post_code,telephone:csvData[i].telephone,mobiletel:csvData[i].mobiletel,lattitude:csvData[i].lattitude,longtitude:csvData[i].longtitude,service_group:csvData[i].service_group});
                }

                console.log(csvData)

                res.status(200).send({
                    message:
                        "Upload/import the CSV data into database successfully: " + req.file.originalname,
                });

            });
    } catch (error) {
        console.log("catch error-", error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
}

exports.getJobSingle=(req,res,next)=>{
    // get  single job

  

    EmployeeModel.getJobSingleRow({final_job_id:req.body.final_job_id}).then(([row]) => {

        res.status(200).json({

            jobdata: row
            
        });

    });
    
}



 
exports.searchjob=(req,res,next) => {
   
    // startdate
    // enddate
    // carlicense
    // customername
    // customergroup
    // 
 
}