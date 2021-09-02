const db = require('../db/db')

class CustomersModel {
  

    static getAllCustomers(){
        return db.execute('SELECT * FROM asapcc_customer_db');
    }

    static findCustomerByCustCode ({cust_code=''}) {
       
        return db.execute('SELECT * FROM asapcc_customer_db WHERE customer_code = ?',[cust_code])
        
    }

    static insertNewHandShake ({customer_code='',customer_firstname='',customer_lastname='',customer_telephone='',customer_auth_token='',customer_address1='',customer_address2='',cust_username='',cust_email='',customer_birthday='',provinceId='',zipCode=''}) {
      
        return db.execute('INSERT INTO `asapcc_customer_db` (`auto_id`, `customer_code`, `customer_firstname`, `customer_lastname`, `customer_telephone`, `customer_business_name`, `customer_type`, `customer_auth_token`, `customerpicture`, `customer_address1`, `customer_address2`, `customer_username`, `customer_email`, `customer_birthday`, `provinceId`, `zipCode`) VALUES (NULL, ?, ?, ?, ?, NULL, NULL, ?, NULL, ?, ?, ?,?,?,?,?)',[customer_code,customer_firstname,customer_lastname,customer_telephone,customer_auth_token,customer_address1,customer_address2,cust_username,cust_email,customer_birthday,provinceId,zipCode])



    }

    static checkCountJob({customer_code=''}){
        return db.execute('select IFNULL((SELECT IF(COUNT(job_appoint_confirm_datetime)>0,"yes","no") FROM asapcc_job_main WHERE job_customer_id=? LIMIT 1),"no") as checka',[customer_code])
    }

    static syncCustomerProfile ({customer_code='',customer_firstname='',customer_lastname='',customer_telephone='',customer_auth_token='',customer_address1='',customer_address2='',cust_username='',cust_email='',customer_birthday='',provinceId='',zipCode=''}) {
      
        return db.execute('UPDATE asapcc_customer_db SET customer_firstname=?, customer_lastname=?, customer_telephone=?, customer_auth_token=?, customer_address1=?, customer_address2=?, customer_username=?, customer_email=?, customer_birthday=?, provinceId=?, zipCode=? WHERE customer_code=?',[customer_firstname,customer_lastname,customer_telephone,customer_auth_token,customer_address1,customer_address2,cust_username,cust_email,customer_birthday,provinceId,zipCode,customer_code])
    }

    static editCustomerProfile({cust_code='',firstname,lastname,telephone,email}){
        
        return db.execute('UPDATE asapcc_customer_db SET customer_firstname="'+firstname+'",customer_lastname="'+lastname+'",customer_telephone="'+telephone+'",customer_email="'+email+'",customer_username=CONCAT("'+firstname+'"," ","'+lastname+'") WHERE customer_code="'+cust_code+'"')
    }
    
}

module.exports = CustomersModel;