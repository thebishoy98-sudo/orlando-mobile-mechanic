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
  const stepTotalEl = document.getElementById('step-total');
  const backBtn = document.getElementById('quote-back');
  const nextBtn = document.getElementById('quote-next');
  const summaryEl = document.getElementById('quote-summary');
  const smsLink = document.getElementById('quote-send-sms');
  const yearSelect = document.getElementById('vehicle-year');
  const makeSelect = document.getElementById('vehicle-make');
  const makeOther = document.getElementById('make-other');
  const issueOther = document.getElementById('issue-other');
  const modelSelect = document.getElementById('vehicle-model-select');
  const modelText = document.getElementById('vehicle-model-text');
  let current = 1;

  const MODEL_STEP = 4;

  const MODELS_BY_MAKE = {
    Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', '4Runner', 'Sienna', 'Prius', 'Avalon', 'Yaris', 'C-HR'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Ridgeline', 'Fit', 'Passport'],
    Ford: ['F-150', 'Escape', 'Explorer', 'Edge', 'Mustang', 'Focus', 'Fusion', 'Expedition', 'Ranger', 'Bronco'],
    Chevrolet: ['Silverado', 'Equinox', 'Malibu', 'Traverse', 'Tahoe', 'Suburban', 'Camaro', 'Impala', 'Colorado', 'Trax'],
    Nissan: ['Altima', 'Sentra', 'Rogue', 'Murano', 'Pathfinder', 'Maxima', 'Versa', 'Frontier', 'Titan', 'Kicks'],
    Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'Kona', 'Palisade', 'Venue'],
    Kia: ['Forte', 'K5', 'Optima', 'Soul', 'Sportage', 'Sorento', 'Telluride', 'Rio', 'Niro'],
    Jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator'],
    Dodge: ['Charger', 'Challenger', 'Durango', 'Journey', 'Grand Caravan', 'Dart'],
    Ram: ['1500', '2500', '3500', 'ProMaster'],
    GMC: ['Sierra', 'Terrain', 'Acadia', 'Yukon', 'Canyon'],
    Subaru: ['Outback', 'Forester', 'Impreza', 'Crosstrek', 'Legacy', 'Ascent', 'WRX'],
    Volkswagen: ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'Beetle', 'Taos'],
    BMW: ['3 Series', '5 Series', 'X3', 'X5', '1 Series', '7 Series', 'X1'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'A-Class'],
    Audi: ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3'],
    Lexus: ['RX', 'ES', 'NX', 'GX', 'IS'],
    Mazda: ['Mazda3', 'CX-5', 'CX-9', 'Mazda6', 'CX-30', 'MX-5 Miata'],
    Chrysler: ['300', 'Pacifica', 'Voyager'],
    Buick: ['Enclave', 'Encore', 'Envision', 'LaCrosse'],
    Cadillac: ['Escalade', 'XT5', 'CT5', 'XT4'],
    Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
  };

  stepTotalEl.textContent = String(steps.length);

  const thisYear = new Date().getFullYear();
  for (let y = thisYear + 1; y >= 1990; y--) {
    const opt = document.createElement('option');
    opt.value = String(y);
    opt.textContent = String(y);
    yearSelect.appendChild(opt);
  }

  function prepareModelStep() {
    const make = makeSelect.value === 'Other' ? makeOther.value.trim() : makeSelect.value;
    const models = MODELS_BY_MAKE[make];
    modelText.value = '';
    modelText.classList.remove('show');
    if (models) {
      modelSelect.innerHTML = '<option value="">Select a model</option>' +
        models.map(m => `<option>${m}</option>`).join('') +
        '<option value="Other">Other / not listed</option>';
      modelSelect.value = '';
      modelSelect.classList.add('show');
    } else {
      modelSelect.classList.remove('show');
      modelText.classList.add('show');
    }
  }

  function getRadioValue(name) {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : '';
  }

  function validateStep(step) {
    if (step === 1) {
      const issue = getRadioValue('issue');
      if (!issue) return false;
      if (issue === 'Other') return issueOther.value.trim().length > 0;
      return true;
    }
    if (step === 2) return yearSelect.value !== '';
    if (step === 3) {
      if (makeSelect.value === '') return false;
      if (makeSelect.value === 'Other') return makeOther.value.trim().length > 0;
      return true;
    }
    if (step === MODEL_STEP) {
      if (modelSelect.classList.contains('show')) {
        if (modelSelect.value === '') return false;
        if (modelSelect.value === 'Other') return modelText.value.trim().length > 0;
        return true;
      }
      return modelText.value.trim().length > 0;
    }
    if (step === 5) return document.getElementById('location').value.trim().length > 0;
    if (step === 6) return getRadioValue('parts') !== '';
    if (step === 7) return getRadioValue('pricing') !== '';
    if (step === 8) {
      return document.getElementById('name').value.trim().length > 0 &&
             document.getElementById('phone').value.trim().length > 0;
    }
    return true;
  }

  function buildSummary() {
    let issue = getRadioValue('issue');
    if (issue === 'Other') issue = issueOther.value.trim();
    let make = makeSelect.value;
    if (make === 'Other') make = makeOther.value.trim();
    const year = yearSelect.value;
    let model;
    if (modelSelect.classList.contains('show')) {
      model = modelSelect.value === 'Other' ? modelText.value.trim() : modelSelect.value;
    } else {
      model = modelText.value.trim();
    }
    const location = document.getElementById('location').value.trim();
    const parts = getRadioValue('parts');
    const pricing = getRadioValue('pricing');
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    return [
      'Quote request from the Orlando Mobile Mechanic website:',
      `Issue: ${issue}`,
      `Vehicle: ${year} ${make} ${model}`.trim(),
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

  function goNext() {
    if (!validateStep(current)) {
      nextBtn.disabled = true;
      setTimeout(() => { nextBtn.disabled = false; }, 350);
      return;
    }
    if (current < steps.length) {
      current += 1;
      showStep(current);
    }
  }

  function showStep(n) {
    steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
    stepCurrentEl.textContent = String(n);
    backBtn.style.visibility = n === 1 ? 'hidden' : 'visible';
    nextBtn.style.visibility = n === steps.length ? 'hidden' : 'visible';
    if (n === MODEL_STEP) prepareModelStep();
    if (n === steps.length) {
      summaryEl.textContent = buildSummary();
      updateSmsLink();
    }
  }

  nextBtn.addEventListener('click', goNext);

  // Pressing the keyboard's return/next key on a single-line field advances the step,
  // since typing an address on mobile won't otherwise trigger anything on its own.
  form.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    goNext();
  });

  backBtn.addEventListener('click', () => {
    if (current > 1) {
      current -= 1;
      showStep(current);
    }
  });

  // Auto-advance: a tapped choice moves straight to the next question.
  form.querySelectorAll('.quote-step[data-auto] input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'Other') {
        if (radio.name === 'issue') {
          issueOther.classList.add('show');
          issueOther.focus();
        }
        return;
      }
      if (radio.name === 'issue') issueOther.classList.remove('show');
      setTimeout(goNext, 220);
    });
  });

  yearSelect.addEventListener('change', () => {
    if (yearSelect.value !== '') setTimeout(goNext, 180);
  });

  makeSelect.addEventListener('change', () => {
    if (makeSelect.value === 'Other') {
      makeOther.classList.add('show');
      makeOther.focus();
      return;
    }
    makeOther.classList.remove('show');
    if (makeSelect.value !== '') setTimeout(goNext, 180);
  });

  modelSelect.addEventListener('change', () => {
    if (modelSelect.value === 'Other') {
      modelText.classList.add('show');
      modelText.focus();
      return;
    }
    modelText.classList.remove('show');
    if (modelSelect.value !== '') setTimeout(goNext, 180);
  });

  issueOther.addEventListener('input', () => {
    form.querySelector('input[name="issue"][value="Other"]').checked = true;
  });
  makeOther.addEventListener('input', () => {
    makeSelect.value = 'Other';
  });

  form.addEventListener('submit', e => e.preventDefault());

  showStep(current);
})();
