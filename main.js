const words = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
  'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because'
];

let currentWords = [];
let currentIndex = 0;
let correctWords = 0;
let incorrectWords = 0;
let timer = 30;
let interval = null;
let started = false;

const wordDisplay = document.getElementById('wordDisplay');
const typingInput = document.getElementById('typingInput');
const wpmDisplay = document.getElementById('wpmDisplay');
const accuracyDisplay = document.getElementById('accuracyDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');

// Sticky nav scroll effect
const nav = document.querySelector('.sticky-nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

function generateWords() {
  currentWords = [];
  for (let i = 0; i < 60; i++) {
    currentWords.push(words[Math.floor(Math.random() * words.length)]);
  }
}

function renderWords() {
  wordDisplay.innerHTML = currentWords.map((word, i) => {
    let cls = '';
    if (i < currentIndex) cls = 'correct';
    else if (i === currentIndex) cls = 'active';
    return `<span class="word ${cls}">${word}</span>`;
  }).join('');

  // scroll active word into view
  const active = wordDisplay.querySelector('.word.active');
  if (active) active.scrollIntoView({ block: 'nearest' });
}

function startGame() {
  currentIndex = 0;
  correctWords = 0;
  incorrectWords = 0;
  timer = 30;
  started = false;

  generateWords();
  renderWords();

  typingInput.value = '';
  typingInput.disabled = false;
  typingInput.focus();

  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '100';
  timerDisplay.textContent = '30';

  startBtn.textContent = 'Restart';
  clearInterval(interval);
}

function endGame() {
  typingInput.disabled = true;
  clearInterval(interval);
  startBtn.textContent = 'Try Again';

  const total = correctWords + incorrectWords;
  const accuracy = total > 0 ? Math.round((correctWords / total) * 100) : 100;
  accuracyDisplay.textContent = accuracy;
  wpmDisplay.textContent = correctWords;
}

typingInput.addEventListener('input', (e) => {
  // start timer on first keypress
  if (!started) {
    started = true;
    interval = setInterval(() => {
      timer--;
      timerDisplay.textContent = timer;
      if (timer <= 0) endGame();
    }, 1000);
  }

  const typed = e.target.value.trim();

  // when space is pressed, check word
  if (e.target.value.endsWith(' ')) {
    if (typed === currentWords[currentIndex]) {
      correctWords++;
    } else {
      incorrectWords++;
      // mark incorrect
      const spans = wordDisplay.querySelectorAll('.word');
      spans[currentIndex].classList.add('incorrect');
    }

    currentIndex++;
    typingInput.value = '';
    wpmDisplay.textContent = correctWords;

    const total = correctWords + incorrectWords;
    const accuracy = total > 0 ? Math.round((correctWords / total) * 100) : 100;
    accuracyDisplay.textContent = accuracy;

    renderWords();
  }
});

startBtn.addEventListener('click', startGame);