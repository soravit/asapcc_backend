const bcrypt = require('bcrypt');
const axios = require('axios');
const FormData = require('form-data');
const jwt = require('jsonwebtoken') // ใช้ระบบ jwt token
const dotenv = require('dotenv'); // ดึงค่า .env ใช้
// get config vars
dotenv.config();

const CarsModel = require('../model/carsModel');

exports.carsGetByLicense = (req, res, next) => {
    CarsModel.findCarByLicense({carlicense:req.params.licenseId}).then(([row]) => {
        //console.log(req.params.licenseId)
        
        if(row.length !== 0) {

            res.status(200).json({
                cardata: row
            });


        } else {
            res.status(401)
            .json({
                message: "notfound"
            });
        }

    })

}

exports.carCheckRegister = (req, res, next) => {
    CarsModel.findCarMappingByVinId({car_vin_id:req.params.vinId,customer_code:req.user.customer_code,checkvaliddate:'false'}).then(([row]) => {
        if(row.length !== 0) {

            res.status(200).json({
                cardata: row
            });

        } else {
            res.status(401)
            .json({
                message: "notfound"
            });
        }

 })
}

exports.carConfirmRegister = (req, res, next) => {
    car_vin_id= req.params.vinId;
    customer_code=req.user.customer_code;
    console.log(req.params.vinId)
    CarsModel.findCarMappingByVinId({car_vin_id:car_vin_id,customer_code:customer_code,checkvaliddate:'false'}).then(([row]) => {

 
        if(row.length !== 0) {

           /* res.status(200).json({
                cardata: row
            });*/

        // ถ้าเจอซ้ำแล้ว ให้ข้าม

        res.status(200).json({
            message: 'duplicate'
        });


        } else {

            CarsModel.findCarMappingByVinId({car_vin_id:car_vin_id,customer_code:customer_code,checkvaliddate:'true'}).then(([row]) => {
                if(row.length == 0) {
    
                  /*  res.status(200).json({
                     carlist: row
                    });*/
                    console.log("insert map car new");
                    
                    CarsModel.insertCarMappingByVinId({car_vin_id:car_vin_id,customer_code:customer_code}).catch((error) => { res.status(401)
                        .json({
                            message: "insert car confirm register error",
                            error:error
                        })
                    })
        
                    CarsModel.updateBusinesssNameInCustomerTable({car_vin_id:car_vin_id,customer_code:customer_code}).catch((error) => { res.status(401)
                        .json({
                            message: "update business name in cust error",
                            error:error
                        })
                    })
                    
    
                } else {
                    res.status(401)
                    .json({
                        message: "carexpire"
                    });
                }
            })

           

            
        
        /* UPDATE asapcc_customer_db SET customer_type=(SELECT c.car_customer_type FROM asapcc_car_db c WHERE c.car_vin='111112222333344444ABCD' LIMIT 1),customer_business_name=(SELECT c.business_name FROM asapcc_car_db c WHERE c.car_vin='111112222333344444ABCD' LIMIT 1) WHERE customer_code='69074' */


          res.status(200).json({
            message: 'success'
         });

        }
    
    })

}

exports.carsRemove = (req, res, next) => {
    car_vin_id= req.params.vinId;
    customer_code=req.user.customer_code;
    console.log(req.params.vinId)
    CarsModel.findCarMappingByVinId({car_vin_id:car_vin_id,customer_code:customer_code,checkvaliddate:'false'}).then(([row]) => {

 
        if(row.length !== 0) {
            CarsModel.removeCarMappingByVinId({car_vin_id:car_vin_id,customer_code:customer_code}).catch((error) => { res.status(401)
                .json({
                    message: "unsubscribe car confirm register error",
                    error:error
                })
        })
        res.status(200).json({
            message: 'success'
        });

        


        } 
    })

}

exports.getMyCar = (req, res, next) => {
    customer_code=req.user.customer_code;
   

        CarsModel.getMyCars({customer_code:customer_code}).then(([row]) => {
            if(row.length !== 0) {

                res.status(200).json({
                 carlist: row
                });

                

            } else {
                res.status(401)
                .json({
                    message: "notfound"
                });
            }
        })
    
}

exports.carsGet = (req, res, next) => {
    /*const { email='', password} = req.body;
    UserModel.findUserByEmail({email:email})
        .then(([row]) => {
            if(row.length !== 0) {
                return bcrypt.compare(password, row[0].password)
                    .then((result) => {
                        if(!result) {
                            res.status(401)
                                .json({
                                    message: "Authentication failed"
                                })
                        } else {
                            let jwtToken = jwt.sign({
                                email: row[0].email,
                                userId: row[0].id
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
                    message: "Authentication failed"
                })
            }
        })
        .catch((error) => {
            res.status(500)
            .json({
                message:error
            })
        })*/
        
        // Get data from token
        console.log(req.user)

        CarsModel.getAllCars().then(([row]) => {
            if(row.length !== 0) {

                res.status(200).json({
                 carlist: row
                });

                

            } else {
                res.status(401)
                .json({
                    message: "notfound"
                });
            }
        })
    
}