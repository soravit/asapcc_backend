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

/* //job order=1
exports.insertJob=(req,res,next)=> { 



    // 1 job 1 car , 1 request
   JobModel.insertJobs({job_orderss:req.body.job_order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:req.body.servicetask1,servicetask2:req.body.servicetask2,servicenote:req.body.servicenote,custcare1:req.body.custcare1,custcare2:req.body.custcare2,custcare3:req.body.custcare3,custcarenote:req.body.custcarenote,car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote}).then(([row]) => {


        res.status(200).json({
            message: 'insert job success ',
            result: 'true'
        });

  
    });

    
} 
*/


 /* แก้เป็นแยก job job ให้ทับเลขเลย /1  /2  /3  /4  แล้วส่งเมลสรุปรายการให้ลูกค้าตอนนี้ด้วย */ 

 e="";
 /// new JOB function
exports.insertJob =(req,res,next)=> { 
    console.log("start insert job");

order=0;



    // วิ่ง insert job แยกแต่ละ row ตามที่ลูกค้าติ๊กถูกเลย
function check1(req){
    if(req.body.servicetask1=='1' ){ // ใส่ service note / job appointment... etc เข้าไปทุกอันด้วย
        order=order+1;
        e=e+"<li>เช็คระยะเปลี่ยนถ่ายน้ำมันเครื่อง</li>";
        JobModel.insertJobs({job_orderss:order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:req.body.servicetask1,servicetask2:'',servicenote:'',custcare1:'',custcare2:'',custcare3:'',custcarenote:'',car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote}).then(([row]) => {
            
        });
        
    } 
    check2(req);
    return "1"
    
}
function check2(req){
    if(req.body.servicetask2=='1' ){
        order=order+1;
        e=e+"<li>เปลี่ยนยาง</li>";
        JobModel.insertJobs({job_orderss:order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:'',servicetask2:req.body.servicetask2,servicenote:'',custcare1:'',custcare2:'',custcare3:'',custcarenote:'',car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote}).then(([row]) => {
          
        });
    }

 
    check3(req);
    return "2"
}
function check3(req){
   if(req.body.servicenote!=''){
        order=order+1;
        e=e+"<li>สอบถามอื่นๆ: "+req.body.servicenote+"</li>";
      
        JobModel.insertJobs({job_orderss:order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:'',servicetask2:req.body.servicetask2,servicenote:req.body.servicenote,custcare1:'',custcare2:'',custcare3:'',custcarenote:'',car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote}).then(([row]) => {
           
        });
    } 

 
    check4(req);
    return "3"
}
function check4(req){
    if(req.body.custcare1=='1'){ // ใส่ cust care note เข้าไปทุกอันด้วย
        order=order+1;
        e=e+"<li>สอบถามสถานะป้ายภาษี พรบ. กรมธรรม์</li>";
        JobModel.insertJobs({job_orderss:order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:'',servicetask2:'',servicenote:'',custcare1:req.body.custcare1,custcare2:'',custcare3:'',custcarenote:'',car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote}).then(([row]) => {
           
        });
    } 
    check5(req)
    return "4"
}
function check5(req){
    if(req.body.custcare2=='1'){
        order=order+1;
        e=e+"<li>สอบถามสถานะรถซ่อม</li>";
        JobModel.insertJobs({job_orderss:order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:'',servicetask2:'',servicenote:'',custcare1:'',custcare2:req.body.custcare2,custcare3:'',custcarenote:'',car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote}).then(([row]) => {
          
        });
    } 
    check6(req)
    return "5"
}
function check6(req){
    if(req.body.custcare3=='1'){
        order=order+1;
        e=e+"<li>สอบถามสถานะรถทดแทน</li>";
        JobModel.insertJobs({job_orderss:order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:'',servicetask2:'',servicenote:'',custcare1:'',custcare2:'',custcare3:req.body.custcare3,custcarenote:'',car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote}).then(([row]) => {
         
        });
    }

    check7(req)
    return "6"
}
function check7(req){
    if(req.body.custcarenote!='') {
        order=order+1;
        e=e+"<li>สอบถามบริการอื่นๆ: "+req.body.custcarenote+"</li>";
    
        JobModel.insertJobs({job_orderss:order,job_customer_id:req.user.customer_code,job_car_vin_id:req.body.job_car_vin_id,job_service_point_code:req.body.job_service_point_code,job_appoint_datetime:req.body.job_appoint_datetime,servicetask1:'',servicetask2:'',servicenote:'',custcare1:'',custcare2:'',custcare3:req.body.custcare3,custcarenote:req.body.custcarenote,car_odo_mile:req.body.car_odo_mile,usertasknote:req.body.usertasknote}).then(([row]) => {
       
        });
    }
  
   // run6(req)

  /* JobModel.updatejobid_complete({customer_code:req.user.customer_code}).then(([row]) => { 
JobModel.updatejobid_complete2();
    res.status(200).json({
        message: 'insert job success ',
        result: 'true'
    });*/
 
    res.status(200).json({
        message: 'insert job success ',
        result: 'true'
 

 
  
});
 

}


/*
function run6(req){
    // Update job ID
    JobModel.updatejobid_complete({customer_code:req.user.customer_code});
    run7(req)
    return "run6"
}

function run7(req){
    // Job ID Constant +1
    JobModel.updatejobid_complete({customer_code:req.user.customer_code});//ย้ำอีกรอบกันหลุด เพราะมันชอบหลุดตอน row สุดท้าย
    JobModel.updatejobid_complete2();
    run8(req)
    
    return "run7"
}
function run8(req){
// update car info & service point info เพื่อทำ report ง่ายขึ้น
    JobModel.findcarlistnocarinfoinjobtable({customer_code:req.user.customer_code}).then(([row]) => {
        console.log("a"); 

        for(i=0;i<row.length;i++){
            jid=row[i].final_job_id;
            console.log(jid);
        // Update carinfo
        JobModel.updatecardatainjobtable({final_job_id:jid,car_license:row[i].car_license,car_brand:row[i].car_brand,car_series:row[i].car_series,car_model:row[i].car_model,car_engine_no:row[i].car_engine_no,car_customer_type:row[i].car_customer_type,business_name:row[i].business_name,contract_startdate:row[i].contract_startdate,contract_enddate:row[i].contract_enddate,customer_name:row[i].customer_firstname+' '+row[i].customer_lastname,customer_email:row[i].customer_email,customer_telephone:row[i].customer_telephone}).then(([row22]) => {     
           
         });
   
     // Update servicepoint info
     EmployeeModel.updateservicepointdatainjobtable({final_job_id:jid,service_point_name:row[i].service_point_name,branch_name:row[i].branch_name,full_address:row[i].full_address,amphor_name_th:row[i].amphor_name_th,province_name_th:row[i].province_name_th,post_code:row[i].post_code,telephone:row[i].telephone,mobiletel:row[i].mobiletel,lattitude:row[i].lattitude,longtitude:row[i].longtitude,service_group:row[i].service_group}).then(([row33]) => {console.log("c"); });


        }

    });
    run9(req)
    return "run8"
    
}
function run9(req){
       // Send email summary job JOB ID 2108XXXXX

       JobModel.getjobid_complete({customer_code:req.user.customer_code}).then(([row2]) => {
        transporter.sendMail({
            from: 'ASAP_CallCenter <'+process.env.GMAILUSER+'>',   // ผู้ส่ง
            to: ""+row2[0].customer_firstname+" "+row2[0].customer_lastname+" <"+row2[0].customer_email+">",// ผู้รับ
            subject: "ASAP Call Center : Job "+row2[0].job_id+"",                      // หัวข้อ
            text: "Hello,",                         // ข้อความ
            html: "<b>คำนัดหมายของท่านคือหมายเลข "+row2[0].job_id+" ได้นัดหมายเรียบร้อยแล้ว ทะเบียนรถ "+row2[0].car_license+" <br>มีรายการดังนี้:<ol>"+e+"</ol> <br>หากมีข้อสงสัยให้ติดต่อกลับที่ โทรศัพท์ 0-12-345678 </b><br>ASAP Call Center",                
        // ข้อความ
        }, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info.messageId);
            }
        });
    });
    
    res.status(200).json({
        message: 'insert job success ',
        result: 'true'
    });
    return "run9"
}*/
/*
async function checkrun(req){
    let check11 = await check1(req);
    let check22 = await check2(req);
    let check33 = await check3(req);
    let check44 = await check4(req);
    let check55 = await check5(req);
    let run66 = await run6(req);
    let run77 = await run7(req);
    let run88 = await run8(req);
    let run99 = await run9(req);

    console.log(check11);
    console.log(check22);
    console.log(check33);
    console.log(check44);
    console.log(check55);
    console.log(run66);
    console.log(run77);
    console.log(run88);
    console.log(run99);
}



checkrun(req);
*/

    
check1(req);

    
    
   


  

    

}

