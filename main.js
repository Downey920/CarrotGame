"use strict";

const ITEM_SIZE = 80;
const TOTAL_COUNT = 12;
const GAME_DURATION_SEC = 10;

const gameBtn = document.querySelector(".game__interface__btn");
const timer = document.querySelector(".game__interface__timer");
const count = document.querySelector(".game__interface__count");
const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const popUp = document.querySelector(".pop-up");
const popUpBtn = document.querySelector(".pop-up__refresh");
const popUpText = document.querySelector(".pop-up__text");

const carrotSound = new Audio("carrot/sound/carrot_pull.mp3");
const bugSound = new Audio("carrot/sound/bug_pull.mp3");
const bgSound = new Audio("carrot/sound/bg.mp3");
const winSound = new Audio("carrot/sound/game_win.mp3");
const alertSound = new Audio("carrot/sound/alert.wav");

let countingSec = undefined;
let carrotCount = undefined;

gameBtn.addEventListener("click", () => {
  if (gameBtn.classList.contains("start")) {
    init();
    toStopIcon();
  } else {
    playSound(alertSound);
    stopTime();
    finishGame();
    hideGameBtn();
    showPopUp("Replay ❓");
  }
});

popUpBtn.addEventListener("click", () => {
  init();
});

// init
function init() {
  field.innerHTML = "";
  popUp.classList.add("invisible");
  carrotCount = TOTAL_COUNT;

  showGameBtn();
  showNum(carrotCount);
  addItems("carrot", TOTAL_COUNT, "carrot/img/carrot.png");
  addItems("bug", TOTAL_COUNT, "carrot/img/bug.png");
  startTime();
  startGame();
}

// Start Game
function startGame() {
  playSound(bgSound);
  field.addEventListener("click", gameProcess);
}

// Finish Game
function finishGame() {
  stopSound(bgSound);
  field.removeEventListener("click", gameProcess);
}

// Game Process
function gameProcess(e) {
  const name = e.target.dataset.name;
  if (name === undefined) return;

  if (name === "carrot") {
    playSound(carrotSound);
    e.target.remove();
    carrotCount--;
    showNum(carrotCount);
  } else {
    playSound(bugSound);
    showPopUp("You Lose 💩");
    hideGameBtn();
    stopTime();
    finishGame();
  }

  if (!carrotCount) {
    playSound(winSound);
    showPopUp("You Win 🎉");
    hideGameBtn();
    stopTime();
    finishGame();
  }
}

// Randomly place items in field
function addItems(name, count, image) {
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", "field__item");
    item.setAttribute("alt", name);
    item.setAttribute("src", image);
    item.setAttribute("data-name", name);

    item.style.position = "absolute";
    item.style.top = `${getRandomNumber(0, fieldRect.height - ITEM_SIZE)}px`;
    item.style.left = `${getRandomNumber(0, fieldRect.width - ITEM_SIZE)}px`;

    field.appendChild(item);
  }
}

// Get a Random Number between two numbers
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Game Button Icon to StopIcon
function toStopIcon() {
  gameBtn.innerHTML = `<i class="fas fa-stop"></i>`;
  gameBtn.classList.add("stop");
  gameBtn.classList.remove("start");
}

// Show Game Button
function showGameBtn() {
  gameBtn.classList.remove("invisible");
}

// Hide Game Button
function hideGameBtn() {
  gameBtn.classList.add("invisible");
}

// Start Timer
function startTime() {
  let time = GAME_DURATION_SEC;
  showSec(GAME_DURATION_SEC);

  countingSec = setInterval(() => {
    showSec(--time);

    if (!time) {
      playSound(bugSound);
      stopTime();
      finishGame();
      showPopUp("Time Out 💩");
      hideGameBtn();
    }
  }, 1000);
}

// Stop timer
function stopTime() {
  if (countingSec != undefined) {
    clearInterval(countingSec);
  }
}

// Show Time
function showSec(sec) {
  timer.textContent = `0:${sec}`;
}

// Show Count
function showNum(num) {
  count.textContent = num;
}

// Show Pop-Up
function showPopUp(text) {
  popUp.classList.remove("invisible");
  popUpText.textContent = text;
}

// Play Sound
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

// Stop Sound
function stopSound(sound) {
  sound.pause();
}
