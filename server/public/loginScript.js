//const express = require("express")

onload = initLoginPage

function initLoginPage(){
    const joinButton = document.getElementById("join-button")
    const createButton = document.getElementById("create-button")
    console.log("Initializing login page")
    joinButton.onclick = joinGame
    createButton.onclick = createGame
}

function sendStartMessage(code, userid, state) {
    const route = `/${state}`;

    fetch(route,
        {
           method: "POST",
           body: JSON.stringify({
               id: userid,
               gameid: code,
           }),
           headers: {
               "Content-type": "application/json",
           },
        })
        .then((response) => {
            if (response.ok) {
                localStorage.setItem("gameId", code);
                localStorage.setItem("userId", userid);
                console.log("Game started successfully");
                window.location.href = "waiting.html";
            } else {
                console.error("Error starting game:", response.statusText);
            }
        })
}

function joinGame() {
    const code = document.getElementById("game-id").value;
    const userid = document.getElementById("user-id").value;
    sendStartMessage(code, userid, "login")
}

function createGame() {
    const code = document.getElementById("game-id").value;
    const userid = document.getElementById("user-id").value;
    console.log("Creating game with code: " + code + " and user id: " + userid)
    sendStartMessage(code, userid, "startgame")
}