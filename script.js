const gameBoard = document.getElementById('game-board');
const boardSize = 9;
let currentPlayer = 1;
let players = [
    { id: 1, position: [0, 4], barriers: 10 },
    { id: 2, position: [8, 4], barriers: 10 }
];

function createBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            gameBoard.appendChild(cell);
        }
    }
}

function placePlayers() {
    players.forEach(player => {
        const [row, col] = player.position;
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        const playerElement = document.createElement('div');
        playerElement.classList.add('player');
        playerElement.style.backgroundColor = player.id === 1 ? '#ff0000' : '#0000ff';
        cell.appendChild(playerElement);
    });
}

function movePlayer(player, newPosition) {
    const [oldRow, oldCol] = player.position;
    const [newRow, newCol] = newPosition;

    const oldCell = document.querySelector(`.cell[data-row='${oldRow}'][data-col='${oldCol}']`);
    const newCell = document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`);

    const playerElement = oldCell.querySelector('.player');
    oldCell.removeChild(playerElement);
    newCell.appendChild(playerElement);

    player.position = [newRow, newCol];
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    const player = players.find(p => p.id === currentPlayer);
    const [currentRow, currentCol] = player.position;

    if (Math.abs(row - currentRow) + Math.abs(col - currentCol) === 1) {
        movePlayer(player, [row, col]);
        switchPlayer();
    }
}

function init() {
    createBoard();
    placePlayers();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}
function placeBarrier(player, position, orientation) {
    // Vérifier si le joueur a encore des barrières
    if (player.barriers <= 0) {
        alert("Vous n'avez plus de barrières !");
        return;
    }

    const [row, col] = position;

    // Vérifier si la barrière est valide (ne bloque pas tous les chemins)
    if (isBarrierValid(position, orientation)) {
        // Créer l'élément de la barrière
        const barrier = document.createElement('div');
        barrier.classList.add('barrier', orientation);

        // Ajouter la barrière à la cellule correspondante
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        cell.appendChild(barrier);

        // Décrémenter le nombre de barrières du joueur
        player.barriers--;
        console.log(`Joueur ${player.id} a placé une barrière. Barrières restantes : ${player.barriers}`);

        // Passer au joueur suivant
        switchPlayer();
    } else {
        alert("Barrière invalide : elle bloque tous les chemins !");
    }
}
function isBarrierValid(position, orientation) {
    // Pour l'instant, on suppose que la barrière est toujours valide
    // Vous pouvez implémenter une vérification plus complexe ici
    return true;
}
function init() {
    createBoard();
    placePlayers();

    // Gérer les clics gauches (déplacement) et droits (barrières)
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick); // Clic gauche
        cell.addEventListener('contextmenu', handleBarrierPlacement); // Clic droit
    });
}
function handleBarrierPlacement(event) {
    event.preventDefault(); // Empêcher le menu contextuel du clic droit

    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    const player = players.find(p => p.id === currentPlayer);

    // Demander l'orientation de la barrière
    const orientation = prompt("Entrez l'orientation de la barrière (horizontal/vertical)");

    if (orientation === 'horizontal' || orientation === 'vertical') {
        placeBarrier(player, [row, col], orientation);
    } else {
        alert("Orientation invalide. Choisissez 'horizontal' ou 'vertical'.");
    }
}
function placeBarrier(player, position, orientation) {
    if (player.barriers <= 0) {
        alert("Vous n'avez plus de barrières !");
        return;
    }

    const [row, col] = position;

    if (isBarrierValid(position, orientation)) {
        const barrier = document.createElement('div');
        barrier.classList.add('barrier', orientation);

        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        cell.appendChild(barrier);

        player.barriers--;
        updateBarrierDisplay(player); // Mettre à jour l'affichage

        switchPlayer();
    } else {
        alert("Barrière invalide : elle bloque tous les chemins !");
    }
}

function updateBarrierDisplay(player) {
    const barrierElement = document.getElementById(`player${player.id}-barriers`);
    barrierElement.textContent = player.barriers;
}

init();