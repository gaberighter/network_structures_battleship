const https = require('https');
const fs = require('fs');

var connections = [];
var num_games = 0;
app.use(express.json());
class Game{
    
    constructor(){
        this.gameID = num_games
        
    }


}



// Client opens a lobby, returns a game code for the lobby
app.post('/startgame', (req, res) => {
    
})

// Guest client joins lobby with game code
app.post('/login', (req, res) => {

})

// Client posts initial position and rotation of their ships
app.post('/setup', (req, res) => {


})

// A player takes a shotd
app.post('/shoot', (req, res) => {


})