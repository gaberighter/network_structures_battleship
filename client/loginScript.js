const express = require("express")

onload = initLoginPage

function initLoginPage(){
    const joinButton = document.getElementById("join-button")
    const createButton = document.getElementById("create-button")

    joinButton.onclick = joinGame
    createButton.onclick = createGame
}

function sendStartMessage(code, userid, state) {
    const route = "../server/${state}"

    fetch(route,
        {
           method: "POST",
           body: JSON.stringify
           ({
            id: userid,
            gameid: code,
           }),
           headers: {
            "Content-type": "application/json",
           },
        })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

function joinGame() {
    const code = document.getElementById("game-id").value;
    const userid = document.getElementById("user-id").value;
    sendStartnMessage(code, userid, "login")
}

function createGame() {
    const code = document.getElementById("game-id").value;
    const userid = document.getElementById("user-id").value;
    sendStartMessage(code, userid, "startgame")
}