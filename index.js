const DEFAULT_TIMEOUT = 1000;
let play = true;

const setupMap = () => {
    let mapSize = 0;
    let isValid = false;
    
    while(!isValid) {
        mapSize = Number(prompt("Wybierz wielkość planszy (liczba musi nalezec do N+)"));
        isValid = Number.isInteger(mapSize) && mapSize > 0;
    }
    return mapSize;
};

const setup = () => {
    const p1 = prompt("Wybierz znak dla pierwszego gracza");
    const p2 = prompt("Wybierz znak dla drugiego gracza");

    return {p1, p2};
};

const createUIBoard = (mapSize) => {
    const divRoot = document.getElementById('board');
    const arrayBoard = [];
    const board = [];
    for( let i=0; i<mapSize; i++) {
        board.push([]);
    }
    board.forEach(arr => {
        for( let i=0; i<mapSize; i++) {
            const element = document.createElement('div');
            element.classList.add('cell');
            const cell = {
                x: null,
                y: null,
                element,
                state: null
            };
            arr.push(cell);
            arrayBoard.push(cell);
            divRoot.appendChild(element);
        }
    })
    return { board, arrayBoard };
};

const bot = (board, player) => {
    const i = Math.floor(Math.random() * 3);
    const j = Math.floor(Math.random() * 3);

    if(board[i][j].state){
        return bot(board, player);
    }
    board[i][j].state = player
    board[i][j].y = i
    board[i][j].x = j
};

const playerMoveOnClick = (board) => {
    console.log({"board": board})
}

const isGameWonForElement = (board, cell, mapSize) =>{
    const {x, y, state} = cell 
    const row = board[y];
    const column = board[x];
    const isRowWinning = row.every(item => item.state === state);
    const isColumnWinning = column.every(item => item.state === state);
    let isDiagonalWinning = true
    for(let i=0; i<mapSize; i++){
        if(board[i][i].state != cell.state){
            isDiagonalWinning = false
        }
    }
    board[0][0].state === cell.state && board[1][1].state && board[2][2].state 
    return isRowWinning || isColumnWinning || isDiagonalWinning
}

const isPlayerWinning = (arrayBoard, board, player, mapSize) => {
    return arrayBoard.filter(item => item.state === player).some(cell => {
        return isGameWonForElement(board, cell, mapSize);
    })
}
const isThereAnyValidMove = (arrayBoard) =>{
    return arrayBoard.filter(item => item.state === null).length
}

const delay = (timeout = DEFAULT_TIMEOUT) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout)
    })
};

const render = (arrayBoard) => {
    arrayBoard.forEach(descriptor => {
        const { element, state } = descriptor;
        element.innerHTML = state;
    })
};

const gameOn = async ({
    p1, p2, board, arrayBoard, mapSize
}) => {
    while(true) {
        await delay()
        bot(board, p1)
        render(arrayBoard);

        await delay()
        const isP1Won = isPlayerWinning(arrayBoard, board, p1, mapSize);
        let isAnyValidMove = isThereAnyValidMove(arrayBoard);

        if(isP1Won) {
            return p1
        }
        if(!isAnyValidMove) {
            return 'draw';
        }

        await delay()
        bot(board, p2)
        render(arrayBoard);

        await delay()
        const isP2Won = isPlayerWinning(arrayBoard, board, p2, mapSize);
        isAnyValidMove = isThereAnyValidMove(arrayBoard);

        if(isP2Won) {
            return p2
        }
        if(!isAnyValidMove) {
            return 'draw';
        }
    }
}

(async () => {
    // const mapSize = setupMap();
    // const {p1, p2} = setup();
    const mapSize = 3;
    const {p1, p2} = {  p1: 'x', p2: 'o'};
    const { board, arrayBoard } = createUIBoard(mapSize);
    
    const result = await gameOn({
        p1, p2, board, arrayBoard, mapSize
    });
    
    if(result == 'draw'){
        alert('Draw')
        return
    }
    alert(`${result} won!`)
})();