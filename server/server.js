const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const { randomInt } = require('crypto');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var connections = [];
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('a user connected with socket id:', socket.id);
    
    // Store socket ID when player joins a game
    socket.on('join-game', (data) => {
        const { gameid, playerType } = data;
        socket.join(gameid); // Join socket.io room for this game
        
        const game = connections.find(g => g.gameid === gameid);
        if (game) {
            if (playerType === 'host') {
                game.hostSocketId = socket.id;
            } else if (playerType === 'guest') {
                game.guestSocketId = socket.id;
            }
            
            // If both players are now connected with sockets
            if (game.hostSocketId && game.guestSocketId) {
                io.to(gameid).emit('game-ready', { message: 'Both players connected! Game can start.' });
            }
        } else {
            console.log("Game not found with ID:", gameid);
            socket.emit('error', { message: 'Game not found' });
        }
    });
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
        // Handle player disconnection logic if needed
    });
});

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
    constructor(gameid, hostShips, guestShips){
        this.gameid = gameid;
        this.hostTurn = true;
        this.host = null;
        this.guest = null;
        this.hostShips = null;
        this.guestShips = null;
        this.gameOver = false;
        this.hostSocketId = null; // Add socket ID tracking
        this.guestSocketId = null; // Add socket ID tracking
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
    const {id, gameid} = req.body;
    res.sendFile(path.join(__dirname, 'public', 'gamepage.html'));
    console.log("Host connected, waiting for second player");
    
    if(connections.find(g => g.gameid === gameid)){
        console.log("Game already exists with ID:", gameid);
        return res.status(403).json({ message: "Game already exists" });
    }

    // Create a new game with proper initialization
    let game = new Game(gameid);
    game.host = req.body.hostName;
    game.guest = null; // Explicitly set guest to null
    
    connections.push(game);
    console.log("Created game with ID:", game.gameid);
    console.log("Current games:", connections.map(g => g.gameid));
    
    let filePath = path.join(__dirname, 'public', 'waiting.html');
    res.status(200)
        .sendFile(filePath);
    
})

app.post('/gameready', (req, res) => {
    console.log("Checking if game is ready with ID:", req.body.gameid);
    const game = connections.find(g => g.gameid === req.body.gameid);
    if (game.guest !== null) {
        res.status(200).json({ message: "Game is ready", gameid: game.gameid });
    } else {
        res.status(404).json({ message: "Game not ready yet" });
    }
});

// Guest client joins lobby with game code
app.post('/login', (req, res) => {
    let filePath = path.join(__dirname, 'public', 'gamepage.html');
    res.sendFile(filePath);
    
    const { gameid, id } = req.body;
    console.log("Guest attempting to join game:", gameid);
    console.log("Available games:", connections.map(g => g.gameid));
    
    const game = connections.find(g => g.gameid === gameid);
    
    if (game) {
        console.log("Game found:", game.gameid, "Current guest:", game.guest);
        if (game.guest === null) {
            game.guest = id || req.body.id;
            console.log("Guest joined successfully:", game.guest);


            // Send success response but don't attempt to send another response later
            res.status(200)
                .sendFile(path.join(__dirname, 'public', 'gamepage.html'));

            
        } else {
            console.log("Game is already full");
            res.status(403).json({ message: "Game is already full" });
        }
    } else {
        console.log("Game not found with ID:", gameid);
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
    
    const { gameid, playerID, ships } = req.body;
    const game = connections.find(g => g.gameid === gameid);
    if (game) {
        if (playerID === 'host') {
            game.hostShips = ships;
        } else if (playerID === 'guest') {
            game.guestShips = ships;
        }
        
        // If both players have set up their ships, notify them
        if (game.hostShips && game.guestShips) {
            io.to(gameid).emit('ships-ready', { message: 'Both players have set up their ships. Game is starting!' });
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
    const { gameid, playerID, x, y } = req.body;
    const game = connections.find(g => g.gameid === gameid);
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

// Use 'server' instead of 'app' for Socket.IO to work
server.listen(3000, () => {
    console.log("Server running on port 3000");
});