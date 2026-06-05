const questions = [
  {
    question: "What is the brain of a computer?",
    options: ["A) Monitor", "B) Keyboard", "C) CPU", "D) Mouse"],
    correct: "c"
  },
  {
    question: "Which device is used to input text into a computer?",
    options: ["A) Printer", "B) Keyboard", "C) Monitor", "D) Speaker"],
    correct: "b"
  },
  {
    question: "What does RAM stand for?",
    options: [
      "A) Read Access Memory",
      "B) Random Access Memory",
      "C) Run Access Memory",
      "D) Random Application Memory"
    ],
    correct: "b"
  },
  {
    question: "Which of the following is an input device?",
    options: ["A) Printer", "B) Monitor", "C) Scanner", "D) Speaker"],
    correct: "c"
  },
  {
    question: "What does CPU stand for?",
    options: [
      "A) Central Processing Unit",
      "B) Central Program Unit",
      "C) Computer Personal Unit",
      "D) Central Processor Unit"
    ],
    correct: "a"
  },
  {
    question: "Which component is considered the main circuit board of a computer?",
    options: ["A) RAM", "B) Motherboard", "C) Hard Drive", "D) Power Supply"],
    correct: "b"
  },
  {
    question: "Which of these is an output device?",
    options: ["A) Monitor", "B) Keyboard", "C) Mouse", "D) Scanner"],
    correct: "a"
  },
  {
    question: "What is the function of a hard drive?",
    options: [
      "A) To process data",
      "B) To store data permanently",
      "C) To connect to the internet",
      "D) To display images"
    ],
    correct: "b"
  },
  {
    question: "What does URL stand for?",
    options: [
      "A) Uniform Resource Locator",
      "B) Universal Resource Locator",
      "C) Uniform Resource Link",
      "D) Universal Resource Link"
    ],
    correct: "a"
  },
  {
    question: "Which programming language is known as the 'mother of all languages'?",
    options: ["A) Python", "B) C", "C) Java", "D) Assembly"],
    correct: "b"
  }
];

const quizContent = document.getElementById('quiz-content');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const skipBtn = document.getElementById('skip-btn');
const progressFill = document.getElementById('progress-fill');
const stepIndicator = document.getElementById('step-indicator');
const resultBox = document.getElementById('result-box');
const navButtons = document.querySelector('.nav-buttons');
const playAgainBtn = document.getElementById('play-again-btn');

let currentStep = 0;
let userAnswers = new Array(questions.length).fill(null);

function renderQuestion(step) {
  const q = questions[step];
  let html = `<h2>${step + 1}. ${q.question}</h2><div class="options">`;
  q.options.forEach((opt) => {
    const letter = opt.charAt(0).toLowerCase();
    const checked = userAnswers[step] === letter ? 'checked' : '';
    html += `
      <div class="option ${checked ? 'selected' : ''}" data-answer="${letter}">
        <input type="radio" name="q${step}" id="q${step}${letter}" value="${letter}" ${checked}>
        <label for="q${step}${letter}">${opt}</label>
      </div>`;
  });
  html += '</div>';
  quizContent.innerHTML = html;

  document.querySelectorAll('.option').forEach(optDiv => {
    optDiv.addEventListener('click', () => {
      const radio = optDiv.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        optDiv.classList.add('selected');
        userAnswers[step] = radio.value;
        updateButtons();
      }
    });
  });
}

function updateUI() {
  const progress = ((currentStep + 1) / questions.length) * 100;
  progressFill.style.width = progress + '%';
  stepIndicator.textContent = `Question ${currentStep + 1} of ${questions.length}`;

  prevBtn.disabled = currentStep === 0;
  // Skip button is ALWAYS visible now
  skipBtn.classList.remove('hidden');  // never hidden
  nextBtn.textContent = currentStep === questions.length - 1 ? 'Submit' : 'Next';
  updateButtons();
}

function updateButtons() {
  const answered = userAnswers[currentStep] !== null;
  nextBtn.disabled = !answered;
}

function calculateScore() {
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correct) correctCount++;
  });
  let marks = 0;
  if (correctCount === questions.length) marks = 3;
  else if (correctCount >= 7) marks = 2;      // 7–9 correct
  else if (correctCount >= 1) marks = 1;      // 1–6 correct
  return { correctCount, total: questions.length, marks };
}

function showResult() {
  quizContent.classList.add('hidden');
  navButtons.classList.add('hidden');
  document.querySelector('.step-indicator').classList.add('hidden');
  document.querySelector('.progress-bar').classList.add('hidden');

  const { correctCount, total, marks } = calculateScore();
  const resultDiv = resultBox.querySelector('.result-content');
  resultDiv.innerHTML = `
    <h3>${marks} mark${marks !== 1 ? 's' : ''}</h3>
    <p>You got ${correctCount} out of ${total} correct.</p>
  `;
  resultBox.classList.remove('hidden');
  playAgainBtn.classList.remove('hidden');
}

function resetQuiz() {
  currentStep = 0;
  userAnswers = new Array(questions.length).fill(null);
  quizContent.classList.remove('hidden');
  navButtons.classList.remove('hidden');
  document.querySelector('.step-indicator').classList.remove('hidden');
  document.querySelector('.progress-bar').classList.remove('hidden');
  resultBox.classList.add('hidden');
  playAgainBtn.classList.add('hidden');
  renderQuestion(0);
  updateUI();
}

// Event listeners
prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    renderQuestion(currentStep);
    updateUI();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentStep < questions.length - 1) {
    currentStep++;
    renderQuestion(currentStep);
    updateUI();
  } else {
    showResult();
  }
});

skipBtn.addEventListener('click', () => {
  if (currentStep < questions.length - 1) {
    // Move to next question, leaving this answer as null
    currentStep++;
    renderQuestion(currentStep);
    updateUI();
  } else {
    // Skipping the last question ends the quiz
    showResult();
  }
});

playAgainBtn.addEventListener('click', resetQuiz);

// Initial load
renderQuestion(0);
updateUI();