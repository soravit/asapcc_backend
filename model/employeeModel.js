const db = require('../db/db')

class EmployeeModel {
  
    static findEmpByCode ({emp_code=''}) {
       
        return db.execute('SELECT * FROM asapcc_employee_db WHERE employee_code = ?',[emp_code])
        
    }

    static findJobByCustTypeAlldate({cust_type='',startdate='',enddate=''}){
        return db.execute('SELECT j.`auto_id`, j.`job_id`, j.`job_order`, j.`final_job_id`, j.`job_customer_id`, j.`job_car_vin_id`, j.`job_service_point_code`, j.`job_service_point_code_confirm`, j.`job_appoint_datetime`, j.`job_appoint_confirm_datetime`, j.`job_note`, j.`job_photo_gallery_id`, j.`job_create_ticket_by_emp_id`, j.`job_create_ticket_datetime`, j.`job_summary_ticket_by_emp_id`, j.`job_summary_ticket_datetime`, j.`job_closed_ticket_by_emp_id`, j.`job_closed_ticket_datetime`, j.`job_callcenter_note`, j.`job_add_datetime`, j.`servicetask1`, j.`servicetask2`, j.`servicenote`, j.`custcare1`, j.`custcare2`, j.`custcare3`, j.`custcarenote`, j.`car_odo_mile`, j.`photos`, j.`is_cancel`, j.`job_status`,c.customer_code,c.customer_type,getempfullname(j.job_create_ticket_by_emp_id) as createticketby,getempfullname(j.job_summary_ticket_by_emp_id) as summaryby,getempfullname(j.job_closed_ticket_by_emp_id) as closeby,c.customer_firstname,c.customer_lastname,c.customer_code,c.customer_telephone,c.customer_business_name,c.customer_email,car.car_license,car.car_brand,car.car_series,car.car_model,car.car_vin,car.car_engine_no,car.contract_startdate,car.contract_enddate,getservicepointname(j.job_service_point_code) as service_point_name,getservicepointname(j.job_service_point_code_confirm) as confirm_service_point_name,getservicepointtel(j.job_service_point_code) as service_point_tel,getservicepointtel(j.job_service_point_code_confirm) as confirm_service_point_tel,j.usertasknote as usertasknote FROM asapcc_job_main j LEFT JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code LEFT JOIN asapcc_car_db car ON j.job_car_vin_id=car.car_vin WHERE c.customer_type = ? AND (DATE(job_add_datetime) BETWEEN ? AND ?)  ORDER BY j.job_add_datetime DESC ',[cust_type,startdate,enddate]) // new first
    }

    static findJobByCustTypeAlldate2({startdate='',enddate=''}){
        return db.execute('SELECT j.`auto_id`, j.`job_id`, j.`job_order`, j.`final_job_id`, j.`job_customer_id`, j.`job_car_vin_id`, j.`job_service_point_code`, j.`job_service_point_code_confirm`, j.`job_appoint_datetime`, j.`job_appoint_confirm_datetime`, j.`job_note`, j.`job_photo_gallery_id`, j.`job_create_ticket_by_emp_id`, j.`job_create_ticket_datetime`, j.`job_summary_ticket_by_emp_id`, j.`job_summary_ticket_datetime`, j.`job_closed_ticket_by_emp_id`, j.`job_closed_ticket_datetime`, j.`job_callcenter_note`, j.`job_add_datetime`, j.`servicetask1`, j.`servicetask2`, j.`servicenote`, j.`custcare1`, j.`custcare2`, j.`custcare3`, j.`custcarenote`, j.`car_odo_mile`, j.`photos`, j.`is_cancel`, j.`job_status`,c.customer_code,c.customer_type,getempfullname(j.job_create_ticket_by_emp_id) as createticketby,getempfullname(j.job_summary_ticket_by_emp_id) as summaryby,getempfullname(j.job_closed_ticket_by_emp_id) as closeby,c.customer_firstname,c.customer_lastname,c.customer_code,c.customer_telephone,c.customer_business_name,c.customer_email,car.car_license,car.car_brand,car.car_series,car.car_model,car.car_vin,car.car_engine_no,car.contract_startdate,car.contract_enddate,getservicepointname(j.job_service_point_code) as service_point_name,getservicepointname(j.job_service_point_code_confirm) as confirm_service_point_name,getservicepointtel(j.job_service_point_code) as service_point_tel,getservicepointtel(j.job_service_point_code_confirm) as confirm_service_point_tel,j.usertasknote as usertasknote FROM asapcc_job_main j LEFT JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code LEFT JOIN asapcc_car_db car ON j.job_car_vin_id=car.car_vin WHERE (DATE(job_add_datetime) BETWEEN ? AND ?)  ORDER BY j.job_add_datetime DESC ',[startdate,enddate]) // new first
    }

