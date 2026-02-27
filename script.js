// ===========================
// PRESSCRAFT ACADEMY JS
// ===========================

// ===========================
// GLOBAL STATE
// ===========================
const state = {
    username: localStorage.getItem('username') || 'Student',
    xp: parseInt(localStorage.getItem('xp')) || 0,
    level: localStorage.getItem('level') || 'Intern',
    achievements: JSON.parse(localStorage.getItem('achievements')) || [],
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
    notifications: JSON.parse(localStorage.getItem('notifications')) || [],
    quizScore: 0,
    modulesCompleted: JSON.parse(localStorage.getItem('modulesCompleted')) || {}
};

// ===========================
// UTILITY FUNCTIONS
// ===========================
function saveState() {
    localStorage.setItem('xp', state.xp);
    localStorage.setItem('level', state.level);
    localStorage.setItem('achievements', JSON.stringify(state.achievements));
    localStorage.setItem('darkMode', state.darkMode);
    localStorage.setItem('notifications', JSON.stringify(state.notifications));
    localStorage.setItem('modulesCompleted', JSON.stringify(state.modulesCompleted));
}

function toast(message, duration=3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.textContent = message;
    container.appendChild(toastEl);
    setTimeout(() => toastEl.classList.add('show'), 100);
    setTimeout(() => toastEl.remove(), duration);
}

// ===========================
// DARK/LIGHT MODE
// ===========================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        state.darkMode = document.body.classList.contains('dark');
        saveState();
    });
}

// Apply saved theme
if (state.darkMode) document.body.classList.add('dark');

// ===========================
// BACK TO TOP BUTTON
// ===========================
const backToTop = document.getElementById('backToTop');
if(backToTop){
    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({top:0, behavior:'smooth'});
    });
}

// ===========================
// SCROLL PROGRESS BAR
// ===========================
const scrollBar = document.createElement('div');
scrollBar.id = 'scroll-progress';
document.body.prepend(scrollBar);
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollBar.style.width = scrollPercent + '%';
});

// ===========================
// TYPING ANIMATION HERO
// ===========================
const typingEl = document.getElementById('typing');
const typingText = 'Where Future Journalists Are Made.';
if(typingEl){
    let index = 0;
    function type() {
        if(index <= typingText.length){
            typingEl.textContent = typingText.slice(0,index);
            index++;
            setTimeout(type, 100);
        }
    }
    type();
}

// ===========================
// ANIMATED COUNTERS
// ===========================
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const increment = Math.ceil(target / 200);
    function updateCounter() {
        if(count < target){
            count += increment;
            counter.textContent = count.toLocaleString();
            requestAnimationFrame(updateCounter);
        } else counter.textContent = target.toLocaleString();
    }
    updateCounter();
});

// ===========================
// ACCORDION MODULES
// ===========================
const accordions = document.querySelectorAll('.accordion');
accordions.forEach(acc => {
    acc.addEventListener('click', () => {
        acc.classList.toggle('active');
        const panel = acc.nextElementSibling;
        if(panel.style.display === 'block'){
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    });
});

// ===========================
// MODULE COMPLETION
// ===========================
const markButtons = document.querySelectorAll('.mark-complete');
markButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const moduleName = btn.closest('.module').querySelector('.accordion').textContent;
        state.modulesCompleted[moduleName] = true;
        toast(`Module "${moduleName}" completed! +50 XP`);
        addXP(50);
        saveState();
    });
});

// ===========================
// XP AND LEVELS
// ===========================
function addXP(amount){
    state.xp += amount;
    updateLevel();
    saveState();
    updateXPDisplay();
}

function updateLevel(){
    if(state.xp >= 1000) state.level = 'Investigative Master';
    else if(state.xp >= 600) state.level = 'Senior Editor';
    else if(state.xp >= 300) state.level = 'Columnist';
    else if(state.xp >= 150) state.level = 'Beat Reporter';
    else state.level = 'Intern';
}

function updateXPDisplay(){
    const xpEl = document.getElementById('xp');
    const levelEl = document.getElementById('level');
    const xpProgress = document.getElementById('xpProgress');
    if(xpEl) xpEl.textContent = state.xp;
    if(levelEl) levelEl.textContent = state.level;
    if(xpProgress){
        let percent = Math.min((state.xp%150)/150*100,100);
        xpProgress.style.width = percent + '%';
    }
}

