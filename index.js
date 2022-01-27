const express = require('express')
const mySql = require('mysql')
const port = 3000
const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

const pool = mySql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_test'
})

//Get all elements of the table
app.get('', (req, res) => {
    pool.getConnection((error, connection) => {
        if(error) throw error
        connection.query('SELECT * FROM motorcycles', (error, rows) => {
            connection.release()

            if(error){
                console.log(error)
            }else {
                res.send(rows)
            }

            console.log('The data from motorcycles table are: \n', rows)
        })
    })
})

//Get a specific element of the table
app.get('/:id', (req, res) => {
    pool.getConnection((error, connection) => {
        if(error) throw error
        connection.query('SELECT * FROM motorcycles WHERE id = ?', [req.params.id], (error, rows) => {
            connection.release()
            if(error){
                console.log(error)
            }else{
                res.send(rows)
            }

            console.log('The data from motorcycles table are: \n', rows);
        })
    })
})

// Delete an element from the table
app.delete('/:id', (req, res) => {
    pool.getConnection((error, connection) => {
        if(error) throw error
        connection.query('DELETE FROM motorcycles WHERE id = ?', [req.params.id], (error, rows) => {
            connection.release()
            if (error) {
                console.log(error)
            } else {
                res.send(`Motorcycle with the record ID ${[req.params.id]} has been removed.`)
            }

            console.log('The data from motorcycles table are: \n', rows)
        })
    })
})

//Add an element to the table
app.post('', (req, res) => {
    pool.getConnection((error, connection) => {
        if(error) throw error
        const params = req.body
        connection.query('INSERT INTO motorcycles SET ?', params, (error, rows) => {
            connection.release()
            if (error) {
                console.log(error)
            } else {
                res.send(`Motorcycle with the name: ${params.name} has been added.`)
            }

            console.log('The data from motorcycles table are: \n', rows)
        })
    })
})

//Update a record of the table
app.put('', (req, res) => {
    pool.getConnection((error, connection) => {
        if(error) throw error
        const { id, name, tagline, description, image } = req.body
        connection.query('UPDATE motorcycles SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?', [name, tagline, description, image, id] , (error, rows) => {
            connection.release()
            if(error) {
                console.log(error)
            } else {
                res.send(`Motorcycle with the name: ${name} has been added.`)
            }
        })
        console.log(req.body)
    })
})

app.listen(port, () => console.log('Server listening on port' + port));