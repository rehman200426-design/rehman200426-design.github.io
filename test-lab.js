(() => {
  const form = document.querySelector('#test-form');
  const registration = form.elements.registration;
  const duration = form.elements.duration;
  const result = form.querySelector('.test-result');
  function clear() {
    [registration, duration].forEach(input => input.removeAttribute('aria-invalid'));
    document.querySelector('#registration-error').textContent = '';
    document.querySelector('#duration-error').textContent = '';
    result.className = 'test-result';
    result.textContent = 'Ready to test. Enter values or choose a sample.';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    clear();
    const plate = registration.value.trim();
    const hours = Number(duration.value);
    const errors = [];
    if (!/^(?=.*[a-z0-9])[a-z0-9 -]{3,16}$/i.test(plate)) {
      document.querySelector('#registration-error').textContent = 'Enter 3–16 characters with at least one letter or number. Only spaces and hyphens are allowed as separators.';
      errors.push(registration);
    }
    if (!duration.value.trim() || !Number.isInteger(hours) || hours < 1 || hours > 24) {
      document.querySelector('#duration-error').textContent = 'Enter a whole number from 1 to 24.';
      errors.push(duration);
    }
    errors.forEach(input => input.setAttribute('aria-invalid', 'true'));
    result.classList.add(errors.length ? 'result-fail' : 'result-pass');
    result.textContent = errors.length ? `Validation found ${errors.length} ${errors.length === 1 ? 'issue' : 'issues'}. Check the highlighted fields.` : `Validation passed: ${plate.toUpperCase()} · ${hours} ${hours === 1 ? 'hour' : 'hours'}. Demo only; no record was saved.`;
    if (errors.length) errors[0].focus();
  });
  document.querySelector('#valid-sample').addEventListener('click', () => {
    clear(); registration.value = 'ABC-123'; duration.value = '2'; form.requestSubmit();
  });
  document.querySelector('#invalid-sample').addEventListener('click', () => {
    clear(); registration.value = '!'; duration.value = '25'; form.requestSubmit();
  });
  form.addEventListener('reset', clear);
  const checks = [...document.querySelectorAll('.review-checklist input')];
  checks.forEach(check => check.addEventListener('change', () => {
    document.querySelector('.checklist-progress').textContent = `${checks.filter(item => item.checked).length} of ${checks.length} reviewed`;
  }));
  document.querySelectorAll('.tech-icons a').forEach(link => link.addEventListener('click', () => {
    document.querySelector(link.hash).open = true;
  }));
})();
