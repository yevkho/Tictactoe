//1. gameBoard object (IIFE)
const gameBoard = (function () {
    let gameboard = ['', '', '', '', '', '', '', '', '']

    const gameboardReset = function () {
        gameboard.length = 0;
        gameboard.push('', '', '', '', '', '', '', '', '')
    }

    return {gameboard, gameboardReset}
})();

//4. Display gameboard
const displayController = (function () {
    
    const main = document.querySelector(".main");
   
    function displayBoard () {

        main.replaceChildren();
        const gameBoardDiv = document.createElement("div");
        gameBoardDiv.setAttribute("class", "gameboard");
        main.appendChild(gameBoardDiv);

        // gameBoardDiv.replaceChildren();
        gameBoard.gameboard.forEach((element, index) => {
            const cell = document.createElement("div");
            cell.setAttribute("class", "cell");
            cell.setAttribute("data-index", `${index}`);
            cell.textContent = `${element}`
            cell.addEventListener('click', game.playRound)
            gameBoardDiv.appendChild(cell);
        });
    }
    
    return {displayBoard}
})();

//2. player Factory
function createPlayer (name, token) {
    let score = 0;
    const showScore = () => score;
    const addScore = function () {
        score += 1;
    } 

    function playTurnOnDisplay (event){
        console.log(event.target.dataset.index);
        if (!gameBoard.gameboard[event.target.dataset.index]) {
            gameBoard.gameboard[event.target.dataset.index] = token;
            // displayController.displayBoard();
            return true
        } else {
            alert("this spot is taken")
            return false
        }
    }
    return {name, token, showScore, addScore, playTurnOnDisplay}
}

// create two players (global objects)
// const player1 = createPlayer ("Yev", "x");
const player1 = (() => {
    const name = prompt("Player 1 name:")
    const token = prompt("Player 1 token:")
    return createPlayer (name, token);
})();
// const player2 = createPlayer ("Gabi", "o");
const player2 = (() => {
    const name = prompt("Player 2 name:")
    const token = prompt("Player 2 token:")
    return createPlayer (name, token);
})();

//3. game object (IIFE)
const game = (function () {
    
    //declare 8 potential Win patterns
    const winPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
                        [0 ,3, 6], [1, 4, 7], [2, 5, 8], //columns
                        [0, 4, 8], [2, 4, 6] // diagonal
    ]

    //check for one of the 8 Win patterns on the gameboard
    function checkWinPattern (token) {
        for (let pattern of winPatterns) {
            if (gameBoard.gameboard[pattern[0]] == token && 
                gameBoard.gameboard[pattern[1]] == token && 
                gameBoard.gameboard[pattern[2]] == token) {
                return true     
            }
        }
        return false
    }
    //check for the Tie pattern
    function checkTiePattern () {
        return gameBoard.gameboard.every((item)=> item !== '')
    }

    //check for Win or Tie and end Game if triggered
    function checkGameStatus () {
        if (checkWinPattern(activePlayer.token)) { 
            alert(`${activePlayer.name} won!`)
            activePlayer.addScore();
            setGameDisplay ();
            gameBoard.gameboardReset();
            displayController.displayBoard();
            activePlayer = player1;
            return
        } else if (checkTiePattern()) {
            alert("it's a tie!")
            gameBoard.gameboardReset();
            displayController.displayBoard();
            activePlayer = player1;
            return
        }
    }
    
    //set and toggle activePlayer
    let activePlayer = player1; 
    const switchPlayer = function () {
        activePlayer = activePlayer == player1 ? player2 : player1; 
    }
    const getActivePlayer = () => activePlayer;

    //play a single round function
    function playRound(event) { 
        if (!activePlayer.playTurnOnDisplay(event)) {return};
        displayController.displayBoard();
        checkGameStatus();
        switchPlayer();
    }

    return {getActivePlayer, playRound}
})();

//Start Game Button
const StartGameButton = document.querySelector(".startGameButton")
StartGameButton.addEventListener('click', () => {
    displayController.displayBoard();

    function setGameDisplay () {
        const playerOneDiv = document.querySelector("#one");
        const playerTwoDiv = document.querySelector("#two");
        playerOneDiv.textContent = `${player1.name}(${player1.token}): ${player1.showScore()}`;
        playerTwoDiv.textContent = `${player2.name}(${player2.token}): ${player2.showScore()}`;
    }
    setGameDisplay ();
})

//Restart Game Button
const RestartGameButton = document.querySelector(".restartGameButton")
RestartGameButton.addEventListener('click', () => {
    gameBoard.gameboardReset();
    displayController.displayBoard();
})
