async function enterspase() {
    var login = document.getElementById("login").value;
    var password = document.getElementById("password").value;
    const authorizationContainer = document.getElementById("authorizationContainer");

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password })
    });

    const data = await response.json();

    localStorage.setItem("loginst", data.login);
    localStorage.setItem("namest", data.name);

    if (response.status === 201) {
        authorizationContainer.classList.add("off")
        document.getElementById("login").value = "";
        document.getElementById("password").value = "";

    } else {
        const result = await response.json();
        alert(result.message);
    }
}

async function registration() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var login = document.getElementById("RgLogin").value;
    var password = document.getElementById("RgPassword").value;
    const authorization = document.getElementById("authorization");
    const registration = document.getElementById("registration");

    const response = await fetch('http://localhost:3000/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, login, password })
    });

    const result = await response.json();

    if (response.status === 201) {
        document.getElementById("email").value = "";
        document.getElementById("name").value = "";
        document.getElementById("RgLogin").value = "";
        document.getElementById("RgPassword").value = "";
        alert("Пользователь зарегестрирован")
        registration.classList.remove("on")
        registration.classList.add("off")
        authorization.classList.remove("off");
        authorization.classList.add("on");
    } else {
        alert("Ошибка" +result.message)
    }
}

function windowRegistration() {
    const authorization = document.getElementById("authorization");
    const registration = document.getElementById("registration");

    authorization.classList.remove("on");
    authorization.classList.add("off");
    registration.classList.remove("off");
    registration.classList.add("on");
}

function beck() {
    const authorization = document.getElementById("authorization");
    const registration = document.getElementById("registration");

    document.getElementById("email").value = "";
    document.getElementById("name").value = "";
    document.getElementById("RgLogin").value = "";
    document.getElementById("RgPassword").value = "";

    authorization.classList.remove("off");
    authorization.classList.add("on");
    registration.classList.remove("on");
    registration.classList.add("off");
}

function exit() {
    const authorizationContainer = document.getElementById("authorizationContainer");

    authorizationContainer.classList.remove("off");
    localStorage.clear()
}