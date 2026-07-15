(() => {
  'use strict';

  const STORAGE_KEY = 'flowerJournal.entries';

  const FLOWERS = {
    rose: { label: 'Rose', petal: '#e8899c', petalDark: '#d96b83', center: '#f7d3da' },
    tulip: { label: 'Tulip', petal: '#f2a06b', petalDark: '#e8834a', center: '#fbe0c4' },
    sunflower: { label: 'Sunflower', petal: '#f2c14e', petalDark: '#e0a72a', center: '#8a5a3b' },
    daisy: { label: 'Daisy', petal: '#ffffff', petalDark: '#e9e2da', center: '#f2c14e' },
    lavender: { label: 'Lavender', petal: '#b79fd6', petalDark: '#9c81c2', center: '#e2d6f2' },
    peony: { label: 'Peony', petal: '#e2739a', petalDark: '#cf5480', center: '#f9d6e2' },
  };

  const MOODS = [
    { key: 'joyful', emoji: '😊', label: 'Joyful' },
    { key: 'peaceful', emoji: '😌', label: 'Peaceful' },
    { key: 'grateful', emoji: '🥰', label: 'Grateful' },
    { key: 'tired', emoji: '😴', label: 'Tired' },
    { key: 'sad', emoji: '😔', label: 'Sad' },
    { key: 'tough', emoji: '😢', label: 'Tough day' },
  ];

  function budSVG() {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 95 C50 70 50 55 50 45" stroke="#a9c0a0" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M50 70 C38 68 32 60 34 52" stroke="#a9c0a0" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M50 78 C62 76 68 68 66 60" stroke="#a9c0a0" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="50" cy="34" rx="13" ry="18" fill="#c3d9b8"/>
      <ellipse cx="50" cy="34" rx="8" ry="16" fill="#a9c0a0"/>
    </svg>`;
  }

  function flowerSVG(type) {
    const f = FLOWERS[type] || FLOWERS.rose;
    const petals = [0, 60, 120, 180, 240, 300].map(angle => {
      return `<ellipse cx="50" cy="28" rx="13" ry="20" fill="${f.petal}" stroke="${f.petalDark}" stroke-width="1.5"
        transform="rotate(${angle} 50 50)"/>`;
    }).join('');
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 95 C50 82 50 74 50 66" stroke="#7fa073" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M50 84 C40 82 35 76 36 70" stroke="#7fa073" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g>${petals}</g>
      <circle cx="50" cy="50" r="11" fill="${f.center}"/>
    </svg>`;
  }

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  let entries = loadEntries();
  let viewDate = new Date();
  viewDate.setDate(1);
  let activeDateKey = null;
  let pendingPhoto = null;
  let selectedFlower = null;
  let selectedMood = null;
  let justSavedKey = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const monthLabel = document.getElementById('monthLabel');
  const bloomCountEl = document.getElementById('bloomCount');
  const weekdayRow = document.getElementById('weekdayRow');
  const grid = document.getElementById('calendarGrid');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const todayBtn = document.getElementById('todayBtn');

  const modalOverlay = document.getElementById('modalOverlay');
  const modalDate = document.getElementById('modalDate');
  const modalFlowerDisplay = document.getElementById('modalFlowerDisplay');
  const flowerPicker = document.getElementById('flowerPicker');
  const moodPicker = document.getElementById('moodPicker');
  const memoryText = document.getElementById('memoryText');
  const photoInput = document.getElementById('photoInput');
  const photoPreviewWrap = document.getElementById('photoPreviewWrap');
  const photoPreview = document.getElementById('photoPreview');
  const removePhotoBtn = document.getElementById('removePhoto');
  const saveEntryBtn = document.getElementById('saveEntry');
  const deleteEntryBtn = document.getElementById('deleteEntry');
  const closeModalBtn = document.getElementById('closeModal');

  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function dateKey(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function renderWeekdayRow() {
    weekdayRow.innerHTML = WEEKDAYS.map(w => `<div>${w}</div>`).join('');
  }

  function renderCalendar() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthLabel.textContent = `${MONTH_NAMES[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayKey = dateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    let html = '';
    for (let i = 0; i < firstDayIndex; i++) {
      html += `<div class="day-card empty"></div>`;
    }

    let bloomedThisMonth = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(year, month, d);
      const entry = entries[key];
      const isToday = key === todayKey;
      if (entry) bloomedThisMonth++;

      const flowerMarkup = entry ? flowerSVG(entry.flower) : budSVG();
      html += `<div class="day-card ${entry ? 'has-entry' : ''} ${isToday ? 'is-today' : ''}" data-key="${key}" role="button" tabindex="0" aria-label="${MONTH_NAMES[month]} ${d}${entry ? ', memory captured' : ''}">
        <span class="day-number">${d}</span>
        <div class="day-flower">${flowerMarkup}</div>
      </div>`;
    }

    grid.innerHTML = html;
    bloomCountEl.textContent = bloomedThisMonth > 0
      ? `${bloomedThisMonth} flower${bloomedThisMonth === 1 ? '' : 's'} bloomed this month`
      : 'No flowers bloomed yet this month';

    grid.querySelectorAll('.day-card:not(.empty)').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.key));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card.dataset.key);
        }
      });

      // gentle idle sway, randomized per card so the field feels alive, not synced
      const flowerEl = card.querySelector('.day-flower');
      if (flowerEl) flowerEl.style.setProperty('--sway-delay', `${(Math.random() * 3).toFixed(2)}s`);

      if (!prefersReducedMotion) attachTilt(card);

      if (card.dataset.key === justSavedKey) {
        card.classList.add('just-bloomed');
        spawnSparkles(card);
      }
    });

    justSavedKey = null;
  }

  function attachTilt(card) {
    const maxTilt = 8;
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-3px) scale(1.03) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }

  function spawnSparkles(card) {
    const layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    const glyphs = ['✨', '🌟', '💫'];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = glyphs[i % glyphs.length];
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const dist = 34 + Math.random() * 18;
      s.style.setProperty('--sx', `${(Math.cos(angle) * dist).toFixed(1)}px`);
      s.style.setProperty('--sy', `${(Math.sin(angle) * dist).toFixed(1)}px`);
      s.style.animationDelay = `${(i * 0.03).toFixed(2)}s`;
      layer.appendChild(s);
    }
    card.appendChild(layer);
    setTimeout(() => layer.remove(), 900);
    setTimeout(() => card.classList.remove('just-bloomed'), 750);
  }

  function spawnPetalField() {
    const container = document.getElementById('bgPetals');
    if (!container || prefersReducedMotion) return;
    const glyphs = ['🌸', '🌷', '🌼', '💮'];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'bg-petal';
      p.textContent = glyphs[i % glyphs.length];
      p.style.left = `${Math.random() * 100}%`;
      p.style.setProperty('--drift', `${(Math.random() * 120 - 60).toFixed(0)}px`);
      p.style.animationDuration = `${16 + Math.random() * 14}s`;
      p.style.animationDelay = `${(Math.random() * -20).toFixed(1)}s`;
      p.style.fontSize = `${1 + Math.random() * 0.9}rem`;
      container.appendChild(p);
    }
  }

  function renderFlowerPicker() {
    flowerPicker.innerHTML = Object.keys(FLOWERS).map(type => {
      return `<button type="button" class="pick-btn flower-opt" data-type="${type}" title="${FLOWERS[type].label}">${flowerSVG(type)}</button>`;
    }).join('');

    flowerPicker.querySelectorAll('.flower-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedFlower = btn.dataset.type;
        updateFlowerPickerSelection();
        modalFlowerDisplay.innerHTML = flowerSVG(selectedFlower);
        modalFlowerDisplay.classList.remove('pulse');
        void modalFlowerDisplay.offsetWidth;
        modalFlowerDisplay.classList.add('pulse');
      });
    });
  }

  function updateFlowerPickerSelection() {
    flowerPicker.querySelectorAll('.flower-opt').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.type === selectedFlower);
    });
  }

  function renderMoodPicker() {
    moodPicker.innerHTML = MOODS.map(m => {
      return `<button type="button" class="pick-btn mood-opt" data-key="${m.key}" title="${m.label}">${m.emoji}</button>`;
    }).join('');

    moodPicker.querySelectorAll('.mood-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedMood = btn.dataset.key;
        updateMoodPickerSelection();
      });
    });
  }

  function updateMoodPickerSelection() {
    moodPicker.querySelectorAll('.mood-opt').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.key === selectedMood);
    });
  }

  function openModal(key) {
    activeDateKey = key;
    const [y, m, d] = key.split('-').map(Number);
    const displayDate = new Date(y, m - 1, d);
    modalDate.textContent = displayDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const entry = entries[key];
    selectedFlower = entry ? entry.flower : 'rose';
    selectedMood = entry ? entry.mood : null;
    pendingPhoto = entry ? entry.photo : null;

    modalFlowerDisplay.innerHTML = flowerSVG(selectedFlower);
    updateFlowerPickerSelection();
    updateMoodPickerSelection();

    memoryText.value = entry ? entry.text : '';
    photoInput.value = '';
    if (pendingPhoto) {
      photoPreview.src = pendingPhoto;
      photoPreviewWrap.hidden = false;
    } else {
      photoPreviewWrap.hidden = true;
    }

    deleteEntryBtn.hidden = !entry;

    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    memoryText.focus();
  }

  function closeModal() {
    saveEntryBtn.classList.remove('saved');
    if (prefersReducedMotion) {
      modalOverlay.hidden = true;
      document.body.style.overflow = '';
      activeDateKey = null;
      pendingPhoto = null;
      return;
    }
    modalOverlay.classList.add('closing');
    setTimeout(() => {
      modalOverlay.hidden = true;
      modalOverlay.classList.remove('closing');
      document.body.style.overflow = '';
      activeDateKey = null;
      pendingPhoto = null;
    }, 160);
  }

  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      pendingPhoto = reader.result;
      photoPreview.src = pendingPhoto;
      photoPreviewWrap.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  removePhotoBtn.addEventListener('click', () => {
    pendingPhoto = null;
    photoInput.value = '';
    photoPreviewWrap.hidden = true;
  });

  saveEntryBtn.addEventListener('click', () => {
    if (!activeDateKey) return;
    const text = memoryText.value.trim();
    if (!text && !pendingPhoto) {
      memoryText.focus();
      memoryText.placeholder = 'Write a little something to plant this memory…';
      return;
    }
    entries[activeDateKey] = {
      text,
      mood: selectedMood,
      photo: pendingPhoto,
      flower: selectedFlower,
      savedAt: new Date().toISOString(),
    };
    saveEntries(entries);
    justSavedKey = activeDateKey;
    saveEntryBtn.classList.add('saved');
    setTimeout(() => {
      closeModal();
      renderCalendar();
    }, 260);
  });

  deleteEntryBtn.addEventListener('click', () => {
    if (!activeDateKey) return;
    delete entries[activeDateKey];
    saveEntries(entries);
    closeModal();
    renderCalendar();
  });

  closeModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

  function changeMonth(delta) {
    const outClass = delta > 0 ? 'slide-out-left' : 'slide-out-right';
    const inClass = delta > 0 ? 'slide-in-right' : 'slide-in-left';
    if (prefersReducedMotion) {
      viewDate.setMonth(viewDate.getMonth() + delta);
      renderCalendar();
      return;
    }
    grid.classList.add(outClass);
    setTimeout(() => {
      viewDate.setMonth(viewDate.getMonth() + delta);
      renderCalendar();
      grid.classList.remove(outClass);
      grid.classList.add(inClass);
      setTimeout(() => grid.classList.remove(inClass), 300);
    }, 170);
  }

  prevBtn.addEventListener('click', () => changeMonth(-1));
  nextBtn.addEventListener('click', () => changeMonth(1));
  todayBtn.addEventListener('click', () => {
    viewDate = new Date();
    viewDate.setDate(1);
    renderCalendar();
  });

  renderWeekdayRow();
  renderFlowerPicker();
  renderMoodPicker();
  renderCalendar();
  spawnPetalField();
})();
