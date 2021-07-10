const db = require('../db/db')

class JobModel {

    static getLastServicePoint(){
        return db.execute('SELECT sp.service_point_name FROM asapcc_job_main job inner join asapcc_service_point sp on job.job_service_point_code_confirm=sp.service_code WHERE job.job_customer_id="69074" order by job.job_appoint_confirm_datetime desc limit 3');
    }

    static insertJobs({job_orderss='',job_customer_id='',job_car_vin_id='',job_service_point_code='',job_appoint_datetime='',servicetask1='',servicetask2='',servicenote='',custcare1='',custcare2='',custcare3='',custcarenote='',car_odo_mile='',usertasknote=''}){
 
        return db.execute('INSERT INTO `asapcc_job_main` (`auto_id`, `job_id`, `job_order`, `final_job_id`, `job_customer_id`, `job_car_vin_id`, `job_service_point_code`, `job_service_point_code_confirm`, `job_appoint_datetime`, `job_appoint_confirm_datetime`, `job_note`, `job_photo_gallery_id`, `job_create_ticket_by_emp_id`, `job_create_ticket_datetime`, `job_summary_ticket_by_emp_id`, `job_summary_ticket_datetime`, `job_closed_ticket_by_emp_id`, `job_closed_ticket_datetime`, `job_callcenter_note`, `job_add_datetime`, `servicetask1`, `servicetask2`, `servicenote`, `custcare1`, `custcare2`, `custcare3`, `custcarenote`, `car_odo_mile`, `photos`, `is_cancel`,`usertasknote`) VALUES (NULL, NULL, "'+job_orderss+'", NULL, "'+job_customer_id+'", "'+job_car_vin_id+'", "'+job_service_point_code+'", NULL, "'+job_appoint_datetime+'", NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, current_timestamp(), "'+servicetask1+'", "'+servicetask2+'", "'+servicenote+'", "'+custcare1+'", "'+custcare2+'", "'+custcare3+'", "'+custcarenote+'", "'+car_odo_mile+'", NULL, NULL,"'+usertasknote+'");');

       

    }
 
 
 
    
 
static updatejobid_complete({customer_code=''}){

    return db.execute('UPDATE `asapcc_job_main` SET `job_id` = (select current_job_no+1 from asapcc_constant_jobno where auto_id=1),final_job_id=CONCAT((select current_job_no+1 from asapcc_constant_jobno where auto_id=1),"/",job_order) WHERE auto_id IN (select auto_id from asapcc_job_main where (job_id is NULL or job_id="") and job_customer_id=? order by job_order asc);',[customer_code])
    
    // frontend ส่ง job order มาก่อน แล้วเว้นว่าง job id ไว้ ให้ระบบรันต่อในหน้า confirm และส่ง mail

}


static getjobid_complete({customer_code=''}){

    return db.execute('SELECT final_job_id FROM `asapcc_job_main` WHERE job_customer_id=? order by job_order desc LIMIT 1',[customer_code])
    
    // frontend ส่ง job order มาก่อน แล้วเว้นว่าง job id ไว้ ให้ระบบรันต่อในหน้า confirm และส่ง mail

}


static updatejobid_complete2(){

 return db.execute('UPDATE asapcc_constant_jobno SET current_job_no=current_job_no+1 WHERE auto_id=1;')
}


 
}

module.exports = JobModel;