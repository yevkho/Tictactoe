//1. gameBoard object (IIFE)
const gameBoard = (function () {
    let gameboard = ['', '', '', '', '', '', '', '', ''];

    const gameboardReset = function () {
        gameboard.length = 0;
        gameboard.push('', '', '', '', '', '', '', '', '');
    }

    return {gameboard, gameboardReset}
})();

//2. player Factory
function createPlayer (name, token) {
    let score = 0;
    const showScore = () => score;
    const addScore = function () {
        score += 1;
    } 

    return {name, token, showScore, addScore}
}

//3. gameFlow object (IIFE)
const gameController = (function () {
    // create two players
    const dialog = document.querySelector("dialog");
    const createButton = document.querySelector("#StartButton");
    dialog.showModal();

    let player1 = "";
    function getPlayer1 () {return player1} 
    let player2 = "";
    function getPlayer2 () {return player2} 

    createButton.addEventListener('click', () => {
        player1 = createPlayer (document.querySelector("#playerOneName").value, 'x');
        resetActivePlayer ();
        player2 = createPlayer (document.querySelector("#playerTwoName").value, 'o');
    })
    //set, reset and toggle activePlayer
    let activePlayer = player1; 
    const switchPlayer = function () {
        activePlayer = activePlayer == player1 ? player2 : player1; 
        displayController.setTurnDisplay();
    }
    const getActivePlayer = () => activePlayer;

    function resetActivePlayer () {
        activePlayer = player1;
        displayController.setTurnDisplay(); 
    }
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
            displayController.setGameDisplay ();
            gameBoard.gameboardReset();
            displayController.displayBoard();
            resetActivePlayer ();
            return true
        } else if (checkTiePattern()) {
            alert("it's a tie!")
            gameBoard.gameboardReset();
            displayController.displayBoard();
            resetActivePlayer ();
            return true
        }
        return false
    }
    //playTurn function
    function playTurn (event){
        console.log(event.target.dataset.index);
        if (!gameBoard.gameboard[event.target.dataset.index]) {
            gameBoard.gameboard[event.target.dataset.index] = activePlayer.token;
            return true
        } else {
            alert("this spot is taken")
            return false
        }
    }
    //play a single round function
    function playRound(event) { 
        if (!playTurn(event)) {return};
        displayController.displayBoard();
        if (checkGameStatus()) {return};
        switchPlayer();
    }

    return {resetActivePlayer, getActivePlayer, playRound, getPlayer1, getPlayer2}
})();

//4. Display gameboard and gameDisplay
const displayController = (function () {
   //display gameBoard
    const main = document.querySelector(".main");
    function displayBoard () {
        main.replaceChildren();
        const gameBoardDiv = document.createElement("div");
        gameBoardDiv.setAttribute("class", "gameboard");
        main.appendChild(gameBoardDiv);

        gameBoard.gameboard.forEach((element, index) => {
            const cell = document.createElement("div");
            cell.setAttribute("class", "cell");
            cell.setAttribute("data-index", `${index}`);
            cell.textContent = `${element}`
            cell.addEventListener('click', gameController.playRound)
            gameBoardDiv.appendChild(cell);
        });
    }
    //display gameDisplay
    function setGameDisplay () {
        const playerOneDiv = document.querySelector("#one");
        const playerTwoDiv = document.querySelector("#two");
        playerOneDiv.textContent = `${gameController.getPlayer1().name}(${gameController.getPlayer1().token}): ${gameController.getPlayer1().showScore()}`;
        playerTwoDiv.textContent = `${gameController.getPlayer2().name}(${gameController.getPlayer2().token}): ${gameController.getPlayer2().showScore()}`;
    }
    
    function setTurnDisplay () {
        const turnDisplayDiv = document.querySelector(".turnDisplay")
        turnDisplayDiv.textContent = `${gameController.getActivePlayer().name}'s turn`
    }
    //Start Game Button
    const StartGameButton = document.querySelector(".startGameButton")
    StartGameButton.addEventListener('click', () => {
        displayController.displayBoard();
        displayController.setGameDisplay ();
        displayController.setTurnDisplay (); 
    })
    //Restart Game Button
    const RestartGameButton = document.querySelector(".restartGameButton")
    RestartGameButton.addEventListener('click', () => {
        gameBoard.gameboardReset();
        displayController.displayBoard();
    })

    return {displayBoard, setGameDisplay, setTurnDisplay}
})();