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
    const route = `/${state}`

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
    sendStartMessage(code, userid, "login")
}

function createGame() {
    const code = document.getElementById("game-id").value;
    const userid = document.getElementById("user-id").value;
    console.log("Creating game with code: " + code + " and user id: " + userid)
    sendStartMessage(code, userid, "startgame")
    function pollGameReady() {
        console.log("Waiting for game to be ready");
        fetch("/gameready/:code", {
            method: "GET",
            body: JSON.stringify({gameid: code}),
            headers: {
                "Content-type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.message === "Game is ready") {
                console.log("Game is ready");
                window.location.href = "/gamepage.html";
            } else {
                console.log("Game not ready yet");
                setTimeout(pollGameReady, 1000);
            }
        });
    }

    pollGameReady();
}