const express = require("express");
const cors = require("cors");
const app = express();
const port = 3004;
const mysql = require("mysql");
const fs = require("fs");

const db = fs.readFileSync('./database.json');

const conf = JSON.parse(db);

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database,
})

app.use(express.json());
app.use(cors());


app.get('/login', async (req, res)=>{
    connection.query(
        "select * from login",
        (err,rows)=>{
            if(err){
                console.log(err);
            }
            res.send(rows)
        }
    )
})
app.post('/user', async (req, res)=>{
    const {userId, userPw} =  req.body;
    connection.query(
        //userId로 값을 찾는데 값의 컬럼 이름을 result로 받음. 컬럼에 나오는 결과값은 userId의 개수
        `select * from login where userId = '${userId}'`,
        (err, row) => {
            const result = row[0];
            //에러가 나지 않았을 때(정상적으로 값을 받아왔을 때)
            if(!err){
                if(!result){
                    res.send('id is undefined');
                }else{
                    if(userPw !== result.userPw){
                        res.send('pw is undefined');
                    }else{
                        res.send('login successed');
                    }
                }
            }else{
                console.log(err);
            }
            
        }
    )
})

app.listen(port, ()=>{
    console.log("로그인 서버 작동중");
})