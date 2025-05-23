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
});
