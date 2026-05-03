const scenes = [...document.querySelectorAll(".scene")];
const randomButtons = [...document.querySelectorAll(".random-jump")];
const navButtons = [...document.querySelectorAll("[data-target]")];
const memeButton = document.querySelector(".next-meme");
const memeCategory = document.querySelector(".meme-category");
const memeText = document.querySelector(".meme-text");
const hygieneButton = document.querySelector(".hygiene-check");
const hygieneResult = document.querySelector(".hygiene-result");
const meterFill = document.querySelector(".meter-fill");
const moodButton = document.querySelector(".mood-button");
const musicButtons = [...document.querySelectorAll(".music-toggle")];
const secretInput = document.querySelector("#secretCode");
const unlockSecret = document.querySelector(".unlock-secret");
const hiddenDot = document.querySelector(".hidden-dot");
const toast = document.querySelector(".toast");
const floatLayer = document.querySelector(".float-layer");
const quizQuestion = document.querySelector(".quiz-question");
const quizOptions = document.querySelector(".quiz-options");
const quizProgress = document.querySelector(".quiz-progress");
const quizResult = document.querySelector(".quiz-result");

const sceneIds = scenes.map((scene) => scene.id).filter((id) => id !== "landing" && id !== "secret");
let currentScene = "landing";
let audioContext;
let musicTimer;
let isMusicOn = false;
let quizIndex = 0;
let quizScore = 0;
let lastMemeIndex = 0;

const memes = [
  { category: "Funny daily life", text: "Swapnil after saying 'bas 2 minute': accidentally starts a full side quest." },
  { category: "Hygienic guy jokes", text: "His hands are so clean even sanitizer asks for motivation." },
  { category: "Branded / luxury", text: "Budget says normal. Swapnil's aura says premium showroom lighting." },
  { category: "Relationship-style teasing", text: "Branded but still mine 😌. Terms and conditions: reply fast." },
  { category: "Funny daily life", text: "When plans cancel, he acts sad for 3 seconds then enjoys peace like a king." },
  { category: "Hygienic guy jokes", text: "Dust particle entered the room. Swapnil: 'Not on my watch.'" },
  { category: "Branded / luxury", text: "Future billionaire vibes, currently comparing watches like a CEO." },
  { category: "Relationship-style teasing", text: "He says 'I'm simple' while looking like an expensive notification." }
];

const hygieneResults = [
  { width: 64, text: "Fresh enough to make the room behave properly." },
  { width: 82, text: "Premium hygiene. Even the towel has discipline." },
  { width: 96, text: "Sanitizer certification: emotionally proud." },
  { width: 100, text: "Unreal. Soap companies should sponsor this man." }
];

const moods = [
  "Feeling royal? Go to Luxury Zone immediately.",
  "Feeling emotional? Family corner is waiting softly.",
  "Feeling chaotic? Meme Zone has entered the chat.",
  "Feeling peaceful? Ganapati Bappa section is the place.",
  "Feeling curious? Press S. That is all I will say."
];

const quiz = [
  {
    question: "Swapnil's birthday is on...",
    options: ["29 May", "Every day in May", "Whenever cake arrives"],
    answer: 0
  },
  {
    question: "Most accurate Swapnil energy?",
    options: ["Activa for reality, car for dreams", "No plans, no style", "Dust is welcome"],
    answer: 0
  },
  {
    question: "His hidden superpower is...",
    options: ["Hygiene level max", "Ignoring brands", "Never posing"],
    answer: 0
  },
  {
    question: "Luxury caption that fits him?",
    options: ["Future billionaire vibes", "Budget wallpaper only", "No watch, no aura"],
    answer: 0
  },
  {
    question: "What should Swapnil feel here?",
    options: ["Valued, understood, and entertained", "Confused only", "Like the website ended"],
    answer: 0
  }
];

function showScene(id) {
  const nextScene = document.getElementById(id);
  if (!nextScene) return;

  scenes.forEach((scene) => scene.classList.toggle("active", scene.id === id));
  currentScene = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
  burst(18);

  if (id === "quiz") {
    resetQuiz();
  }
}

function randomScene() {
  const options = sceneIds.filter((id) => id !== currentScene);
  const next = options[Math.floor(Math.random() * options.length)];
  showScene(next);
}

