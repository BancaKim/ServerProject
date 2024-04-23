const express = require('express');
const app = express();
const cors = require('cors');  //cors 설정
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost', 
    port: 3306,
    user: 'root',
    password: 'qwe123!@#',
    database: 'potato'
})

connection.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000, function(){
    console.log('node Start');
})


app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.get('/test',(req,res)=>{
    let obj = {};
    console.log("hihi")
    obj.result='gg';
    res.json(obj);
})

app.get('/name',(req,res)=>{
    let obj = {};
    console.log("give you a name")
    obj.result='kimgun';
    res.json(obj);
})

app.get('/get1',(req,res)=>{
    console.log(req.query);
})
// function first(val1){
//     alert(val1);
// }

// const second = (val2)=>{
//     alert(val2);
// }


app.post('/post1',(req,res)=>{
    console.log('post1 도착');
    console.log(req.body);

    let name = req.body.name; //짱구
    let obj = {};
    obj.result = name;  //object의 key(result)에 '짱구' 넣기
    res.json(obj)
})

 app.get('/query',(req,res)=>{
    console.log('query');
    let responseData = {};

    connection.query('select * from emp',(err,rows)=>{
        if(err) throw err;
        if(rows[0]){
            console.log(rows[0]);
            responseData.data = rows;
            responseData.state = 'ok';
        } else {
            responseData.state = 'none';
        }
        res.json(responseData);
    })
 })

  app.get('/query2',(req,res)=>{
    console.log(req.query);
    console.log('query');
    let responseData = {};
    let job = req.query.job;
    let empNo = req.query.empNo;

    connection.query('SELECT * FROM EMP WHERE JOB="'+job+'" AND EMPNO = "'+empNo+'"',(err,rows)=>{
        if(err) throw err;
        if(rows[0]){
            console.log(rows[0]);
            responseData.data = rows;
            responseData.state = 'ok';
        } else {
            responseData.state = 'none';
        }
        res.json(responseData);
    })
 })

  app.get('/query3',(req,res)=>{
    console.log(req.query);
    console.log('query');
    let responseData = {};
    let job = req.query.job;
    let empNo = req.query.empNo;

    let query = 'SELECT * FROM EMP WHERE JOB= ? AND EMPNO = ?'
    connection.query(query,[job, empNo ],(err,rows)=>{  //첫번째 요소는 첫번째 물음표 , 두번째 요소는 두번째 물음표
        if(err) throw err;
        if(rows[0]){
            console.log(rows[0]);
            responseData.data = rows;
            responseData.state = 'ok';
        } else {
            responseData.state = 'none';
        }
        res.json(responseData);
    })
 })

   app.get('/query4',(req,res)=>{
    console.log(req.query);
    console.log('query');
    let responseData = {};
    let sal = req.query.sal;

    let query = 'SELECT * FROM EMP WHERE SAL > ?'
    connection.query(query,[sal],(err,rows)=>{  //첫번째 요소는 첫번째 물음표 , 두번째 요소는 두번째 물음표
        if(err) throw err;
        if(rows[0]){
            console.log(rows[0]);
            responseData.data = rows;
            responseData.state = 'ok';
        } else {
            responseData.state = 'none';
        }
        res.json(responseData);
    })
 })

 // post 방식
// app.post('/insert', (req, res) => {
//     let query = 'insert into DEPT (DEPTNO, DNAME, LOC) values (?, ?, ?)';
//     connection.query(query, [ 50, '관리부', '서울' ], (err, result, fields) => {
//         if(err) throw err;
//         console.log(result);
//     })
// })

app.post('/insert', (req, res) => {
    let data = req.body;
    let deptNo = data.deptNo;
    let dname = data.dname;
    let loc = data.loc;
    console.log(deptNo, dname, loc);
    let query = 'insert into DEPT (DEPTNO, DNAME, LOC) values (?, ?, ?)';
    connection.query(query, [ deptNo, dname, loc ], (err, result, fields) => {
        if(err) throw err;
        console.log(result);
    })
})
app.get('/promise', async(req, res) => {
// app.get('/promise', (req, res) => {
    let val = -1;
    val = await third();
    // val = second();
    console.log('promise');
    console.log(val);
})
function second() {
    let query = 'SELECT COUNT(*) FROM EMP';
    connection.query(query,(err, rows) => {
        if(err) throw err;
        if(rows[0]) {
            console.log(rows[0]);
            return rows[0];
        }
        //res.json(responseData);
    })
}
function third() {
    return new Promise((resovle, reject) => {
        let query = 'SELECT COUNT(*) FROM EMP';
        connection.query(query,(err, rows) => {
            if(err) throw err;
            if(rows[0]) {
                console.log(rows[0]);
                resovle(rows[0]);
            }
            //res.json(responseData);
        })
    })
}