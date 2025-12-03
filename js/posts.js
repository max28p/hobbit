// Функция для перемешивания массива (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Загрузка и отображение постов пользователя
async function loadUserPosts() {
    const user_id = localStorage.getItem("user_id");
    const myPostsContainer = document.querySelector(".my-posts");

    if (!user_id || !myPostsContainer) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/user_posts/${user_id}`);
        const data = await response.json();

        if (data.success && data.posts) {
            displayPosts(data.posts, myPostsContainer);
        } else {
            console.error("Ошибка при загрузке постов:", data.error);
        }
    } catch (error) {
        console.error("Ошибка при загрузке постов:", error);
    }
}

// Загрузка и отображение всех постов в ленте
async function loadAllPosts() {
    const ribbonContainer = document.getElementById("conteiner-ribbon");

    if (!ribbonContainer) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/all_posts`);
        const data = await response.json();

        if (data.success && data.posts) {
            // Перемешиваем посты в случайном порядке
            const shuffledPosts = shuffleArray(data.posts);
            displayPosts(shuffledPosts, ribbonContainer);
        } else {
            console.error("Ошибка при загрузке постов:", data.error);
            ribbonContainer.innerHTML = "<p style='text-align: center; padding: 20px; color: #999;'>Ошибка при загрузке постов</p>";
        }
    } catch (error) {
        console.error("Ошибка при загрузке постов:", error);
        ribbonContainer.innerHTML = "<p style='text-align: center; padding: 20px; color: #999;'>Ошибка при загрузке постов</p>";
    }
}

// Отображение постов в контейнере
function displayPosts(posts, container) {
    // Очищаем контейнер
    container.innerHTML = "";

    if (posts.length === 0) {
        container.innerHTML = "<p style='text-align: center; padding: 20px; color: #999;'>Пока нет постов</p>";
        return;
    }

    posts.forEach(post => {
        // Создаем новый div для каждого поста
        const postDiv = document.createElement("div");
        postDiv.className = "post-item";
        postDiv.style.cssText = `
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #fff;
        `;

        // Имя пользователя (вверху)
        const userName = document.createElement("div");
        userName.className = "post-author";
        userName.textContent = post.full_name || post.login || "Пользователь";
        userName.style.cssText = `
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 15px;
            color: #333;
        `;
        postDiv.appendChild(userName);

        // Фотография (если есть)
        if (post.media_url) {
            const imageDiv = document.createElement("div");
            imageDiv.className = "post-image";
            imageDiv.style.cssText = "margin-bottom: 15px;";
            
            const img = document.createElement("img");
            img.src = `http://localhost:3000${post.media_url}`;
            img.alt = "Пост пользователя";
            img.style.cssText = `
                max-width: 500px;
                max-height: 400px;
                width: auto;
                height: auto;
                border-radius: 8px;
                display: block;
                object-fit: contain;
            `;
            img.onerror = function() {
                this.style.display = "none";
            };
            
            imageDiv.appendChild(img);
            postDiv.appendChild(imageDiv);
        }

        // Подпись (текст поста)
        if (post.content && post.content.trim()) {
            const contentDiv = document.createElement("div");
            contentDiv.className = "post-content";
            contentDiv.textContent = post.content;
            contentDiv.style.cssText = `
                font-size: 16px;
                line-height: 1.5;
                color: #555;
                white-space: pre-wrap;
                word-wrap: break-word;
            `;
            postDiv.appendChild(contentDiv);
        }

        container.appendChild(postDiv);
    });
}

function newPostss() {
    const containerPosts = document.getElementById("containerPosts");
    if (containerPosts) {
        containerPosts.classList.remove("off");
    }
}

function exitPosts() {
    const containerPosts = document.getElementById("containerPosts");
    if (containerPosts) {
        containerPosts.classList.add("off");
    }
    // Очищаем форму
    document.getElementById("profileTextarea").value = "";
    document.getElementById("profileInput").value = "";
}

function createPosts() {
    const user_id = localStorage.getItem("user_id");
    const content = document.getElementById("profileTextarea").value;
    const fileInput = document.getElementById("profileInput");
    const file = fileInput.files[0];

    if (!user_id) {
        alert("Ошибка: пользователь не авторизован");
        return;
    }

    if (!content.trim() && !file) {
        alert("Заполните текст или выберите изображение");
        return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("user_id", user_id);
    
    if (file) {
        formData.append("media", file);
    }

    fetch("http://localhost:3000/api/create_post", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Пост успешно создан!");
            // Очищаем форму
            document.getElementById("profileTextarea").value = "";
            fileInput.value = "";
            // Закрываем форму создания поста
            exitPosts();
            // Обновляем список постов в профиле
            loadUserPosts();
            // Обновляем ленту, если она открыта
            const ribbonContainer = document.getElementById("conteiner-ribbon");
            if (ribbonContainer && !ribbonContainer.classList.contains("off")) {
                loadAllPosts();
            }
        } else {
            alert("Ошибка при создании поста: " + (data.error || data.message || "Неизвестная ошибка"));
        }
    })
    .catch(error => {
        console.error("Ошибка:", error);
        alert("Ошибка при отправке поста");
    });
}

function exitPosts() {
    const containerPosts = document.getElementById("containerPosts");
    if (containerPosts) {
        containerPosts.classList.add("off");
    }
    // Очищаем форму
    document.getElementById("profileTextarea").value = "";
    document.getElementById("profileInput").value = "";
}

function newPostss() {
    const containerPosts = document.getElementById("containerPosts");
    if (containerPosts) {
        containerPosts.classList.remove("off");
    }
}

