const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require("path")
const fs = require("fs");

const server = express()
const PORT = 3000;

server.use(cors());
server.use(express.json());
server.use("/publicate", express.static(path.join(__dirname, "publicate")));

const connection = mysql.createConnection({
    host: '82.117.87.98',
    user: 'root',
    password: 'xobbit1306',
    database: 'hobbit',
    port: 25565,
    insecureAuth: true
});

connection.connect((err) => {
    if (err) {
        console.error('ошибка подключения', err)
    } else {
        console.log('подключенно')
    }
})

const storage = multer.diskStorage({
    destination: async function(req, file, cb) {
        const user_id = req.body.user_id;

        const userFolder = path.join(__dirname, "publicate", user_id);

        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        cb(null, userFolder);
    },

    filename: function (req, file, cb) {
        const unique = Date.now() + "_" + file.originalname;
        cb(null, unique);
    }
});

server.post('/login', async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ message: 'Введите логин или пароль' });

    connection.query('SELECT * FROM users WHERE login = ?', [login], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Ошибка сервера', err });

        if (results.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });

        const user = results[0];
        if (password === user.password) {
            return res.status(201).json({
                login: user.login,
                name: user.full_name,
                message: 'good'
            });
        } else {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }
    });
})

server.post('/registration', async (req, res) => {
    const {name, email, login, password} = req.body;

    if (!name || !email || !login || !password) {
        if (err) return res.json({message: 'заполните поля'})
    }

    connection.query('SELECT * FROM users WHERE login = ?', [login], async (err, results) => {
        if (err) return res.json({massege: 'ошибка сервера'})

        if (results.length > 0) {
            return res.json({message: 'Такой логин уже существует'});
        }
    })

    connection.query(
        'INSERT INTO users (full_name, email, login, password) VALUES (?, ?, ?, ?)',
        [name, email, login, password],
        (err, result) => {
            if (err) return res.json({message: "Ошибка при создании пользователя"})

            return res.status(201).json({message: "Пользователь успешно создан"})
        }
    )
})

server.post("/api/create_post", upload.single("media"), (req, res) => {
    const { user_id, content } = req.body;
    let media_url = null;

    if (req.file) {
        media_url = `/publicate/${user_id}/${req.file.filename}`;
    }

    connection.query(
        "INSERT INTO posts (author_id, content, media_url) VALUES (?, ?, ?)",
        [user_id, content, media_url],
        (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err });

            res.json({
                success: true,
                post: {
                    id: result.insertId,
                    content,
                    media_url
                }
            });
        }
    );
});


const upload = multer({ storage });

server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)})