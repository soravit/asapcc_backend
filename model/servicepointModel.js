const db = require('../db/db')

class ServicePoint {
    /*constructor({auto_id=0}) {
        this.auto_id=auto_id;
     
    }*/

    /*static findCarsByCustomerCode({cust_code=''}){
        return db.execute('SELECT * FROM asapcc_car_db WHERE customer_code = ?',[cust_code]);
    }*/

    static getAllServicePoint(){
        return db.execute('SELECT * FROM asapcc_service_point');
    }

    static findServicePointByName({name=''}){
        return db.execute('SELECT * FROM asapcc_service_point WHERE service_point_name LIKE "%'+name+'%"');
    }

    static findServicePointByCode({code=''}){
    console.log('SELECT * FROM asapcc_service_point WHERE service_code="'+code+'"');
        return db.execute('SELECT * FROM asapcc_service_point WHERE service_code="'+code+'"');
    
    }

    static findServicePointByLocation({province='',amphor=''}){
        if(amphor==''){
            return db.execute('SELECT * FROM asapcc_service_point WHERE province_name_th LIKE "'+province+'"');
        } else {
            return db.execute('SELECT * FROM asapcc_service_point WHERE province_name_th LIKE "'+province+'" AND amphor_name_th LIKE "'+amphor+'"');
        }
       
    }

    static getProvinceList(){
        return db.execute('SELECT * FROM asapcc_constant_province ORDER BY province_name_th');
    }

    static getAmphor({province=''}){
        return db.execute('SELECT * FROM asapcc_constant_amphor WHERE province_name_th LIKE "'+province+'" ORDER BY amphor_name_th')
    }

     
    
/*test*/
    /*registerUser() {
        return db.execute('INSERT INTO USER (email, password, createAt, updateAt) VALUES(?, ?, ?, ?)',
        [this.email, this.password, this.createAt, this.updateAt])
    }
    static findUserByEmail ({email=''}) {
        return db.execute('SELECT * FROM USER WHERE user.email = ?',[email])
    }*/

}

module.exports = ServicePoint;