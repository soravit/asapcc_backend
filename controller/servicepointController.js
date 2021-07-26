const bcrypt = require('bcrypt');
const axios = require('axios');
const FormData = require('form-data');
const jwt = require('jsonwebtoken') // ใช้ระบบ jwt token
const dotenv = require('dotenv'); // ดึงค่า .env ใช้
// get config vars
dotenv.config();

const ServicePoint = require('../model/servicepointModel');

exports.servicePointAll = (req, res, next) => {
    ServicePoint.getAllServicePoint().then(([row]) => {
        //console.log(req.params.licenseId)
        
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

exports.servicePointSearchName = (req, res, next) => {
    ServicePoint.findServicePointByName({name:req.params.name}).then(([row]) => {
        //console.log(req.params.licenseId)
        
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


exports.servicePointByCode = (req, res, next) => {
    ServicePoint.findServicePointByCode({code:req.query.code}).then(([row]) => {
        //console.log(req.params.licenseId)
        
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


exports.servicePointSearchLocation = (req, res, next) => {
    ServicePoint.findServicePointByLocation({province:req.query.province,amphor:req.query.amphor}).then(([row]) => {
        //console.log(req.params.licenseId)
        
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

exports.servicePointProvince = (req, res, next) => {
    ServicePoint.getProvinceList().then(([row]) => {
        //console.log(req.params.licenseId)
        
        if(row.length !== 0) {

            res.status(200).json({
                province: row
            });


        } else {
            res.status(401)
            .json({
                message: "notfound"
            });
        }

    })

}

exports.servicePointAmphor = (req, res, next) => {
    ServicePoint.getAmphor({province:req.query.province}).then(([row]) => {
        //console.log(req.params.licenseId)
        
        if(row.length !== 0) {

            res.status(200).json({
                amphor: row
            });


        } else {
            res.status(401)
            .json({
                message: "notfound"
            });
        }

    })

}