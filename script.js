const sparkleLayer = document.querySelector(".sparkle-layer");
const musicToggle = document.querySelector(".music-toggle");
const audio = document.querySelector(".birthday-audio");
const confettiButton = document.querySelector(".confetti-button");
const easterEgg = document.querySelector(".easter-egg");
const animatedLines = [...document.querySelectorAll(".animated-line")];
const photoSlots = [...document.querySelectorAll("[data-photo]")];

const floatyShapes = ["♥", "✦", "★", "♡"];
const confettiColors = ["#ff83b7", "#9b87f5", "#54a6d8", "#fff0ad", "#ffd7e8"];

function createFloaty() {
  const item = document.createElement("span");
  item.className = "floaty";
  item.textContent = floatyShapes[Math.floor(Math.random() * floatyShapes.length)];
  item.style.left = `${Math.random() * 100}%`;
  item.style.fontSize = `${18 + Math.random() * 22}px`;
  item.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
  item.style.animationDuration = `${8 + Math.random() * 7}s`;
  sparkleLayer.appendChild(item);

  window.setTimeout(() => item.remove(), 15000);
}

function typeLine(element, delay = 0) {
  const text = element.dataset.text || "";
  let index = 0;

  window.setTimeout(() => {
    const timer = window.setInterval(() => {
      element.textContent = text.slice(0, index);
      index += 1;

      if (index > text.length) {
        window.clearInterval(timer);
      }
    }, 34);
  }, delay);
}

function releaseConfetti(amount = 90) {
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = confettiColors[index % confettiColors.length];
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.setProperty("--fall-drift", `${-140 + Math.random() * 280}px`);
    document.body.appendChild(piece);

    window.setTimeout(() => piece.remove(), 3800);
  }
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  window.requestAnimationFrame(() => toast.classList.add("show"));
  window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => toast.remove(), 250);
  }, 3600);
}

function loadGalleryPhotos() {
  photoSlots.forEach((slot) => {
    const image = new Image();
    image.onload = () => {
      slot.style.backgroundImage = `url("${slot.dataset.photo}")`;
      slot.classList.add("has-photo");
    };
    image.src = slot.dataset.photo;
  });
}

musicToggle.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      musicToggle.setAttribute("aria-pressed", "true");
      musicToggle.classList.add("is-playing");
      showToast("Music is on. Add your MP3 at assets/music/birthday-music.mp3");
    } catch {
      showToast("Add a music file at assets/music/birthday-music.mp3, then tap again.");
    }
  } else {
    audio.pause();
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.classList.remove("is-playing");
  }
});

confettiButton.addEventListener("click", () => {
  releaseConfetti();
  showToast("Happy Birthday Month, Swapnil Ghavat. 29 May is officially yours.");
});

easterEgg.addEventListener("click", () => {
  releaseConfetti(140);
  showToast("Secret unlocked: Swapnil Ghavat gets unlimited cake privileges on 29 May.");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.dataset.typed) {
      entry.target.dataset.typed = "true";
      typeLine(entry.target, animatedLines.indexOf(entry.target) * 320);
    }
  });
}, { threshold: 0.35 });

animatedLines.forEach((line) => observer.observe(line));

loadGalleryPhotos();
window.setInterval(createFloaty, 850);
releaseConfetti(28);
