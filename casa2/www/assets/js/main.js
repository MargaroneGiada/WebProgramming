const btnLogin = document.querySelector("#btnLogin");
const btnNoAccount = document.querySelector("#btnNoAccount");
const btnAlreadyAccount = document.querySelector("#btnAlreadyAccount");
const btnRegister = document.querySelector("#btnRegister");
const userLogin = document.querySelector("#userLogin");
const passLogin = document.querySelector("#pass");
const LoginPage = document.querySelector("#LogContainer");
const RegisterPage = document.querySelector("#RegContainer");
const Dashboard = document.querySelector("#Dashboard");
const SensorContainer = document.querySelector("#sensorContainer");

let socket;

let displaySensors = (user) => {
    for(let sens of user.sensors){
        let sensorInfo = `
          <div class="sensorImage">

          </div>
          <div class = "sensorInfo">
            <span id="sensorName">${sens.name}</span>
            <span id="sensorType">${sens.type}</span>
            <span id="sensorValue">${sens.updateTime}</span>
          </div>`;
        let sensorBox = document.createElement("div");
        sensorBox.classList = "sensorBox"
        sensorBox.innerHTML = sensorInfo;

        SensorContainer.appendChild(sensorBox);

    }
}

btnLogin.addEventListener("click", () => {

    socket = io();
    socket.on("connect", async () => {
        const resp = await fetch("/api/user/" + userLogin.value);
        const user = await resp.json();
        if (user) {
            if (user.password == passLogin.value) {
                LoginPage.classList = "wrapper hidden";
                Dashboard.classList = "wrapper";
                displaySensors(user);
            }
            else {
                alert("User not found or password incorrect");
                socket.on("disconnect", ()=>{});
            }
        } else {
            alert("User not found or password incorrect");
                socket.on("disconnect", ()=>{});
        }
    });
});

btnNoAccount.addEventListener("click", () => {
    LoginPage.classList = "wrapper hidden";
    RegisterPage.classList = "wrapper";
});


btnAlreadyAccount.addEventListener("click", () => {
    LoginPage.classList = "wrapper";
    RegisterPage.classList = "wrapper hidden";
});