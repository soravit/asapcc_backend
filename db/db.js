const db = require('mysql2')

const Database = db.createPool({
    host:'192.168.50.6', /* 192.168.50.6 */
    user:'asap',
    database:'asapapp',
    password:'asap',
    port:3307
})

module.exports = Database.promise();