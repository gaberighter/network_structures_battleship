onload = initWaitingPage

function initWaitingPage(){
    setInterval(pollServer, 1000)
}

function pollServer(){
    fetch("/gameready", {
        method: "POST",
        body: JSON.stringify({
            gameid: localStorage.getItem("gameId"),
        }),
        headers: {
            "Content-type": "application/json",
        },
    })
    .then((response) => {
        if (response.ok) {
            console.log("Game started successfully");
            window.location.href = "gamepage.html";
        } else {
            console.error("Error starting game:", response.statusText);
        }
    })
}