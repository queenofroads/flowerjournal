(() => {
  'use strict';

  const STORAGE_KEY = 'flowerJournal.entries';

  // Muted-warm botanical palette, echoing hand-painted gouache/watercolor references.
  const FLOWERS = {
    rose:      { label: 'Rose',      petal: '#e8a0aa', petal2: '#f2c2c8', ink: '#bd6d78', leaf: '#94a06a', leafInk: '#6d7a46', draw: 'rose' },
    poppy:     { label: 'Poppy',     petal: '#e86a50', petal2: '#f28e77', ink: '#b3452f', leaf: '#94a06a', leafInk: '#6d7a46', core: '#3d3a46', draw: 'poppy' },
    anemone:   { label: 'Anemone',   petal: '#b9d2dc', petal2: '#d7e6ec', ink: '#7995a2', leaf: '#94a06a', leafInk: '#6d7a46', core: '#33324c', draw: 'anemone' },
    sunflower: { label: 'Sunflower', petal: '#f0be48', petal2: '#f7d574', ink: '#cf9528', leaf: '#94a06a', leafInk: '#6d7a46', core: '#7a4e29', draw: 'sunflower' },
    daisy:     { label: 'Daisy',     petal: '#fffdf7', petal2: '#ffffff', ink: '#d6cbb7', leaf: '#94a06a', leafInk: '#6d7a46', core: '#f0be48', coreInk: '#cf9528', draw: 'daisy' },
    lavender:  { label: 'Lavender',  petal: '#a98ecd', petal2: '#c4addf', ink: '#7c62a6', leaf: '#94a06a', leafInk: '#6d7a46', draw: 'lavender' },
  };

  const PENCIL = { stroke: '#b0a086', fill: 'none' };

  const MOODS = [
    { key: 'joyful', emoji: '😊', label: 'Joyful' },
    { key: 'peaceful', emoji: '😌', label: 'Peaceful' },
    { key: 'grateful', emoji: '🥰', label: 'Grateful' },
    { key: 'tired', emoji: '😴', label: 'Tired' },
    { key: 'sad', emoji: '😔', label: 'Sad' },
    { key: 'tough', emoji: '😢', label: 'Tough day' },
  ];

  // ---- Illustrated flower drawing -------------------------------------------
  // Every flower is drawn on a 120x120 canvas and rendered in two modes:
  //   'ink'   -> uncoloured pencil line-art (a day waiting for a memory)
  //   'color' -> full watercolour-and-ink illustration (a day remembered)

  function teardrop(cx, cy, len, wid, angle) {
    const p = `M${cx} ${cy}`
      + `C${cx - wid} ${cy - len * 0.42} ${cx - wid} ${cy - len * 0.85} ${cx} ${cy - len}`
      + `C${cx + wid} ${cy - len * 0.85} ${cx + wid} ${cy - len * 0.42} ${cx} ${cy} Z`;
    return `<path d="${p}" transform="rotate(${angle} ${cx} ${cy})"/>`;
  }

  function stipple(cx, cy, r, n, color) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = i * 2.399963;                 // golden angle -> even packing
      const rr = r * Math.sqrt((i + 0.5) / n);
      s += `<circle cx="${(cx + Math.cos(a) * rr).toFixed(1)}" cy="${(cy + Math.sin(a) * rr).toFixed(1)}" r="1" fill="${color}"/>`;
    }
    return s;
  }

  function leaves(f, mode) {
    const stroke = mode === 'ink' ? PENCIL.stroke : f.leafInk;
    const fill = mode === 'ink' ? 'none' : f.leaf;
    return `<g fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">
      <path d="M60 96 C60 108 60 112 60 116" fill="none" stroke-linecap="round"/>
      <path d="M60 104 C50 100 44 104 42 112 C52 112 58 110 60 104 Z"/>
      <path d="M60 100 C70 96 76 100 78 108 C68 108 62 106 60 100 Z"/>
    </g>`;
  }

  function drawRose(f, mode) {
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    let outer = '';
    for (let i = 0; i < 6; i++) outer += teardrop(60, 54, 38, 20, i * 60 + 15);
    let mid = '';
    for (let i = 0; i < 5; i++) mid += teardrop(60, 54, 26, 15, i * 72);
    return `${leaves(f, mode)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round">${outer}</g>
      <g fill="${fill2}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">${mid}</g>
      <g fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M51 55 C49 45 71 45 69 56"/>
        <path d="M55 57 C53 49 67 49 65 57"/>
        <path d="M59 55 C59 51 64 51 64 55 C64 58 60 58 60 55"/>
      </g>`;
  }

  function drawPoppy(f, mode) {
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    const core = mode === 'ink' ? 'none' : (f.core || '#3d3a46');
    let back = '';
    for (let i = 0; i < 5; i++) back += teardrop(60, 52, 40, 27, i * 72 + 36);
    let front = '';
    for (let i = 0; i < 5; i++) front += teardrop(60, 52, 30, 22, i * 72);
    return `${leaves(f, mode)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round">${back}</g>
      <g fill="${fill2}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">${front}</g>
      <circle cx="60" cy="52" r="9" fill="${core}" stroke="${stroke}" stroke-width="1.6"/>
      ${mode === 'ink' ? '' : stipple(60, 52, 6, 10, f.petal2)}`;
  }

  function drawAnemone(f, mode) {
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    const core = mode === 'ink' ? 'none' : (f.core || '#33324c');
    let petals = '';
    for (let i = 0; i < 8; i++) petals += teardrop(60, 52, 40, 17, i * 45);
    let stamens = '';
    for (let i = 0; i < 12; i++) {
      const a = (i * 30) * Math.PI / 180;
      const x2 = 60 + Math.cos(a) * 15, y2 = 52 + Math.sin(a) * 15;
      stamens += `<line x1="60" y1="52" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`
        + `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="1.4" fill="${core}" stroke="none"/>`;
    }
    return `${leaves(f, mode)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">${petals}</g>
      <g fill="${fill2}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round">
        ${[0,72,144,216,288].map(a => teardrop(60,52,24,12,a)).join('')}
      </g>
      <g stroke="${core}" stroke-width="1.4" stroke-linecap="round" opacity="${mode === 'ink' ? 0 : 1}">${stamens}</g>
      <circle cx="60" cy="52" r="7" fill="${core}" stroke="${stroke}" stroke-width="1.4"/>`;
  }

  function drawSunflower(f, mode) {
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    const core = mode === 'ink' ? 'none' : (f.core || '#7a4e29');
    let back = '';
    for (let i = 0; i < 16; i++) back += teardrop(60, 50, 40, 8, i * 22.5 + 11);
    let front = '';
    for (let i = 0; i < 12; i++) front += teardrop(60, 50, 30, 9, i * 30);
    return `${leaves(f, mode)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round">${back}</g>
      <g fill="${fill2}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round">${front}</g>
      <circle cx="60" cy="50" r="15" fill="${core}" stroke="${stroke}" stroke-width="1.8"/>
      ${mode === 'ink' ? '' : stipple(60, 50, 12, 30, '#5c3a1f')}`;
  }

  function drawDaisy(f, mode) {
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
    const fill = mode === 'ink' ? 'none' : f.petal;
    const core = mode === 'ink' ? 'none' : (f.core || '#f0be48');
    const coreInk = mode === 'ink' ? PENCIL.stroke : (f.coreInk || '#cf9528');
    let petals = '';
    for (let i = 0; i < 13; i++) petals += teardrop(60, 50, 40, 10, i * (360 / 13));
    return `${leaves(f, mode)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round">${petals}</g>
      <circle cx="60" cy="50" r="12" fill="${core}" stroke="${coreInk}" stroke-width="1.8"/>
      ${mode === 'ink' ? '' : stipple(60, 50, 9, 16, coreInk)}`;
  }

  function drawLavender(f, mode) {
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    const spikes = [
      { x: 60, top: 16, bot: 78 },
      { x: 44, top: 30, bot: 82 },
      { x: 76, top: 30, bot: 82 },
    ];
    let buds = '';
    spikes.forEach(sp => {
      buds += `<path d="M${sp.x} ${sp.bot} C${sp.x} ${sp.bot} ${sp.x} ${sp.top + 6} ${sp.x} ${sp.top}"
        fill="none" stroke="${mode === 'ink' ? PENCIL.stroke : f.leafInk}" stroke-width="2" stroke-linecap="round"/>`;
      let alt = 0;
      for (let y = sp.top; y < sp.bot - 4; y += 7) {
        const off = (alt % 2 === 0) ? -6 : 6;
        buds += `<ellipse cx="${sp.x + off}" cy="${y}" rx="5.5" ry="4"
          fill="${alt % 2 === 0 ? fill : fill2}" stroke="${stroke}" stroke-width="1.4"
          transform="rotate(${off < 0 ? -25 : 25} ${sp.x + off} ${y})"/>`;
        alt++;
      }
    });
    return `${leaves(f, mode)}<g>${buds}</g>`;
  }

  const DRAWERS = { rose: drawRose, poppy: drawPoppy, anemone: drawAnemone, sunflower: drawSunflower, daisy: drawDaisy, lavender: drawLavender };

  function flowerSVG(type, mode = 'color') {
    const f = FLOWERS[type] || FLOWERS.rose;
    const inner = DRAWERS[f.draw](f, mode);
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  }

  // A stable flower species for each calendar day, so the uncoloured line-art
  // already shows a garden's worth of variety before anything is captured.
  function dayFlowerType(key) {
    const types = Object.keys(FLOWERS);
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return types[h % types.length];
  }

  // ---- State ----------------------------------------------------------------

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
    const now = new Date();
    const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

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

      const type = entry ? entry.flower : dayFlowerType(key);
      const flowerMarkup = flowerSVG(type, entry ? 'color' : 'ink');
      html += `<div class="day-card ${entry ? 'has-entry' : 'is-bud'} ${isToday ? 'is-today' : ''}" data-key="${key}" role="button" tabindex="0" aria-label="${MONTH_NAMES[month]} ${d}${entry ? ', memory captured' : ', empty'}">
        <span class="day-number">${d}</span>
        <div class="day-flower">${flowerMarkup}</div>
      </div>`;
    }

    grid.innerHTML = html;
    bloomCountEl.textContent = bloomedThisMonth > 0
      ? `${bloomedThisMonth} flower${bloomedThisMonth === 1 ? '' : 's'} bloomed this month`
      : 'A page waiting to be coloured in';

    grid.querySelectorAll('.day-card:not(.empty)').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.key));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card.dataset.key);
        }
      });

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
      card.style.transform = `translateY(-3px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }

  function spawnSparkles(card) {
    const layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    const petalColors = ['#e8a0aa', '#f0be48', '#b9d2dc', '#a98ecd', '#e86a50'];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.innerHTML = `<svg viewBox="0 0 12 16"><path d="M6 0 C10 5 10 11 6 16 C2 11 2 5 6 0 Z" fill="${petalColors[i % petalColors.length]}"/></svg>`;
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const dist = 36 + Math.random() * 20;
      s.style.setProperty('--sx', `${(Math.cos(angle) * dist).toFixed(1)}px`);
      s.style.setProperty('--sy', `${(Math.sin(angle) * dist).toFixed(1)}px`);
      s.style.setProperty('--sr', `${(Math.random() * 360).toFixed(0)}deg`);
      s.style.animationDelay = `${(i * 0.03).toFixed(2)}s`;
      layer.appendChild(s);
    }
    card.appendChild(layer);
    setTimeout(() => layer.remove(), 1000);
    setTimeout(() => card.classList.remove('just-bloomed'), 800);
  }

  function spawnPetalField() {
    const container = document.getElementById('bgPetals');
    if (!container || prefersReducedMotion) return;
    const colors = ['#e8a0aa', '#f0be48', '#b9d2dc', '#a98ecd', '#e86a50', '#94a06a'];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'bg-petal';
      const c = colors[i % colors.length];
      p.innerHTML = `<svg viewBox="0 0 12 16"><path d="M6 0 C10 5 10 11 6 16 C2 11 2 5 6 0 Z" fill="${c}"/></svg>`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.setProperty('--drift', `${(Math.random() * 140 - 70).toFixed(0)}px`);
      p.style.animationDuration = `${18 + Math.random() * 16}s`;
      p.style.animationDelay = `${(Math.random() * -24).toFixed(1)}s`;
      const size = 10 + Math.random() * 12;
      p.style.width = `${size}px`;
      container.appendChild(p);
    }
  }

  function renderFlowerPicker() {
    flowerPicker.innerHTML = Object.keys(FLOWERS).map(type =>
      `<button type="button" class="pick-btn flower-opt" data-type="${type}" title="${FLOWERS[type].label}" aria-label="${FLOWERS[type].label}">${flowerSVG(type, 'color')}</button>`
    ).join('');

    flowerPicker.querySelectorAll('.flower-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedFlower = btn.dataset.type;
        updateFlowerPickerSelection();
        modalFlowerDisplay.innerHTML = flowerSVG(selectedFlower, 'color');
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
    moodPicker.innerHTML = MOODS.map(m =>
      `<button type="button" class="pick-btn mood-opt" data-key="${m.key}" title="${m.label}" aria-label="${m.label}">${m.emoji}</button>`
    ).join('');

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
    selectedFlower = entry ? entry.flower : dayFlowerType(key);
    selectedMood = entry ? entry.mood : null;
    pendingPhoto = entry ? entry.photo : null;

    modalFlowerDisplay.innerHTML = flowerSVG(selectedFlower, 'color');
    updateFlowerPickerSelection();
    updateMoodPickerSelection();

    memoryText.value = entry ? entry.text : '';
    memoryText.placeholder = 'What happened today? What made it worth remembering?';
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
      memoryText.placeholder = 'Write a little something to colour this day in…';
      memoryText.classList.add('nudge');
      setTimeout(() => memoryText.classList.remove('nudge'), 500);
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
    if (prefersReducedMotion) {
      viewDate.setMonth(viewDate.getMonth() + delta);
      renderCalendar();
      return;
    }
    const outClass = delta > 0 ? 'slide-out-left' : 'slide-out-right';
    const inClass = delta > 0 ? 'slide-in-right' : 'slide-in-left';
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
