import { startPresentation } from '../../src/presentation.js';
import './style.css';

const taskCount = 5;
const scores = [0, 0];
const completed = new Set();

function teamName(team) {
  return team === 0 ? 'Рябинки' : 'Каштаны';
}

function updateScores() {
  document.querySelectorAll('[data-score="0"]').forEach((item) => { item.textContent = `Рябинки: ${scores[0]}`; });
  document.querySelectorAll('[data-score="1"]').forEach((item) => { item.textContent = `Каштаны: ${scores[1]}`; });
  document.querySelectorAll('[data-final-score="0"]').forEach((item) => { item.textContent = `Рябинки: ${scores[0]}`; });
  document.querySelectorAll('[data-final-score="1"]').forEach((item) => { item.textContent = `Каштаны: ${scores[1]}`; });
  const result = document.querySelector('[data-final-result]');
  if (result) {
    result.textContent = scores[0] === scores[1]
      ? `Идеальная командная ничья: ${scores[0]} : ${scores[1]}.`
      : `Сегодня впереди «${teamName(scores[0] > scores[1] ? 0 : 1)}»: ${Math.max(...scores)} : ${Math.min(...scores)}.`;
  }
  const progress = document.querySelector('[data-map-progress]');
  const bar = document.querySelector('[data-map-bar]');
  if (progress) progress.textContent = `${completed.size} / ${taskCount}`;
  if (bar) bar.style.width = `${completed.size / taskCount * 100}%`;
  document.querySelectorAll('.map-location').forEach((location) => {
    const done = completed.has(Number(location.dataset.location));
    location.classList.toggle('is-completed', done);
    location.setAttribute('aria-label', done ? `Локация ${location.dataset.location}, выполнено` : location.getAttribute('aria-label'));
  });
}

function openTask(deck, number) {
  deck.slide(number + 2);
}

function prepareTask(slide, deck) {
  const card = slide.querySelector('[data-quest-card]');
  if (!card) return;
  const answers = [...card.querySelectorAll('.quest-answer')];
  const teams = [...card.querySelectorAll('.quest-team')];
  const feedback = card.querySelector('[data-feedback]');
  const hint = card.querySelector('[data-hint]');
  const next = card.querySelector('[data-next]');
  const taskNumber = Number(slide.dataset.task);
  let selectedTeam = null;
  let answered = false;

  teams.forEach((button) => button.addEventListener('click', () => {
    if (answered) return;
    teams.forEach((item) => item.classList.remove('is-selected'));
    button.classList.add('is-selected');
    selectedTeam = Number(button.dataset.team);
    feedback.textContent = `Ход команды «${teamName(selectedTeam)}»: выбирайте ответ.`;
  }));

  answers.forEach((button) => button.addEventListener('click', () => {
    if (selectedTeam === null) {
      feedback.textContent = 'Сначала выберите команду, которая отвечает.';
      return;
    }
    if (answered) return;
    answered = true;
    const correct = button.dataset.correct === 'true';
    answers.forEach((item) => {
      item.disabled = true;
      if (item.dataset.correct === 'true') item.classList.add('is-correct');
    });
    if (!correct) button.classList.add('is-wrong');
    if (correct) {
      scores[selectedTeam] += 2;
      feedback.textContent = `Верно! «${teamName(selectedTeam)}» получают 2 листочка. Теперь объясните правило.`;
    } else {
      feedback.textContent = 'Верный вариант подсвечен. Разберите, какой шаг способа действия помог бы найти его.';
    }
    hint.hidden = false;
    next.hidden = false;
    completed.add(taskNumber);
    updateScores();
  }));

  next.addEventListener('click', () => {
    if (taskNumber === taskCount) deck.slide(7);
    else deck.slide(2);
  });
}

startPresentation({
  game(deck) {
    document.querySelectorAll('[data-task]').forEach((slide) => prepareTask(slide, deck));
    document.querySelectorAll('.map-location').forEach((location) => {
      const go = () => openTask(deck, Number(location.dataset.location));
      location.addEventListener('click', go);
      location.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          go();
        }
      });
    });
    document.querySelector('[data-start]')?.addEventListener('click', () => deck.slide(1));
    document.querySelector('[data-open-map]')?.addEventListener('click', () => deck.slide(2));
    document.querySelector('[data-restart]')?.addEventListener('click', () => window.location.reload());
    updateScores();
  },
});
