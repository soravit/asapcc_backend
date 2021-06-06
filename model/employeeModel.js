const db = require('../db/db')

class EmployeeModel {
  
    static findEmpByCode ({emp_code=''}) {
       
        return db.execute('SELECT * FROM asapcc_employee_db WHERE employee_code = ?',[emp_code])
        
    }

    static findJobByCustTypeAlldate({cust_type='',startdate='',enddate=''}){
        return db.execute('SELECT j.`auto_id`, j.`job_id`, j.`job_order`, j.`final_job_id`, j.`job_customer_id`, j.`job_car_vin_id`, j.`job_service_point_code`, j.`job_service_point_code_confirm`, j.`job_appoint_datetime`, j.`job_appoint_confirm_datetime`, j.`job_note`, j.`job_photo_gallery_id`, j.`job_create_ticket_by_emp_id`, j.`job_create_ticket_datetime`, j.`job_summary_ticket_by_emp_id`, j.`job_summary_ticket_datetime`, j.`job_closed_ticket_by_emp_id`, j.`job_closed_ticket_datetime`, j.`job_callcenter_note`, j.`job_add_datetime`, j.`servicetask1`, j.`servicetask2`, j.`servicenote`, j.`custcare1`, j.`custcare2`, j.`custcare3`, j.`custcarenote`, j.`car_odo_mile`, j.`photos`, j.`is_cancel`, j.`job_status`,c.customer_code,c.customer_type,getempfullname(j.job_create_ticket_by_emp_id) as createticketby,getempfullname(j.job_summary_ticket_by_emp_id) as summaryby,getempfullname(j.job_closed_ticket_by_emp_id) as closeby,c.customer_firstname,c.customer_lastname,c.customer_code,c.customer_telephone,c.customer_business_name,c.customer_email,car.car_license,car.car_brand,car.car_series,car.car_model,car.car_vin,car.car_engine_no,car.contract_startdate,car.contract_enddate,getservicepointname(j.job_service_point_code) as service_point_name,getservicepointname(j.job_service_point_code_confirm) as confirm_service_point_name,getservicepointtel(j.job_service_point_code) as service_point_tel,getservicepointtel(j.job_service_point_code_confirm) as confirm_service_point_tel FROM asapcc_job_main j LEFT JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code LEFT JOIN asapcc_car_db car ON j.job_car_vin_id=car.car_vin WHERE c.customer_type = ? AND (DATE(job_add_datetime) BETWEEN ? AND ?)  ORDER BY j.job_add_datetime DESC ',[cust_type,startdate,enddate]) // new first
    }

    static findJobByCustTypeAlldateOrderJobNo({cust_type='',startdate='',enddate=''}){
        return db.execute('SELECT j.`auto_id`, j.`job_id`, j.`job_order`, j.`final_job_id`, j.`job_customer_id`, j.`job_car_vin_id`, j.`job_service_point_code`, j.`job_service_point_code_confirm`, j.`job_appoint_datetime`, j.`job_appoint_confirm_datetime`, j.`job_note`, j.`job_photo_gallery_id`, j.`job_create_ticket_by_emp_id`, j.`job_create_ticket_datetime`, j.`job_summary_ticket_by_emp_id`, j.`job_summary_ticket_datetime`, j.`job_closed_ticket_by_emp_id`, j.`job_closed_ticket_datetime`, j.`job_callcenter_note`, j.`job_add_datetime`, j.`servicetask1`, j.`servicetask2`, j.`servicenote`, j.`custcare1`, j.`custcare2`, j.`custcare3`, j.`custcarenote`, j.`car_odo_mile`, j.`photos`, j.`is_cancel`, j.`job_status`,c.customer_code,c.customer_type,getempfullname(j.job_create_ticket_by_emp_id) as createticketby,getempfullname(j.job_summary_ticket_by_emp_id) as summaryby,getempfullname(j.job_closed_ticket_by_emp_id) as closeby,c.customer_firstname,c.customer_lastname,c.customer_code,c.customer_telephone,c.customer_business_name,c.customer_email,car.car_license,car.car_brand,car.car_series,car.car_model,car.car_vin,car.car_engine_no,car.contract_startdate,car.contract_enddate,getservicepointname(j.job_service_point_code) as service_point_name,getservicepointname(j.job_service_point_code_confirm) as confirm_service_point_name,getservicepointtel(j.job_service_point_code) as service_point_tel,getservicepointtel(j.job_service_point_code_confirm) as confirm_service_point_tel FROM asapcc_job_main j LEFT JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code LEFT JOIN asapcc_car_db car ON j.job_car_vin_id=car.car_vin WHERE c.customer_type = ? AND (DATE(job_add_datetime) BETWEEN ? AND ?) ORDER BY j.final_job_id DESC',[cust_type,startdate,enddate]) // new first

    }
    static getstatJob({cust_type='',startdate='',enddate=''}){

        return db.execute('SELECT (SELECT COUNT(*) FROM asapcc_job_main j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code WHERE j.job_status="new" AND (DATE(j.job_add_datetime) BETWEEN "'+startdate+'" AND "'+enddate+'") AND c.customer_type="'+cust_type+'") AS NEWJOB,(SELECT COUNT(*) FROM asapcc_job_main j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code WHERE j.job_status="onprocess" AND (DATE(j.job_add_datetime) BETWEEN "'+startdate+'" AND "'+enddate+'") AND c.customer_type="'+cust_type+'") AS ONPROCESS,(SELECT COUNT(*) FROM asapcc_job_main j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code WHERE j.job_status="finished" AND (DATE(j.job_add_datetime) BETWEEN "'+startdate+'" AND "'+enddate+'") AND c.customer_type="'+cust_type+'") AS FINISHED')
    }

