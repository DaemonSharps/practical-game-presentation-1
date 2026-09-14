import Reveal from 'reveal.js';
import RevealNotes from 'reveal.js/plugin/notes/notes.esm.js';
import './shared.css';

export function startPresentation({ game = null } = {}) {
  const deck = new Reveal({
    hash: true,
    controls: true,
    progress: true,
    slideNumber: 'c/t',
    transition: 'slide',
    keyboard: true,
    plugins: [RevealNotes],
  });

  deck.initialize().then(() => {
    if (game) game(deck);
  });

  return deck;
}

export function markAnswer(button, isCorrect, feedback) {
  const group = button.closest('[data-answer-group]');
  if (!group || group.dataset.locked === 'true') return;
  group.dataset.locked = 'true';
  group.querySelectorAll('button').forEach((item) => {
    item.disabled = true;
    item.classList.toggle('is-correct', item.dataset.correct === 'true');
  });
  button.classList.toggle('is-wrong', !isCorrect);
  const output = group.querySelector('[data-feedback]');
  if (output) output.textContent = feedback;
}

export function createCountdown(element, seconds, onFinish = () => {}) {
  let remaining = seconds;
  let timer = null;
  const render = () => { element.textContent = `${remaining} с`; };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    remaining = seconds;
    render();
    timer = setInterval(() => {
      remaining -= 1;
      render();
      if (remaining <= 0) { stop(); onFinish(); }
    }, 1000);
  };
  render();
  return { start, stop };
}
