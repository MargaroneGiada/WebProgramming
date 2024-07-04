const express = require("express");

const serverExpress = express();

const serverHTTP = require('http').Server(serverExpress);
const serverSocketIO = require('socket.io')(serverHTTP);

serverExpress.use(express.static("./www"));

const listUsers = [];

serverExpress.get("/api/users", (req, resp) => {
    resp.json(listUsers);
})

//gestione web socket

serverSocketIO.on("connection", (socketClient) => {
    console.log("Client Collegtao");

    socketClient.on("disconnect", () => {
        console.log("Il client si è disconnesso");
        for(const index in listUsers){
            if(listUsers[index].id == socketClient.id){
                listUsers.splice(index, 1);
                break;
            }
        }
        if(socketClient.nickname){
            serverSocketIO.sockets.emit("userLogged", nickname);
        }
    });

    socketClient.on("userLogged", (nickname) => {
        socketClient("nickname") = nickname;
        socketClient.broadcast.emit("userLogged", nickname);
        const userObject = {id: socketClient.id,
            nickname: nickname
        };
        listUsers.push(userObject);
    });



})



serverHTTP.listen(8080);