    static updateJobTicketCreate({final_job_id='',emp_code=''}){
        return db.execute('UPDATE asapcc_job_main SET job_create_ticket_by_emp_id = ?, job_create_ticket_datetime = NOW(), job_status="onprocess" WHERE final_job_id = ?',[emp_code,final_job_id])
    }

    static updateJobSummary({final_job_id='',emp_code=''}){
        return db.execute('UPDATE asapcc_job_main SET job_summary_ticket_by_emp_id = ?, job_summary_ticket_datetime = NOW(), job_status="onprocess" WHERE final_job_id = ?',[emp_code,final_job_id])
    }


    static updateJobClose({final_job_id='',emp_code=''}){
        return db.execute('UPDATE asapcc_job_main SET job_closed_ticket_by_emp_id = ?, job_closed_ticket_datetime = NOW(), job_status="finished" WHERE final_job_id = ?',[emp_code,final_job_id])
    }

    static updateJob({job_note='',job_service_point_code_confirm='',job_appoint_confirm_datetime='',servicetask1='',servicetask2='',servicenote='',custcare1='',custcare2='',custcare3='',custcarenote='',car_odo_mile='',final_job_id=''}){
        return db.execute('UPDATE asapcc_job_main SET job_note = ?, job_service_point_code_confirm = ?, job_appoint_confirm_datetime = ?, servicetask1 = ?, servicetask2 = ?, servicenote = ?, custcare1 = ?, custcare2 = ?, custcare3 = ?, custcarenote = ?, car_odo_mile = ? WHERE final_job_id = ?',[job_note,job_service_point_code_confirm,job_appoint_confirm_datetime,servicetask1,servicetask2,servicenote,custcare1,custcare2,custcare3,custcarenote,car_odo_mile,final_job_id])
    }


   /* static getAllCustomers(){
        return db.execute('SELECT * FROM asapcc_customer_db');
    }

   

    static insertNewHandShake ({customer_code='',customer_firstname='',customer_lastname='',customer_telephone='',customer_auth_token='',customer_address1='',customer_address2='',cust_username='',cust_email='',customer_birthday='',provinceId='',zipCode=''}) {
      
        return db.execute('INSERT INTO `asapcc_customer_db` (`auto_id`, `customer_code`, `customer_firstname`, `customer_lastname`, `customer_telephone`, `customer_business_name`, `customer_type`, `customer_auth_token`, `customerpicture`, `customer_address1`, `customer_address2`, `customer_username`, `customer_email`, `customer_birthday`, `provinceId`, `zipCode`) VALUES (NULL, ?, ?, ?, ?, NULL, NULL, ?, NULL, ?, ?, ?,?,?,?,?)',[customer_code,customer_firstname,customer_lastname,customer_telephone,customer_auth_token,customer_address1,customer_address2,cust_username,cust_email,customer_birthday,provinceId,zipCode])



    }

    static syncCustomerProfile ({customer_code='',customer_firstname='',customer_lastname='',customer_telephone='',customer_auth_token='',customer_address1='',customer_address2='',cust_username='',cust_email='',customer_birthday='',provinceId='',zipCode=''}) {
      
        return db.execute('UPDATE asapcc_customer_db SET customer_firstname=?, customer_lastname=?, customer_telephone=?, customer_auth_token=?, customer_address1=?, customer_address2=?, customer_username=?, customer_email=?, customer_birthday=?, provinceId=?, zipCode=? WHERE customer_code=?',[customer_firstname,customer_lastname,customer_telephone,customer_auth_token,customer_address1,customer_address2,cust_username,cust_email,customer_birthday,provinceId,zipCode,customer_code])
    }

    static editCustomerProfile({cust_code='',firstname,lastname,telephone,email}){
        
        return db.execute('UPDATE asapcc_customer_db SET customer_firstname="'+firstname+'",customer_lastname="'+lastname+'",customer_telephone="'+telephone+'",customer_email="'+email+'",customer_username=CONCAT("'+firstname+'"," ","'+lastname+'") WHERE customer_code="'+cust_code+'"')
    }*/
    
}

module.exports = EmployeeModel;