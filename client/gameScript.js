const shipDict = [{"CARRIER": 5, "BATTLESHIP":4, "CRUISER": 3, "SUBMARINE": 3, "DESTROYER": 2}]

const shipContainer = document.getElementById('player-board')

onload = initGamePage;

function initGamePage(){
    createTargetBoard();
    createShipBoard();
}

function targetCellClick(row, col){
    console.log(`Target cell clicked: Row ${row}, Column ${col}`);
}

function createTargetBoard(){
    // Create a 10x10 grid for the target board
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const targetContainer = document.getElementById('target-board')
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
    const shipContainer = document.getElementById('player-board')
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