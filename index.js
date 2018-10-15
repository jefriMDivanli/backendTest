const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

var app = express();
const port = 1997;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


const conn = mysql.createConnection({
    host: 'localhost',
    user: 'morofuji',
    password: 'japan',
    database: 'hotelbertasbih',
    port: 3306
});
 
app.get('/', (req, res) => {
    res.send('<h1>API HOTEL BERTASBIH!</h1>');
});

//USER REGISTER
app.post('/registerUser', (req, res) => {
    const { username, email, password, role } = req.body;
    var data = {
        //database table:frontend
        username: username,
        email: email,
        password: password,
        role: role
    };
    var sql = 'INSERT INTO tableuser SET ?;';
    conn.query(sql, data, (err, result) => {
        if (err) { throw err };
        res.send(data);
    })
})

//USER LOGIN
app.get('/login', (req, res) => {
    var { email, password } = req.query;
    var data = { 
        email: email, 
        password: password 
    }
    var sql = `select * from user where email='${email}' and password='${password}'`;
    conn.query(sql, data, (err, result) => {
        if (err) { throw err };
        res.send(result);
    })
}) 

//TAMPILKAN SEMUA KAMAR DAN FILTER BY CATEGORY 
app.get('/kamar', (req, res) => {
    const { kamarcategory } = req.query; //require from front-end use ? in url

    if (kamarcategory) {
        var sql = `SELECT tk.* from tablekamar tk  
                    JOIN tablecategory tc 
                    ON tk.categoryid = tc.id
                    WHERE tc.id in (?) 
                    ORDER by tk.categoryid;`;
        conn.query(sql, [kamarcategory], (err, results) => {
            if (err) throw err;

            res.send(results);
        })
    }
})

//UPDATE TABLEKAMAR 
app.put('/kamar/:id', (req, res) => {

    var { id } = req.params;
    var { nomorkamar, categoryid, harga } = req.body;
    var data = {
        //sql table : frontend
        nomorkamar: nomorkamar,
        categoryid: categoryid,
        harga: harga
    }
    var sql = `UPDATE tablekamar SET ? WHERE id = ${id}`; // ? nampung data
    conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(results);
    })
})

//UPDATE CATEGORY (UPDATE)
app.put('/category/:id', (req, res) => {
    var { id } = req.params;
    var { namacategory } = req.body;
    var data = {
        namacategory: namacategory
    }
    var sql = `UPDATE tablecategory SET ? WHERE id = ${id}`;
    conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(results);
    })
})


//DELETE KAMAR
app.delete('/kamar/:id', (req, res) => {
    var { id } = req.params;

    var sql = `DELETE FROM tablekamar WHERE id = ${id}`;
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    })
})

//DELETE CATEGORY
app.delete('/category/:id', (req, res) => {
    var { id } = req.params;

    var sql = `DELETE FROM tablecategory WHERE id = ${id}`;
    conn.query(sql, (err, results) => {
        if (err) throw err;

        res.send(results);
    })
})

//CREATE KAMAR
app.post('/kamar', (req, res) => {
    const { nomorkamar, categoryid, harga } = req.body;
    var data = {
        nomorkamar: nomorkamar,
        categoryid: categoryid,
        harga: harga
    };
    var sql = 'INSERT INTO tablekamar SET ?';
    conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(results);
    })
})

//ADD CATEGORY (CREATE)
app.post('/category', (req, res) => {
    const { namacategory } = req.body;
    var data = {
        namacategory: namacategory,
    };
    var sql = 'INSERT INTO tablecategory SET ?';
    conn.query(sql, data, (err, results) => {
        if (err) throw err;
        res.send(results);
    })
})



app.listen(port, () => console.log('API Active at localhost:1997!'));