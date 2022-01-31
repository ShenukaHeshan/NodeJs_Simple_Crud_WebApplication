const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//database connection
const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employee"
});

mysqlConnection.connect((err)=>{
    if(err) throw err;
    console.log('Database connected successfully');
});

//server listening
app.listen(3000,()=>{
    console.log('server is running on port 3000');
});

//set views file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//all employee list
app.get('/employee',(req,res)=>{
    let sql = "SELECT * FROM employee";
    let query = mysqlConnection.query(sql, (err, rows)=>{
        if(err) throw err;
        res.render('index.ejs',{
            title: 'Employee Details',
            user:rows
         });
    });
});

//redirect to add employee page
app.get('/add',(req,res)=>{
    res.render('add',{
        title: 'Add Employee'
    });
});

//add new employee
app.post('/save',(req,res)=>{
    let data={name: req.body.name, email: req.body.email};
    let sql = "INSERT INTO employee SET ?";
    let query = mysqlConnection.query(sql, data,(err, results)=>{
        if(err) throw err;
        res.redirect('/employee');
    });
});

//get edit employee details
app.get('/edit/:id',(req,res)=>{
    let data=req.params.id;
    let sql = "SELECT * FROM employee WHERE id = ?";
    let query = mysqlConnection.query(sql, data,(err, results)=>{
        if(err) throw err;
        res.render('edit.ejs',{
            title: 'Edit Employee Details',
            user:results[0]
         });
    });
});

//get employee details
app.get('/details/:id',(req,res)=>{
    let data=req.params.id;
    let sql = "SELECT * FROM employee WHERE id = ?";
    let query = mysqlConnection.query(sql, data,(err, results)=>{
        if(err) throw err;
        res.render('details.ejs',{
            title: 'Employee Details',
            user:results[0]
         });
    });
});

//update employee
app.post('/update',(req,res)=>{
    const userid = req.body.id; 
    let sql = "update employee SET name='"+req.body.name+"',email='"+req.body.email+"' WHERE id = "+userid;
    let query = mysqlConnection.query(sql,(err, results)=>{
        if(err) throw err;
        res.redirect('/employee');
    });
});

//delete employee
app.get('/delete/:id',(req,res)=>{
    const data=req.params.id;
    let sql = "DELETE FROM employee WHERE id = ?";
    let query = mysqlConnection.query(sql, data,(err, results)=>{
        if(err) throw err;
        res.redirect('/employee')
    });
});