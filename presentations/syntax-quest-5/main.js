import { startPresentation } from '../../src/presentation.js';

const tasks = 6;
const scores = [0, 0];
let selectedTeam = null;
let currentAnswer = null;

function updateScores() {
  document.querySelectorAll('[data-score="0"]').forEach((item) => { item.textContent = `Север: ${scores[0]}`; });
  document.querySelectorAll('[data-score="1"]').forEach((item) => { item.textContent = `Юг: ${scores[1]}`; });
  document.querySelectorAll('[data-final-score="0"]').forEach((item) => { item.textContent = `Север: ${scores[0]}`; });
  document.querySelectorAll('[data-final-score="1"]').forEach((item) => { item.textContent = `Юг: ${scores[1]}`; });
}

function prepareTask(slide) {
  const card = slide.querySelector('[data-quest-card]');
  if (!card) return;
  const answers = [...card.querySelectorAll('.quest-answer')];
  const teams = [...card.querySelectorAll('.quest-team')];
  const feedback = card.querySelector('[data-feedback]');
  const hint = card.querySelector('[data-hint]');
  const next = card.querySelector('[data-next]');
  selectedTeam = null;
  currentAnswer = null;

  teams.forEach((button) => button.addEventListener('click', () => {
    teams.forEach((item) => item.classList.remove('is-selected'));
    button.classList.add('is-selected');
    selectedTeam = Number(button.dataset.team);
    feedback.textContent = `Ход команды ${selectedTeam === 0 ? 'Севера' : 'Юга'}: выбирайте ответ.`;
  }));

  answers.forEach((button) => button.addEventListener('click', () => {
    if (selectedTeam === null) {
      feedback.textContent = 'Сначала выберите команду, которая отвечает.';
      return;
    }
    if (currentAnswer) return;
    currentAnswer = button;
    const correct = button.dataset.correct === 'true';
    answers.forEach((item) => {
      item.disabled = true;
      if (item.dataset.correct === 'true') item.classList.add('is-correct');
    });
    if (!correct) button.classList.add('is-wrong');
    if (correct) {
      scores[selectedTeam] += 2;
      feedback.textContent = `Верно! Команда ${selectedTeam === 0 ? 'Севера' : 'Юга'} получает 2 очка.`;
    } else {
      feedback.textContent = `Почти! Верный вариант подсвечен. Команда получает 0 очков в этом отсеке.`;
    }
    hint.hidden = false;
    next.hidden = false;
    updateScores();
  }));

  next.addEventListener('click', () => {
    const nextSlide = Number(slide.dataset.task) < tasks ? `data-task=\"${Number(slide.dataset.task) + 1}\"` : '#quest-finish';
    if (nextSlide.startsWith('#')) document.querySelector(nextSlide)?.scrollIntoView();
    else document.querySelector(`[${nextSlide}]`)?.scrollIntoView();
    document.querySelector('.reveal')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  });
}

startPresentation({
  game(deck) {
    document.querySelectorAll('[data-task]').forEach((slide) => {
      const progress = slide.querySelector('[data-progress]');
      if (progress) progress.style.width = `${(Number(slide.dataset.task) / tasks) * 100}%`;
      prepareTask(slide);
    });
    document.querySelector('[data-restart]')?.addEventListener('click', () => window.location.reload());
    deck.on('slidechanged', updateScores);
    updateScores();
  },
});