// ===========================
// QUIZ ENGINE
// ===========================
const quizData = [
    {
        question: "What is the main principle of journalism ethics?",
        answers: ["Accuracy", "Speed", "Popularity", "Profit"],
        correct: 0,
        explanation: "Journalists must prioritize accuracy above all."
    },
    {
        question: "Which of these is an investigative technique?",
        answers: ["Freedom of press", "Interviewing sources", "Press release", "Blogging"],
        correct: 1,
        explanation: "Interviewing multiple sources is key for investigations."
    },
    {
        question: "Fact-checking prevents what?",
        answers: ["Fake news", "Slow articles", "Clickbait", "Typos"],
        correct: 0,
        explanation: "Fact-checking prevents spreading misinformation."
    },
    {
        question: "What does neutrality mean in journalism?",
        answers: ["No bias", "Fast writing", "Personal opinion", "Humor"],
        correct: 0,
        explanation: "Neutrality means reporting facts without bias."
    },
    {
        question: "A lead paragraph should...",
        answers: ["Hook reader", "Be lengthy", "Include jokes", "Be personal"],
        correct: 0,
        explanation: "The lead should summarize and hook the reader."
    },
    {
        question: "Which law protects journalists?",
        answers: ["Media Law", "Tax Law", "Traffic Law", "Corporate Law"],
        correct: 0,
        explanation: "Media Law safeguards journalists' rights."
    },
    {
        question: "Investigative journalism requires...",
        answers: ["Deep research", "Fast typing", "Photo editing", "Short quotes"],
        correct: 0,
        explanation: "Deep research uncovers hidden truths."
    },
    {
        question: "Primary sources are...",
        answers: ["Direct info", "Opinions", "Blog posts", "Videos"],
        correct: 0,
        explanation: "Primary sources provide firsthand information."
    },
    {
        question: "An editorial is...",
        answers: ["Opinion piece", "News report", "Advertisement", "Press release"],
        correct: 0,
        explanation: "Editorials express opinions."
    },
    {
        question: "Which skill is essential for clarity?",
        answers: ["Simple language", "Complex words", "Slang", "Jargon"],
        correct: 0,
        explanation: "Simple language ensures clarity."
    }
];

let currentQuiz = 0;
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('nextQuestion');
const scoreEl = document.getElementById('score');

function loadQuiz(){
    if(!questionEl || !answersEl) return;
    const q = quizData[currentQuiz];
    questionEl.textContent = q.question;
    answersEl.innerHTML = '';
    q.answers.forEach((ans,i)=>{
        const btn = document.createElement('button');
        btn.textContent = ans;
        btn.addEventListener('click', ()=>{
            if(i===q.correct){
                toast('Correct! +20 XP');
                state.quizScore += 20;
                addXP(20);
            } else toast('Incorrect. ' + q.explanation);
            currentQuiz++;
            if(currentQuiz < quizData.length){
                loadQuiz();
            } else showScore();
        });
        answersEl.appendChild(btn);
    });
}

function showScore(){
    if(scoreEl) scoreEl.textContent = `Quiz Completed! Score: ${state.quizScore}/${quizData.length*20}`;
}

loadQuiz();

// ===========================
// EDITOR AUTO-SAVE
// ===========================
const editor = document.getElementById('editor');
if(editor){
    const savedDraft = localStorage.getItem('draft');
    if(savedDraft) editor.innerHTML = savedDraft;
    editor.addEventListener('input', () => {
        localStorage.setItem('draft', editor.innerHTML);
        updateWordCount();
    });
}

function updateWordCount(){
    const wordCountEl = document.getElementById('wordCount');
    const readingTimeEl = document.getElementById('readingTime');
    if(!editor) return;
    const text = editor.innerText;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words/200);
    if(wordCountEl) wordCountEl.textContent = `Words: ${words}`;
    if(readingTimeEl) readingTimeEl.textContent = `Reading time: ${minutes} min`;
}

// ===========================
// PUBLISH ARTICLE BUTTON
// ===========================
const publishBtn = document.getElementById('publishArticle');
if(publishBtn){
    publishBtn.addEventListener('click', ()=>{
        toast('Article Published! +50 XP');
        addXP(50);
        localStorage.removeItem('draft');
        editor.innerHTML = '';
        updateWordCount();
    });
}

// ===========================
// NOTIFICATIONS DISPLAY
// ===========================
const notificationsList = document.getElementById('notificationsList');
function renderNotifications(){
    if(!notificationsList) return;
    notificationsList.innerHTML = '';
    state.notifications.forEach(n => {
        const li = document.createElement('li');
        li.textContent = n;
        notificationsList.appendChild(li);
    });
}
renderNotifications();

// ===========================
// COMMUNITY SEARCH / FILTER
// ===========================
const communitySearch = document.getElementById('communitySearch');
const categoryFilter = document.getElementById('categoryFilter');

if(communitySearch) communitySearch.addEventListener('input', ()=>filterArticles());
if(categoryFilter) categoryFilter.addEventListener('change', ()=>filterArticles());

function filterArticles(){
    const search = communitySearch ? communitySearch.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : 'all';
    const articles = document.querySelectorAll('.article-feed .card');
    articles.forEach(a => {
        const text = a.innerText.toLowerCase();
        const cat = a.querySelector('.category') ? a.querySelector('.category').textContent.toLowerCase() : '';
        if((text.includes(search)) && (category==='all' || cat===category)){
            a.style.display = 'block';
        } else a.style.display = 'none';
    });
}

// ===========================
// INITIAL XP DISPLAY
// ===========================
updateXPDisplay();
