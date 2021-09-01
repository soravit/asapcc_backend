const db = require('../db/db')

class JobModel {

    static getLastServicePoint({customer_code=''}){ 
        console.log(customer_code)
        return db.execute('SELECT DISTINCT(sp.service_point_name),sp.service_code,sp.branch_name,sp.full_address,sp.amphor_name_th,sp.province_name_th,sp.post_code,sp.telephone,sp.mobiletel,sp.lattitude,sp.longtitude,sp.branchpicture FROM asapcc_job_main job inner join asapcc_service_point sp on job.job_service_point_code_confirm=sp.service_code WHERE job.job_customer_id=? order by job.job_appoint_confirm_datetime desc limit 3',[customer_code]);
    }

    static insertJobs({job_orderss='',job_customer_id='',job_car_vin_id='',job_service_point_code='',job_appoint_datetime='',servicetask1='',servicetask2='',servicenote='',custcare1='',custcare2='',custcare3='',custcarenote='',car_odo_mile='',usertasknote=''}){
 
        return db.execute('INSERT INTO `asapcc_job_main` (`auto_id`, `job_id`, `job_order`, `final_job_id`, `job_customer_id`, `job_car_vin_id`, `job_service_point_code`, `job_service_point_code_confirm`, `job_appoint_datetime`, `job_appoint_confirm_datetime`, `job_note`, `job_photo_gallery_id`, `job_create_ticket_by_emp_id`, `job_create_ticket_datetime`, `job_summary_ticket_by_emp_id`, `job_summary_ticket_datetime`, `job_closed_ticket_by_emp_id`, `job_closed_ticket_datetime`, `job_callcenter_note`, `job_add_datetime`, `servicetask1`, `servicetask2`, `servicenote`, `custcare1`, `custcare2`, `custcare3`, `custcarenote`, `car_odo_mile`, `photos`, `is_cancel`,`usertasknote`) VALUES (NULL, NULL, "'+job_orderss+'", NULL, "'+job_customer_id+'", "'+job_car_vin_id+'", "'+job_service_point_code+'", NULL, "'+job_appoint_datetime+'", NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), "'+servicetask1+'", "'+servicetask2+'", "'+servicenote+'", "'+custcare1+'", "'+custcare2+'", "'+custcare3+'", "'+custcarenote+'", "'+car_odo_mile+'", NULL, NULL,"'+usertasknote+'");');

       

    }
 
 
    static findCustomerByJobno ({job_id=''}) {
   
        return db.execute('SELECT * FROM asapcc_job_main WHERE final_job_id="'+job_id+'"')
        
    }

    static findJobSinglerow ({job_id=''}) {
   
        return db.execute('SELECT * FROM asapcc_job_main WHERE final_job_id="'+job_id+'" order by auto_id DESC LIMIT 1')
        
    }
    
 
static updatejobid_complete({customer_code=''}){ // แก้ format job id ด้วย YYMM00001
    

    return db.execute('UPDATE `asapcc_job_main` SET `job_id` = (select LPAD(current_job_no, 5, \'0\') from asapcc_constant_jobno where auto_id=1),final_job_id=CONCAT(Substring(EXTRACT(YEAR FROM NOW()), 3),DATE_FORMAT(NOW(),\'%m\'),(select LPAD(current_job_no, 5, \'0\') from asapcc_constant_jobno where auto_id=1),"/",job_order) WHERE auto_id IN ( select * from (select auto_id from asapcc_job_main where (job_id is NULL or job_id="") and job_customer_id=? order by job_order asc) as tmp_a )',[customer_code])
   
    // frontend ส่ง job order มาก่อน แล้วเว้นว่าง job id ไว้ ให้ระบบรันต่อในหน้า confirm และส่ง mail

}


static getjobid_complete({customer_code=''}){

    return db.execute('SELECT j.car_license,CONCAT(Substring(EXTRACT(YEAR FROM NOW()), 3),DATE_FORMAT(NOW(),\'%m\'),j.job_id) as job_id,j.final_job_id,c.customer_code,c.customer_firstname,c.customer_lastname,c.customer_email,c.customer_telephone FROM `asapcc_job_main` j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code WHERE j.job_customer_id=? order by j.final_job_id desc LIMIT 1',[customer_code])
    
    // frontend ส่ง job order มาก่อน แล้วเว้นว่าง job id ไว้ ให้ระบบรันต่อในหน้า confirm และส่ง mail

}


static getcarlist_confirmed_sendmail({job_id=''}){

    return db.execute('SELECT c.car_license,j.final_job_id FROM `asapcc_job_main` j inner join asapcc_car_db c on j.job_car_vin_id=c.car_vin WHERE j.job_id=? order by j.job_order asc',[job_id])
    
    // frontend ส่ง job order มาก่อน แล้วเว้นว่าง job id ไว้ ให้ระบบรันต่อในหน้า confirm และส่ง mail

}

static getcarlicense_injobtable({job_id=''}){
    return db.execute('SELECT * FROM `asapcc_job_main` WHERE job_id=? LIMIT 1',[job_id])
}

static updatejobid_complete2(){

 return db.execute('UPDATE asapcc_constant_jobno SET current_job_no=current_job_no+1 WHERE auto_id=1;')
}

static updatecardatainjobtable({final_job_id='',car_license='',car_brand='',car_series='',car_model='',car_engine_no='',car_customer_type='',business_name='',contract_startdate='',contract_enddate='',customer_name='',customer_email='',customer_telephone=''}){
 
    return db.execute("UPDATE `asapcc_job_main` SET `car_license` = ?, `car_brand` = ?, `car_series` = ?, `car_model` = ?, `car_engine_no` = ?, `car_customer_type` = ?, `business_name` = ?, `contract_startdate` = ?, `contract_enddate`=?,`customer_name`=?,`customer_email`=?,`customer_telephone` = ? WHERE `asapcc_job_main`.`final_job_id` = ?",[car_license,car_brand,car_series,car_model,car_engine_no,car_customer_type,business_name,contract_startdate,contract_enddate,customer_name,customer_email,customer_telephone,final_job_id])
}

static findcarvininjobtable({final_job_id=''}){
    return db.execute("SELECT job_car_vin_id,final_job_id FROM asapcc_job_main WHERE final_job_id='"+final_job_id+"'")
}

// update
static findcarlistnocarinfoinjobtable({customer_code=''}){
    return db.execute("SELECT j.job_id,j.job_order,j.final_job_id,j.job_customer_id,j.job_car_vin_id,j.job_service_point_code,c.customer_code,c.customer_firstname,c.customer_lastname,c.customer_telephone,c.customer_business_name,c.customer_type,c.customer_email,car.car_license,car.car_brand,car.car_series,car.car_model,car.car_engine_no,car.car_customer_type,car.business_name,car.contract_startdate,car.contract_enddate,s.service_code,s.service_point_name,s.branch_name,s.full_address,s.amphor_name_th,s.province_name_th,s.post_code,s.telephone,s.mobiletel,s.lattitude,s.longtitude,s.service_group FROM asapcc_job_main j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code INNER JOIN asapcc_car_db car on j.job_car_vin_id=car.car_vin INNER JOIN asapcc_service_point s ON j.job_service_point_code=s.service_code WHERE j.job_customer_id='"+customer_code+"' AND (j.car_license='' OR j.car_license IS NULL)")
}
 
}

module.exports = JobModel;