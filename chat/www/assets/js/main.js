const nicknameInput = document.querySelector("#nicknameInput");
const btnLogin = document.querySelector("#btn-login");

let nicknameUser = "";
const loginView = document.querySelector("#loginform");
const chatView = document.querySelector("#chatview");

let socket;

btnLogin.addEventListener("click", () => {
    nicknameUser = nicknameInput.value;

    socket = io();

    socket.on("connect", () => {
        console.log("Connesso");
        loginView.classList = "container-fluid h-100 hidden";
        chatView.classList = "container-fluid h-100";
        socket.emit("userLogged", nicknameUser);
        const resp = fetch("/api/users");
        const listUsers = resp.json();
    })

    socket.on("disconnect", () => {
        console.log("Disconnesso");
        loginView.classList = "container-fluid h-100";
        chatView.classList = "container-fluid h-100 hidden";
    })

    socket.on("userLogged", (nicknameLogged) => {
        console.log("Tizio si è connesso", nicknameLogged);
    });

    socket.on("userDisconnected", (nicknameLogged) => {
        console.log("Tizio si è disconnected", nicknameLogged);
    });
})