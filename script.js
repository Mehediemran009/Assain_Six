const display = document.getElementById("display");
const question = document.getElementById("question");
const startBtn = document.getElementById("starts");
const countdownOverlay = document.getElementById("countdown");
const resultModal = document.getElementById("result");
const modalBackground = document.getElementById("modal-background");


let userText = "";
let errorCount = 0;
let startTime;
let questionText = "";


fetch("./texts.json")
  .then((res) => res.json())
  .then((data) => {
    questionText = data[Math.floor(Math.random() * data.length)];
    question.innerText = questionText;
  });


const typeController = (e) => {
  const newLetter = e.key;
 
  if (newLetter == "Backspace") {
    userText = userText.slice(0, userText.length - 1);
    return display.removeChild(display.lastChild);
  }


  const validLetters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890!@#$%^&*()_+-={}[]'\".,?";

  
  if (!validLetters.includes(newLetter)) {
  
    return;
  }

  userText += newLetter;
  

  const newLetterCorrect = validate(newLetter);
 
  if (newLetterCorrect) {
    display.innerHTML += `<span class="green">${newLetter === " " ? "▪" : newLetter}</span>`;
  } else {
    display.innerHTML += `<span class="red">${newLetter === " " ? "▪" : newLetter}</span>`;
    errorCount++
  }

 
  if (questionText === userText) {
    gameOver();
  }
};

const validate = (key) => {
  if (key === questionText[userText.length - 1]) {
    return true;
  }
  return false;
};


const gameOver = () => {
  document.removeEventListener("keydown", typeController);
  
  const finishTime = new Date().getTime();
  const timeTaken = (finishTime - startTime) / 1000;

 
  resultModal.innerHTML = "";
  resultModal.classList.toggle("hidden");
  modalBackground.classList.toggle("hidden");
 
  display.innerHTML = "";

  display.classList.add("inactive");

  resultModal.innerHTML += `
    <h1>Finished!</h1>
    <p>You took: <span class="bold">${Math.round(timeTaken)}</span> seconds</p>
    <p>You made <span class="bold red">${errorCount}</span> mistakes</p>
    <button onclick="closeModal()">Close</button>
  `;

  addHistory(questionText, timeTaken, errorCount);


  startTime = null;
  errorCount = 0;
  userText = "";
  display.classList.add("inactive");
};

const closeModal = () => {
  modalBackground.classList.toggle("hidden");
  resultModal.classList.toggle("hidden");
};

const start = () => {
 
  if (startTime) return;

  let count = 3;
  countdownOverlay.style.display = "flex";

  const startCountdown = setInterval(() => {
    countdownOverlay.innerHTML = `<h1>${count}</h1>`;
    
 
    if (count === 0) {
      
      document.addEventListener("keydown", typeController);
      countdownOverlay.style.display = "none";
      display.classList.remove("inactive");

      clearInterval(startCountdown);
      startTime = new Date().getTime();
    }
    count--;
  }, 1000);
};


startBtn.addEventListener("click", start);


displayHistory();


setInterval(() => {
  const currentTime = new Date().getTime();
  const timeSpent = (currentTime - startTime) / 1000;


  document.getElementById("show-time").innerHTML = `${startTime ? Math.round(timeSpent) : 0} seconds`;
}, 1000);
