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

let wordlist = [];
let wordindex = 0;
let correctcount = 0;
let wrongcount = 0;
let timeleft = 30;
let gameinterval = null;
let gamestarted = false;

const wordsarea = document.getElementById('wordsarea');
const typebox = document.getElementById('typebox');
const wpmcount = document.getElementById('wpmcount');
const accuracycount = document.getElementById('accuracycount');
const timercount = document.getElementById('timercount');
const playbtn = document.getElementById('playbtn');

const topbar = document.querySelector('.topbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        topbar.classList.add('scrolled');
    } else {
        topbar.classList.remove('scrolled');
    }
});

function buildwords() {
    wordlist = [];
    for (let i = 0; i < 60; i++) {
        wordlist.push(words[Math.floor(Math.random() * words.length)]);
    }
}

function showwords() {
    wordsarea.innerHTML = wordlist.map((word, i) => {
        let style = '';
        if (i < wordindex) style = 'correct';
        else if (i === wordindex) style = 'active';
        return `<span class="worditem ${style}">${word}</span>`;
    }).join(' ');

    const current = wordsarea.querySelector('.worditem.active');
    if (current) current.scrollIntoView({ block: 'nearest' });
}

function startgame() {
    wordindex = 0;
    correctcount = 0;
    wrongcount = 0;
    timeleft = 30;
    gamestarted = false;

    buildwords();
    showwords();

    typebox.value = '';
    typebox.disabled = false;
    typebox.focus();

    wpmcount.textContent = '0';
    accuracycount.textContent = '100';
    timercount.textContent = '30';

    playbtn.textContent = 'Restart';
    clearInterval(gameinterval);
}

function endgame() {
    typebox.disabled = true;
    clearInterval(gameinterval);
    playbtn.textContent = 'Try Again';

    const total = correctcount + wrongcount;
    const accuracy = total > 0 ? Math.round((correctcount / total) * 100) : 100;
    accuracycount.textContent = accuracy;
    wpmcount.textContent = correctcount;
}

typebox.addEventListener('input', (e) => {
    if (!gamestarted) {
        gamestarted = true;
        gameinterval = setInterval(() => {
            timeleft--;
            timercount.textContent = timeleft;
            if (timeleft <= 0) endgame();
        }, 1000);
    }

    const typed = e.target.value.trim();

    if (e.target.value.endsWith(' ')) {
        if (typed === wordlist[wordindex]) {
            correctcount++;
        } else {
            wrongcount++;
            const allwords = wordsarea.querySelectorAll('.worditem');
            allwords[wordindex].classList.add('incorrect');
        }

        wordindex++;
        typebox.value = '';
        wpmcount.textContent = correctcount;

        const total = correctcount + wrongcount;
        const accuracy = total > 0 ? Math.round((correctcount / total) * 100) : 100;
        accuracycount.textContent = accuracy;

        showwords();
    }
});

playbtn.addEventListener('click', startgame);
