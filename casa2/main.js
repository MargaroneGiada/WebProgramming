const express = require('express')
const fs = require("fs");
const serverExpress = express();
const serverHTTP = require('http').Server(serverExpress);
const serverSocketIO = require('socket.io')(serverHTTP);

serverExpress.use(express.static("./www"));

const readJSON = () => {
    const data = fs.readFileSync("./database/users.json");
    return JSON.parse(data);
};

const writeJSON = (data) => {
    fs.writeFileSync("./database/users.json", JSON.stringify(data));
};

serverExpress.get("/api/user/:user", (req, resp) =>{
    let data = readJSON();
    const user = data.users.find(user => user.username === req.params.user);
    if(user){
        return resp.json(user);
    }else{
        return resp.status(404).json({message: "User not found"});
    }
});

serverSocketIO.on("connection", (socketClient)=>{
    socketClient.on("disconnect", () => {
        console.log("CIAONE");
    });

    socketClient.on("newUser", (username, pass) => {
        let data = readJSON();
        const user = data.users.find(user => user.username === username);
        if(!user){
            const user = {
                username : username,
                password : pass,
                sensors : []
            }
            data.users.push(user);
            writeJSON(data);
        }else{
            socketClient.emit("usernameUsed", ()=>{});
        }
    });
});

serverHTTP.listen(8080);