    static findJobByCustTypeAlldateOrderJobNo({cust_type='',startdate='',enddate=''}){
        return db.execute('SELECT j.`auto_id`, j.`job_id`, j.`job_order`, j.`final_job_id`, j.`job_customer_id`, j.`job_car_vin_id`, j.`job_service_point_code`, j.`job_service_point_code_confirm`, j.`job_appoint_datetime`, j.`job_appoint_confirm_datetime`, j.`job_note`, j.`job_photo_gallery_id`, j.`job_create_ticket_by_emp_id`, j.`job_create_ticket_datetime`, j.`job_summary_ticket_by_emp_id`, j.`job_summary_ticket_datetime`, j.`job_closed_ticket_by_emp_id`, j.`job_closed_ticket_datetime`, j.`job_callcenter_note`, j.`job_add_datetime`, j.`servicetask1`, j.`servicetask2`, j.`servicenote`, j.`custcare1`, j.`custcare2`, j.`custcare3`, j.`custcarenote`, j.`car_odo_mile`, j.`photos`, j.`is_cancel`, j.`job_status`,c.customer_code,c.customer_type,getempfullname(j.job_create_ticket_by_emp_id) as createticketby,getempfullname(j.job_summary_ticket_by_emp_id) as summaryby,getempfullname(j.job_closed_ticket_by_emp_id) as closeby,c.customer_firstname,c.customer_lastname,c.customer_code,c.customer_telephone,c.customer_business_name,c.customer_email,car.car_license,car.car_brand,car.car_series,car.car_model,car.car_vin,car.car_engine_no,car.contract_startdate,car.contract_enddate,getservicepointname(j.job_service_point_code) as service_point_name,getservicepointname(j.job_service_point_code_confirm) as confirm_service_point_name,getservicepointtel(j.job_service_point_code) as service_point_tel,getservicepointtel(j.job_service_point_code_confirm) as confirm_service_point_tel,j.usertasknote as usertasknote FROM asapcc_job_main j LEFT JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code LEFT JOIN asapcc_car_db car ON j.job_car_vin_id=car.car_vin WHERE c.customer_type = ? AND (DATE(job_add_datetime) BETWEEN ? AND ?) ORDER BY j.final_job_id DESC',[cust_type,startdate,enddate]) // new first

    }
    static getstatJob({cust_type='',startdate='',enddate=''}){

        return db.execute('SELECT (SELECT COUNT(*) FROM asapcc_job_main j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code WHERE j.job_status="new" AND (DATE(j.job_add_datetime) BETWEEN "'+startdate+'" AND "'+enddate+'") AND c.customer_type="'+cust_type+'") AS NEWJOB,(SELECT COUNT(*) FROM asapcc_job_main j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code WHERE j.job_status="onprocess" AND (DATE(j.job_add_datetime) BETWEEN "'+startdate+'" AND "'+enddate+'") AND c.customer_type="'+cust_type+'") AS ONPROCESS,(SELECT COUNT(*) FROM asapcc_job_main j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code WHERE j.job_status="finished" AND (DATE(j.job_add_datetime) BETWEEN "'+startdate+'" AND "'+enddate+'") AND c.customer_type="'+cust_type+'") AS FINISHED')
    }

    static getstatJob2({startdate='',enddate=''}){

        return db.execute('SELECT (SELECT COUNT(*) FROM asapcc_job_main j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code WHERE j.job_status="new" AND (DATE(j.job_add_datetime) BETWEEN "'+startdate+'" AND "'+enddate+'") ) AS NEWJOB,(SELECT COUNT(*) FROM asapcc_job_main j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code WHERE j.job_status="onprocess" AND (DATE(j.job_add_datetime) BETWEEN "'+startdate+'" AND "'+enddate+'") ) AS ONPROCESS,(SELECT COUNT(*) FROM asapcc_job_main j INNER JOIN asapcc_customer_db c ON j.job_customer_id=c.customer_code WHERE j.job_status="finished" AND (DATE(j.job_add_datetime) BETWEEN "'+startdate+'" AND "'+enddate+'") ) AS FINISHED')
    }

    static updateJobTicketCreate({final_job_id='',emp_code='',empname=''}){
        return db.execute('UPDATE asapcc_job_main SET job_create_ticket_by_emp_id = ?, job_create_ticket_datetime = NOW(), job_status="onprocess",job_create_ticket_by_emp_name=? WHERE final_job_id = ?',[emp_code,empname,final_job_id])
    }

    static updateJobSummary({final_job_id='',emp_code='',empname=''}){
        return db.execute('UPDATE asapcc_job_main SET job_summary_ticket_by_emp_id = ?, job_summary_ticket_datetime = NOW(), job_status="onprocess",job_summary_ticket_by_emp_name=? WHERE final_job_id = ?',[emp_code,empname,final_job_id])
    }


    static updateJobClose({final_job_id='',emp_code='',empname=''}){
        return db.execute('UPDATE asapcc_job_main SET job_closed_ticket_by_emp_id = ?, job_closed_ticket_datetime = NOW(), job_status="finished",job_closed_ticket_by_emp_name=? WHERE final_job_id = ?',[emp_code,empname,final_job_id])
    }

