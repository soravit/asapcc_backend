const bcrypt = require('bcrypt');
const axios = require('axios');
const FormData = require('form-data');
const jwt = require('jsonwebtoken') // ใช้ระบบ jwt token
const dotenv = require('dotenv'); // ดึงค่า .env ใช้
// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;
 

const CustomersModel = require('../model/customersModel');

/*
exports.loginController = (req, res, next) => {
    const { cust_code='', auth_token=''} = req.body;
 

    CustomersModel.findCustomerByCustCode({cust_code:'C00001'})
        .then(([row]) => {
        
            if(row.length != 0) {
              
               return compare(auth_token, row[0].customer_auth_token)
               .then((result) => {
                        if(!result) {
                            res.status(401)
                                .json({
                                    message: "Authentication failed 1"
                                })
                        } else {
                            let jwtToken = jwt.sign({
                                cust_code: row[0].customer_code,
                                auto_id: row[0].auto_id
                            }, 
                            "create-authen-nodejs", {
                                expiresIn: "1h"
                            });
                            res.status(200).json({
                                token: jwtToken,
                                expiresIn: 3600,
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
                    message: "Authentication failed 3"
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
*/
exports.CustomerProfile = (req, res, next) => {
    CustomersModel.findCustomerByCustCode({cust_code:req.user.customer_code}).then(([row]) => {
    
        if(row.length !== 0) {
            res.status(200).json({
                profile: row
               });
        } else {
            res.status(401)
            .json({
                message: "notfound" 
            });
        }

    
    })

}
/*{
  "result": true,
  "data": {
    "id": 69074,
    "firstName": "Soravit",
    "lastName": "Yenjit (Dev ASAP CC.)",
    "birthday": "",
    "address1": "",
    "address2": "",
    "provinceId": 1,
    "provinceName": "กรุงเทพมหานคร",
    "zipCode": "",
    "email": "soravit.m@gmail.com",
    "username": "Soravit Yenjit (Dev ASAP CC.)",
    "mobile": "0801234567",
    "approveAsap": "N",
    "hardwareId": "-",
    "imageJsonList": [],
    "memberGroupList": [
      {
        "id": 1,
        "name": "Soravit",
        "type": "G",
        "isActive": "Y"
      }
    ]
  },
  "message": "success"
}*/


exports.CustomerProfileEdit = (req,res,next) => {

  


    CustomersModel.editCustomerProfile({cust_code:req.user.customer_code,firstname:req.body.firstname,lastname:req.body.lastname,telephone:req.body.telephone,email:req.body.email}).then(([row]) => {
        res.status(200).json({
            message: 'update success',
            result: 'true'
        });

        CustomersModel.findCustomerByCustCode({cust_code:req.user.customer_code}).then(([row]) => {
                
                //
                console.log('edit profile '+row[0].customer_firstname+' '+req.body.firstname+' '+row[0].customer_auth_token)
                        // update in api asap duai krub
                    const form_data = new FormData();
                    form_data.append('token',  row[0].customer_auth_token);
                    form_data.append('firstName', req.body.firstname);
                    form_data.append('lastName', req.body.lastname);
                    form_data.append('birthday', row[0].customer_birthday);
                    form_data.append('address1', row[0].customer_address1);
                    form_data.append('provinceId', row[0].provinceId);
                    form_data.append('zipCode', row[0].zipCode);
                    form_data.append('email', req.body.email);
                    form_data.append('username', row[0].customer_username);
                    form_data.append('mobile', req.body.telephone);

                    axios.post("https://asapapi1.wisdominnovatech.com/mobile-api/edit-profile", form_data, { headers: form_data.getHeaders()})
                    .then(response => {

                        if(response.data['result']==false){
                            console.log('edit profile in asap api success')
                        } else {
                            console.log('edit profile in asap api fail')
                        }

                        })
                        .catch(err => {
                            res.status(401).json({
                                message: 'api errro update profile to (asap api)',
                                result: 'false'
                            });
                        })
                
                //


        })



    }).catch(err => {
        res.status(401).json({
            message: 'error update profile',
            result: 'false'
        });
    })
        
    
    
}

