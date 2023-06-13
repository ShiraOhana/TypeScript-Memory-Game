const cardsArray: { name: string; img: string }[] = [
  { name: "candle", img: "dist/assets/candle.png" },
  { name: "candle", img: "dist/assets/candle.png" },
  { name: "spider", img: "dist/assets/spider.png" },
  { name: "spider", img: "dist/assets/spider.png" },
  { name: "voodoo", img: "dist/assets/voodoo.png" },
  { name: "voodoo", img: "dist/assets/voodoo.png" },
  { name: "potion", img: "dist/assets/potion.png" },
  { name: "potion", img: "dist/assets/potion.png" },
  { name: "flame", img: "dist/assets/flame.png" },
  { name: "flame", img: "dist/assets/flame.png" },
  { name: "littledevil", img: "dist/assets/littledevil.png" },
  { name: "littledevil", img: "dist/assets/littledevil.png" },
];

// Card shuffle
cardsArray.sort(() => 0.5 - Math.random());

const timer: HTMLElement | null = document.querySelector("#timer");
let timerRun: boolean = false;
const grid: HTMLElement | null = document.querySelector(".grid");
const resultDisplay: HTMLElement | null = document.querySelector("#result");
const textAlert: HTMLElement | null = document.querySelector(".alert");
let cardsPicked: { name: string; img: string }[] = [];
let cardsPickedId: number[] = [];
let cardsWon = [];
let attempts: number = 6;

// Create the board - back side of the cards will show
function createGameBoard(): void {
  for (let i: number = 0; i < cardsArray.length; i++) {
    let card: HTMLElement = document.createElement("img");
    card.setAttribute("src", "dist/assets/backside.png");
    card.setAttribute("data-id", i.toString());
    card.addEventListener("click", flipCard);
    grid?.appendChild(card);
  }
}

// Timer countdown
function runTimer(): void {
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

function resetTimer(): void {
  if (timer == null) {
    return;
  }
  timerRun = false;
  timer.innerHTML = "30";
}

// Flip 2 card and reveal the image
function flipCard(event: Event): void {
  if (!timerRun) runTimer();

  let card = event.target as HTMLElement;
  let cardId: number = parseInt(card.getAttribute("data-id")!);
  cardsPicked.push(cardsArray[cardId]);
  cardsPickedId.push(cardId);
  card.setAttribute("src", cardsArray[cardId].img);
  if (cardsPicked.length === 2) {
    setTimeout(checkForMatch, 500);
  }
}

// Check if the two cards we fliped are a pair | same card | not pair
function checkForMatch(): void {
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
  const optionOneId: number = cardsPickedId[0];
  const optionTwoId: number = cardsPickedId[1];

  if (optionOneId == optionTwoId) {
    cards[optionOneId].setAttribute("src", "dist/assets/backside.png");
    cards[optionTwoId].setAttribute("src", "dist/assets/backside.png");

    textAlert.textContent = "Same card!";
    textAlert.classList.remove("hide");
    setTimeout(() => {
      textAlert.classList.add("hide");
    }, 2000);
  } else if (cardsPicked[0].name === cardsPicked[1].name) {
    // Feedback when finding a match
    let textArray: string[] = ["Nice!", "Awesome!", "Amazing!"];
    let word: number = Math.floor(Math.random() * textArray.length);
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
    // attempts -= 1;
    cards[optionOneId].setAttribute("src", cardsPicked[0].img);
    cards[optionTwoId].setAttribute("src", cardsPicked[1].img);
    cards[optionOneId].removeEventListener("click", flipCard);
    cards[optionTwoId].removeEventListener("click", flipCard);
    cardsWon.push(cardsPicked);
  } else {
    attempts -= 1;
    cards[optionOneId].setAttribute("src", "dist/assets/backside.png");
    cards[optionTwoId].setAttribute("src", "dist/assets/backside.png");
    // Feedback when fliping the wrong pair
    let textArray: string[] = ["Try again", "Nice try", "Nope"];
    let word: number = Math.floor(Math.random() * textArray.length);
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

  //   Clear the cardsChosen & cardsChosenId arrays for the next pair that will be picked
  cardsPicked = [];
  cardsPickedId = [];

  //   Display the attempts & wining & losing
  resultDisplay.textContent = `Attempts: ${attempts}`;
  if (cardsWon.length === cardsArray.length / 2) {
    resultDisplay.textContent = "You Won!";
    textAlert.textContent = "";
  }
  if (attempts === 0) {
    gameOver();
  }
}

// Game over when the time is up or have been 6 attempts
function gameOver() {
  if (resultDisplay == null || timer == null) {
    return;
  }
  timer.innerHTML = "0";
  timerRun = false;

  resultDisplay.textContent = "Game Over!";
  let textAlert: HTMLElement | null = document.querySelector(".alert");
  let cards: NodeListOf<HTMLImageElement> = document.querySelectorAll("img");

  if (textAlert == null) {
    return;
  }

  for (let card of cards) {
    card.setAttribute("src", "dist/assets/backside.png");
    card.removeEventListener("click", flipCard);
  }

  textAlert.textContent = "";
  let button: HTMLElement = document.createElement("a");
  button.textContent = "New Game";
  resultDisplay.appendChild(button);
  button.addEventListener("click", newGame);
}

// New game function when clicking the New Game button
function newGame(): void {
  cardsPicked = [];
  cardsPickedId = [];
  cardsWon = [];
  resetTimer();
  attempts = 6;
  cardsArray.sort(() => 0.5 - Math.random());
  let cards: NodeListOf<HTMLImageElement> = document.querySelectorAll("img");
  let button: HTMLElement | null = document.querySelector("a");
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
