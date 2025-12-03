function newPostss() {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("media", file); // сам файл
    formData.append("user_id", CURRENT_USER_ID); // важный параметр

    fetch("/api/create_post.php", {
        method: "POST",
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            addPostToProfile(data.post);
        }
    });
}

