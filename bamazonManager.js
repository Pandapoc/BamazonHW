const { createConnection } = require('mysql2')
const { prompt } = require('inquirer')

const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nickisawesome1!',
    database: 'bamazon'
})

const init = () => {
    db.connect(e => {
        if (e) throw e
        choice()
    })
}

async function view (columns) {
    let response = await new Promise ((res, rej) => {
        db.query(`select ${columns} from products`, (e, r) => {
            if (e) {
              rej(e)
            }
            else {
              res(r)
            }
        })
    })
    return response
}

const choice = () => {
    prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add new Product', 'EXIT']
        }
    ])
    .then(answers => {
        if (answers.action === 'View Products for Sale') {
            viewProducts()
        } else if (answers.action === 'View Low Inventory') {
            viewInventory()
        } else if (answers.action === 'Add to Inventory') {
            addInventory()
        } else if (answers.action === 'Add new Product'){
            addProduct()
        } else if (answers.action === 'EXIT'){
            console.log('Goodbye!')
            process.exit()
          }
        })
        .catch(e => console.log(e))
}

const viewProducts = () => {
    view('*')
    .then(r => {
        r.map(({item_id, product_name, department_name, price, stock_quantity}) => {
            console.log(`
            -------------------
            ID: ${item_id}
            Product: ${product_name}
            Department: ${department_name}
            Price: $${price}
            Stock: ${stock_quantity}
            -------------------
            `)
        })
      choice()
    })
}

const viewInventory = () => {
    db.query('select product_name from products where stock_quantity < 5', (e, r) => {
        if (e) { console.log(e) }
        else {
            console.log(`We have low stock for the following items:`)
            r.map(({product_name}) => {
                console.log(`
                ------------------------
                Product: ${product_name}
                ------------------------
                `)
            })
            choice()
        }
    })
}

const addInventory = () => {
    view('product_name, stock_quantity')
    .then(r => {
        prompt([{
            type: 'list',
            name: 'choice',
            message: 'Which item would you like to add inventory?',
            choices: r.map(({ product_name, stock_quantity }) => `${product_name} ${stock_quantity}`)
        },{
            type: 'input',
            name: 'stock',
            message: 'How much would you like to add?'
        }])
        .then(answers => {
            let tempArr = answers.choice.split(' ')
            let item = tempArr[0]
            let dbquantity = tempArr[1]
            let quantity = parseInt(answers.stock)
            let sum = answers.stock + dbquantity
            db.query(`update products set stock_quantity = ? where product_name = ?`,[sum, item], (e,r) => {
                if (e) { console.log(e) }
                else {
                    console.log(`
                    -------------------------------------------------
                    You have successfully added ${quantity} ${item}s!
                    -------------------------------------------------
                    `)
                    choice()
                }
            })
        })
    })

}

const addProduct = () => {
    prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the item you would like to add?'
        },{
            type: 'input',
            name: 'department',
            message: 'What department will this item be under?'
        },{
            type: 'input',
            name: 'price',
            message: 'How much will this item cost?'
        },{
            type: 'input',
            name: 'stock',
            message: 'What will the initial stock of this item be?'
        }
    ])
    .then(answers => {
        let item = answers.name
        let department = answers.department
        let price = answers.price
        let stock = answers.stock
        db.query(`insert into products (product_name, department_name, price, stock_quantity) values (?, ?, ?, ?)`,[item, department, price, stock], (e, data) => {
            if (e) {console.log(e) }
            else {
                console.log(`
                -------------------------------------------------
                You have successfully added ${stock} ${item}s at $${price} in the ${department} department!
                -------------------------------------------------
                `)
                choice()
            }
        })
    })

}


init()