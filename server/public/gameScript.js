//const { response } = require("express")

const shipDict = [{"CARRIER": 5, "BATTLESHIP":4, "CRUISER": 3, "SUBMARINE": 3, "DESTROYER": 2}]
const shipNames = ["CARRIER", "BATTLESHIP", "CRUISER", "SUBMARINE", "DESTROYER"]
const shipPositions = []

const shipContainer = document.getElementById('player-board')

onload = initGamePage;

function initGamePage(){
    createTargetBoard();
    createShipBoard();
    initSetup()
}

function initSetup() {
    initSetupControls()
    initShips()
}

function initSetupControls() {
    const controlBox = document.getElementById('control-box');
    const readyButton = document.createElement('button');
    readyButton.setAttribute('id', 'ready-button')
    readyButton.onclick = startGame;
    const buttonText = document.createTextNode("Start Game")
    readyButton.appendChild(buttonText)
    controlBox.appendChild(readyButton)
    
    addRandomFillButton();
}

function startGame() {
    if (shipPositions.length == shipNames.length) {
        const route = `/setup`
        console.log("Starting game with ship positions: ", shipPositions);
        fetch(route,
            {
            method: "POST",
            body: JSON.stringify(shipPositions),
            headers: {
                "gameid": localStorage.getItem("gameId"),
                "userid": localStorage.getItem("userId"),
                "Content-type": "application/json",
            }
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((response) => {
                console.log("Game started successfully");
                const startButton = document.getElementById('ready-button');
                startButton.style.backgroundColor = "green";
                startButton.innerHTML = "You're ready!";
                playGame();
            })
            .catch((error) => {
                console.error("Error starting game:", error.message);
            });
    }
}


function playGame() {
    console.log("Playing game");

    //remove the buttons for starting the game and random fill
    const controlBox = document.getElementById('control-box');
    const readyButton = document.getElementById('ready-button');
    const randomButton = document.getElementById('random-button');
    if (readyButton) {
        controlBox.removeChild(readyButton);
    }
    if (randomButton) {
        controlBox.removeChild(randomButton);
    }

    // create a Fire button and coordinate input
    console.log("Creating fire button and coordinate input");
    createCoordinateInput();
    createFireButton();

    setInterval(isMyTurn, 1000);
}

function createFireButton() {
    const controlBox = document.getElementById('control-box');
    const fireButton = document.createElement('button');
    fireButton.setAttribute('id', 'fire-button');
    fireButton.onclick = fire();
    controlBox.appendChild(fireButton);
}

function createCoordinateInput() {
    const controlBox = document.getElementById('control-box');
    const coordinateInput = document.createElement('input');
    coordinateInput.setAttribute('type', 'text');
    coordinateInput.setAttribute('id', 'coordinate-input');
    coordinateInput.setAttribute('placeholder', 'Enter coordinates (e.g., A1)');
    coordinateInput.setAttribute('maxlength', '2');
    controlBox.appendChild(coordinateInput);
}

function fire() {
    const coordinateInput = document.getElementById('coordinate-input');
    const coordinate = coordinateInput.value.toUpperCase();
    const row = parseInt(coordinate.substring(1)) - 1; // Extract row number and adjust for 0-based index
    const col = coordinate.charCodeAt(0) - 65; // Convert column letter to 0-based index

    const move = { x: col, y: row };

    const shotCell = document.getElementById(`target-cell-${row + 1}-${col + 1}`);
    if (shotCell) {
        shotCell.style.backgroundColor = white;
    }

    sendTurn(move);
}

function sendTurn(move) {
    const route = '/shoot'
    fetch(route,
        {
            method: "POST",
            body: JSON.stringify({
                gameid: localStorage.getItem("gameId"),
                userid: localStorage.getItem("userId"),
                move: move,
            }),
            headers: {
                "Content-type": "application/json",
            },
        })
}


function isMyTurn() {
    const route = '/checkturn'
    lastMove = { x: -1, y: -1 }
    fetch(route,
        {
            method: "POST",
            body: JSON.stringify({
                gameid: localStorage.getItem("gameId"),
                userid: localStorage.getItem("userId"),
            }),
            headers: {
                "Content-type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((response) => {
            if (response.body && response.body.yourTurn) {
                console.log("It's my turn!");
                lastMove["x"] = response.body.shotx;
                lastMove["y"] = response.body.shoty;
                const targetCell = document.getElementById(`ship-cell-${lastMove.y + 1}-${lastMove.x + 1}`);
                if (targetCell) {
                    if (targetCell.classList.contains('ship-cell-placed')) {
                        targetCell.style.backgroundColor = "red";
                    }
                    else {
                        ship.style.backgroundColor = "white";
                    }
                }
            } else {
                console.log("Not my turn yet.");
            }
        });
}



function initShips() {
    const shipBox = document.getElementById('ship-box');

    const input_form = document.createElement("form")
    input_form.onsubmit = shipFormSubmit
    input_form.setAttribute("id", "ship-form")

    for(let i = 0; i < shipNames.length; i++) {

        const locationInput = document.createElement("input")
        locationInput.setAttribute("type", "text")
        locationInput.setAttribute("id", shipNames[i])
        locationInput.setAttribute("name", shipNames[i])

        const locationLabel = document.createElement("label")
        locationLabel.setAttribute("for", shipNames[i])
        locationLabel.innerHTML = shipNames[i]

        const horizontal = document.createElement("input")
        horizontal.setAttribute("type", "radio")
        horizontal.setAttribute("name", shipNames[i] + "-orientation")
        horizontal.setAttribute("id", shipNames[i] + "-horizontal")
        horizontal.setAttribute("value", "horizontal")

        const horizontalLabel = document.createElement("label")
        horizontalLabel.setAttribute("for", shipNames[i] + "-horizontal")
        horizontalLabel.innerHTML = "Horizontal"

        const vertical = document.createElement("input")
        vertical.setAttribute("type", "radio")
        vertical.setAttribute("name", shipNames[i] + "-orientation")
        vertical.setAttribute("id", shipNames[i] + "-vertical")
        vertical.setAttribute("value", "vertical")

        const verticalLabel = document.createElement("label")
        verticalLabel.setAttribute("for", shipNames[i] + "-vertical")
        verticalLabel.innerHTML = "Vertical"

        input_form.appendChild(locationLabel)
        input_form.appendChild(locationInput)
        input_form.appendChild(horizontal)
        input_form.appendChild(horizontalLabel)
        input_form.appendChild(vertical)
        input_form.appendChild(verticalLabel)
        input_form.appendChild(document.createElement("br"))
    }

    const submitButton = document.createElement("button")
    submitButton.setAttribute("type", "submit")

    const buttonText = document.createTextNode("Submit")
    submitButton.appendChild(buttonText)

    input_form.appendChild(submitButton)
    shipBox.appendChild(input_form)
}

function shipFormSubmit(event) {
    event.preventDefault();
    const shipForm = document.getElementById("ship-form");
    const shipData = new FormData(shipForm);
    const shipLocations = {};

    for (const shipName of shipNames) {
        const location = shipData.get(shipName);
        const orientation = shipData.get(shipName + "-orientation");

        if (!location || !orientation) {
            alert(`Please fill out both location and orientation for ${shipName}.`);
            return;
        }

        shipLocations[shipName] = { location: location, orientation: orientation };
    }

    console.log(shipLocations);
    for (const shipName in shipLocations) {
        const { location, orientation } = shipLocations[shipName];
        placeShip(shipName, location, orientation);
    }
    shipForm.reset();
    shipForm.remove();
}

function addRandomFillButton() {
    const controlBox = document.getElementById('control-box');
    const randomButton = document.createElement('button');
    randomButton.setAttribute('id', 'random-button');
    randomButton.textContent = 'Random Fill';
    randomButton.onclick = randomFillForm;
    controlBox.appendChild(randomButton);
}

function randomFillForm() {
    const shipForm = document.getElementById('ship-form');
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const occupiedCells = new Set();

    for (const shipName of shipNames) {
        const shipLength = shipDict[0][shipName];
        let validPlacement = false;
        let randomRow, randomCol, randomOrientation;

        while (!validPlacement) {
            randomRow = Math.floor(Math.random() * 10) + 1;
            randomCol = letters[Math.floor(Math.random() * 10)];
            randomOrientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';

            const startRow = randomRow - 1;
            const startCol = randomCol.charCodeAt(0) - 65;
            const shipCells = [];

            validPlacement = true;

            if (randomOrientation === 'horizontal') {
                for (let i = 0; i < shipLength; i++) {
                    const nextCol = startCol + i;
                    if (nextCol >= 10 || occupiedCells.has(`${startRow}-${nextCol}`)) {
                        validPlacement = false;
                        break;
                    }
                    shipCells.push(`${startRow}-${nextCol}`);
                }
            } else {
                for (let i = 0; i < shipLength; i++) {
                    const nextRow = startRow + i;
                    if (nextRow >= 10 || occupiedCells.has(`${nextRow}-${startCol}`)) {
                        validPlacement = false;
                        break;
                    }
                    shipCells.push(`${nextRow}-${startCol}`);
                }
            }

            if (validPlacement) {
                shipCells.forEach(cell => occupiedCells.add(cell));
            }
        }

        const locationInput = shipForm.querySelector(`#${shipName}`);
        const horizontalRadio = shipForm.querySelector(`#${shipName}-horizontal`);
        const verticalRadio = shipForm.querySelector(`#${shipName}-vertical`);

        if (locationInput) locationInput.value = `${randomCol}${randomRow}`;
        if (randomOrientation === 'horizontal' && horizontalRadio) {
            horizontalRadio.checked = true;
        } else if (verticalRadio) {
            verticalRadio.checked = true;
        }
    }
}

function placeShip(shipName, location, orientation) {
    const shipLength = shipDict[0][shipName];
    const row = parseInt(location.substring(1)) - 1; // Extract row number and adjust for 0-based index
    const col = location.charCodeAt(0) - 65; // Convert column letter to 0-based index

    // Validate starting cell
    if (row < 0 || row >= 10 || col < 0 || col >= 10) {
        alert(`Invalid starting location for ${shipName}.`);
        resetBoardAndForm();
        clearFormEntries();
        return;
    }

    const shipCells = [];
    let isValidPlacement = true;

    // Check if the ship fits and does not overlap
    if (orientation === "horizontal") {
        for (let i = 0; i < shipLength; i++) {
            const nextCol = col + i;
            if (nextCol >= 10) {
                isValidPlacement = false;
                break;
            }
            const cell = document.getElementById(`ship-cell-${row + 1}-${nextCol + 1}`); // Adjust for 1-based grid
            shipCells.push(cell);
        }
    } else if (orientation === "vertical") {
        for (let i = 0; i < shipLength; i++) {
            const nextRow = row + i;
            if (nextRow >= 10) {
                isValidPlacement = false;
                break;
            }
            const cell = document.getElementById(`ship-cell-${nextRow + 1}-${col + 1}`); // Adjust for 1-based grid
            if (cell && cell.classList.contains('ship-cell-placed')) {
                isValidPlacement = false;
                break;
            }
            shipCells.push(cell);
        }
    }

    if (!isValidPlacement) {
        alert(`Cannot place ${shipName} at ${location} facing ${orientation}. It either overflows the board or overlaps with another ship.`);
        resetBoardAndForm();
        clearFormEntries();
        return;
    }

    // Place the ship
    for (const cell of shipCells) {
        if (cell) {
            cell.setAttribute('class', 'ship-cell-placed');
        }
    }

    console.log(`Placed ${shipName} at ${location} facing ${orientation}`);
    shipPositions.push({ name: shipName, location: location, orientation: orientation });
}

function resetBoardAndForm() {
    // Reset the board
    const shipCells = document.querySelectorAll('.ship-cell-placed');
    shipCells.forEach(cell => {
        cell.setAttribute('class', 'ship-cell');
        cell.style.backgroundColor = '';
    });

    // Reset the form
    const shipForm = document.getElementById('ship-form');
    if (shipForm) {
        const shipBox = document.getElementById('ship-box');
        const formClone = shipForm.cloneNode(true);
        formClone.onsubmit = shipFormSubmit;
        shipBox.replaceChild(formClone, shipForm); // Replace the old form with the new one
    }
}

function clearFormEntries() {
    const shipForm = document.getElementById('ship-form');
    if (shipForm) {
        const inputs = shipForm.querySelectorAll('input[type="text"], input[type="radio"]');
        inputs.forEach(input => {
            if (input.type === 'text') {
                input.value = '';
            } else if (input.type === 'radio') {
                input.checked = false;
            }
        });
    }
}

function targetCellClick(row, col){
    console.log(`Target cell clicked: Row ${row}, Column ${col}`);
}

function createTargetBoard(){
    // Create a 10x10 grid for the target board
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const targetContainer = document.getElementById('target-board')
    const width = targetContainer.clientWidth;
    const targetTable = document.createElement('table');
    targetTable.setAttribute('id', 'target-table');
    targetContainer.appendChild(targetTable);
    for (let i = 0; i < 11; i++){
        const row = document.createElement('tr');
        row.setAttribute('id', `target-row-${i}`);
        targetTable.appendChild(row);
        for (let j = 0; j < 11; j++){
            const cell = document.createElement('td');
            cell.setAttribute('id', `target-cell-${i}-${j}`);
            cell.setAttribute('class', 'target-cell');
            cell.setAttribute('width', width/11);
            row.appendChild(cell);
            if (i === 0 && j > 0){
                cell.innerHTML = letters[j-1];
            }
            else if (j === 0 && i > 0){
                cell.innerHTML = i;
            }
            else if (i === 0 && j === 0){
                cell.innerHTML = "";
            }
            else {
                cell.innerHTML = "";
                cell.onclick = targetCellClick.bind(null, i, j);
            }
        }
    }
}

function createShipBoard(){
    // Create a 10x10 grid for the ship board
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const shipContainer = document.getElementById('player-board');
    const width = shipContainer.clientWidth;
    const shipTable = document.createElement('table');
    shipTable.setAttribute('id', 'ship-table');
    shipContainer.appendChild(shipTable);
    for (let i = 0; i < 11; i++){
        const row = document.createElement('tr');
        row.setAttribute('id', `ship-row-${i}`);
        shipTable.appendChild(row);
        for (let j = 0; j < 11; j++){
            const cell = document.createElement('td');
            cell.setAttribute('id', `ship-cell-${i}-${j}`);
            cell.setAttribute('class', 'ship-cell');
            cell.setAttribute("width", width);
            row.appendChild(cell);
            if (i === 0 && j > 0){
                cell.innerHTML = letters[j-1];
            }
            else if (j === 0 && i > 0){
                cell.innerHTML = i;
            }
            else if (i === 0 && j === 0){
                cell.innerHTML = "";
            }
            else {
                cell.innerHTML = "";
            }
        }
    }
}