function nextMeme() {
  lastMemeIndex = (lastMemeIndex + 1 + Math.floor(Math.random() * (memes.length - 1))) % memes.length;
  const meme = memes[lastMemeIndex];
  memeCategory.textContent = meme.category;
  memeText.textContent = meme.text;
}

function checkHygiene() {
  const result = hygieneResults[Math.floor(Math.random() * hygieneResults.length)];
  meterFill.style.width = `${result.width}%`;
  hygieneResult.textContent = result.text;
  showToast("Hygiene scan complete ✨");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function unlockSecretPage() {
  showScene("secret");
  burst(90);
  showToast("Secret page unlocked 💗");
}

function handleSecretInput() {
  const value = secretInput.value.trim().toLowerCase();
  if (["swapnil", "29 may", "ghavat", "bappa"].includes(value)) {
    unlockSecretPage();
  } else {
    showToast("Almost. Try something more personal.");
  }
}

function resetQuiz() {
  quizIndex = 0;
  quizScore = 0;
  quizResult.textContent = "";
  renderQuiz();
}

function renderQuiz() {
  const item = quiz[quizIndex];
  quizProgress.textContent = `Question ${quizIndex + 1} of ${quiz.length}`;
  quizQuestion.textContent = item.question;
  quizOptions.innerHTML = "";

  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerQuiz(index));
    quizOptions.appendChild(button);
  });
}

function answerQuiz(index) {
  if (index === quiz[quizIndex].answer) {
    quizScore += 1;
    quizResult.textContent = "Correct. You understand the lore.";
  } else {
    quizResult.textContent = "Wrong, but funny enough to continue.";
  }

  quizIndex += 1;
  window.setTimeout(() => {
    if (quizIndex >= quiz.length) {
      quizProgress.textContent = "Result";
      quizQuestion.textContent = quizScore >= 4
        ? "Certified close person. You know Swapnil properly."
        : "You need more Swapnil episodes, but your heart is in the right place.";
      quizOptions.innerHTML = "";
      quizResult.textContent = "This quiz never really ends. Press one more thing.";
      burst(60);
    } else {
      renderQuiz();
    }
  }, 650);
}

function createFloaty() {
  const shapes = ["♥", "✦", "★", "♡", "✨"];
  const item = document.createElement("span");
  item.className = "floaty";
  item.textContent = shapes[Math.floor(Math.random() * shapes.length)];
  item.style.left = `${Math.random() * 100}%`;
  item.style.fontSize = `${16 + Math.random() * 22}px`;
  item.style.animationDuration = `${8 + Math.random() * 7}s`;
  item.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
  floatLayer.appendChild(item);
  window.setTimeout(() => item.remove(), 15000);
}

function burst(amount = 44) {
  const colors = ["#ff78ad", "#8f79ee", "#69c8e9", "#ffe29a", "#d8f8df"];
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.7}s`;
    piece.style.setProperty("--fall-drift", `${-150 + Math.random() * 300}px`);
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 3600);
  }
}

function toggleMusic() {
  if (isMusicOn) {
    window.clearInterval(musicTimer);
    isMusicOn = false;
    musicButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
    showToast("Music paused");
    return;
  }

  audioContext = audioContext || new AudioContext();
  const notes = [329.63, 392, 493.88, 440, 392, 329.63];
  let noteIndex = 0;

  function playNote() {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = notes[noteIndex % notes.length];
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.42);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.45);
    noteIndex += 1;
  }

  playNote();
  musicTimer = window.setInterval(playNote, 540);
  isMusicOn = true;
  musicButtons.forEach((button) => button.setAttribute("aria-pressed", "true"));
  showToast("Soft music on");
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showScene(button.dataset.target));
});

randomButtons.forEach((button) => button.addEventListener("click", randomScene));
memeButton.addEventListener("click", nextMeme);
hygieneButton.addEventListener("click", checkHygiene);
moodButton.addEventListener("click", () => showToast(moods[Math.floor(Math.random() * moods.length)]));
musicButtons.forEach((button) => button.addEventListener("click", toggleMusic));
unlockSecret.addEventListener("click", handleSecretInput);
secretInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleSecretInput();
});
hiddenDot.addEventListener("click", unlockSecretPage);
document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "s") unlockSecretPage();
});
document.addEventListener("dblclick", () => {
  burst(52);
  showToast("Double-click surprise: Swapnil lore expanded.");
});

window.setInterval(createFloaty, 850);
burst(28);
