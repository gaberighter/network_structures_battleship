const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

var connections = [];
var num_games = 0;
app.use(express.json());
class Game{
    


    constructor(){
        this.gameID = num_games++;
        
    }


}



// Client opens a lobby, returns a game code for the lobby
app.post('/startgame', (req, res) => {
    res.sendFile('../client/gamepage.html', {root: __dirname});
    console.log("Host connected, waiting for second player");
})

// Guest client joins lobby with game code
app.post('/login', (req, res) => {
    res.sendFile('../client/gamepage.html', {root: __dirname});
    console.log("Guest connected, starting game...");

})

// Guest client connects to the website
app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile('../client/login.html', {root: __dirname});
})

// Client posts initial position and rotation of their ships
app.post('/setup', (req, res) => {
    

})

// A player takes a shotd
app.post('/shoot', (req, res) => {


})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})