const { createConnection } = require('mysql2')
const inquirer = require('inquirer')

const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nickisawesome1!',
    database: 'bamazon'
})
