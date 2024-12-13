const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'root'
});

app.post('login', (req, res) => {
    const sql = "SELECT * FROM login WHERE username = ? AND password = ?"
    const values = [
        req.body.email,
        req.body.password
    ]
    db.query(sql, [req.body.email], (err, data) => {
        if(err) return res.json("Login Failed");
        return res.json(data);
    })
})


connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});



app.listen(8080, () => {
  console.log(`Server is running on port ${port}`);
});