exports.CustomerLogin = (req, res, next) => {
    const { email='', password} = req.body;
 
    if(email !='' && password !=''){
        console.log(req.body.email+' '+req.body.password)
        const form_data = new FormData();
        form_data.append('username', email);
        form_data.append('password', password);
        form_data.append('tokenNoti', '-');
        form_data.append('osType', '-');

        axios.post("https://asapapi1.wisdominnovatech.com/mobile-api/login2", form_data, { headers: form_data.getHeaders()})
        .then(response => {
            if(response.data['result']==false){
                // login  ไม่สำเร็จ
                console.log('error'+' '+response.data['message'])
                res.status(401).json({
                    message: 'Unauthorized request (asap api).',
                    result: 'false'
                });
            } else {
                console.log( response.data.data['token'])
                // login สำเร็จ เก็บ token และเช็คต่อ
                tokenss='';
                tokenss=response.data.data['token'];
                const form_data2 = new FormData();
                form_data2.append('token', response.data.data['token']);

                axios
                .post("https://asapapi1.wisdominnovatech.com/mobile-api/get-profile", form_data2, { headers: form_data2.getHeaders()})
                .then(response2 => {
                     if(response2.data['result']==false){
              
                     } else {

                        CustomersModel.findCustomerByCustCode({cust_code:response2.data['data'].id}).then(([row]) => {
                      
                            if(row.length == 0) {
                                // Insert new customer record
                                CustomersModel.insertNewHandShake({customer_code:response2.data['data'].id,customer_firstname:response2.data['data'].firstName,customer_lastname:response2.data['data'].lastName,customer_telephone:response2.data['data'].mobile,customer_auth_token:tokenss,customer_address1:response2.data['data'].address1,customer_address2:response2.data['data'].address2,cust_username:response2.data['data'].username,cust_email:response2.data['data'].email,customer_birthday:response2.data['data'].birthday,provinceId:response2.data['data'].provinceId,zipCode:response2.data['data'].zipCode})
                            } else {
                                // Get exists user data from db

                                // and update user data
                                CustomersModel.syncCustomerProfile({customer_code:response2.data['data'].id,customer_firstname:response2.data['data'].firstName,customer_lastname:response2.data['data'].lastName,customer_telephone:response2.data['data'].mobile,customer_auth_token:tokenss,customer_address1:response2.data['data'].address1,customer_address2:response2.data['data'].address2,cust_username:response2.data['data'].username,cust_email:response2.data['data'].email,customer_birthday:response2.data['data'].birthday,provinceId:response2.data['data'].provinceId,zipCode:response2.data['data'].zipCode})

                            }

                            // Generate JWT Token
                            let jwtToken = jwt.sign({
                                customer_code: response2.data['data'].id,
                                job_order:1
                            }, 
                            process.env.TOKEN_SECRET, {
                                expiresIn: process.env.TOKEN_EXPIRE_IN
                            });

                            CustomersModel.checkCountJob({customer_code:response2.data['data'].id}).then(([row999]) => {
                                res.status(200).json({
                                    token: jwtToken,
                                    expiresIn: process.env.TOKEN_EXPIRE_IN,
                                    firstlogin: row999[0].checka
                              
                                });
                        });
                        });
                    }
                    
                })   
            }
        })
        .catch(err => {
            res.status(401).json({
                message: 'api errro (asap api)',
                result: 'false'
            });
        })
     
    } else {
        res.status(401)
        .json({
            message: "notfound"
        });
    }

}


exports.CustomerGet = (req, res, next) => {
    CustomersModel.getAllCustomers().then(([row]) => {
        if(row.length !== 0) {

           /* res.status(200).json({
             carlist: row
            });*/

             // ทดสอบระบบผูกข้อมูล
             const form_data = new FormData();
             form_data.append('token', req.query.token); // test token = 7QO5FVDE18X46HMPCZJ92TWLASRNU3
         
                axios
                .post("https://asapapi1.wisdominnovatech.com/mobile-api/get-profile", form_data, { headers: form_data.getHeaders()})
                .then(response => {
                     if(response.data['result']==false){
                        // login token ไม่สำเร็จข
                        console.log('error'+' '+response.data['message'])
                        res.status(401).json({
                            message: 'Unauthorized request (asap api)',
                            result: 'false'
                        });


                     } else {

                        // ถ้าสำเร็จ เช็คในฐานข้อมูลว่า มีรายชื่อนี้หรือยัง โดยดูจาก id
                         

                         CustomersModel.findCustomerByCustCode({cust_code:response.data['data'].id}).then(([row]) => {
                      
                            if(row.length == 0) {
                                // Insert new customer record
                                CustomersModel.insertNewHandShake({customer_code:response.data['data'].id,customer_firstname:response.data['data'].firstName,customer_lastname:response.data['data'].lastName,customer_telephone:response.data['data'].mobile,customer_auth_token:response.data['data'].token,customer_address1:response.data['data'].address1,customer_address2:response.data['data'].address2,cust_username:response.data['data'].username})
                            } else {
                                // Get exists user data from db
                            }

                            // Generate JWT Token
                            let jwtToken = jwt.sign({
                                customer_code: response.data['data'].id,
                                job_order:1
                            }, 
                            process.env.TOKEN_SECRET, {
                                expiresIn: process.env.TOKEN_EXPIRE_IN
                            });
                            /*res.status(200).json({
                                token: jwtToken,
                                expiresIn: process.env.TOKEN_EXPIRE_IN,
                            });*/

                            CustomersModel.checkCountJob({customer_code:response.data['data'].id}).then(([row999]) => {
                                res.status(200).json({
                                    token: jwtToken,
                                    expiresIn: process.env.TOKEN_EXPIRE_IN,
                                    firstlogin: row999[0].checka
                              
                                });
                        });

                            

                           // console.log(token)
                            //res.json(token);
                        })

                     }
                    
                })
                .catch(err => {
                    res.status(401).json({
                        message: 'Unauthorized request (asap api)',
                        result: 'false'
                    });
                })
           

        } else {
            res.status(401)
            .json({
                message: "notfound"
            });
        }
    })
}
 