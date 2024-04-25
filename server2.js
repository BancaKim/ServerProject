const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql2');

// Multer 설정: 이미지를 'uploads/' 폴더에 저장
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function(req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'qwe123!@#',
    database: 'potato'
});

connection.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(4000, function(){
    console.log('Node server started on port 4000');
});


//상세화면 열기
// app.get('/getDetail', (req, res) => {
//     console.log('come');
//     console.log(req.query);    
//     let responseData = {};
//     let id = req.query.boardId; 
//     let query = "SELECT title,content,createdAt,pic FROM products where id=?";
//     connection.query(query,(err, results) => {
//         if (err) {
//             console.error('Database error:', err);
//         } 
        
//         console.log('result:', results);
//         responseData.data = results;
//         res.json(responseData);
//     });
// });

// 데이터 불러오기
app.get('/getDetail', (req, res) => {
    //req.query.boardId;
    console.log('come')
    let responseData = {};
    let id = req.query.boardId; 
    let query = "SELECT title,content,createdAt,pic FROM products where id=?";
    connection.query(query, [id],  (err, rows) => {
        if (err) {
            console.error('Database error:', err);
        }
        if (rows.length > 0) {
            responseData.state = 'ok';
            responseData.data = rows.map(row => ({
                ...row,
                pic: row.pic ? Buffer.from(row.pic).toString('base64') : null,
            }));
        } else {
            responseData.state = 'none';
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(responseData);
    });
});


// 데이터 불러오기
app.get('/getBoardDetail', (req, res) => {
    //req.query.boardId;
    console.log('come')
    let responseData = {};
    let id = req.query.boardId; 
    let query = "SELECT title,content,createdAt FROM freeboard where board_id=?";
    connection.query(query, [id],  (err, rows) => {
        if (err) {
            console.error('Database error:', err);
        }
        if (rows.length > 0) {
            responseData.state = 'ok';
            responseData.data = rows.map(row => ({
                ...row,
            }));
        } else {
            responseData.state = 'none';
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(responseData);
    });
});

// 데이터 불러오기
app.get('/getBoards', (req, res) => {

    //req.query.boardId;
    let responseData = {};
    let sql = 'SELECT * FROM freeboard';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (rows.length > 0) {
            responseData.state = 'ok';
            // console.log('123');
            responseData.data = rows.map(row => ({
                ...row,
            }));
            // console.log(responseData.data);
        } else {
            responseData.state = 'none';
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(responseData);
    });
});

// 데이터 불러오기
app.get('/getPosts', (req, res) => {

    //req.query.boardId;
    let responseData = {};
    let sql = 'SELECT * FROM products';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (rows.length > 0) {
            responseData.state = 'ok';
            // console.log('123');
            responseData.data = rows.map(row => ({
                ...row,
                pic: row.pic ? Buffer.from(row.pic).toString('base64') : null,
            }));
            // console.log(responseData.data);
        } else {
            responseData.state = 'none';
        }
        console.log('end');
        res.setHeader('Content-Type', 'application/json');
        res.json(responseData);
        console.log(responseData);
    });
});

// 파일 업로드와 게시글 데이터를 처리하는 라우트
app.post('/posts', upload.single('image'), (req, res) => {
    console.log('Received fields:', req.body);
    console.log('Received file:', req.file);

    const { title, content } = req.body;
    const image = req.file ? req.file.buffer : null;
    const query = "INSERT INTO products (user_id, title, content, pic) VALUES ('a', ?, ?, ?)";

    connection.query(query, [title, content, image], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        console.log('Insert result:', results);
        res.send('Post created with ID: ' + results.insertId);
    });
});

// 게시물 수정
app.post('/updatePost', (req, res) => {
    console.log('update_come');
    console.log('req:'+req);    
    let data = req.body;
    let id = data.id;
    let title = data.title;
    let content = data.content;

    let query = "UPDATE PRODUCTS SET title=?, content=? where id=?";
    connection.query(query,[title,content,id],(err, results) => {
        if (err) {
            console.error('Database error:', err);
        } 
        console.log('result:', results);
        res.json('ok');
    });
});

