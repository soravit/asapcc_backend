const jwt = require('jsonwebtoken') // ใช้ระบบ jwt token
const dotenv = require('dotenv'); // ดึงค่า .env ใช้
// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;


exports.verifyUserToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({
        message: 'Unauthorized request',
        result: 'false'
    });

    try {
        token = token.split(' ')[1] // Remove Bearer from string

        if (token === 'null' || !token) return res.status(401).json({
            message: 'Unauthorized request',
            result: 'false'
        });

        let verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);   // config.TOKEN_SECRET => 'secretKey'
        if (!verifiedUser) return res.status(401).json({
            message: 'Unauthorized request',
            result: 'false'
        });

        req.user = verifiedUser; // store variable to req.user to use in another method
        next();

    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized request',
            result: 'false'
        });
    }

}