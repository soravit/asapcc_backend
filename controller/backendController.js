const bcrypt = require('bcrypt');
const axios = require('axios');
const FormData = require('form-data');
const jwt = require('jsonwebtoken') // ใช้ระบบ jwt token
const dotenv = require('dotenv'); // ดึงค่า .env ใช้
const fs = require('fs');

const CsvParser = require("json2csv").Parser


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
const JobModel = require('../model/jobModel');

exports.loginEmp=(req,res,next) => {
    const { emp_code='', password} = req.body;
    EmployeeModel.findEmpByCode({emp_code:emp_code})
    .then(([row]) => {
        if(row.length !== 0) {
            /*return bcrypt.compare(password, row[0].password)
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
                })*/

                if(row[0].password!=password) {
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

     ///// EMAIL SENDER
    JobModel.findCustomerByJobno({job_id:req.body.final_job_id}).then(([row2]) => {


     a=req.body.final_job_id;
     b=row2[0].customer_name;
     //c=row2[0].customer_lastname;
     d=row2[0].customer_email;
     e="";
 
     JobModel.getcarlist_confirmed_sendmail({job_id:a}).then(([row3]) => {
     
             for(i=0;i<row3.length;i++){
                 e=e+"<li>"+row3[i].car_license+" : "+row3[i].final_job_id+""+"</li>";

              

             
             }

             // รายละเอียดอีเมล
                 transporter.sendMail({
                     from: 'ASAP_CallCenter <'+process.env.GMAILUSER+'>',   // ผู้ส่ง
                     to: ""+b+" <"+d+">",// ผู้รับ
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
}


//job_note,job_service_point_code_confirm,job_appoint_confirm_datetime,servicetask1,servicetask2,servicenote,custcare1,custcare2,custcare3,custcarenote,car_odo_mile
exports.jobupdate=(req,res,next)=>{

      // insert final service point data
     // EmployeeModel.findservicepointcodeinjobtable({final_job_id:req.body.final_job_id}).then(([row]) => {
        a= req.body.job_service_point_code_confirm
        console.log(a)
 
        ServicePoint.findServicePointByCode({code:a}).then(([row2]) => {
    
            /*`service_point_name` = '1', `branch_name` = '1', `full_address` = '1', `amphor_name_th` = '1', `province_name_th` = '1', `post_code` = '1', `telephone` = '1', `mobiletel` = '1', `lattitude` = '1', `longtitude` = '1', `service_group`*/
             EmployeeModel.updateservicepointdatainjobtable({final_job_id:req.body.final_job_id,service_point_name:row2[0].service_point_name,branch_name:row2[0].branch_name,full_address:row2[0].full_address,amphor_name_th:row2[0].amphor_name_th,province_name_th:row2[0].province_name_th,post_code:row2[0].post_code,telephone:row2[0].telephone,mobiletel:row2[0].mobiletel,lattitude:row2[0].lattitude,longtitude:row2[0].longtitude,service_group:row2[0].service_group})
 
        });
         
   //  });
     
//อัพเดทข้อมูลจ๊อบนั้นๆ
    EmployeeModel.updateJob({job_note:req.body.job_note,job_service_point_code_confirm:req.user.job_service_point_code_confirm,job_appoint_confirm_datetime:req.user.job_appoint_confirm_datetime,servicetask1:req.body.servicetask1,servicetask2:req.body.servicetask2,servicenote:req.body.servicenote,custcare1:req.body.custcare1,custcare2:req.body.custcare2,custcare3:req.body.custcare3,custcarenote:req.body.custcarenote,car_odo_mile:req.body.car_odo_mile,job_callcenter_note:req.body.job_callcenter_note,job_status:req.body.job_status,final_job_id:req.body.final_job_id});
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
            return res.status(500).send({
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
                EmployeeModel.clearcartable(); // clear car table
                
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
            return res.status(500).send({
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
                EmployeeModel.clearservicepointable(); // clear  table
                
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

/*
exports.exportjob=(req,res,next) => {
    
    EmployeeModel.searchjob_all({order:''}).then(([row]) => {

        let tutorials = [];

        id='a';
        title='b';
        description='c';
        published='d';
        
        tutorials.push({ id, title, description, published });
     
         csvFields = ["Id", "Title", "Description", "Published"];
         csvParser = new CsvParser({ csvFields });
      
         csvData = csvParser.parse(row);
    
        res.setHeader("Content-Type", "text-csv"); // text-csv
        res.setHeader("Content-Disposition", "attachment; filename=tutorials.csv");
    
        res.status(200).end(csvData);
        console.log(csvData);


        });

  
 

}*/


exports.exportjob=(req,res,next) => {
   
    // startdate
    // enddate
    // carlicense
    // customername
    // customergroup
    // statusjob
    // service_group
    // branch
    // emp_name_assign
    // emp_name_jobclose

    // sort condition
    // 
    /*เรียง ดาม
    1.date created (new first)
    2. date created (new last)
    3. date close (new first)
    4. date close (new last)*/

 

    // condition
    // 1 if startdate = null  = all
    // 2 if customergroup = null = all
    // 3 4 5 6 7 ...


    // order condition
    orderstring=''
    if(req.body.ordercondition=='datecreated_newfirst'){
        orderstring='ORDER BY job_add_datetime DESC'
    } else if(req.body.ordercondition=='datecreated_newlast'){
        orderstring='ORDER BY job_add_datetime ASC'
    } else if(req.body.ordercondition=='dateclose_newfirst'){
        orderstring='ORDER BY job_closed_ticket_datetime DESC'
    } else if(req.body.ordercondition=='dateclose_newlast'){
        orderstring='ORDER BY job_closed_ticket_datetime ASC'
    }


    // Part 1 Core Filter

    if(req.body.startdate=='' && req.body.enddate=='' && req.body.customergroup=='' && (req.body.carlicense=='' && req.body.customername=='' && req.body.statusjob=='' && req.body.service_group=='' && req.body.branch=='' && req.body.emp_name_assign=='' && req.body.emp_name_jobclose=='')){ 
        EmployeeModel.searchjob_all({order:orderstring}).then(([row]) => {

            EmployeeModel.statsearchjob_all().then(([row2]) => {

                let tutorials = [];

                    id='a';
                    title='b';
                    description='c';
                    published='d';
                    
                    tutorials.push({ id, title, description, published });
                
                    csvFields = ["Id", "Title", "Description", "Published"];
                    csvParser = new CsvParser({ csvFields });
                
                    csvData = csvParser.parse(row);
                
                    res.setHeader("Content-Type", "text-csv"); // text-csv
                    res.setHeader("Content-Disposition", "attachment; filename=tutorials.csv");
                
                    res.status(200).end(csvData);
                    console.log(csvData);

                    });
        });

    } else if(req.body.startdate!='' && req.body.enddate!='' && req.body.customergroup=='' && (req.body.carlicense=='' && req.body.customername=='' && req.body.statusjob=='' && req.body.service_group=='' && req.body.branch=='' && req.body.emp_name_assign=='' && req.body.emp_name_jobclose=='')){
        EmployeeModel.searchjob_all({order:orderstring,daterange:'WHERE job_add_datetime BETWEEN "'+req.body.startdate+'" AND "'+req.body.enddate+'"'}).then(([row]) => {
           
            EmployeeModel.statsearchjob_all2({daterange:'WHERE job_add_datetime BETWEEN "'+req.body.startdate+'" AND "'+req.body.enddate+'"'}).then(([row2]) => {

                let tutorials = [];

                    id='a';
                    title='b';
                    description='c';
                    published='d';
                    
                    tutorials.push({ id, title, description, published });
                
                    csvFields = ["Id", "Title", "Description", "Published"];
                    csvParser = new CsvParser({ csvFields });
                
                    csvData = csvParser.parse(row);
                
                    res.setHeader("Content-Type", "text-csv"); // text-csv
                    res.setHeader("Content-Disposition", "attachment; filename=tutorials.csv");
                
                    res.status(200).end(csvData);
                    console.log(csvData);

                  



        });

    });

    // Part 2 filter another

    } else if(req.body.startdate=='' && req.body.enddate=='' && (req.body.customergroup!='' || req.body.carlicense!='' || req.body.customername!='' || req.body.statusjob!='' || req.body.service_group!='' || req.body.branch!='' || req.body.emp_name_assign!='' || req.body.emp_name_jobclose!='')){ 
        
        arr1 = [];
        searchstring='';
        if(req.body.customergroup!=''){
            arr1.push('car_customer_type = "'+req.body.customergroup+'"')
        }
        if(req.body.carlicense!=''){
            arr1.push('car_license LIKE "%'+req.body.carlicense+'%"')
        }
        if(req.body.customername!=''){
            arr1.push('customer_name LIKE "%'+req.body.customername+'%"')
        }
        if(req.body.statusjob!=''){
            arr1.push('job_status = "'+req.body.statusjob+'"')
        }
        if(req.body.service_group!=''){
            arr1.push('service_group = "'+req.body.service_group+'"')
        }
        if(req.body.branch!=''){
            arr1.push('service_point_name LIKE "%'+req.body.branch+'%"')
        }
        if(req.body.emp_name_assign!=''){
            arr1.push('job_create_ticket_by_emp_name = "'+req.body.emp_name_assign+'"')
        }
        if(req.body.emp_name_jobclose!=''){
            arr1.push('job_closed_ticket_by_emp_name = "'+req.body.emp_name_jobclose+'"')
        }

        //console.log(arr1)

        for(i=0;i<arr1.length;i++){
            searchstring+=arr1[i]+' AND '
            if(i==(arr1.length-1)){
                searchstring+=arr1[i]
            }
        }
     

  

        EmployeeModel.searchjob_filter({othersearch:searchstring,order:orderstring}).then(([row]) => {

            EmployeeModel.statsearchjob_filter({othersearch:searchstring}).then(([row2]) => {

                let tutorials = [];

                    id='a';
                    title='b';
                    description='c';
                    published='d';
                    
                    tutorials.push({ id, title, description, published });
                
                    csvFields = ["Id", "Title", "Description", "Published"];
                    csvParser = new CsvParser({ csvFields });
                
                    csvData = csvParser.parse(row);
                
                    res.setHeader("Content-Type", "text-csv"); // text-csv
                    res.setHeader("Content-Disposition", "attachment; filename=tutorials.csv");
                
                    res.status(200).end(csvData);
                    console.log(csvData);

                  
        });
    });

    } else if(req.body.startdate!='' && req.body.enddate!='' && (req.body.customergroup!='' || req.body.carlicense!='' || req.body.customername!='' || req.body.statusjob!='' || req.body.service_group!='' || req.body.branch!='' || req.body.emp_name_assign!='' || req.body.emp_name_jobclose!='')){ 
        
        arr1 = [];
        searchstring='';
        if(req.body.customergroup!=''){
            arr1.push('car_customer_type = "'+req.body.customergroup+'"')
        }
        if(req.body.carlicense!=''){
            arr1.push('car_license LIKE "%'+req.body.carlicense+'%"')
        }
        if(req.body.customername!=''){
            arr1.push('customer_name LIKE "%'+req.body.customername+'%"')
        }
        if(req.body.statusjob!=''){
            arr1.push('job_status = "'+req.body.statusjob+'"')
        }
        if(req.body.service_group!=''){
            arr1.push('service_group = "'+req.body.service_group+'"')
        }
        if(req.body.branch!=''){
            arr1.push('service_point_name LIKE "%'+req.body.branch+'%"')
        }
        if(req.body.emp_name_assign!=''){
            arr1.push('job_create_ticket_by_emp_name = "'+req.body.emp_name_assign+'"')
        }
        if(req.body.emp_name_jobclose!=''){
            arr1.push('job_closed_ticket_by_emp_name = "'+req.body.emp_name_jobclose+'"')
        }

        //console.log(arr1)

        for(i=0;i<arr1.length;i++){
            searchstring+=arr1[i]+' AND '
            if(i==(arr1.length-1)){
                searchstring+=arr1[i]
            }
        }
  

        EmployeeModel.searchjob_filter({othersearch:searchstring,order:orderstring,daterange:'AND job_add_datetime BETWEEN "'+req.body.startdate+'" AND "'+req.body.enddate+'"'}).then(([row]) => {
            EmployeeModel.statsearchjob_filter2({othersearch:searchstring,daterange:'AND job_add_datetime BETWEEN "'+req.body.startdate+'" AND "'+req.body.enddate+'"'}).then(([row2]) => {
          
                let tutorials = [];

                id='a';
                title='b';
                description='c';
                published='d';
                
                tutorials.push({ id, title, description, published });
            
                csvFields = ["Id", "Title", "Description", "Published"];
                csvParser = new CsvParser({ csvFields });
            
                csvData = csvParser.parse(row);
            
                res.setHeader("Content-Type", "text-csv"); // text-csv
                res.setHeader("Content-Disposition", "attachment; filename=tutorials.csv");
            
                res.status(200).end(csvData);
                console.log(csvData);

           
        });
    });

    } 

 else {
    res.status(400).json({
        message: "error search"
    });
 }

}


 
exports.searchjob=(req,res,next) => {
   
    // startdate
    // enddate
    // carlicense
    // customername
    // customergroup
    // statusjob
    // service_group
    // branch
    // emp_name_assign
    // emp_name_jobclose

    // sort condition
    // 
    /*เรียง ดาม
    1.date created (new first)
    2. date created (new last)
    3. date close (new first)
    4. date close (new last)*/

 

    // condition
    // 1 if startdate = null  = all
    // 2 if customergroup = null = all
    // 3 4 5 6 7 ...


    // order condition
    orderstring=''
    if(req.body.ordercondition=='datecreated_newfirst'){
        orderstring='ORDER BY job_add_datetime DESC'
    } else if(req.body.ordercondition=='datecreated_newlast'){
        orderstring='ORDER BY job_add_datetime ASC'
    } else if(req.body.ordercondition=='dateclose_newfirst'){
        orderstring='ORDER BY job_closed_ticket_datetime DESC'
    } else if(req.body.ordercondition=='dateclose_newlast'){
        orderstring='ORDER BY job_closed_ticket_datetime ASC'
    }


    // Part 1 Core Filter

    if(req.body.startdate=='' && req.body.enddate=='' && req.body.customergroup=='' && (req.body.carlicense=='' && req.body.customername=='' && req.body.statusjob=='' && req.body.service_group=='' && req.body.branch=='' && req.body.emp_name_assign=='' && req.body.emp_name_jobclose=='')){ 
        EmployeeModel.searchjob_all({order:orderstring}).then(([row]) => {

            EmployeeModel.statsearchjob_all().then(([row2]) => {

            res.status(200).json({
                joblist: row,
                length: row.length,
                jobstat: row2
            });
        });
        });

    } else if(req.body.startdate!='' && req.body.enddate!='' && req.body.customergroup=='' && (req.body.carlicense=='' && req.body.customername=='' && req.body.statusjob=='' && req.body.service_group=='' && req.body.branch=='' && req.body.emp_name_assign=='' && req.body.emp_name_jobclose=='')){
        EmployeeModel.searchjob_all({order:orderstring,daterange:'WHERE job_add_datetime BETWEEN "'+req.body.startdate+'" AND "'+req.body.enddate+'"'}).then(([row]) => {
           
            EmployeeModel.statsearchjob_all2({daterange:'WHERE job_add_datetime BETWEEN "'+req.body.startdate+'" AND "'+req.body.enddate+'"'}).then(([row2]) => {

            res.status(200).json({
                joblist: row,
                length: row.length,
                jobstat: row2      
            });
        });

    });

    // Part 2 filter another

    } else if(req.body.startdate=='' && req.body.enddate=='' && (req.body.customergroup!='' || req.body.carlicense!='' || req.body.customername!='' || req.body.statusjob!='' || req.body.service_group!='' || req.body.branch!='' || req.body.emp_name_assign!='' || req.body.emp_name_jobclose!='')){ 
        
        arr1 = [];
        searchstring='';
        if(req.body.customergroup!=''){
            arr1.push('car_customer_type = "'+req.body.customergroup+'"')
        }
        if(req.body.carlicense!=''){
            arr1.push('car_license LIKE "%'+req.body.carlicense+'%"')
        }
        if(req.body.customername!=''){
            arr1.push('customer_name LIKE "%'+req.body.customername+'%"')
        }
        if(req.body.statusjob!=''){
            arr1.push('job_status = "'+req.body.statusjob+'"')
        }
        if(req.body.service_group!=''){
            arr1.push('service_group = "'+req.body.service_group+'"')
        }
        if(req.body.branch!=''){
            arr1.push('branch_name LIKE "%'+req.body.branch+'%"')
        }
        if(req.body.emp_name_assign!=''){
            arr1.push('job_create_ticket_by_emp_name = "'+req.body.emp_name_assign+'"')
        }
        if(req.body.emp_name_jobclose!=''){
            arr1.push('job_closed_ticket_by_emp_name = "'+req.body.emp_name_jobclose+'"')
        }

        //console.log(arr1)

        for(i=0;i<arr1.length;i++){
            searchstring+=arr1[i]+' AND '
            if(i==(arr1.length-1)){
                searchstring+=arr1[i]
            }
        }
     

  

        EmployeeModel.searchjob_filter({othersearch:searchstring,order:orderstring}).then(([row]) => {

            EmployeeModel.statsearchjob_filter({othersearch:searchstring}).then(([row2]) => {

            res.status(200).json({
                joblist: row,
                length: row.length,
                jobstat: row2      
            });
        });
    });

    } else if(req.body.startdate!='' && req.body.enddate!='' && (req.body.customergroup!='' || req.body.carlicense!='' || req.body.customername!='' || req.body.statusjob!='' || req.body.service_group!='' || req.body.branch!='' || req.body.emp_name_assign!='' || req.body.emp_name_jobclose!='')){ 
        
        arr1 = [];
        searchstring='';
        if(req.body.customergroup!=''){
            arr1.push('car_customer_type = "'+req.body.customergroup+'"')
        }
        if(req.body.carlicense!=''){
            arr1.push('car_license LIKE "%'+req.body.carlicense+'%"')
        }
        if(req.body.customername!=''){
            arr1.push('customer_name LIKE "%'+req.body.customername+'%"')
        }
        if(req.body.statusjob!=''){
            arr1.push('job_status = "'+req.body.statusjob+'"')
        }
        if(req.body.service_group!=''){
            arr1.push('service_group = "'+req.body.service_group+'"')
        }
        if(req.body.branch!=''){
            arr1.push('branch_name LIKE "%'+req.body.branch+'%"')
        }
        if(req.body.emp_name_assign!=''){
            arr1.push('job_create_ticket_by_emp_name = "'+req.body.emp_name_assign+'"')
        }
        if(req.body.emp_name_jobclose!=''){
            arr1.push('job_closed_ticket_by_emp_name = "'+req.body.emp_name_jobclose+'"')
        }

        //console.log(arr1)

        for(i=0;i<arr1.length;i++){
            searchstring+=arr1[i]+' AND '
            if(i==(arr1.length-1)){
                searchstring+=arr1[i]
            }
        }
  

        EmployeeModel.searchjob_filter({othersearch:searchstring,order:orderstring,daterange:'AND job_add_datetime BETWEEN "'+req.body.startdate+'" AND "'+req.body.enddate+'"'}).then(([row]) => {
            EmployeeModel.statsearchjob_filter2({othersearch:searchstring,daterange:'AND job_add_datetime BETWEEN "'+req.body.startdate+'" AND "'+req.body.enddate+'"'}).then(([row2]) => {
          
            res.status(200).json({
                joblist: row,
                length: row.length,
                jobstat: row2      
            });
        });
    });

    } 

 else {
    res.status(400).json({
        message: "error search"
    });
 }

}



exports.statusjoblist=(req,res,next) => {
    EmployeeModel.findstatusjoblist().then(([row2]) => {
        res.status(200).json({
            joblist: row2
        });
    });
}

exports.servicegroup=(req,res,next) => {
    EmployeeModel.findservicegroup().then(([row2]) => {
        res.status(200).json({
            serviceglist: row2
        });
    });

}

exports.employeelist=(req,res,next) => {
    EmployeeModel.findemployeelist().then(([row2]) => {
        res.status(200).json({
            emplist: row2
        });
    });

}