// 자유게시판 수정
app.post('/updateBoard', (req, res) => {
    let data = req.body;
    let id = data.board_id;
    let title = data.title;
    let content = data.content;

    let query = "UPDATE freeboard SET title=?, content=? where board_id=?";
    connection.query(query,[title,content,id],(err, results) => {
        if (err) {
            console.error('Database error:', err);
        } 
        console.log('result:', results);
        res.json('ok');
    });
});
// 게시물 삭제
app.post('/delPost', (req, res) => {
    console.log('del_come');
    console.log(req.body);    
    let id = req.body.boardId; 
    let query = "DELETE FROM products where id=?";
    connection.query(query,[id],(err, results) => {
        if (err) {
            console.error('Database error:', err);
        } 
        console.log('result:', results);
        res.json('ok');
    });
});
// 자유게시판 삭제
app.post('/delBoard', (req, res) => {   
    let id = req.body.boardId; 
    let query = "DELETE FROM freeboard where board_id=?";
    connection.query(query,[id],(err, results) => {
        if (err) {
            console.error('Database error:', err);
        } 
        console.log('result:', results);
        res.json('ok');
    });
});

// 좋아요 업데이트
app.post('/upLikeCount', (req, res) => {
    console.log('update_come');
    console.log('req:', req.body);    
    let data = req.body;
    let id = data.boardId;
    let likeCount = data.likeCount;

    let query = "UPDATE PRODUCTS SET likeCount=? where id=?";
    connection.query(query,[likeCount,id],(err, results) => {
        if (err) {
            console.error('Database error:', err);
        } 
        console.log('result:', results);
        res.json('ok');
    });
});

//자유게시판 등록
app.post('/createBoard', (req, res) => {
    console.log('req:',req);
    const { title, content } = req.body;
        console.log('req.body:',req.body);
        console.log('title:',title);
        console.log('content:',content);
    const query = "INSERT INTO freeboard (user_id, title, content) VALUES ('a', ?, ?)";

    connection.query(query, [title, content], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.send('Post created with ID: ' + results.insertId);
    });
});

//회원가입 등록
app.post('/signIn', (req, res) => {
    let data = req.body;
    let userName = data.userName;
    let userId = data.userId;
    let userPwd = data.userPwd;
    let userEmail = data.userEmail;
    let userAddress = data.userAddress;
    console.log(userName,userId,userPwd,userEmail,userAddress)

    let query = 'insert into user (user_id, user_name, user_email, user_adrs, user_pw) values (?,?,?,?,?)';
    connection.query(query, [userId,userName,userEmail,userAddress,userPwd], (err, result) => {
        if(err) throw err;
        console.log(result);
    })
})

//login 영역

app.post('/login', (req, res) => {
    // const memberid = req.query.memberid;
    // const pw = req.query.pw;
    // let id=req.body.id;
    // let pw=req.body.pw;
    let obj = req.body;
    // const { id, pw } = req.body;
    console.log('obj:'+obj);
    console.log('id:'+obj.params.id);
    console.log('pwd:'+obj.params.pwd);
    let responseData = {};
    let query = 'Select * from user where user_id = ? and user_pw = ?';
    connection.query(query, [obj.params.id, obj.params.pwd], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        responseData.state = 'error';
      } else if (rows.length > 0) {
        // 로그인 성공
        responseData.state = 'ok';
        console.log(responseData.state);
        responseData.info = rows[0]; // 로그인된 사용자 정보 전송
        console.log('data.info:'+responseData.info)
      } else {
        // 로그인 실패
        responseData.state = 'none';
        console.log(responseData.state);
      }
      res.json(responseData);
    });
  });







// app.post('/login',(req, res)=>{
//     console.log('req:'+req);
//     let data = req.body;
//     console.log('data:'+data)
//     let userId = data.userId;
//     console.log('userId:'+userId)
//     let userPwd = data.userPwd;
//     console.log('userPwd:'+userPwd)
//     let responseData ={};

//     let query = 'Select * from user where user_id = ? and user_pw = ?';
//     connection.query(query,[userId, userPwd],(err, rows)=>{ // 번쨰 매개변수 = > 쿼리문  // err은 오류 rows는 배열의 형태로 값이 하나라도 있으면 들어옴
//         if(err) throw err;
//          if (rows.length > 0) {
//             responseData.state = 'ok';
//             console.log('123');
//             responseData.data = rows.map(row => ({
//                 ...row,
//             }));
//             console.log(responseData.data);
//         } else {
//             responseData.state = 'none';
//         }
//         console.log('end');
//         res.setHeader('Content-Type', 'application/json');
//         res.json(responseData);
//         console.log(responseData);
//     });
// });


//admin 영역 

app.get('/getmeminfo',(req,res) => {                       //상준 / 회원정보가지고오려고 작업중
    console.log('query')  ;
    let responseData = {};
    connection.query('select * from user',(err, rows)=> {
        if(err) throw err;
        if(rows[0]) {                               // 첫번째 행이 값이 있으면 트루
            console.log(rows[0]);
            responseData.data = rows;               // rows는 전체 데이터 임
           // responseData.state = 'good job';        //responseData에 굳 잡이라고 씀
        } else {
            responseData.state = 'none';
        }
            res.json(responseData);
    })
})

