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

// Убеждаемся, что папка publicate существует
const publicateDir = path.join(__dirname, "publicate");
if (!fs.existsSync(publicateDir)) {
    fs.mkdirSync(publicateDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const user_id = req.body.user_id;

        if (!user_id) {
            return cb(new Error('user_id обязателен для загрузки файла'), null);
        }

        const userFolder = path.join(__dirname, "publicate", String(user_id));

        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        cb(null, userFolder);
    },

    filename: function (req, file, cb) {
        const unique = Date.now() + "_" + Math.random().toString(36).substring(7) + "_" + file.originalname;
        cb(null, unique);
    }
});

const upload = multer({ storage });

server.post('/login', async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ message: 'Введите логин или пароль' });

    connection.query('SELECT * FROM users WHERE login = ?', [login], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Ошибка сервера', err });

        if (results.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });

        const user = results[0];
        if (password === user.password) {
            return res.status(201).json({
                user_id: user.id,
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
        return res.json({message: 'заполните поля'})
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

// Обработка ошибок multer
server.post("/api/create_post", (req, res, next) => {
    upload.single("media")(req, res, (err) => {
        if (err) {
            console.error("Ошибка загрузки файла:", err);
            return res.status(400).json({ success: false, message: "Ошибка при загрузке файла: " + err.message });
        }
        next();
    });
}, (req, res) => {
    try {
        const { user_id, content } = req.body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: "user_id обязателен" });
        }

        let media_url = null;

        if (req.file) {
            media_url = `/publicate/${user_id}/${req.file.filename}`;
        }

        connection.query(
            "INSERT INTO posts (author_id, content, media_url) VALUES (?, ?, ?)",
            [user_id, content, media_url],
            (err, result) => {
                if (err) {
                    console.error("Ошибка при создании поста:", err);
                    return res.status(500).json({ success: false, error: err.message });
                }

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
    } catch (error) {
        console.error("Ошибка при обработке запроса:", error);
        res.status(500).json({ success: false, message: "Ошибка сервера", error: error.message });
    }
});

// Получение постов пользователя
server.get("/api/user_posts/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    connection.query(
        `SELECT p.*, u.full_name, u.login 
         FROM posts p 
         JOIN users u ON p.author_id = u.id 
         WHERE p.author_id = ? 
         ORDER BY p.id DESC`,
        [user_id],
        (err, results) => {
            if (err) {
                console.error("Ошибка при получении постов:", err);
                return res.status(500).json({ success: false, error: err.message });
            }

            res.json({
                success: true,
                posts: results
            });
        }
    );
});

// Получение всех постов (для ленты)
server.get("/api/all_posts", (req, res) => {
    connection.query(
        `SELECT p.*, u.full_name, u.login 
         FROM posts p 
         JOIN users u ON p.author_id = u.id 
         ORDER BY p.id DESC`,
        (err, results) => {
            if (err) {
                console.error("Ошибка при получении всех постов:", err);
                return res.status(500).json({ success: false, error: err.message });
            }

            res.json({
                success: true,
                posts: results
            });
        }
    );
});

server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)})