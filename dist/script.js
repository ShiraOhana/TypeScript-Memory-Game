"use strict";
const cardsArray = [
    { name: "broom", img: "dist/assets/broom.png" },
    { name: "broom", img: "dist/assets/broom.png" },
    { name: "hat", img: "dist/assets/hat.png" },
    { name: "hat", img: "dist/assets/hat.png" },
    { name: "ghost", img: "dist/assets/ghost.png" },
    { name: "ghost", img: "dist/assets/ghost.png" },
    { name: "potion", img: "dist/assets/potion.png" },
    { name: "potion", img: "dist/assets/potion.png" },
    { name: "lollipop", img: "dist/assets/lollipop.png" },
    { name: "lollipop", img: "dist/assets/lollipop.png" },
    { name: "cauldron", img: "dist/assets/cauldron.png" },
    { name: "cauldron", img: "dist/assets/cauldron.png" },
];
cardsArray.sort(() => 0.5 - Math.random());
const timer = document.querySelector("#timer");
let timerRun = false;
const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector("#result");
const textAlert = document.querySelector(".alert");
let cardsPicked = [];
let cardsPickedId = [];
let cardsWon = [];
let attempts = 6;
function createGameBoard() {
    for (let i = 0; i < cardsArray.length; i++) {
        let card = document.createElement("img");
        card.setAttribute("src", "dist/assets/backside.png");
        card.setAttribute("data-id", i.toString());
        card.addEventListener("click", flipCard);
        grid === null || grid === void 0 ? void 0 : grid.appendChild(card);
    }
}
function runTimer() {
    if (timer == null) {
        return;
    }
    timerRun = true;
    const counter = setInterval(() => {
        const time = (parseInt(timer.innerHTML) - 1).toString();
        timer.innerHTML = time;
    }, 1000);
    setTimeout(() => {
        clearInterval(counter);
        gameOver();
    }, 30000);
}
function resetTimer() {
    if (timer == null) {
        return;
    }
    timerRun = false;
    timer.innerHTML = "30";
}
function flipCard(event) {
    if (!timerRun)
        runTimer();
    let card = event.target;
    let cardId = parseInt(card.getAttribute("data-id"));
    cardsPicked.push(cardsArray[cardId]);
    cardsPickedId.push(cardId);
    card.setAttribute("src", cardsArray[cardId].img);
    if (cardsPicked.length === 2) {
        setTimeout(checkForMatch, 500);
    }
}
function checkForMatch() {
    if (textAlert == null || resultDisplay == null || textAlert == null) {
        return;
    }
    if (attempts === 1) {
        const queryCards = document.querySelectorAll("img");
        for (let card of queryCards) {
            card.removeEventListener("click", flipCard);
        }
    }
    const cards = document.querySelectorAll("img");
    const optionOneId = cardsPickedId[0];
    const optionTwoId = cardsPickedId[1];
    if (optionOneId == optionTwoId) {
        cards[optionOneId].setAttribute("src", "dist/assets/backside.png");
        cards[optionTwoId].setAttribute("src", "dist/assets/backside.png");
        textAlert.textContent = "Same card!";
        textAlert.classList.remove("hide");
        setTimeout(() => {
            textAlert.classList.add("hide");
        }, 2000);
    }
    else if (cardsPicked[0].name === cardsPicked[1].name) {
        let textArray = ["Nice!", "Awesome!", "Amazing!"];
        let word = Math.floor(Math.random() * textArray.length);
        textAlert.textContent = `${textArray[word]}`;
        textAlert.classList.remove("hide");
        cards[optionOneId].setAttribute("data-inactive", "true");
        cards[optionTwoId].setAttribute("data-inactive", "true");
        for (let card of cards) {
            card.removeEventListener("click", flipCard);
        }
        setTimeout(() => {
            textAlert.classList.add("hide");
            for (let card of cards) {
                if (card.getAttribute("data-inactive") != "true")
                    card.addEventListener("click", flipCard);
            }
        }, 2000);
        cards[optionOneId].setAttribute("src", cardsPicked[0].img);
        cards[optionTwoId].setAttribute("src", cardsPicked[1].img);
        cards[optionOneId].removeEventListener("click", flipCard);
        cards[optionTwoId].removeEventListener("click", flipCard);
        cardsWon.push(cardsPicked);
    }
    else {
        attempts -= 1;
        cards[optionOneId].setAttribute("src", "dist/assets/backside.png");
        cards[optionTwoId].setAttribute("src", "dist/assets/backside.png");
        let textArray = ["Try again", "Nice try", "Nope"];
        let word = Math.floor(Math.random() * textArray.length);
        textAlert.classList.remove("hide");
        for (let card of cards) {
            card.removeEventListener("click", flipCard);
        }
        textAlert.textContent = `${textArray[word]}`;
        setTimeout(() => {
            textAlert.classList.add("hide");
            for (let card of cards) {
                if (card.getAttribute("data-inactive") != "true")
                    card.addEventListener("click", flipCard);
            }
        }, 2000);
    }
    cardsPicked = [];
    cardsPickedId = [];
    resultDisplay.textContent = `Attempts: ${attempts}`;
    if (cardsWon.length === cardsArray.length / 2) {
        resultDisplay.textContent = "You Won!";
        textAlert.textContent = "";
    }
    if (attempts === 0) {
        gameOver();
    }
}
function gameOver() {
    if (resultDisplay == null || timer == null) {
        return;
    }
    timer.innerHTML = "0";
    timerRun = false;
    resultDisplay.textContent = "Game Over!";
    let textAlert = document.querySelector(".alert");
    let cards = document.querySelectorAll("img");
    if (textAlert == null) {
        return;
    }
    for (let card of cards) {
        card.setAttribute("src", "dist/assets/backside.png");
        card.removeEventListener("click", flipCard);
    }
    textAlert.textContent = "";
    let button = document.createElement("a");
    button.textContent = "New Game";
    resultDisplay.appendChild(button);
    button.addEventListener("click", newGame);
}
function newGame() {
    cardsPicked = [];
    cardsPickedId = [];
    cardsWon = [];
    resetTimer();
    attempts = 6;
    cardsArray.sort(() => 0.5 - Math.random());
    let cards = document.querySelectorAll("img");
    let button = document.querySelector("a");
    if (resultDisplay == null || button == null) {
        return;
    }
    button.remove();
    resultDisplay.textContent = "Start";
    for (let card of cards) {
        card.setAttribute("src", "dist/assets/backside.png");
    }
    const queryCards = document.querySelectorAll("img");
    for (let card of queryCards) {
        card.remove();
    }
    createGameBoard();
}
createGameBoard();
