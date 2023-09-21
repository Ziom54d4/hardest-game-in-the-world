let elementTooLowResolution;

creatingAnElementForTooLowResolution();

function creatingAnElementForTooLowResolution() {
  elementTooLowResolution = document.createElement("div");
  elementTooLowResolution.classList.add("tooLowResolution");
  elementTooLowResolution.innerHTML = `<h1>Za mała rozdzielczość! </br> Najniższa wymagana: 1369 x 800</h1>`;
  document.body.appendChild(elementTooLowResolution);
}

let gameLevel;
let collisionsCounter;
let opponents;
let numberOfOpponents;
let opponentElements;

let leftArrow;
let upArrow;
let rightArrow;
let downArrow;

startGame();

function startGame() {
  gameLevel = 1;
  collisionsCounter = 0;
  opponents = [];

  creatingABoardAndSomeOfItsElements();

  opponentElements = createEnemiesDependingOnTheLevel();

  const startElement = document.querySelector(".start");
  const playerElement = document.querySelector(".player");
  const opponentsElement = document.querySelector(".opponents");

  addingAPlayerToTheStart(startElement, playerElement);
  addingOpponentsToTheBoard(opponentsElement);

  leftArrow = false;
  upArrow = false;
  rightArrow = false;
  downArrow = false;

  whetherAnyOfTheKeysWereHeldDownOrReleased();
  gameLoop();
  enemyMovement();
  creatingAGameLevelElement();
  creatingACollisionsCounterElement();
}

function creatingABoardAndSomeOfItsElements() {
  const boardAndItsElements = [];

  for (let i = 0; i < 5; i++) {
    boardAndItsElements[i] = document.createElement("div");
  }

  boardAndItsElements[0].classList.add("board");
  document.body.appendChild(boardAndItsElements[0]);

  boardAndItsElements[1].classList.add("start");
  boardAndItsElements[2].classList.add("player");
  boardAndItsElements[3].classList.add("opponents");
  boardAndItsElements[4].classList.add("meta");

  for (let i = 1; i < 5; i++) {
    boardAndItsElements[0].appendChild(boardAndItsElements[i]);
  }

  return boardAndItsElements;
}

function createEnemiesDependingOnTheLevel() {
  if (gameLevel == 1) {
    numberOfOpponents = 4;
    for (let i = 0; i < numberOfOpponents; i++) {
      const elementOpponent = document.createElement("div");
      elementOpponent.classList.add("opponent");
      opponents[i] = elementOpponent;
    }
  } else if (gameLevel == 2) {
    numberOfOpponents = 9;
    for (let i = 0; i < numberOfOpponents; i++) {
      const elementOpponent = document.createElement("div");
      elementOpponent.classList.add("opponent");
      opponents[i] = elementOpponent;
    }
  }
  return opponents;
}

function creatingAVariableArrayWithAllGameElements(someGameElements) {
  let allGameElements = [];
  allGameElements.push(someGameElements);
  allGameElements = allGameElements.reduce((accum, curVal) => {
    return accum.concat(curVal);
  });
  allGameElements.push(opponentElements);

  const tmp = allGameElements[4];
  allGameElements[4] = allGameElements[5];
  allGameElements[5] = tmp;

  return allGameElements;
}

function addingAPlayerToTheStart(startElement, playerElement) {
  startElement.appendChild(playerElement);
}

function addingOpponentsToTheBoard(opponentsElement) {
  for (let i = 0; i < opponents.length; i++) {
    opponentsElement.appendChild(opponents[i]);
  }
}

function whetherAnyOfTheKeysWereHeldDownOrReleased() {
  window.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
      case 37:
        leftArrow = true;
        break;

      case 38:
        upArrow = true;
        break;

      case 39:
        rightArrow = true;
        break;

      case 40:
        downArrow = true;
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.keyCode) {
      case 37:
        leftArrow = false;
        break;

      case 38:
        upArrow = false;
        break;

      case 39:
        rightArrow = false;
        break;

      case 40:
        downArrow = false;
        break;
    }
  });
}

function gameLoop() {
  const playerElement = document.querySelector(".player");
  const opponents = [...document.querySelectorAll(".opponent")];

  if (playerElement != null) {
    movingAroundTheBoard(playerElement);
    goToTheNextLevelAndChangeTheBoard(playerElement);
  }
  if (playerElement != null && opponents != null) {
    playerCollisionWithOpponent(playerElement, opponents);
  }

  requestAnimationFrame(gameLoop);
}

function movingAroundTheBoard(playerElement) {
  if (leftArrow && playerElement.offsetLeft > 0) {
    playerElement.style.marginLeft = playerElement.offsetLeft - 1 + "px";
  }
  if (upArrow && playerElement.offsetTop > 0) {
    playerElement.style.marginTop = playerElement.offsetTop - 1 + "px";
  }
  if (rightArrow && playerElement.offsetLeft < 950) {
    playerElement.style.marginLeft = playerElement.offsetLeft + 1 + "px";
  }
  if (downArrow && playerElement.offsetTop < 350) {
    playerElement.style.marginTop = playerElement.offsetTop + 1 + "px";
  }
}

