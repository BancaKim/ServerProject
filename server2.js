const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql2');

// Multer 설정: 이미지를 'uploads/' 폴더에 저장
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
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


// 데이터 불러오기
app.get('/getPosts', (req, res) => {
    let responseData = {};
    let sql = 'SELECT * FROM product_enroll_list';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (rows.length > 0) {
            responseData.state = 'ok';
            responseData.data = rows.map(row => ({
                ...row,
                product_pic: row.product_pic ? Buffer.from(row.product_pic).toString('base64') : null
            }));
        } else {
            responseData.state = 'none';
        }
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
    const image = req.file ? req.file.path : null;
    const query = "INSERT INTO product_enroll_list (user_id, product_title, product_content, product_pic) VALUES ('a', ?, ?, ?)";

    connection.query(query, [title, content, image], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        console.log('Insert result:', results);
        res.send('Post created with ID: ' + results.insertId);
    });
});