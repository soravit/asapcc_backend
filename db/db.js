const db = require('mysql2')

const Database = db.createPool({
    host:'203.151.205.217',
    user:'asap',
    database:'asapapp',
    password:'asap',
    port:3307
})

module.exports = Database.promise();