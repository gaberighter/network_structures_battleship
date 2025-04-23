const shipDict = [{"CARRIER": 5, "BATTLESHIP":4, "CRUISER": 3, "SUBMARINE": 3, "DESTROYER": 2}]
const shipNames = ["CARRIER", "BATTLESHIP", "CRUISER", "SUBMARINE", "DESTROYER"]

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
    const buttonText = document.createTextNode("Start Game")
    readyButton.appendChild(buttonText)
    controlBox.appendChild(readyButton)
}

function initShips() {
    const shipBox = document.getElementById('ship-box');

    const input_form = document.createElement("form")
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