exports.confirmJob=(req,res,next)=> { 
 

    JobModel.updatejobid_complete({customer_code:req.user.customer_code}).then(([row999]) => {

        JobModel.updatejobid_complete2().then(([row888]) => {
                     //async await for https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of

                    // update car info & service point info เพื่อทำ report ง่ายขึ้น
                    JobModel.findcarlistnocarinfoinjobtable({customer_code:req.user.customer_code}).then(([row]) => {
                         
                        console.log(row); 


                        (async function() {
                        /* for await (let num of asyncIterable) {
                            console.log(num);
                            }
                        */

                        for await (rowdata of row){ // ต้องทำ await for ด้วย ไม่งั้น query update กระโดดไปมา เบื่อมาก
               
                            
                        // Update carinfo
                        JobModel.updatecardatainjobtable({final_job_id:rowdata.final_job_id,car_license:rowdata.car_license,car_brand:rowdata.car_brand,car_series:rowdata.car_series,car_model:rowdata.car_model,car_engine_no:rowdata.car_engine_no,car_customer_type:rowdata.car_customer_type,business_name:rowdata.business_name,contract_startdate:rowdata.contract_startdate,contract_enddate:rowdata.contract_enddate,customer_name:rowdata.customer_firstname+' '+rowdata.customer_lastname,customer_email:rowdata.customer_email,customer_telephone:rowdata.customer_telephone}).then(([row22]) => {     
                        


                        });
                
                    
                // Update servicepoint info
                EmployeeModel.updateservicepointdatainjobtable({final_job_id:rowdata.final_job_id,service_point_name:rowdata.service_point_name,branch_name:rowdata.branch_name,full_address:rowdata.full_address,amphor_name_th:rowdata.amphor_name_th,province_name_th:rowdata.province_name_th,post_code:rowdata.post_code,telephone:rowdata.telephone,mobiletel:rowdata.mobiletel,lattitude:rowdata.lattitude,longtitude:rowdata.longtitude,service_group:rowdata.service_group}).then(([row33]) => {console.log("c"); });

                

                        }
                    })();

                    });


        }); // บวก เลขหลัก job id ให้สูงขึ้น
     

                    JobModel.getjobid_complete({customer_code:req.user.customer_code}).then(([row2]) => {
                        //console.log(row2)
                        //carlicense=row2[0].car_license;

                        JobModel.getcarlicense_incartable({vin:row2[0].job_car_vin_id}).then(([row23]) => {
                                console.log(row23);
                                    transporter.sendMail({
                                        from: 'ASAP_CallCenter <'+process.env.GMAILUSER+'>',   // ผู้ส่ง
                                        to: ""+row2[0].customer_firstname+" "+row2[0].customer_lastname+" <"+row2[0].customer_email+">",// ผู้รับ
                                        subject: "ASAP Call Center : Job "+row2[0].job_id+"",                      // หัวข้อ
                                        text: "Hello,",                         // ข้อความ
                                        html: "<b>คำนัดหมายของท่านคือหมายเลข "+row2[0].job_id+" ได้นัดหมายเรียบร้อยแล้ว ทะเบียนรถ "+row23[0].car_license+" <br>มีรายการดังนี้:<ol>"+e+"</ol> <br>หากมีข้อสงสัยให้ติดต่อกลับที่ โทรศัพท์ 0-12-345678 </b><br>ASAP Call Center",                
                                    // ข้อความ
                                    }, (err, info) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(info.messageId);
                                        }
                                    });

                                res.status(200).json({
                                    message: 'confirm job success ',
                                    jobid: row2[0].job_id,
                                    result: 'true'
                                });
                });
            });

    }); 


}
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

