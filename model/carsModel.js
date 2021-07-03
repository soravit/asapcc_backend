const db = require('../db/db')

class CarsModel {
    /*constructor({auto_id=0}) {
        this.auto_id=auto_id;
     
    }*/

    /*static findCarsByCustomerCode({cust_code=''}){
        return db.execute('SELECT * FROM asapcc_car_db WHERE customer_code = ?',[cust_code]);
    }*/

    static getAllCars(){
        return db.execute('SELECT * FROM asapcc_car_db');
    }


    static getMyCars({customer_code=''}){
        return db.execute('SELECT cm.car_vin_id,cm.customer_code,car.car_license,car.car_brand,car.car_series,car.car_model,car.car_engine_no,car.car_customer_type,car.business_name,car.contract_startdate,car.contract_enddate,(SELECT MAX(job_appoint_confirm_datetime) FROM asapcc_job_main WHERE job_car_vin_id=cm.car_vin_id LIMIT 1) as last_service_date,IF(DATE_FORMAT(NOW(), "%Y-%m-%d") > car.contract_enddate,"yes","no") as isexpirecontract,car.carpicture FROM asapcc_car_mapping_customer cm INNER JOIN asapcc_car_db car ON cm.car_vin_id=car.car_vin WHERE cm.customer_code=?',[customer_code]);
    }


    static findCarByLicense({carlicense=''}){
      
        return db.execute('SELECT * FROM asapcc_car_db WHERE car_license LIKE "%'+carlicense+'%" AND contract_enddate > DATE_FORMAT(NOW(), "%Y-%m-%d")');
    }

    static findCarMappingByVinId({car_vin_id='',customer_code='',checkvaliddate=''}){
        if(checkvaliddate=='false'){
             
            return db.execute('SELECT * FROM asapcc_car_mapping_customer m INNER JOIN asapcc_car_db cardb ON m.car_vin_id=cardb.car_vin WHERE m.car_vin_id ="'+car_vin_id+'" AND m.customer_code ="'+customer_code+'"');
        } else if(checkvaliddate=='true'){
            return db.execute('SELECT * FROM asapcc_car_mapping_customer m INNER JOIN asapcc_car_db cardb ON m.car_vin_id=cardb.car_vin WHERE m.car_vin_id ="'+car_vin_id+'" AND m.customer_code ="'+customer_code+'" AND cardb.contract_enddate < DATE_FORMAT(NOW(), "%Y-%m-%d")');
        }
    }

    static insertCarMappingByVinId({car_vin_id='',customer_code=''}){
     
            return db.execute('INSERT INTO `asapcc_car_mapping_customer` (`auto_id`, `car_vin_id`, `customer_code`) VALUES (NULL, ?, ?)',[car_vin_id,customer_code]);
     
    }

    static updateBusinesssNameInCustomerTable({car_vin_id='',customer_code=''}){
     
        return db.execute('UPDATE asapcc_customer_db SET customer_type=(SELECT c.car_customer_type FROM asapcc_car_db c WHERE c.car_vin=? LIMIT 1),customer_business_name=(SELECT c.business_name FROM asapcc_car_db c WHERE c.car_vin=? LIMIT 1) WHERE customer_code=?',[car_vin_id,car_vin_id,customer_code]);
 
}
    
    static removeCarMappingByVinId({car_vin_id='',customer_code=''}){
     
        return db.execute('DELETE FROM `asapcc_car_mapping_customer` WHERE `car_vin_id`=? AND `customer_code`=?',[car_vin_id,customer_code]);
 
}   

    /*registerUser() {
        return db.execute('INSERT INTO USER (email, password, createAt, updateAt) VALUES(?, ?, ?, ?)',
        [this.email, this.password, this.createAt, this.updateAt])
    }
    static findUserByEmail ({email=''}) {
        return db.execute('SELECT * FROM USER WHERE user.email = ?',[email])
    }*/

}

module.exports = CarsModel;