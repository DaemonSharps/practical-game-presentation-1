import { createCountdown, markAnswer, startPresentation } from '../../src/presentation.js';

startPresentation({
  game() {
    document.querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', () => {
        const correct = button.dataset.correct === 'true';
        markAnswer(button, correct, correct ? 'Верно: сначала называем правило, затем применяем его.' : 'Проверь способ действия: ответ должен опираться на правило.');
      });
    });

    const timerElement = document.querySelector('[data-timer]');
    const timerFeedback = document.querySelector('[data-timer-feedback]');
    const countdown = createCountdown(timerElement, 20, () => {
      timerFeedback.textContent = 'Время! Теперь сравните названные шаги с алгоритмом на доске.';
    });
    document.querySelector('[data-start-timer]').addEventListener('click', () => {
      timerFeedback.textContent = 'Объясняй вслух — время пошло!';
      countdown.start();
    });
  },
});
