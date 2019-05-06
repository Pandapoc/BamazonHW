const { createConnection } = require('mysql2')
const { prompt } = require('inquirer')
let idArr = []
let itemArr = []

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

async function options(columns) {
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
    options('item_id, product_name')
    .then( r => {
        prompt([{
          type: 'list',
          name: 'item',
          message: 'What item would you like to purchase?',
          choices: r.map(({ item_id, product_name }) => `${item_id}) ${product_name}`)
        },
        {
          type: 'input',
          name: 'quantity',
          message: 'How many would you like to buy?'
        }])
        .then(answers => {
          let tempArr = answers.item.split(' ')
          let item = tempArr[1]
          let quantity = answers.quantity
            console.log(`You want to buy ${quantity} of ${item}`)
            db.query(`select stock_quantity from products where product_name = ?`,[`${item}`],(e, data) => {
                if (e) { console.log(e) }
                else {
                    let dbquantity = data[0].stock_quantity
                    if (quantity > dbquantity) {
                        console.log(`Sorry We don't have enough in stock!`)
                        quantity()
                    } else {
                        dbquantity -= quantity
                        console.log(dbquantity)
                        console.log('got here')
                        db.query(`update products set stock_quantity = ? where product_name = ?;`,[dbquantity, `${item}`], (e, data) => {
                            if (e) { console.log(e) }
                            else {
                                console.log(`you have successfully bought ${quantity} ${item}s`)
                                choice()
                            }
                        })
                    }
                }
            })
        })
          


    })
}



const quantity = () => {
    prompt({
        type: 'input',
        name: 'quantity',
        message: 'How many would you like to buy?'
      })
      .then(answers =>{
        let quantity = answers.quantity
        console.log(`You want to buy ${quantity} of ${item}`)
        db.query(`select stock_quantity from products where product_name = ?`,[item],(e, data) => {
            if (e) { console.log(e) }
            else {
                if (quantity > data) {
                    console.log(`Sorry We don't have enough in stock!`)
                    quantity()
                } else {
                    db.query(`update products set product_quantity = ? where product_name = ?`,[data-quantity],[item], (e, data) => {
                        console.log(`you have successfully bought ${quantity} ${items}s`)
                    })
                }
            }
        })
      })
}

const checker = () => {

}

const buyer = () => {

}

init()
