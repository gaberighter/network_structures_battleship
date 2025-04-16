onload = initLoginPage

function initLoginPage(){
    const joinButton = document.getElementById("join-button")
    const createButton = document.getElementById("create-button")

    joinButton.onclick = joinGame
    createButton.onclick = createGame
}

function joinGame() {
    const code = document.getElementById("game-id").value;
}

function createGame() {
    const code = document.getElementById("game-id").value;
}