app.get('/getincomeinfo', (req, res) => {               // 월별 충전
    let responseData = [];
    let months = 12; // 1월부터 12월까지 반복

    for (let i = 1; i <= months; i++) {
        connection.query('SELECT SUM(potato_pay) AS total_pay FROM pay_log WHERE in_out = 1 AND MID(time_info, 6, 2) = ?', [i], (err, rows) => {
            if (err) throw err;
            let totalPay = rows[0].total_pay || 0; // 만약 값이 없으면 0으로 설정
            responseData.push(totalPay);

            if (responseData.length === months) { // 모든 데이터를 가져왔을 때 응답
                res.json(responseData);
                console.log(responseData);
            }
        });
    }
});

app.get('/getoutcomeinfo', (req, res) => {                      // 월별 지출
    let responseData = [];
    let months = 12; // 1월부터 12월까지 반복

    for (let i = 1; i <= months; i++) {
        connection.query('SELECT SUM(potato_pay) AS total_pay FROM pay_log WHERE in_out = 0 AND MID(time_info, 6, 2) = ?', [i], (err, rows) => {
            if (err) throw err;
            let totalPay = rows[0].total_pay || 0; // 만약 값이 없으면 0으로 설정
            responseData.push(totalPay);

            if (responseData.length === months) { // 모든 데이터를 가져왔을 때 응답
                res.json(responseData);
                console.log(responseData);
            }
        });
    }
});


app.get('/gettotalcomeinfo', (req, res) => {                      // 월별 (충전-지출)
    let responseData = [];
    let months = 12; // 1월부터 12월까지 반복

    for (let i = 1; i <= months; i++) {
        connection.query('SELECT SUM(case when in_out=1 then potato_pay else -potato_pay end) AS total_pay FROM pay_log WHERE MID(time_info, 6, 2) = ?', [i], (err, rows) => {
            if (err) throw err;
            let totalPay = rows[0].total_pay || 0; // 만약 값이 없으면 0으로 설정
            responseData.push(totalPay);

            if (responseData.length === months) { // 모든 데이터를 가져왔을 때 응답
                res.json(responseData);
                console.log(responseData);
            }
        });
    }
});


app.get('/gettotallineinfo', (req, res) => {                      // 월별 (충전-지출)
    let responseData = [];
    let months = 12; // 1월부터 12월까지 반복

    for (let i = 1; i <= months; i++) {
        connection.query('SELECT SUM(case when in_out=1 then potato_pay else -potato_pay end) AS total_pay FROM pay_log WHERE MID(time_info, 6, 2) <= ?', [i], (err, rows) => {
            if (err) throw err;
            let totalPay = rows[0].total_pay || 0; // 만약 값이 없으면 0으로 설정
            responseData.push(totalPay);

            if (responseData.length === months) { // 모든 데이터를 가져왔을 때 응답
                res.json(responseData);
                console.log(responseData);
            }
        });
    }
});

app.get('/getincomeuserinfo', (req, res) => {                      // 월별 회원 가입 수
    let responseData = [];
    let months = 12; // 1월부터 12월까지 반복

    for (let i = 1; i <= months; i++) {
        connection.query('select count(user_id) As total_pay from user where mid(enroll_info,6,2)= ?', [i], (err, rows) => {
            if (err) throw err;
            let totalPay = rows[0].total_pay || 0; // 만약 값이 없으면 0으로 설정
            responseData.push(totalPay);

            if (responseData.length === months) { // 모든 데이터를 가져왔을 때 응답
                res.json(responseData);
                console.log(responseData);
            }
        });
    }
});

app.get('/getincomeuserinfoline', (req, res) => {                      // 월별 누적 회원 가입 수
    let responseData = [];
    let months = 12; // 1월부터 12월까지 반복

    for (let i = 1; i <= months; i++) {
        connection.query('select count(user_id) As total_pay from user where mid(enroll_info,6,2)<= ?', [i], (err, rows) => {
            if (err) throw err;
            let totalPay = rows[0].total_pay || 0; // 만약 값이 없으면 0으로 설정
            responseData.push(totalPay);

            if (responseData.length === months) { // 모든 데이터를 가져왔을 때 응답
                res.json(responseData);
                console.log("--------");
                console.log(responseData);
            }
        });
    }
});