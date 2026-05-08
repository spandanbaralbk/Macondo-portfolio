const wordstuff = [
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

let wordpile = [];
let whereami = 0;
let gotem = 0;
let nope = 0;
let secsleft = 30;
let cheshiretimer = null;
let hasbegun = false;

const wordbox = document.getElementById('wordbox');
const userinput = document.getElementById('userinput');
const wpmcount = document.getElementById('wpmcount');
const accuracycount = document.getElementById('accuracycount');
const timercount = document.getElementById('timercount');
const gobtn = document.getElementById('gobtn');

const jennie = document.querySelector('.jennie');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        jennie.classList.add('scrolled');
    } else {
        jennie.classList.remove('scrolled');
    }
});

function fillwords() {
    wordpile = [];
    for (let i = 0; i < 60; i++) {
        wordpile.push(wordstuff[Math.floor(Math.random() * wordstuff.length)]);
    }
}

function renderfrfr() {
    wordbox.innerHTML = wordpile.map((word,   i) => {
        let vibe = '';
        if (i < whereami) vibe = 'correct';
        else if (i === whereami) vibe = 'active';
        return `<span class="worditem ${vibe}">${word}</span>`;
    }).join(' ');

    const currentword = wordbox.querySelector('.worditem.active');
    if (currentword) currentword.scrollIntoView({  block: 'nearest'  });
}

function letsgoo() {
    whereami = 0;
    gotem = 0;
    nope = 0;
    secsleft = 30;
    hasbegun = false;

    fillwords();
    renderfrfr();

    userinput.value = '';
    userinput.disabled = false;
    userinput.focus();

    wpmcount.textContent = '0';
    accuracycount.textContent = '100';
    timercount.textContent = '30';

    gobtn.textContent = 'Restart';
    clearInterval(cheshiretimer);
}

function itsover() {
    userinput.disabled = true;
    clearInterval(cheshiretimer);
    gobtn.textContent = 'Try Again';

    const total = gotem + nope;
    const howgood = total > 0 ? Math.round((gotem / total) * 100) : 100;
    accuracycount.textContent = howgood;
    wpmcount.textContent = gotem;
}

userinput.addEventListener('input', (e) => {
    if (!hasbegun) {
        hasbegun = true;
        cheshiretimer = setInterval(() => {
            secsleft--;
            timercount.textContent = secsleft;
            if (secsleft <= 0) itsover();
        },   1000);
    }

    const usertyped = e.target.value.trim();

    if (e.target.value.endsWith(' ')) {
        if (usertyped === wordpile[whereami]) {
            gotem++;
        } else {
            nope++;
            const allspans = wordbox.querySelectorAll('.worditem');
            allspans[whereami].classList.add('incorrect');
        }

        whereami++;
        userinput.value = '';
        wpmcount.textContent = gotem;

        const total = gotem + nope;
        const howgood = total > 0 ? Math.round((gotem / total) * 100) : 100;
        accuracycount.textContent = howgood;

        renderfrfr();
    }
});

gobtn.addEventListener('click',  letsgoo);
