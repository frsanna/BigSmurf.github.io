// script.js
document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('.scroll-container .section'));
  let current = 0;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function updateButtons() {
    prevBtn.classList.toggle('hidden', current === 0);
    nextBtn.classList.toggle('hidden', current === sections.length - 1);
  }

  function scrollTo(index) {
    sections[index].scrollIntoView({ behavior: 'smooth' });
    current = index;
    updateButtons();
  }

  prevBtn.addEventListener('click', () => scrollTo(current - 1));
  nextBtn.addEventListener('click', () => scrollTo(current + 1));

  document.querySelector('.scroll-container').addEventListener('scroll', () => {
    const scrollTop = document.querySelector('.scroll-container').scrollTop;
    sections.forEach((sec, i) => {
      if (Math.abs(sec.offsetTop - scrollTop) < sec.clientHeight / 2) {
        current = i;
      }
    });
    updateButtons();
  });

  updateButtons();

  const trigger = document.getElementById("trigger-logo");
    const egg = document.getElementById("easter-egg");
    const hLines = egg.querySelectorAll(".h-line");
    const vLines = egg.querySelectorAll(".v-line");
    const squares = egg.querySelectorAll(".square");
    const letters = egg.querySelector(".letters");

    function resetAnimations() {
      hLines.forEach(line => {
        line.style.animation = "none";
        line.offsetHeight;
        line.style.animation = `draw-h 0.8s forwards`;
      });
      vLines.forEach(line => {
        line.style.animation = "none";
        line.offsetHeight;
        line.style.animation = `draw-v 0.8s forwards`;
      });
      squares.forEach((s, i) => {
        s.style.animation = "none";
        s.offsetHeight;
        s.style.animation = `pop 0.4s ${1.8 + i * 0.4}s forwards`;
      });
      letters.style.animation = "none";
      letters.offsetHeight;
      letters.style.animation = `rise 0.8s ease-out 2.6s forwards`;
    }

    function reverseAnimations() {
      letters.style.animation = `rise-reverse 0.5s forwards`;
      squares.forEach((s, i) => {
        s.style.animation = `pop-reverse 0.3s ${0.2 + i * 0.2}s forwards`;
      });
      hLines.forEach(line => {
        line.style.animation = `draw-h-reverse 0.4s 0.6s forwards`;
      });
      vLines.forEach(line => {
        line.style.animation = `draw-v-reverse 0.4s 0.6s forwards`;
      });
    }

    trigger.addEventListener("dblclick", () => {
      resetAnimations();
      egg.classList.add("visible");
      setTimeout(() => {
        reverseAnimations();
        setTimeout(() => egg.classList.remove("visible"), 800);
      }, 4200);
    });
});
