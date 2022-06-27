var express = require('express');
var mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

var connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'root', 
    database : 'softsuave'
});

connection.connect((err) => {
    var server = app.listen(port, 'localhost', function() {
        var host = server.address().address
        var port = server.address().port
        console.log('Example app listening at http://%s:%s', host, port);
    });
});

app.get('/read/:id', (req, res) => {
    try {
        let sql = "SELECT * FROM informations WHERE id = ";
        let value = req.params.id;
        connection.query(`${sql} ${value}`, (err, result) => {
            if(err) throw err;
            if(result.length === 0) {
                return res.send(`id:${value} not found`);
            }
            return res.send(result);
        });
    } catch(err) {
        return res.send(err);
    }
});

let printCommment = (req, res, next) => {
    // console.log("all the columns in the table is as follows: ");
    next();
}

app.use(printCommment);

app.get('/read', printCommment, (req, res) => {
    try {
        let sql = "SELECT * FROM informations ORDER BY id";
        connection.query(sql, (err, result) => {
            if(err) throw err;
            return res.send(result);
        });
    } catch(err) {
        return res.send(err);
    }
});


//get specific id
//try to return error if id is not found



// app.post('/post', (req, res) => {
//   let {id, name, occupation, age} = req.body;
//   let sql = id != undefined? `INSERT INTO informations(id, name, occupation, age) VALUES(${id}, '${name}', '${occupation}', ${age})` : `INSERT INTO informations(name, occupation, age) VALUES('${name}', '${occupation}', ${age})`;
//   connection.query(`${sql}`,[12,'fsdf'], (err, result) => {
//     if(err) throw err;
//   });
//   return res.send(req.body);
// });

app.post('/post', (req, res) => {
    let arr = [req.body];
    let { name, occupation, age} = req.body;
    let sql =`INSERT INTO informations( name, occupation, age) VALUES (?, ?, ?)`; 
    connection.query(`${sql}`,[name, occupation, age], (err, result) => {
        if(err) throw err;
    });
    return res.send(req.body);
});

app.patch('/update', (req, res) => {
    let {id} = req.body;
    let arr = [req.body];
    for(let [key, value] of Object.entries(req.body)) {
        // console.log(key + " " + value);
        if(key != 'id') {
            console.log(key + " " + value);
            let sql = `UPDATE informations SET ${key} = '${value}' WHERE id = ${id}`;
            connection.query(sql, (err, result) => {
                if(err) throw err;
            });
        }
    }
    return res.send(req.body);
});

app.delete('/delete/:id', (req, res) => {
    let sql = 'DELETE FROM informations WHERE';
    let value = req.params.id;
    connection.query(`${sql} id = ${value}`, (err, result) => {
        if(err) throw err;
        return res.send(value);
    });
});

app.delete('/deleteAll', (req, res) => {
    let sql = 'DELETE FROM informations';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        return res.send('all deleted');
    });
});