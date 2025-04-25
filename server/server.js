const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const { randomInt } = require('crypto');

var connections = [];
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


class Ship{
    constructor(name, length, rotation, x, y){
        this.name = name;
        this.length = length;
        this.rotation = rotation; // 0 = horizontal, 1 = vertical
        this.x = x;
        this.y = y;
        this.hits = 0;
        this.sunk = false;
    }
}
class Game{

    constructor(hostShips, guestShips){
        this.gameID = randomInt(100,999).toString();
        this.hostTurn = true;
        this.host = null;
        this.guest = null;
        this.hostShips = null;
        this.guestShips = null;
        this.gameOver = false;
        
    }


}

function checkForHit(ship, x, y){
    if(ship.rotation == 0){ // horizontal
        if(x >= ship.x && x < ship.x + ship.length && y == ship.y){
            return true;
        }
    }else{ // vertical
        if(x == ship.x && y >= ship.y && y < ship.y + ship.length){
            return true;
        }
    }
    return false;
}

// Client opens a lobby, returns a game code for the lobby
app.post('/startgame', (req, res) => {
    res.sendFile('../public/gamepage.html', {root: __dirname});
    console.log("Host connected, waiting for second player");
    let game = new Game();
    game.host = req.body.hostName;
    connections.push(game);
    res.status(200).json({ gameID: game.gameID });
})

// Guest client joins lobby with game code
app.post('/login', (req, res) => {
    let filePath = path.join(__dirname, 'public', 'gamepage.html')
    res.sendFile(filePath);
    console.log("Guest connected, starting game...");

    const { gameID } = req.body;
    const game = connections.find(g => g.gameID === gameID);
    if (game && game.guest === null) {
        game.guest = req.body.guestName;
        res.status(200).json({ message: "Guest joined the game", gameID: game.gameID });
    } else {
        res.status(404).json({ message: "Game not found or game full" });
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
    
    const { gameID, playerID, ships } = req.body;
    const game = connections.find(g => g.gameID === gameID);
    if (game) {
        if (playerID === 'host') {
            game.hostShips = ships;
        } else if (playerID === 'guest') {
            game.guestShips = ships;
        }
        if (game.hostShips && game.guestShips) {
            res.status(200).json({ message: "Both players have set up their ships, game can start" });
        } else {
            res.status(200).json({ message: "Ships set up successfully" });
        }
    } else {
        res.status(404).json({ message: "Game not found" });
    }
})

// A player takes a shot
//TODO Consolidate processing the shot
app.post('/shoot', (req, res) => {
    const { gameID, playerID, x, y } = req.body;
    const game = connections.find(g => g.gameID === gameID);
    var allSunk = true;
    if (game) {
        // Process the shot here
        console.log(`Shot taken by player ${playerID} at (${x}, ${y})`);
        if (playerID === 'host') {
            game.hostTurn = !game.hostTurn;
            
            for (let ship of game.guestShips) {
                
                if (checkForHit(ship, x, y)) {
                    console.log("Hit!");
                    ship.hits++;
                    if (ship.hits >= ship.length) {
                        ship.sunk = true;
                        console.log(`Guest's ${ship.name} has been sunk!`);
                    }
                }
            }
            for (let ship of game.guestShips) {
                if (!ship.sunk) {
                    allSunk = false;
                    break;
                }
            }
            
        } else if (playerID === 'guest') {
            game.hostTurn = true;
            for (let ship of game.hostShips) {
                
                if (checkForHit(ship, x, y)) {
                    console.log("Hit!");
                    ship.hits++;
                    if (ship.hits >= ship.length) {
                        ship.sunk = true;
                        console.log(`${ship.name} has been sunk!`);
                    }
                }
            }
            for (let ship of game.hostShips) {
                if (!ship.sunk) {
                    allSunk = false;
                    break;
                }
            }
        }


        if (allSunk) {
            game.gameOver = true;
            return res.status(200).json({ message: "Game over", winner: playerID });
        }


        res.status(200).json({ message: "Shot taken", x: x, y: y });
    } else {
        res.status(404).json({ message: "Game not found" });
    }

})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})