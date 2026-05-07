/* ===========================================
   NIGHT MODE THEME TOGGLE
   =========================================== */
function toggleTheme() {
  var isDark = document.body.classList.toggle('dark-mode');
  var toggle = document.getElementById('theme-toggle');
  toggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function initTheme() {
  var savedTheme = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  
  if (isDark) {
    document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').textContent = '☀️';
  } else {
    document.getElementById('theme-toggle').textContent = '🌙';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

/* ===========================================
   TAB & SECTION NAVIGATION
   =========================================== */
function switchTab(id, el) {
  document.querySelectorAll('.tab').forEach(function(t) {
    t.classList.remove('active');
  });
  el.classList.add('active');
  
  document.querySelectorAll('[id^="tab-"]').forEach(function(t) {
    t.classList.remove('visible');
  });
  document.getElementById('tab-' + id).classList.add('visible');
  document.getElementById('sec-nav').style.display = (id === 'junior') ? 'flex' : 'none';
}

function showSec(name, el) {
  document.querySelectorAll('.nav-pill').forEach(function(p) {
    p.classList.remove('active');
  });
  el.classList.add('active');
  
  var juniorSecs = document.querySelectorAll('#tab-junior .content-area');
  juniorSecs.forEach(function(s) {
    s.classList.remove('visible');
  });
  
  var target = document.getElementById('sec-' + name);
  if (target) target.classList.add('visible');
}

/* ===========================================
   CARD TOGGLING
   =========================================== */
function toggleCard(card) {
  card.classList.toggle('open');
}

/* ===========================================
   PROGRESS TRACKING
   =========================================== */
var prog = { bp: 0, cc: 0, ts: 0 };

function incProg(key, amount) {
  prog[key] = Math.min(100, prog[key] + amount);
  document.getElementById(key + '-fill').style.width = prog[key] + '%';
  document.getElementById(key + '-pct').textContent = prog[key] + '%';
}

function resetProg() {
  ['bp', 'cc', 'ts'].forEach(function(k) {
    prog[k] = 0;
    document.getElementById(k + '-fill').style.width = '0%';
    document.getElementById(k + '-pct').textContent = '0%';
  });
}

/* ===========================================
   ROADMAP TRACKING
   =========================================== */
var rmCount = 0;

function updateRM(cb) {
  rmCount += cb.checked ? 1 : -1;
  rmCount = Math.max(0, rmCount);
  
  var pct = Math.round((rmCount / 12) * 100);
  document.getElementById('rm-fill').style.width = pct + '%';
  document.getElementById('rm-label').textContent = rmCount + ' / 12 weeks';
}

/* ===========================================
   QUIZ FUNCTIONALITY
   =========================================== */
var qScore = 0, qAnswered = 0;

function answer(opt, qId, fbId, correct, msg) {
  var card = document.getElementById(qId);
  if (card.dataset.answered) return;
  
  card.dataset.answered = '1';
  qAnswered++;
  document.getElementById('q-total').textContent = qAnswered;

  card.querySelectorAll('.quiz-opt').forEach(function(o) {
    o.style.pointerEvents = 'none';
  });

  var fb = document.getElementById(fbId);
  fb.textContent = msg;
  fb.classList.add('show');

  if (correct) {
    opt.classList.add('correct');
    fb.classList.add('correct');
    qScore++;
    document.getElementById('q-score').textContent = qScore;
  } else {
    opt.classList.add('wrong');
    fb.classList.add('wrong');
  }

  if (qAnswered === 6) {
    var done = document.getElementById('quiz-done');
    done.style.display = 'block';
    var pct = Math.round((qScore / 6) * 100);
    var verdict = pct >= 83 ? '🎉 Excellent! You are well on your way to being job-ready.' :
                  pct >= 67 ? '👍 Good start! Review sections where you missed and retry.' :
                              '📚 Keep studying — revisit Foundations and Compliance sections.';
    document.getElementById('quiz-done-msg').textContent = qScore + '/6 correct (' + pct + '%). ' + verdict;
  }
}

function resetQuiz() {
  qScore = 0;
  qAnswered = 0;
  document.getElementById('q-score').textContent = '0';
  document.getElementById('q-total').textContent = '0';
  document.getElementById('quiz-done').style.display = 'none';
  
  ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].forEach(function(id) {
    var card = document.getElementById(id);
    delete card.dataset.answered;
    
    card.querySelectorAll('.quiz-opt').forEach(function(o) {
      o.classList.remove('correct', 'wrong');
      o.style.pointerEvents = '';
    });
    
    var fb = document.getElementById(id + '-fb');
    if (fb) {
      fb.className = 'quiz-feedback';
      fb.textContent = '';
    }
  });
}
