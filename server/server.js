const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const { randomInt } = require('crypto');

var connections = [];
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

class Game{
    


    constructor(){
        this.gameID = randomInt(100,999).toString();
        this.hostTurn = true;
        this.host = null;
        this.guest = null;
        
    }


}



// Client opens a lobby, returns a game code for the lobby
app.post('/startgame', (req, res) => {
    res.sendFile('gamepage.html', {root: __dirname});
    console.log("Host connected, waiting for second player");
    let game = new Game();
    game.host = req.body.hostName;
    connections.push(game);
    res.status(200).json({ gameID: game.gameID });
})

// Guest client joins lobby with game code
app.post('/login', (req, res) => {
    let filePath = path.join(__dirname, 'gamepage.html')
    res.sendFile(filePath);
    console.log("Guest connected, starting game...");

    const { gameID } = req.body;
    const game = connections.find(g => g.gameID === gameID);
    if (game) {
        game.guest = req.body.guestName;
        res.status(200).json({ message: "Guest joined the game", gameID: game.gameID });
    } else {
        res.status(404).json({ message: "Game not found" });
    }
})

// Guest client connects to the website
app.get('/', (req, res) => {
    let filePath = path.join(__dirname, 'public', 'login.html');
    res.sendFile(filePath);
    console.log("User connected to server");
})

// Client posts initial position and rotation of their ships
app.post('/setup', (req, res) => {
    

})

// A player takes a shot
app.post('/shoot', (req, res) => {


})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})