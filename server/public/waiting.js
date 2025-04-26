onload = initWaitingPage

function initWaitingPage(){
    setInterval(pollServer, 1000)
}

function pollServer(){
    this.fetch("/gameready", {
        method: "POST",
        body: JSON.stringify({
            gameid: localStorage.getItem("gameId"),
        }),
        headers: {
            "Content-type": "application/json",
        },
    })
}