const ribbonBtn = document.getElementById("button-ribbon");
const profileBtn = document.getElementById("button-profile");
const friendsBtn = document.getElementById("button-friends");
const searchBtn = document.getElementById("button-search");

const ribbonContainer = document.getElementById("conteiner-ribbon") ;
const profileContainer = document.getElementById("conteiner-profile");
const friendsContainer = document.getElementById("conteiner-friends");
const searchContainer = document.getElementById("conteiner-search");
const optionsContainer = document.getElementById("conteiner-options");

function ribbon() {
    ribbonBtn.classList.add("active");
    profileBtn.classList.remove("active");
    friendsBtn.classList.remove("active");
    searchBtn.classList.remove("active");

    ribbonContainer.classList.remove("off");
    profileContainer.classList.add("off");
    friendsContainer.classList.add("off");
    searchContainer.classList.add("off");
    optionsContainer.classList.add("off");
}

function profile() {
    ribbonBtn.classList.remove("active");
    profileBtn.classList.add("active");
    friendsBtn.classList.remove("active");
    searchBtn.classList.remove("active");

    ribbonContainer.classList.add("off");
    profileContainer.classList.remove("off");
    friendsContainer.classList.add("off");
    searchContainer.classList.add("off");
    optionsContainer.classList.add("off");

    const name = localStorage.getItem("namest");
    document.getElementById("profileName").textContent = `${name}`;
}

function friends() {
    ribbonBtn.classList.remove("active");
    profileBtn.classList.remove("active");
    friendsBtn.classList.add("active");
    searchBtn.classList.remove("active");

    ribbonContainer.classList.add("off");
    profileContainer.classList.add("off");
    friendsContainer.classList.remove("off");
    searchContainer.classList.add("off");
    optionsContainer.classList.add("off");
}

function search() {
    ribbonBtn.classList.remove("active");
    profileBtn.classList.remove("active");
    friendsBtn.classList.remove("active");
    searchBtn.classList.add("active");

    ribbonContainer.classList.add("off");
    profileContainer.classList.add("off");
    friendsContainer.classList.add("off");
    searchContainer.classList.remove("off");
    optionsContainer.classList.add("off");
}

function setings() {
    ribbonBtn.classList.remove("active");
    profileBtn.classList.remove("active");
    friendsBtn.classList.remove("active");
    searchBtn.classList.remove("active");

    ribbonContainer.classList.add("off");
    profileContainer.classList.add("off");
    friendsContainer.classList.add("off");
    searchContainer.classList.add("off");
    optionsContainer.classList.remove("off");

    const name = localStorage.getItem("namest");
    const login = localStorage.getItem("loginst");

    document.getElementById("optionsName").textContent = `${name}`;
    document.getElementById("optionsLogin").textContent = `${login}`;
}