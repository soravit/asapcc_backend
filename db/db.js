const db = require('mysql2')

const Database = db.createPool({
    host:'128.199.155.179',
    user:'asapcallcenter',
    database:'asapcallcenter',
    password:'treetreerice',
    port:3306
})

module.exports = Database.promise();