function goToTheNextLevelAndChangeTheBoard(playerElement) {
  if (
    (gameLevel == 1 && playerElement.offsetLeft >= 750) ||
    (gameLevel == 2 && playerElement.offsetLeft >= 750)
  ) {
    playerElement.style.marginLeft = 75 + "px";
    playerElement.style.marginTop = 175 + "px";
    gameLevel++;
    createEnemiesDependingOnTheLevel();
    removeOpponentsFromPreviousLevel();
    enemyMovement();
    handleTextInGameLevelElement();
  }

  if (gameLevel == 3) {
    endGame();
  }
}

function removeOpponentsFromPreviousLevel() {
  const opponentsFromThePreviousLevel = [
    ...document.querySelectorAll(".opponent"),
  ];

  for (let i = 0; i < opponentsFromThePreviousLevel.length; i++) {
    opponentsFromThePreviousLevel[i].remove();
  }
}

function enemyMovement() {
  const refreshRate = 1000 / 60;

  if (gameLevel === 1) {
    let speedXForFirstAndThirdOpponent = 5;
    const endXPositionForFirstAndThirdOpponent = 545;
    const firstOpponent = opponents[0];
    const thirdOpponent = opponents[2];
    let positionXForFirstAndThirdOpponent = 5;

    window.setInterval(
      changingThePositionOfTheFirstAndThirdOpponent,
      refreshRate
    );

    function changingThePositionOfTheFirstAndThirdOpponent() {
      positionXForFirstAndThirdOpponent =
        positionXForFirstAndThirdOpponent + speedXForFirstAndThirdOpponent;
      if (
        positionXForFirstAndThirdOpponent >
          endXPositionForFirstAndThirdOpponent ||
        positionXForFirstAndThirdOpponent < 5
      ) {
        speedXForFirstAndThirdOpponent = speedXForFirstAndThirdOpponent * -1;
      }
      firstOpponent.style.marginLeft = positionXForFirstAndThirdOpponent + "px";
      thirdOpponent.style.marginLeft = positionXForFirstAndThirdOpponent + "px";
    }

    let speedXForSecondAndFourthOpponent = 5;
    const endXPositionForSecondAndFourthOpponent = 5;
    const secondOpponent = opponents[1];
    const fourthOpponent = opponents[3];
    let positionXForSecondAndFourthOpponent = 545;

    window.setInterval(
      changingThePositionOfTheSecondAndFourthOpponent,
      refreshRate
    );

    function changingThePositionOfTheSecondAndFourthOpponent() {
      positionXForSecondAndFourthOpponent =
        positionXForSecondAndFourthOpponent - speedXForSecondAndFourthOpponent;
      if (
        positionXForSecondAndFourthOpponent <
          endXPositionForSecondAndFourthOpponent ||
        positionXForSecondAndFourthOpponent > 545
      ) {
        speedXForSecondAndFourthOpponent =
          speedXForSecondAndFourthOpponent * -1;
      }
      secondOpponent.style.marginLeft =
        positionXForSecondAndFourthOpponent + "px";
      fourthOpponent.style.marginLeft =
        positionXForSecondAndFourthOpponent + "px";
    }
  } else if (gameLevel === 2) {
    const opponentsElement = document.querySelector(".opponents");
    addingOpponentsToTheBoard(opponentsElement);

    let speedYForOddOpponents = 5;
    const endYPositionForOddOpponents = 345;
    const firstOpponent = opponents[0];
    const thirdOpponent = opponents[2];
    const fifthOpponent = opponents[4];
    const seventhOpponent = opponents[6];
    const ninth = opponents[8];
    let positionYForOddOpponents = 5;

    for (let i = 0; i < opponents.length; i++) {
      i % 2 === 0
        ? (opponents[i].style.marginTop = "0px")
        : (opponents[i].style.marginTop = "350px");
      opponents[i].style.marginLeft = "15px";
      opponents[i].style.cssFloat = "left";
    }

    window.setInterval(changingPositionForOddOpponents, refreshRate);

    function changingPositionForOddOpponents() {
      positionYForOddOpponents =
        positionYForOddOpponents + speedYForOddOpponents;

      if (
        positionYForOddOpponents > endYPositionForOddOpponents ||
        positionYForOddOpponents < 5
      ) {
        speedYForOddOpponents = speedYForOddOpponents * -1;
      }
      firstOpponent.style.marginTop = positionYForOddOpponents + "px";
      thirdOpponent.style.marginTop = positionYForOddOpponents + "px";
      fifthOpponent.style.marginTop = positionYForOddOpponents + "px";
      seventhOpponent.style.marginTop = positionYForOddOpponents + "px";
      ninth.style.marginTop = positionYForOddOpponents + "px";
    }

    let speedYForEvenOpponents = 5;
    const endYPositionForEvenOpponents = 5;
    const secondOpponent = opponents[1];
    const fourthOpponent = opponents[3];
    const sixthOpponent = opponents[5];
    const eighthOpponent = opponents[7];
    let positionYForEvenOpponents = 345;

    window.setInterval(changingPositionForEvenOpponents, refreshRate);

    function changingPositionForEvenOpponents() {
      positionYForEvenOpponents =
        positionYForEvenOpponents - speedYForEvenOpponents;
      if (
        positionYForEvenOpponents < endYPositionForEvenOpponents ||
        positionYForEvenOpponents > 345
      ) {
        speedYForEvenOpponents = speedYForEvenOpponents * -1;
      }
      secondOpponent.style.marginTop = positionYForEvenOpponents + "px";
      fourthOpponent.style.marginTop = positionYForEvenOpponents + "px";
      sixthOpponent.style.marginTop = positionYForEvenOpponents + "px";
      eighthOpponent.style.marginTop = positionYForEvenOpponents + "px";
    }
  }
}