    static updateJob({job_note='',job_service_point_code_confirm='',job_appoint_confirm_datetime='',servicetask1='',servicetask2='',servicenote='',custcare1='',custcare2='',custcare3='',custcarenote='',car_odo_mile='',job_callcenter_note='',job_status='',final_job_id=''}){
        return db.execute('UPDATE asapcc_job_main SET job_note = ?, job_service_point_code_confirm = ?, job_appoint_confirm_datetime = ?, servicetask1 = ?, servicetask2 = ?, servicenote = ?, custcare1 = ?, custcare2 = ?, custcare3 = ?, custcarenote = ?, car_odo_mile = ?,job_callcenter_note=?,job_status=? WHERE final_job_id = ?',[job_note,job_service_point_code_confirm,job_appoint_confirm_datetime,servicetask1,servicetask2,servicenote,custcare1,custcare2,custcare3,custcarenote,car_odo_mile,job_callcenter_note,job_status,final_job_id])
    }



    static findcustgroup(){
        return db.execute('SELECT DISTINCT(car_customer_type) FROM asapcc_job_main WHERE car_customer_type IS NOT NULL') 
    }

    static findstatusjoblist(){
        return db.execute('SELECT DISTINCT(job_status) FROM asapcc_job_main WHERE job_status IS NOT NULL') 
    }
    static findservicegroup(){
        return db.execute('SELECT DISTINCT(service_group) FROM asapcc_job_main WHERE service_group IS NOT NULL') 
    }
    static findemployeelist(){
        return db.execute('SELECT DISTINCT(employee_fullname) FROM asapcc_employee_db WHERE employee_fullname IS NOT NULL') 
    }

    static clearcartable(){
        return db.execute('TRUNCATE asapcc_car_db') 
    }

    static clearservicepointable(){
        return db.execute('TRUNCATE asapcc_service_point') 
    }

    static insertcarimport({car_license='',car_brand='',car_series='',car_model='',car_vin='',car_engine_no='',car_customer_type='',business_name='',contract_startdate='',contract_enddate=''}){
        return db.execute("INSERT INTO `asapcc_car_db` (`auto_id`, `car_license`, `car_brand`, `car_series`, `car_model`, `car_vin`, `car_engine_no`, `car_customer_type`, `business_name`, `contract_startdate`, `contract_enddate`, `carpicture`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)",[car_license,car_brand,car_series,car_model,car_vin,car_engine_no,car_customer_type,business_name,contract_startdate,contract_enddate]);
    }

    static insertservicepointimport({service_code='',service_point_name='',branch_name='',full_address='',amphor_name_th='',province_name_th='',post_code='',telephone='',mobiletel='',lattitude='',longtitude='',service_group=''}){
        return db.execute("INSERT INTO `asapcc_service_point` (`auto_id`, `service_code`, `service_point_name`, `branch_name`, `full_address`, `amphor_name_th`, `province_name_th`, `post_code`, `telephone`, `mobiletel`, `lattitude`, `longtitude`, `branchpicture`, `service_group`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL,?)",[service_code,service_point_name,branch_name,full_address,amphor_name_th,province_name_th,post_code,telephone,mobiletel,lattitude,longtitude,service_group]);
    }

    static findservicepointcodeinjobtable({final_job_id=''}){
        return db.execute("SELECT job_service_point_code_confirm FROM asapcc_job_main WHERE final_job_id='"+final_job_id+"'")
    }

    static findservicepointcodeinjobtable_beforeconfirm({final_job_id=''}){
       
        return db.execute("SELECT * FROM asapcc_job_main WHERE final_job_id='"+final_job_id+"'")
    }

    static updateservicepointdatainjobtable({final_job_id='',service_point_name='',branch_name='',full_address='',amphor_name_th='',province_name_th='',post_code='',telephone='',mobiletel='',lattitude='',longtitude='',service_group=''}){
        return db.execute("UPDATE `asapcc_job_main` SET `service_point_name` = ?, `branch_name` = ?, `full_address` = ?, `amphor_name_th` = ?, `province_name_th` = ?, `post_code` = ?, `telephone` = ?, `mobiletel` = ?, `lattitude` = ?, `longtitude` = ?, `service_group` = ? WHERE `asapcc_job_main`.`final_job_id` = ?",[service_point_name,branch_name,full_address,amphor_name_th,province_name_th,post_code,telephone,mobiletel,lattitude,longtitude,service_group,final_job_id])
    }


    static getJobSingleRow({final_job_id=''}){
        return db.execute("SELECT * FROM asapcc_job_main WHERE final_job_id='"+final_job_id+"' LIMIT 1")
    }

    ///// Search job new
    static searchjob_all({order='',daterange=''}){
        console.log('SELECT * FROM asapcc_job_main '+daterange+' '+order+'')
        return db.execute('SELECT * FROM asapcc_job_main '+daterange+' '+order+'')
    }

    static searchjob_filter({othersearch='',order='',daterange=''}){
        console.log('SELECT * FROM asapcc_job_main WHERE '+othersearch+' '+daterange+' '+order+'')
        return db.execute('SELECT * FROM asapcc_job_main WHERE '+othersearch+' '+daterange+' '+order+'')
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