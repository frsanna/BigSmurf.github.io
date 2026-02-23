/** @type {string[]} Image pool used for positive verdicts. */
/** Some web images were sourced from CATAAS (https://cataas.com) and stored locally. */
const yes = [
  "./pics/yes_1.jpg",
  "./pics/yes_2.jpg",
  "./pics/yes_3.jpg",
  "./pics/yes_4.gif",
  "./pics/web_yes/yes_web_01.jpg",
  "./pics/web_yes/yes_web_02.jpg",
  "./pics/web_yes/yes_web_03.jpg",
  "./pics/web_yes/yes_web_04.jpg",
  "./pics/web_yes/yes_web_05.jpg",
  "./pics/web_yes/yes_web_06.jpg",
  "./pics/web_yes/yes_web_07.jpg",
  "./pics/web_yes/yes_web_08.jpg",
  "./pics/web_yes/yes_web_09.jpg",
  "./pics/web_yes/yes_web_10.jpg",
  "./pics/web_yes/yes_web_11.jpg",
  "./pics/web_yes/yes_web_12.jpg"
];

/** @type {string[]} Image pool used for negative verdicts. */
const no = [
  "./pics/no_1.gif",
  "./pics/no_2.gif",
  "./pics/no_3.jpg",
  "./pics/web_no/no_web_01.jpg",
  "./pics/web_no/no_web_02.jpg",
  "./pics/web_no/no_web_03.jpg",
  "./pics/web_no/no_web_04.jpg",
  "./pics/web_no/no_web_05.jpg",
  "./pics/web_no/no_web_06.jpg",
  "./pics/web_no/no_web_07.jpg",
  "./pics/web_no/no_web_08.jpg",
  "./pics/web_no/no_web_09.jpg",
  "./pics/web_no/no_web_10.jpg",
  "./pics/web_no/no_web_11.jpg",
  "./pics/web_no/no_web_12.jpg"
];

/** @type {string[]} Pool of random absurd questions used for auto-fill and fun mode. */
const funnyLifeChangerQuestions = [
  "Should I trust a seagull with my five-year plan?",
  "If I move my desk 13 centimeters left, will destiny notice?",
  "Would my career improve if I wore a cape on Mondays?",
  "Is this the week I finally become a morning person?",
  "Should I start replying to emails in haiku form?",
  "If I name my plant CEO, will productivity rise?",
  "Is my toaster secretly my biggest supporter?",
  "Should I launch a startup that only sells dramatic pauses?",
  "Would life be better if I color-code my snacks?",
  "Am I one bold haircut away from enlightenment?",
  "Should I treat my calendar like a pirate treasure map?",
  "If I take a nap now, is it strategy or surrender?",
  "Should I negotiate with my alarm clock instead of fighting it?",
  "Will buying one more notebook unlock my true potential?",
  "Should I let my cat choose my next major decision?",
  "Is this idea genius, or did I just skip lunch?",
  "Should I replace all meetings with interpretive dance?",
  "If I learn the accordion, will confidence follow?",
  "Am I ready to be the mysterious neighbor with excellent coffee?",
  "Should I start every day by shouting plot twist?",
  "If I wear sunglasses indoors, do I look visionary or lost?",
  "Should I pivot my life based on this one playlist?",
  "Would my soul benefit from a dramatic train journey?",
  "If I ghost my bad habits, will they text me back?",
  "Should I trust this random gut feeling named Kevin?",
  "Is this the day I stop overthinking and start overdoing?",
  "Should I become the person who says let us circle back at dinner?",
  "If I build a tiny library for squirrels, will luck increase?",
  "Would my life improve if I scheduled wonder like a meeting?",
  "Should I speak less or just use better sound effects?",
  "Is now a terrible time to reinvent my signature?",
  "If I adopt a lucky spoon, will projects ship faster?",
  "Should I learn one magic trick for emergency confidence?",
  "Am I destined to peak during a random Tuesday afternoon?",
  "Should I trust advice from a fortune cookie with typos?",
  "Would my next big idea arrive if I walk without headphones?",
  "Should I stop waiting for permission and start being weird professionally?",
  "If I rename my fears, do they become manageable interns?",
  "Is this quarter about growth or just expensive lessons?",
  "Should I finally take that class that scares me a little?",
  "If I delete one app, will I gain three years of life?",
  "Would saying no twice a day heal my calendar?",
  "Should I make decisions as if future me is watching live?",
  "Is this the sign to chase quality over applause?",
  "Should I move abroad for six months just for perspective?",
  "If I commit to one bold promise, can I keep it?",
  "Should I send that message I've been drafting for weeks?",
  "Would I regret not trying this before next summer?",
  "Is this chapter chaos or the beginning of mastery?",
  "Should I choose courage even if it feels inconvenient today?"
];

const image = document.getElementById("cat-img");
const answer = document.getElementById("answer");
const question = document.getElementById("question");
const questionTip = document.getElementById("question-tip");
const refreshBtn = document.getElementById("refresh");
const randomQuestionBtn = document.getElementById("random-q");
const resultContainer = document.querySelector(".result");

/**
 * Picks a random element from a list.
 * @template T
 * @param {T[]} list - Source list.
 * @returns {T}
 */
function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Applies a quick shake/highlight animation to the question field.
 * @returns {void}
 */
function animateMissingQuestion() {
  question.classList.remove("prompt-empty");
  question.offsetHeight;
  question.classList.add("prompt-empty");
}

/**
 * Validates that the question field is not empty.
 * @returns {boolean} `true` when question contains text, otherwise `false`.
 */
function ensureQuestionBeforeVerdict() {
  if (question.value.trim()) {
    return true;
  }

  animateMissingQuestion();
  question.focus();
  questionTip.textContent = "Please ask a question first.";
  resultContainer.classList.add("result-hidden");
  return false;
}

/**
 * Generates a random yes/no verdict and updates UI accordingly.
 * @returns {void}
 */
function showHoracleCat() {
  const isYes = Math.random() >= 0.5;
  image.src = isYes ? pick(yes) : pick(no);
  image.alt = isYes ? "Horacle Cat says yes" : "Horacle Cat says no";

  answer.textContent = isYes ? "YES" : "NO";
  answer.className = isYes ? "answer-yes" : "answer-no";
}

/**
 * Handles verdict requests from button or keyboard.
 * @returns {void}
 */
function requestVerdict() {
  if (!ensureQuestionBeforeVerdict()) {
    return;
  }

  resultContainer.classList.remove("result-hidden");
  questionTip.textContent = "";
  showHoracleCat();
}

/**
 * Fills the prompt with a random absurd question.
 * @returns {void}
 */
function fillRandomQuestion() {
  question.classList.remove("prompt-empty");
  question.value = pick(funnyLifeChangerQuestions);
  questionTip.textContent = "Random life-changing question loaded.";
  resultContainer.classList.add("result-hidden");
  question.focus();
}

refreshBtn.addEventListener("click", requestVerdict);
randomQuestionBtn.addEventListener("click", fillRandomQuestion);
question.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    requestVerdict();
  }
});
question.addEventListener("input", () => {
  question.classList.remove("prompt-empty");
  if (!question.value.trim()) {
    questionTip.textContent = "";
    resultContainer.classList.add("result-hidden");
  }
});

resultContainer.classList.add("result-hidden");
