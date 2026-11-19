document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('nav-toggle');
const mobileNav = document.getElementById('mobile-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// --- Quote wizard ---
(() => {
  const BUSINESS_PHONE = '+14079006304';
  const form = document.getElementById('quote-form');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.quote-step'));
  const stepCurrentEl = document.getElementById('step-current');
  const backBtn = document.getElementById('quote-back');
  const nextBtn = document.getElementById('quote-next');
  const summaryEl = document.getElementById('quote-summary');
  const smsLink = document.getElementById('quote-send-sms');
  let current = 1;

  function getRadioValue(name) {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : '';
  }

  function validateStep(step) {
    if (step === 1) {
      const issue = getRadioValue('issue');
      if (!issue) return false;
      if (issue === 'Other') return document.getElementById('issue-other').value.trim().length > 0;
      return true;
    }
    if (step === 2) {
      return document.getElementById('vehicle').value.trim().length > 0 &&
             document.getElementById('location').value.trim().length > 0;
    }
    if (step === 3) {
      return getRadioValue('parts') !== '' && getRadioValue('pricing') !== '';
    }
    if (step === 4) {
      return document.getElementById('name').value.trim().length > 0 &&
             document.getElementById('phone').value.trim().length > 0;
    }
    return true;
  }

  function buildSummary() {
    let issue = getRadioValue('issue');
    if (issue === 'Other') issue = document.getElementById('issue-other').value.trim();
    const vehicle = document.getElementById('vehicle').value.trim();
    const location = document.getElementById('location').value.trim();
    const parts = getRadioValue('parts');
    const pricing = getRadioValue('pricing');
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    return [
      'Quote request from the Orlando Mobile Mechanic website:',
      `Issue: ${issue}`,
      `Vehicle: ${vehicle}`,
      `Location: ${location}`,
      `Has parts: ${parts}`,
      `Wants price estimate first: ${pricing}`,
      `Name: ${name}`,
      `Callback number: ${phone}`,
    ].join('\n');
  }

  function isiOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function updateSmsLink() {
    const body = encodeURIComponent(buildSummary());
    const separator = isiOS() ? '&' : '?';
    smsLink.href = `sms:${BUSINESS_PHONE}${separator}body=${body}`;
  }

  function showStep(n) {
    steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
    stepCurrentEl.textContent = String(n);
    backBtn.style.visibility = n === 1 ? 'hidden' : 'visible';
    nextBtn.style.visibility = n === steps.length ? 'hidden' : 'visible';
    if (n === steps.length) {
      summaryEl.textContent = buildSummary();
      updateSmsLink();
    }
  }

  nextBtn.addEventListener('click', () => {
    if (!validateStep(current)) {
      nextBtn.disabled = true;
      setTimeout(() => { nextBtn.disabled = false; }, 350);
      return;
    }
    if (current < steps.length) {
      current += 1;
      showStep(current);
    }
  });

  backBtn.addEventListener('click', () => {
    if (current > 1) {
      current -= 1;
      showStep(current);
    }
  });

  document.getElementById('issue-other').addEventListener('input', () => {
    form.querySelector('input[name="issue"][value="Other"]').checked = true;
  });

  form.addEventListener('submit', e => e.preventDefault());

  showStep(current);
})();