function playerCollisionWithOpponent(playerElement, opponents) {
  playerElement.offsetBottom =
    playerElement.offsetTop + playerElement.offsetHeight;

  playerElement.offsetRight =
    playerElement.offsetLeft + playerElement.offsetWidth;

  opponents.forEach((opponent) => {
    opponent.offsetBottom = opponent.offsetTop + opponent.offsetHeight;
    opponent.offsetRight = opponent.offsetLeft + opponent.offsetWidth;

    if (
      (playerElement.offsetBottom >= opponent.offsetTop &&
        playerElement.offsetTop <= opponent.offsetBottom &&
        playerElement.offsetRight >= opponent.offsetLeft &&
        playerElement.offsetLeft <= opponent.offsetRight &&
        window.getComputedStyle(elementTooLowResolution, null).display ==
          "none" &&
        gameLevel == 1) ||
      (playerElement.offsetBottom >= opponent.offsetTop &&
        playerElement.offsetTop <= opponent.offsetBottom &&
        playerElement.offsetRight >= opponent.offsetLeft &&
        playerElement.offsetLeft <= opponent.offsetRight &&
        window.getComputedStyle(elementTooLowResolution, null).display ==
          "none" &&
        gameLevel == 2)
    ) {
      playerElement.style.marginLeft = 75 + "px";
      playerElement.style.marginTop = 175 + "px";
      collisionsCounter++;
      handleTextInCollisionsCounterElement();
    }
  });
}

function creatingAGameLevelElement() {
  const gameLevelElement = document.createElement("div");
  gameLevelElement.classList.add("gameLevel");
  gameLevelElement.innerHTML = `Obecny level: <span class="counter">${gameLevel}</span>`;
  document.body.appendChild(gameLevelElement);
}

function handleTextInGameLevelElement() {
  const gameLevelElement = document.querySelector(".gameLevel");
  gameLevelElement.innerHTML = `Obecny level: <span class="counter">${gameLevel}</span>`;
}

function creatingACollisionsCounterElement() {
  const collisionsCounterElement = document.createElement("div");
  collisionsCounterElement.classList.add("collisionsCounter");
  collisionsCounterElement.innerHTML = `Ilość zderzeń: <span class="counter">${collisionsCounter}</span>`;
  document.body.appendChild(collisionsCounterElement);
}

function handleTextInCollisionsCounterElement() {
  const collisionsCounterElement = document.querySelector(".collisionsCounter");
  collisionsCounterElement.innerHTML = `Ilość zderzeń: <span class="counter">${collisionsCounter}</span>`;
}

function endGame() {
  const boardElement = document.querySelector(".board");
  boardElement.remove();
  const gameLevelElement = document.querySelector(".gameLevel");
  gameLevelElement.remove();

  const endGameElement = document.createElement("div");
  endGameElement.classList.add("endGame");
  document.body.appendChild(endGameElement);
  const startAgain = document.createElement("button");
  startAgain.classList.add("startAgain");
  document.body.appendChild(startAgain);

  const collisionsCounterElement = document.querySelector(".collisionsCounter");
  collisionsCounterElement.style.margin = "0px";
  collisionsCounterElement.style.position = "absolute";
  collisionsCounterElement.style.top = "50%";
  collisionsCounterElement.style.left = "50%";
  collisionsCounterElement.style.transform = "translate(-50%, -50%)";

  endGameElement.innerHTML = `<span>Koniec gry!</span>`;
  startAgain.textContent = `Rozpocznij ponownie`;

  startAgain.addEventListener("click", refreshThePage);
}

function refreshThePage() {
  window.location.reload();
}
