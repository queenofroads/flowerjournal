(() => {
  'use strict';

  const STORAGE_KEY = 'flowerJournal.entries';

  // Muted-warm botanical palette, echoing hand-painted gouache/watercolor references.
  // Each flower carries a vivid, contrasting stamp background (Bloomie-style),
  // so a captured day turns from a pale blank stamp into a colourful one.
  // Flat paper-cut palette: bold base-card backgrounds, accent-colour petals,
  // emerald/olive foliage. No black outlines; shapes read by colour contrast.
  const FLOWERS = {
    rose:        { label: 'Rose',        petal: '#FA318A', petal2: '#F7B2D2', ink: '#BA1259', leaf: '#168B46', leafInk: '#5B7318', bg: '#CDBDF6', draw: 'rose' },
    poppy:       { label: 'Poppy',       petal: '#EE4A36', petal2: '#F99E7B', ink: '#BA1259', core: '#4A0E2B', leaf: '#168B46', leafInk: '#5B7318', bg: '#1BB29D', draw: 'poppy' },
    anemone:     { label: 'Anemone',     petal: '#A3CFFC', petal2: '#CDBDF6', ink: '#2D72D9', core: '#4A0E2B', bg: '#EE4A36', leaf: '#168B46', leafInk: '#5B7318', draw: 'anemone' },
    sunflower:   { label: 'Sunflower',   petal: '#FED52B', petal2: '#FFB719', ink: '#F05023', leaf: '#168B46', leafInk: '#5B7318', core: '#4A0E2B', seed: '#4A0E2B', bg: '#8D32A7', draw: 'sunflower' },
    daisy:       { label: 'Daisy',       petal: '#ffffff', petal2: '#ffffff', ink: '#F7B2D2', leaf: '#168B46', leafInk: '#5B7318', core: '#FED52B', coreInk: '#FFB719', bg: '#FA318A', draw: 'daisy' },
    tulip:       { label: 'Tulip',       petal: '#FA318A', petal2: '#F7B2D2', ink: '#BA1259', leaf: '#168B46', leafInk: '#5B7318', bg: '#1BB29D', draw: 'tulip' },
    ranunculus:  { label: 'Ranunculus',  petal: '#F05023', petal2: '#F99E7B', ink: '#BA1259', leaf: '#168B46', leafInk: '#5B7318', bg: '#A3CFFC', draw: 'ranunculus' },
    lavender:    { label: 'Lavender',    petal: '#8D32A7', petal2: '#CDBDF6', ink: '#4A0E2B', leaf: '#168B46', leafInk: '#5B7318', bg: '#C2D637', draw: 'lavender' },
    forgetmenot: { label: 'Forget-me-not', petal: '#2D72D9', petal2: '#A3CFFC', ink: '#4A0E2B', core: '#FED52B', leaf: '#168B46', leafInk: '#5B7318', bg: '#EE4A36', draw: 'forgetmenot' },
    cherryblossom: { label: 'Cherry blossom', petal: '#F7B2D2', petal2: '#FA318A', ink: '#BA1259', core: '#FA318A', leaf: '#168B46', leafInk: '#5B7318', bg: '#8D32A7', draw: 'sakura' },
    bluebell:    { label: 'Bluebell',    petal: '#2D72D9', petal2: '#A3CFFC', ink: '#4A0E2B', leaf: '#168B46', leafInk: '#5B7318', bg: '#C2D637', draw: 'bluebell' },
    marigold:    { label: 'Marigold',    petal: '#FFB719', petal2: '#FED52B', ink: '#F05023', leaf: '#168B46', leafInk: '#5B7318', bg: '#8D32A7', draw: 'ranunculus' },
    cosmos:      { label: 'Cosmos',      petal: '#F7B2D2', petal2: '#F99E7B', ink: '#FA318A', leaf: '#168B46', leafInk: '#5B7318', core: '#FED52B', coreInk: '#FFB719', bg: '#1BB29D', draw: 'daisy' },
    crocus:      { label: 'Crocus',      petal: '#8D32A7', petal2: '#CDBDF6', ink: '#4A0E2B', leaf: '#168B46', leafInk: '#5B7318', bg: '#FA318A', draw: 'tulip' },
    dahlia:      { label: 'Dahlia',      petal: '#BA1259', petal2: '#FA318A', ink: '#4A0E2B', leaf: '#168B46', leafInk: '#5B7318', core: '#4A0E2B', seed: '#4A0E2B', bg: '#A3CFFC', draw: 'sunflower' },
    cornflower:  { label: 'Cornflower',  petal: '#2D72D9', petal2: '#A3CFFC', ink: '#1c2044', core: '#4A0E2B', seed: '#4A0E2B', leaf: '#168B46', leafInk: '#5B7318', bg: '#EE4A36', draw: 'sunflower' },
    aster:       { label: 'Aster',       petal: '#8D32A7', petal2: '#CDBDF6', ink: '#4A0E2B', core: '#FED52B', coreInk: '#FFB719', leaf: '#168B46', leafInk: '#5B7318', bg: '#FFF8DC', draw: 'aster' },
    zinnia:      { label: 'Zinnia',      petal: '#EE4A36', petal2: '#FFB719', ink: '#BA1259', core: '#FFB719', leaf: '#168B46', leafInk: '#5B7318', bg: '#CDBDF6', draw: 'zinnia' },
    camellia:    { label: 'Camellia',    petal: '#F7B2D2', petal2: '#FA318A', ink: '#BA1259', core: '#FED52B', leaf: '#168B46', leafInk: '#5B7318', bg: '#A3CFFC', draw: 'ranunculus' },
    hibiscus:    { label: 'Hibiscus',    petal: '#FA318A', petal2: '#F99E7B', ink: '#BA1259', core: '#4A0E2B', leaf: '#168B46', leafInk: '#5B7318', bg: '#1BB29D', draw: 'poppy' },
  };

  const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  // gentle daily prompts to spark a line or two
  const PROMPTS = [
    'What made you smile today?',
    'One small thing you are grateful for?',
    'What do you want to remember about today?',
    'Who or what made today a little lighter?',
    'What is one tiny win from today?',
    'How did you take care of yourself today?',
    'What surprised you today?',
    'A moment from today you would happily relive?',
    'What are you ready to let go of tonight?',
    'What is quietly blooming in your life right now?',
    'A sound, smell, or taste from today worth keeping?',
    'Who deserves a thank-you today?',
    'What felt hard, and how did you meet it?',
    'What are you looking forward to?',
    'Where did you feel most like yourself today?',
  ];
  // affirmations shown after you save
  const AFFIRMATIONS = [
    'You showed up today. That is enough.',
    'One more day, gently kept.',
    'Small moments make a whole life.',
    'Look at your garden growing.',
    'You are becoming, one day at a time.',
    'Today mattered, and so do you.',
    'A little bloom for a full day.',
    'Kind to yourself, always.',
  ];
  function pickBy(arr, key) {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return arr[h % arr.length];
  }

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
  // opts.leaves === false draws just the flower head (used inside bouquets).

  function teardrop(cx, cy, len, wid, angle) {
    const p = `M${cx} ${cy}`
      + `C${cx - wid} ${cy - len * 0.42} ${cx - wid} ${cy - len * 0.85} ${cx} ${cy - len}`
      + `C${cx + wid} ${cy - len * 0.85} ${cx + wid} ${cy - len * 0.42} ${cx} ${cy} Z`;
    return `<path d="${p}" transform="rotate(${angle} ${cx} ${cy})"/>`;
  }

  function stipple(cx, cy, r, n, color) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = i * 2.399963;
      const rr = r * Math.sqrt((i + 0.5) / n);
      s += `<circle cx="${(cx + Math.cos(a) * rr).toFixed(1)}" cy="${(cy + Math.sin(a) * rr).toFixed(1)}" r="1" fill="${color}"/>`;
    }
    return s;
  }

  function leaves(f, mode) {
    // flat oversized leaves; the stem and veins are the only line work (tonal, not black)
    const stemCol = mode === 'ink' ? PENCIL.stroke : f.leafInk;
    const leafStroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.leaf;
    // the stem runs up under the flower head (drawn behind the petals) so the
    // bloom, stem and leaves read as one connected plant
    return `<g stroke-linejoin="round">
      <path d="M60 58 C61 78 59 98 60 117" fill="none" stroke="${stemCol}" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M60 104 C46 97 37 103 35 115 C49 115 57 111 60 104 Z" fill="${fill}" stroke="${leafStroke}" stroke-width="2"/>
      <path d="M60 96 C74 89 83 95 85 107 C71 107 63 103 60 96 Z" fill="${fill}" stroke="${leafStroke}" stroke-width="2"/>
      ${mode === 'ink' ? '' : `<g fill="none" stroke="${stemCol}" stroke-width="1" stroke-linecap="round" opacity="0.5"><path d="M58 105 C51 104 44 107 39 112"/><path d="M60 98 C69 97 76 100 81 105"/></g>`}
    </g>`;
  }

  function base(f, mode, opts) {
    return (opts && opts.leaves === false) ? '' : leaves(f, mode);
  }

  function drawRose(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    let outer = '';
    for (let i = 0; i < 6; i++) outer += teardrop(60, 54, 38, 20, i * 60 + 15);
    let mid = '';
    for (let i = 0; i < 5; i++) mid += teardrop(60, 54, 26, 15, i * 72);
    return `${base(f, mode, opts)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round">${outer}</g>
      <g fill="${fill2}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">${mid}</g>
      <g fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M51 55 C49 45 71 45 69 56"/>
        <path d="M55 57 C53 49 67 49 65 57"/>
        <path d="M59 55 C59 51 64 51 64 55 C64 58 60 58 60 55"/>
      </g>`;
  }

  function drawPoppy(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    const core = mode === 'ink' ? 'none' : (f.core || '#3d3a46');
    let back = '';
    for (let i = 0; i < 5; i++) back += teardrop(60, 52, 40, 27, i * 72 + 36);
    let front = '';
    for (let i = 0; i < 5; i++) front += teardrop(60, 52, 30, 22, i * 72);
    return `${base(f, mode, opts)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round">${back}</g>
      <g fill="${fill2}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">${front}</g>
      <circle cx="60" cy="52" r="9" fill="${core}" stroke="${stroke}" stroke-width="1.6"/>
      ${mode === 'ink' ? '' : stipple(60, 52, 6, 10, f.petal2)}`;
  }

  function drawAnemone(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
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
    return `${base(f, mode, opts)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">${petals}</g>
      <g fill="${fill2}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round">
        ${[0,72,144,216,288].map(a => teardrop(60,52,24,12,a)).join('')}
      </g>
      <g stroke="${core}" stroke-width="1.4" stroke-linecap="round" opacity="${mode === 'ink' ? 0 : 1}">${stamens}</g>
      <circle cx="60" cy="52" r="7" fill="${core}" stroke="${stroke}" stroke-width="1.4"/>`;
  }

  function drawSunflower(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    const core = mode === 'ink' ? 'none' : (f.core || '#7a4e29');
    let back = '';
    for (let i = 0; i < 16; i++) back += teardrop(60, 50, 40, 8, i * 22.5 + 11);
    let front = '';
    for (let i = 0; i < 12; i++) front += teardrop(60, 50, 30, 9, i * 30);
    return `${base(f, mode, opts)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round">${back}</g>
      <g fill="${fill2}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round">${front}</g>
      <circle cx="60" cy="50" r="15" fill="${core}" stroke="${stroke}" stroke-width="1.8"/>
      ${mode === 'ink' ? '' : stipple(60, 50, 12, 30, f.seed || '#5c3a1f')}`;
  }

  function drawSakura(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const core = mode === 'ink' ? 'none' : (f.core || '#e0587a');
    let petals = '';
    for (let i = 0; i < 5; i++) {
      petals += `<path d="M60 54 C51 48 48 33 53 24 C55 28 57 29 60 32 C63 29 65 28 67 24 C72 33 69 48 60 54 Z" transform="rotate(${i * 72} 60 54)"/>`;
    }
    let stamens = '';
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 - 90) * Math.PI / 180;
      const x2 = 60 + Math.cos(a) * 11, y2 = 54 + Math.sin(a) * 11;
      stamens += `<line x1="60" y1="54" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="1.5" fill="${core}" stroke="none"/>`;
    }
    return `${base(f, mode, opts)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">${petals}</g>
      <g stroke="${core}" stroke-width="1.3" stroke-linecap="round" opacity="${mode === 'ink' ? 0 : 1}">${stamens}</g>
      <circle cx="60" cy="54" r="4" fill="${core}" stroke="${stroke}" stroke-width="1.2"/>`;
  }

  function drawBluebell(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    const stemInk = mode === 'ink' ? PENCIL.stroke : f.leafInk;
    const stalk = `<path d="M58 114 C58 88 55 58 66 36 C71 27 79 26 84 33" fill="none" stroke="${stemInk}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M60 92 C50 88 45 92 44 100 C54 100 59 97 60 92 Z" fill="${mode === 'ink' ? 'none' : f.leaf}" stroke="${stemInk}" stroke-width="1.8" stroke-linejoin="round"/>`;
    const pts = [[82, 33], [73, 43], [64, 55], [58, 70], [56, 86]];
    let bells = '';
    pts.forEach(([x, y], i) => {
      const s = 1 - i * 0.06;
      bells += teardrop(x, y, 16 * s, 7.5 * s, 172 + (i % 2 ? 9 : -9));
    });
    return `${stalk}
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round">${bells}</g>
      <g fill="${fill2}" stroke="none" opacity="${mode === 'ink' ? 0 : 0.5}">${pts.map(([x, y], i) => { const s = (1 - i * 0.06) * 0.5; return teardrop(x, y - 1, 12 * s * 2, 4 * s * 2, 172 + (i % 2 ? 9 : -9)); }).join('')}</g>`;
  }

  function drawDaisy(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const core = mode === 'ink' ? 'none' : (f.core || '#f0be48');
    const coreInk = mode === 'ink' ? PENCIL.stroke : (f.coreInk || '#cf9528');
    let petals = '';
    for (let i = 0; i < 13; i++) petals += teardrop(60, 50, 40, 10, i * (360 / 13));
    return `${base(f, mode, opts)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round">${petals}</g>
      <circle cx="60" cy="50" r="12" fill="${core}" stroke="${coreInk}" stroke-width="1.8"/>
      ${mode === 'ink' ? '' : stipple(60, 50, 9, 16, coreInk)}`;
  }

  function drawTulip(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    // cup with three pointed petals on top, rounded base tapering to the stem
    const cup = 'M42 62 C42 50 43 42 47 42 C51 42 53 50 54 58 C55 49 57 40 60 40 C63 40 65 49 66 58 C67 50 69 42 73 42 C77 42 78 50 78 62 C78 78 71 88 60 88 C49 88 42 78 42 62 Z';
    const inner = 'M51 62 C51 53 52 48 55 55 C56 49 58 46 60 46 C62 46 64 49 65 55 C68 48 69 53 69 62 C69 76 65 82 60 82 C55 82 51 76 51 62 Z';
    return `${base(f, mode, opts)}
      <path d="${cup}" fill="${fill}" stroke="${stroke}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="${inner}" fill="${fill2}" stroke="none"/>
      <g fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round">
        <path d="M54 58 C54 68 55 78 58 85"/>
        <path d="M66 58 C66 68 65 78 62 85"/>
      </g>`;
  }

  function drawRanunculus(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    let r1 = ''; for (let i = 0; i < 10; i++) r1 += teardrop(60, 56, 32, 15, i * 36);
    let r2 = ''; for (let i = 0; i < 8; i++) r2 += teardrop(60, 55, 22, 13, i * 45 + 18);
    let r3 = ''; for (let i = 0; i < 6; i++) r3 += teardrop(60, 54, 13, 10, i * 60);
    return `${base(f, mode, opts)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round">${r1}</g>
      <g fill="${fill2}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round">${r2}</g>
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round">${r3}</g>
      <circle cx="60" cy="53" r="4" fill="${mode === 'ink' ? 'none' : f.ink}" stroke="${stroke}" stroke-width="1.2"/>`;
  }

  function drawLavender(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
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
    return `${base(f, mode, opts)}<g>${buds}</g>`;
  }

  function drawForgetmenot(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    const core = mode === 'ink' ? 'none' : (f.core || '#f0be48');
    const blooms = [
      { x: 60, y: 40, r: 6, c: fill }, { x: 44, y: 50, r: 5.5, c: fill2 },
      { x: 76, y: 50, r: 5.5, c: fill2 }, { x: 50, y: 66, r: 6, c: fill },
      { x: 70, y: 66, r: 5.5, c: fill }, { x: 60, y: 56, r: 6.5, c: fill2 },
    ];
    let cluster = '';
    blooms.forEach(b => {
      for (let i = 0; i < 5; i++) {
        const a = i * 72 * Math.PI / 180;
        cluster += `<circle cx="${(b.x + Math.cos(a) * b.r).toFixed(1)}" cy="${(b.y + Math.sin(a) * b.r).toFixed(1)}" r="${(b.r * 0.72).toFixed(1)}" fill="${b.c}" stroke="${stroke}" stroke-width="1.2"/>`;
      }
      cluster += `<circle cx="${b.x}" cy="${b.y}" r="${(b.r * 0.42).toFixed(1)}" fill="${core}" stroke="none"/>`;
    });
    return `${base(f, mode, opts)}<g>${cluster}</g>`;
  }

  function drawAster(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const core = mode === 'ink' ? 'none' : (f.core || '#FED52B');
    // organic rounded petals in a radial pattern
    let petals = '';
    for (let i = 0; i < 16; i++) {
      const angle = (i * 22.5) - 90;
      const a = angle * Math.PI / 180;
      const dist = 26;
      const px = 60 + Math.cos(a) * dist;
      const py = 52 + Math.sin(a) * dist;
      // blobby petal shape
      const path = `M${px} ${py} Q${px + Math.cos(a) * 10} ${py + Math.sin(a) * 8} ${px + Math.cos(a) * 12} ${py + Math.sin(a) * 20} Q${px - Math.sin(a) * 8} ${py + Math.cos(a) * 12} ${px} ${py} Z`;
      petals += `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>`;
    }
    return `${base(f, mode, opts)}
      <g>${petals}</g>
      <circle cx="60" cy="52" r="13" fill="${core}" stroke="${stroke}" stroke-width="1.5"/>`;
  }

  function drawZinnia(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : 'none';
    const fill = mode === 'ink' ? 'none' : f.petal;
    const fill2 = mode === 'ink' ? 'none' : f.petal2;
    const core = mode === 'ink' ? 'none' : (f.core || '#FED52B');
    let outer = '';
    for (let i = 0; i < 8; i++) {
      const a = i * 45 * Math.PI / 180;
      const dx = Math.cos(a) * 35;
      const dy = Math.sin(a) * 35;
      const cx = 60 + dx, cy = 54 + dy;
      outer += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="16" ry="24" fill="${fill}" stroke="${stroke}" stroke-width="2" transform="rotate(${i * 45 + 22.5} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
    }
    let inner = '';
    for (let i = 0; i < 6; i++) {
      const a = i * 60 * Math.PI / 180;
      const dx = Math.cos(a) * 18;
      const dy = Math.sin(a) * 18;
      inner += `<circle cx="${(60 + dx).toFixed(1)}" cy="${(54 + dy).toFixed(1)}" r="8" fill="${fill2}" stroke="${stroke}" stroke-width="1.4"/>`;
    }
    return `${base(f, mode, opts)}
      <g>${outer}</g>
      <g>${inner}</g>
      <circle cx="60" cy="54" r="10" fill="${core}" stroke="${stroke}" stroke-width="1.5"/>`;
  }

  const DRAWERS = {
    rose: drawRose, poppy: drawPoppy, anemone: drawAnemone, sunflower: drawSunflower,
    daisy: drawDaisy, tulip: drawTulip, ranunculus: drawRanunculus, lavender: drawLavender,
    forgetmenot: drawForgetmenot, sakura: drawSakura, bluebell: drawBluebell,
    aster: drawAster, zinnia: drawZinnia,
  };

  function flowerInner(type, mode, opts) {
    const f = FLOWERS[type] || FLOWERS.rose;
    return DRAWERS[f.draw](f, mode, opts);
  }

  function flowerSVG(type, mode = 'color') {
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${flowerInner(type, mode)}</svg>`;
  }

  function flowerHeadSVG(type, mode = 'color') {
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${flowerInner(type, mode, { leaves: false })}</svg>`;
  }

  // A living cherry-blossom wreath framing the title: outlined blossoms with
  // gold centres (no ghostly glow), a wide clear centre, gentle animation.
  function embroideryCoverSVG() {
    const W = 300, H = 400;
    // a garden of colours around the wreath, not just pink
    const blossomCols = [
      { f: '#f2a0be', o: '#d178a0' }, // rose
      { f: '#f6a17c', o: '#d97a55' }, // coral
      { f: '#f7cf72', o: '#d9a63f' }, // butter
      { f: '#bda2e6', o: '#9878cf' }, // lilac
      { f: '#94c4ea', o: '#6b9fd0' }, // sky
      { f: '#93d9ad', o: '#5faf7c' }, // mint
    ];
    const budCols = ['#e77fa0', '#f0a06a', '#c79ae6', '#7fb2e0'];
    const gold = '#f2cf7a', goldDeep = '#d9a845';
    const leafCol = '#7bab6b', leafInk = '#548049';
    const rnd = s => { const x = Math.sin(s * 99.71) * 10000; return x - Math.floor(x); };
    const leafPath = len => `M0 0 C ${-len * 0.22} ${-len * 0.45} ${-len * 0.18} ${-len * 0.85} 0 ${-len} C ${len * 0.18} ${-len * 0.85} ${len * 0.22} ${-len * 0.45} 0 0 Z`;

    // a notched cherry-blossom petal pointing up, radius r
    const petal = r => `M0 0 C ${-r * 0.52} ${-r * 0.5} ${-r * 0.5} ${-r * 1.02} ${-r * 0.16} ${-r * 1.2} C ${-r * 0.06} ${-r * 1.27} 0 ${-r * 1.2} 0 ${-r * 1.12} C 0 ${-r * 1.2} ${r * 0.06} ${-r * 1.27} ${r * 0.16} ${-r * 1.2} C ${r * 0.5} ${-r * 1.02} ${r * 0.52} ${-r * 0.5} 0 0 Z`;

    const sprig = (r, fill, ol, seed) => {
      const leaves = `<path d="${leafPath(9)}" transform="rotate(150)" fill="${leafCol}" stroke="${leafInk}" stroke-width="0.5"/>`
        + `<path d="${leafPath(8)}" transform="rotate(210)" fill="${leafCol}" stroke="${leafInk}" stroke-width="0.5"/>`;
      let petals = '';
      for (let i = 0; i < 5; i++) petals += `<path d="${petal(r)}" transform="rotate(${i * 72 + seed * 18})" fill="${fill}"/>`;
      let stamens = '';
      for (let k = 0; k < 5; k++) { const a = k * 72 * Math.PI / 180; stamens += `<circle cx="${(Math.cos(a) * r * 0.26).toFixed(1)}" cy="${(Math.sin(a) * r * 0.26).toFixed(1)}" r="${(r * 0.1).toFixed(1)}" fill="${goldDeep}"/>`; }
      return `<g>${leaves}<g stroke="${ol}" stroke-width="0.7" stroke-linejoin="round">${petals}</g><g stroke="none">${stamens}<circle r="${(r * 0.2).toFixed(1)}" fill="${gold}"/></g></g>`;
    };

    const cx = 150, cy = 200, rx = 124, ry = 172, N = 20;
    let blooms = '';
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2 - Math.PI / 2;   // start at top
      const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
      const r = 8 + rnd(i) * 3;
      const delay = (rnd(i * 3) * 3.4).toFixed(2);
      const bc = blossomCols[i % blossomCols.length];
      blooms += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="cov-bloom" style="animation-delay:${delay}s">${sprig(r, bc.f, bc.o, rnd(i * 5))}</g></g>`;
      const a2 = (i + 0.5) / N * Math.PI * 2 - Math.PI / 2;
      const x2 = cx + Math.cos(a2) * (rx - 4), y2 = cy + Math.sin(a2) * (ry - 6);
      if (rnd(i + 1) > 0.45) blooms += `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="${(2 + rnd(i) * 1.2).toFixed(1)}" fill="${budCols[i % budCols.length]}"/>`;
    }
    let sparks = '';
    for (let i = 0; i < 9; i++) {
      const a = (i + 0.3) / 9 * Math.PI * 2;
      const out = rnd(i * 2) > 0.5;
      const x = cx + Math.cos(a) * (rx + (out ? 15 : -18));
      const y = cy + Math.sin(a) * (ry + (out ? 15 : -20));
      const delay = (rnd(i * 7) * 2.6).toFixed(2);
      const sc = (0.7 + rnd(i) * 0.5).toFixed(2);
      sparks += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc})"><g class="cov-spark" style="animation-delay:${delay}s"><path d="M0 -4 Q0.7 -0.7 4 0 Q0.7 0.7 0 4 Q-0.7 0.7 -4 0 Q-0.7 -0.7 0 -4 Z" fill="#f6dca0"/></g></g>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs><filter id="covSoft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="1" stdDeviation="0.7" flood-color="#8a5a66" flood-opacity="0.28"/></filter></defs>
      <g filter="url(#covSoft)">${blooms}</g>
      <g>${sparks}</g>
    </svg>`;
  }

  // A tied bouquet gathering a month's captured flowers.
  function bouquetSVG(types, mode) {
    if (!types || types.length === 0) {
      return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="${PENCIL.stroke}" stroke-width="2.5" stroke-linecap="round" opacity="0.8">
          <path d="M100 200 C100 152 96 112 100 82"/>
          <path d="M100 132 C86 124 80 134 82 148"/>
          <path d="M100 122 C114 114 120 124 118 138"/>
          <circle cx="100" cy="76" r="7"/>
        </g></svg>`;
    }
    const n = Math.min(types.length, 7);
    const tieX = 100, tieY = 184;
    let stems = '', heads = '';
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const deg = -48 + 96 * t;
      const a = deg * Math.PI / 180;
      const hx = tieX + Math.sin(a) * 62;
      const hy = tieY - Math.cos(a) * 120;
      stems += `<path d="M${tieX} ${tieY} Q ${(tieX + Math.sin(a) * 22).toFixed(1)} ${tieY - 66} ${hx.toFixed(1)} ${(hy + 16).toFixed(1)}" fill="none" stroke="#7d8a4f" stroke-width="3" stroke-linecap="round"/>`;
    }
    const s = 0.52;
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const deg = -48 + 96 * t;
      const a = deg * Math.PI / 180;
      const hx = tieX + Math.sin(a) * 62;
      const hy = tieY - Math.cos(a) * 120;
      heads += `<g transform="translate(${(hx - 60 * s).toFixed(1)} ${(hy - 54 * s).toFixed(1)}) scale(${s})">${flowerInner(types[i], mode, { leaves: false })}</g>`;
    }
    const twine = '#c69766', twineDark = '#9a713f';
    const bow = `<g stroke="${twineDark}" stroke-width="1.6" stroke-linejoin="round">
      <rect x="93" y="178" width="14" height="18" rx="3" fill="${twine}"/>
      <path d="M100 184 C85 173 80 193 100 188 Z" fill="${twine}"/>
      <path d="M100 184 C115 173 120 193 100 188 Z" fill="${twine}"/>
      <path d="M100 193 C96 203 94 209 91 214" fill="none" stroke-linecap="round"/>
      <path d="M100 193 C104 203 106 209 109 214" fill="none" stroke-linecap="round"/>
      <circle cx="100" cy="186" r="2.4" fill="${twineDark}" stroke="none"/>
    </g>`;
    return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
      <g>${stems}</g>${bow}<g>${heads}</g></svg>`;
  }

  // A stable flower species for each calendar day.
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
  let currentView = 'flat';   // 'flat' | 'ring' | 'year'
  let activeDateKey = null;
  let pendingPhoto = null;
  let selectedFlower = null;
  let selectedMood = null;
  let editMode = false;
  let justSavedKey = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const monthLabel = document.getElementById('monthLabel');
  const bloomCountEl = document.getElementById('bloomCount');
  const weekdayRow = document.getElementById('weekdayRow');
  const grid = document.getElementById('calendarGrid');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const todayBtn = document.getElementById('todayBtn');
  const exportBtn = document.getElementById('exportBtn');
  const viewFlatBtn = document.getElementById('viewFlat');
  const viewRingBtn = document.getElementById('viewRing');
  const viewYearBtn = document.getElementById('viewYear');

  const modalOverlay = document.getElementById('modalOverlay');
  const postcard = document.getElementById('postcard');
  const pcWeekday = document.getElementById('pcWeekday');
  const pcDayN = document.getElementById('pcDayN');
  const pcMon = document.getElementById('pcMon');
  const pcMark = document.getElementById('pcMark');
  const pcPhotoEmpty = document.getElementById('pcPhotoEmpty');
  const pcMoodCap = document.getElementById('pcMoodCap');
  const pcEmptyNote = document.getElementById('pcEmptyNote');
  const pcEdit = document.getElementById('pcEdit');
  const pcEditToggle = document.getElementById('pcEditToggle');
  const pcPrevBtn = document.getElementById('pcPrev');
  const pcNextBtn = document.getElementById('pcNext');
  const flowerPicker = document.getElementById('flowerPicker');
  const moodPicker = document.getElementById('moodPicker');
  const memoryText = document.getElementById('memoryText');
  const diaryPrompt = document.getElementById('diaryPrompt');
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

  // ---- Habit stats: streak, this-month, flower collection ----
  const statStreak = document.getElementById('statStreak');
  const streakNum = document.getElementById('streakNum');
  const monthNum = document.getElementById('monthNum');
  const collNum = document.getElementById('collNum');
  const todayCta = document.getElementById('todayCta');
  const TOTAL_FLOWERS = Object.keys(FLOWERS).length;

  function computeStats() {
    const keys = Object.keys(entries);
    const prefix = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-`;
    const monthCount = keys.filter(k => k.indexOf(prefix) === 0).length;
    const coll = new Set(keys.map(k => entries[k].flower).filter(Boolean)).size;
    const has = d => !!entries[dateKey(d.getFullYear(), d.getMonth(), d.getDate())];
    const cur = new Date(); cur.setHours(0, 0, 0, 0);
    if (!has(cur)) cur.setDate(cur.getDate() - 1);   // grace: today can still be planted
    let streak = 0;
    while (has(cur)) { streak++; cur.setDate(cur.getDate() - 1); }
    return { streak, monthCount, coll };
  }

  function setStat(el, val) {
    if (el.textContent === String(val)) return;
    el.textContent = val;
    const card = el.closest('.stat');
    if (card) { card.classList.remove('pulse'); void card.offsetWidth; card.classList.add('pulse'); }
  }

  function updateStats() {
    if (!statStreak) return;
    const { streak, monthCount, coll } = computeStats();
    setStat(streakNum, streak);
    setStat(monthNum, monthCount);
    collNum.textContent = `${coll}/${TOTAL_FLOWERS}`;
    statStreak.classList.toggle('active', streak > 0);
    const now = new Date();
    const tk = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
    const done = !!entries[tk];
    todayCta.className = 'today-cta ' + (done ? 'done' : 'todo');
    todayCta.textContent = done ? '🌸 today is planted' : '🌱 plant today';
    todayCta.onclick = () => openModal(tk);
  }

  function render() {
    updateStats();
    if (currentView === 'year') renderYear();
    else renderCalendar(currentView);
  }

  function stampHTML(key, d, isToday) {
    const entry = entries[key];
    const type = entry ? entry.flower : dayFlowerType(key);
    const f = FLOWERS[type] || FLOWERS.rose;
    const flowerMarkup = flowerSVG(type, entry ? 'color' : 'ink');
    const bgStyle = entry ? `--stamp-bg:${f.bg};` : '';
    const photoPeek = entry && entry.photo
      ? `<img class="stamp-photo" src="${entry.photo}" alt="" aria-hidden="true" />` : '';
    return `<div class="day-card ${entry ? 'has-entry' : 'is-bud'} ${isToday ? 'is-today' : ''}" data-key="${key}" role="button" tabindex="0" aria-label="${MONTH_NAMES[viewDate.getMonth()]} ${d}${entry ? ', memory captured' : ', empty'}${entry && entry.photo ? ', has photo' : ''}">
      <div class="stamp" style="${bgStyle}">
        <div class="stamp-face">
          <span class="stamp-date">${d}<small>${MONTH_ABBR[viewDate.getMonth()]}</small></span>
          <div class="day-flower">${flowerMarkup}</div>
          ${photoPeek}
        </div>
      </div>
    </div>`;
  }

  function renderCalendar(arrangement) {
    const ring = arrangement === 'ring';
    weekdayRow.style.display = ring ? 'none' : '';
    grid.classList.remove('year-mode');
    grid.classList.toggle('ring-mode', ring);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthLabel.textContent = `${MONTH_NAMES[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const now = new Date();
    const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

    let html = '';
    if (!ring) {
      for (let i = 0; i < firstDayIndex; i++) html += `<div class="day-card empty"></div>`;
    }

    let bloomedThisMonth = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(year, month, d);
      if (entries[key]) bloomedThisMonth++;
      html += stampHTML(key, d, key === todayKey);
    }

    grid.innerHTML = html;
    bloomCountEl.textContent = bloomedThisMonth > 0
      ? `${bloomedThisMonth} bloom${bloomedThisMonth === 1 ? '' : 's'} this month`
      : 'a page waiting to bloom';

    grid.querySelectorAll('.day-card:not(.empty)').forEach((card, idx) => {
      card.addEventListener('click', () => openModal(card.dataset.key));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.key); }
      });
      if (!ring && !prefersReducedMotion) attachTilt(card);
      // gentle staggered float so the whole grid breathes, like a garden in a soft breeze
      const col = idx % 7;
      card.style.setProperty('--fd', `${(-(col * 0.55 + (idx % 3) * 0.4)).toFixed(2)}s`);
      const fsvg = card.querySelector('.day-flower svg');
      if (fsvg) fsvg.style.animationDelay = `${(Math.random() * 2.6).toFixed(2)}s`;
      if (card.dataset.key === justSavedKey) {
        card.classList.add('just-bloomed');
        spawnSparkles(card);
      }
    });

    if (ring) layoutRing();
    justSavedKey = null;
  }

  function layoutRing() {
    const cards = Array.from(grid.querySelectorAll('.day-card'));
    const n = cards.length;
    if (!n) return;
    const rect = grid.getBoundingClientRect();
    const radius = Math.min(rect.width, rect.height) * 0.40;
    cards.forEach((card, i) => {
      // start at top, sweep clockwise around a full ring
      const angle = -90 + (i / n) * 360;
      const rad = angle * Math.PI / 180;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      const spin = angle + 90;                 // tangential, tops facing outward
      card.style.setProperty('--rx', `${x.toFixed(1)}px`);
      card.style.setProperty('--ry', `${y.toFixed(1)}px`);
      card.style.setProperty('--spin', `${spin.toFixed(1)}deg`);
      card.style.setProperty('--i', i);
    });
  }

  function renderYear() {
    weekdayRow.style.display = 'none';
    grid.classList.remove('ring-mode');
    grid.classList.add('year-mode');

    const year = viewDate.getFullYear();
    monthLabel.textContent = `${year}`;
    const now = new Date();
    const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
    const WD = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // top ruler of day numbers 1..31
    let ruler = `<div class="yp-corner"></div>`;
    for (let d = 1; d <= 31; d++) ruler += `<div class="yp-head">${d}</div>`;

    let total = 0;
    let body = '';
    for (let mi = 0; mi < 12; mi++) {
      const dim = new Date(year, mi + 1, 0).getDate();
      body += `<div class="yp-month" data-month="${mi}" role="button" tabindex="0">${MONTH_ABBR[mi]}</div>`;
      for (let d = 1; d <= 31; d++) {
        if (d > dim) { body += `<div class="yp-cell void"></div>`; continue; }
        const key = dateKey(year, mi, d);
        const entry = entries[key];
        const dow = new Date(year, mi, d).getDay();
        const weekend = (dow === 0 || dow === 6) ? ' weekend' : '';
        const today = key === todayKey ? ' today' : '';
        if (entry) {
          total++;
          const f = FLOWERS[entry.flower] || FLOWERS.rose;
          const note = (entry.text || '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
          body += `<div class="yp-cell filled${weekend}${today}" data-key="${key}" style="--c:${f.bg}" title="${MONTH_NAMES[mi]} ${d}${note ? ' · ' + note : ''}">
            <span class="yp-dnum">${d}</span>
            <span class="yp-wd">${WD[dow]}</span>
            <div class="yp-fl">${flowerHeadSVG(entry.flower, 'color')}</div>
          </div>`;
        } else {
          // empty days still show their own flower as pencil line-art, so the
          // year planner reads like the flat calendar: every day is a bloom
          body += `<div class="yp-cell${weekend}${today}" data-key="${key}" title="${MONTH_NAMES[mi]} ${d}">
            <span class="yp-dnum">${d}</span>
            <span class="yp-wd">${WD[dow]}</span>
            <div class="yp-fl yp-bud">${flowerHeadSVG(dayFlowerType(key), 'ink')}</div>
          </div>`;
        }
      }
    }

    grid.innerHTML = `<div class="year-planner">${ruler}${body}</div>`;
    bloomCountEl.textContent = total > 0
      ? `${total} bloom${total === 1 ? '' : 's'} across ${year}`
      : `${year} · a year waiting to bloom`;

    grid.querySelectorAll('.yp-month').forEach(h => {
      const go = () => { viewDate = new Date(year, Number(h.dataset.month), 1); setView('flat'); };
      h.addEventListener('click', go);
      h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    grid.querySelectorAll('.yp-cell[data-key]').forEach(c => {
      c.addEventListener('click', () => openModal(c.dataset.key));
    });
  }

  function attachTilt(card) {
    const maxTilt = 8;
    // set tilt as CSS vars so it composes with the ambient float animation
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tx', `${(-py * maxTilt).toFixed(2)}deg`);
      card.style.setProperty('--ty', `${(px * maxTilt).toFixed(2)}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tx', '0deg');
      card.style.setProperty('--ty', '0deg');
    });
  }

  function spawnSparkles(card) {
    const layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    const petalColors = ['#e8a0aa', '#f0be48', '#b9d2dc', '#a98ecd', '#e86a50', '#8fb6e6'];
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
    const colors = ['#e8a0aa', '#f0be48', '#b9d2dc', '#a98ecd', '#e86a50', '#94a06a', '#8fb6e6'];
    const count = 6;
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
        paintPostcard(selectedFlower);
      });
    });
  }

  // the note takes the flower's OWN colour (its petals), so a pink tulip
  // gives a pink page, a sunflower a golden one, never an unrelated colour
  function flowerCardColor(f) {
    const p = f.petal || '#e8a0aa';
    const h = p.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    // near-white petals (e.g. daisy) would wash out, so fall back to their heart
    if (lum > 225) return f.core || f.ink || p;
    return p;
  }

  // recolour the whole postcard to the day's flower, and stamp its bloom
  function paintPostcard(type) {
    const f = FLOWERS[type] || FLOWERS.rose;
    const cardBg = flowerCardColor(f);
    postcard.style.setProperty('--stamp-bg', cardBg);
    // choose ink that stays legible whether the bloom's colour is light or deep
    const dark = isDarkColor(cardBg);
    postcard.classList.toggle('on-dark', dark);
    postcard.classList.toggle('on-light', !dark);
    pcMark.innerHTML = flowerHeadSVG(type, 'color');
    postcard.classList.remove('repaint');
    void postcard.offsetWidth;
    postcard.classList.add('repaint');
  }

  function isDarkColor(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    // perceived luminance (0-255); below ~150 reads as a deep colour needing light ink
    return (0.299 * r + 0.587 * g + 0.114 * b) < 150;
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
        updateMoodCaption();
      });
    });
  }

  function updateMoodCaption() {
    const mood = MOODS.find(m => m.key === selectedMood);
    pcMoodCap.textContent = mood ? mood.label : 'Today';
  }

  function updateMoodPickerSelection() {
    moodPicker.querySelectorAll('.mood-opt').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.key === selectedMood);
    });
  }

  function openModal(key, forceEdit) {
    const firstOpen = modalOverlay.hidden;
    activeDateKey = key;
    const [y, m, d] = key.split('-').map(Number);
    const displayDate = new Date(y, m - 1, d);

    const entry = entries[key];
    // empty days open ready to write; filled days open as a page you read, then Edit
    editMode = forceEdit !== undefined ? forceEdit : !entry;

    selectedFlower = entry ? entry.flower : dayFlowerType(key);
    selectedMood = entry ? entry.mood : null;
    pendingPhoto = entry ? entry.photo : null;

    // header: weekday + big faded date + the day's bloom on the stamp
    pcWeekday.textContent = displayDate.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
    pcDayN.textContent = String(d);
    pcMon.textContent = MONTH_ABBR[m - 1];
    paintPostcard(selectedFlower);

    updateFlowerPickerSelection();
    updateMoodPickerSelection();
    updateMoodCaption();

    memoryText.value = entry ? entry.text : '';
    if (diaryPrompt) diaryPrompt.textContent = pickBy(PROMPTS, key);
    photoInput.value = '';
    if (pendingPhoto) {
      photoPreview.src = pendingPhoto;
      photoPreviewWrap.hidden = false;
    } else {
      photoPreviewWrap.hidden = true;
    }

    applyPostcardMode();

    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (firstOpen && !prefersReducedMotion) {
      postcard.classList.remove('deal-in');
      void postcard.offsetWidth;
      postcard.classList.add('deal-in');
    }
    if (editMode) setTimeout(() => memoryText.focus(), 60);
  }

  // toggle the postcard between reading (view) and writing (edit)
  function applyPostcardMode() {
    const entry = entries[activeDateKey];
    postcard.classList.toggle('editing', editMode);
    postcard.classList.toggle('viewing', !editMode);
    pcEdit.hidden = !editMode;
    memoryText.readOnly = !editMode;
    memoryText.hidden = !editMode && !(entry && entry.text);
    pcEmptyNote.hidden = editMode || (entry && entry.text);
    pcPhotoEmpty.style.display = editMode ? '' : 'none';
    // in view mode with no photo, drop the photo column so the writing fills the page
    postcard.classList.toggle('no-photo', !editMode && !pendingPhoto);

    pcEditToggle.hidden = editMode;
    saveEntryBtn.hidden = !editMode;
    deleteEntryBtn.hidden = !(editMode && entry);
  }

  function stepDay(delta) {
    if (!activeDateKey) return;
    const [y, m, d] = activeDateKey.split('-').map(Number);
    const nd = new Date(y, m - 1, d + delta);
    const key = dateKey(nd.getFullYear(), nd.getMonth(), nd.getDate());
    // keep the calendar underneath in step with the day we're paging to
    if (nd.getMonth() !== viewDate.getMonth() || nd.getFullYear() !== viewDate.getFullYear()) {
      viewDate = new Date(nd.getFullYear(), nd.getMonth(), 1);
      setView(currentView === 'year' ? 'flat' : currentView);
    }
    postcard.classList.remove('slide-next', 'slide-prev');
    void postcard.offsetWidth;
    postcard.classList.add(delta > 0 ? 'slide-next' : 'slide-prev');
    openModal(key, false);
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
      saveEntryBtn.classList.remove('saved');
      // stay on the page, now settled into its saved, readable state
      editMode = false;
      applyPostcardMode();
      render();
      showAffirmation();
    }, 260);
  });

  pcEditToggle.addEventListener('click', () => {
    editMode = true;
    applyPostcardMode();
    setTimeout(() => memoryText.focus(), 60);
  });
  pcPrevBtn.addEventListener('click', () => stepDay(-1));
  pcNextBtn.addEventListener('click', () => stepDay(1));

  deleteEntryBtn.addEventListener('click', () => {
    if (!activeDateKey) return;
    delete entries[activeDateKey];
    saveEntries(entries);
    closeModal();
    render();
  });

  closeModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (modalOverlay.hidden) return;
    if (e.key === 'Escape') closeModal();
    // page between days with the arrow keys, unless the writer is typing
    if (!editMode && e.target !== memoryText) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepDay(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); stepDay(1); }
    }
  });

  function stepView(delta) {
    if (currentView === 'year') {
      viewDate.setFullYear(viewDate.getFullYear() + delta);
      renderYear();
      return;
    }
    if (currentView === 'ring' || prefersReducedMotion) {
      viewDate.setMonth(viewDate.getMonth() + delta);
      renderCalendar(currentView);
      return;
    }
    const outClass = delta > 0 ? 'page-out-next' : 'page-out-prev';
    const inClass = delta > 0 ? 'page-in-next' : 'page-in-prev';
    grid.style.transformOrigin = delta > 0 ? 'left center' : 'right center';
    grid.classList.add(outClass);
    setTimeout(() => {
      viewDate.setMonth(viewDate.getMonth() + delta);
      renderCalendar(currentView);
      grid.classList.remove(outClass);
      grid.classList.add(inClass);
      setTimeout(() => { grid.classList.remove(inClass); grid.style.transformOrigin = ''; }, 380);
    }, 300);
  }

  function setView(view) {
    currentView = view;
    [[viewFlatBtn, 'flat'], [viewRingBtn, 'ring'], [viewYearBtn, 'year']].forEach(([btn, v]) => {
      btn.classList.toggle('active', view === v);
      btn.setAttribute('aria-selected', view === v);
    });
    exportBtn.hidden = view !== 'year';
    render();
  }

  // Render the linear wall-planner year view into a downloadable poster.
  async function exportYear() {
    const year = viewDate.getFullYear();
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    const WD = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const pad = 50, titleH = 150, footerH = 58;
    const monthColW = 96, dayW = 46, rulerH = 32, rowH = 54;
    const plannerW = monthColW + 31 * dayW;
    const plannerH = rulerH + 12 * rowH;
    const W = pad * 2 + plannerW;
    const H = titleH + plannerH + footerH;
    const x0 = pad, y0 = titleH;
    const cellX = d => x0 + monthColW + (d - 1) * dayW;
    const rowY = mi => y0 + rulerH + mi * rowH;

    // ---- self-contained SVG: fills, grid, and flowers (no text) ----
    let shapes = '';
    shapes += `<rect width="${W}" height="${H}" fill="#efedea"/>`;
    shapes += `<rect x="${x0}" y="${y0}" width="${plannerW}" height="${plannerH}" rx="16" fill="#fffdf9"/>`;
    // header + month-column tints
    shapes += `<rect x="${x0}" y="${y0}" width="${monthColW}" height="${rulerH}" fill="#f7f0e4"/>`;
    shapes += `<rect x="${x0 + monthColW}" y="${y0}" width="${31 * dayW}" height="${rulerH}" fill="#f7f0e4"/>`;
    shapes += `<rect x="${x0}" y="${y0 + rulerH}" width="${monthColW}" height="${12 * rowH}" fill="#fdf7ee"/>`;

    let flowers = '';
    let total = 0;
    for (let mi = 0; mi < 12; mi++) {
      const dim = new Date(year, mi + 1, 0).getDate();
      for (let d = 1; d <= 31; d++) {
        const cx = cellX(d), cy = rowY(mi);
        if (d > dim) {
          shapes += `<rect x="${cx}" y="${cy}" width="${dayW}" height="${rowH}" fill="#ece6da"/>`;
          continue;
        }
        const dow = new Date(year, mi, d).getDay();
        if (dow === 0 || dow === 6) shapes += `<rect x="${cx}" y="${cy}" width="${dayW}" height="${rowH}" fill="#faf3e8"/>`;
        const entry = entries[dateKey(year, mi, d)];
        if (entry) {
          total++;
          const f = FLOWERS[entry.flower] || FLOWERS.rose;
          shapes += `<rect x="${cx}" y="${cy}" width="${dayW}" height="${rowH}" fill="${f.bg}"/>`;
          const s = (Math.min(dayW, rowH) * 0.74) / 120;
          const fx = cx + dayW / 2 - 60 * s;
          const fy = cy + rowH / 2 - 60 * s;
          flowers += `<g transform="translate(${fx.toFixed(1)} ${fy.toFixed(1)}) scale(${s.toFixed(3)})">${flowerInner(entry.flower, 'color', { leaves: false })}</g>`;
        }
      }
    }

    // grid lines
    let lines = `<g stroke="#eae4db" stroke-width="1">`;
    for (let i = 0; i <= 31; i++) {
      const x = x0 + monthColW + i * dayW;
      lines += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + plannerH}"/>`;
    }
    for (let r = 0; r <= 12; r++) {
      const y = y0 + rulerH + r * rowH;
      lines += `<line x1="${x0}" y1="${y}" x2="${x0 + plannerW}" y2="${y}"/>`;
    }
    lines += `</g><g stroke="#e0d8ca" stroke-width="1.5" fill="none">`;
    lines += `<line x1="${x0 + monthColW}" y1="${y0}" x2="${x0 + monthColW}" y2="${y0 + plannerH}"/>`;
    lines += `<line x1="${x0}" y1="${y0 + rulerH}" x2="${x0 + plannerW}" y2="${y0 + rulerH}"/>`;
    lines += `<rect x="${x0}" y="${y0}" width="${plannerW}" height="${plannerH}" rx="16"/></g>`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${shapes}${flowers}${lines}</svg>`;
    const img = await new Promise(res => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => res(null);
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });

    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = '#efedea';
    ctx.fillRect(0, 0, W, H);
    if (img) ctx.drawImage(img, 0, 0, W, H);

    // ---- text (uses the loaded fonts) ----
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#2f2b28';
    ctx.font = "72px 'Parisienne', cursive";
    ctx.fillText('Flower Journal', W / 2, 82);
    ctx.fillStyle = '#8b837a';
    ctx.font = "italic 23px 'Fraunces', Georgia, serif";
    ctx.fillText(`a garden of small moments · ${year}`, W / 2, 118);

    ctx.textBaseline = 'middle';
    // ruler day numbers
    ctx.fillStyle = '#8b837a';
    ctx.font = "600 14px 'Fraunces', Georgia, serif";
    for (let d = 1; d <= 31; d++) ctx.fillText(String(d), cellX(d) + dayW / 2, y0 + rulerH / 2 + 1);
    // month labels
    ctx.fillStyle = '#c06d78';
    ctx.font = "600 22px 'Fraunces', Georgia, serif";
    for (let mi = 0; mi < 12; mi++) ctx.fillText(MONTH_ABBR[mi], x0 + monthColW / 2, rowY(mi) + rowH / 2 + 1);

    // per-cell day number + weekday
    ctx.textBaseline = 'top';
    for (let mi = 0; mi < 12; mi++) {
      const dim = new Date(year, mi + 1, 0).getDate();
      for (let d = 1; d <= dim; d++) {
        const cx = cellX(d), cy = rowY(mi);
        const dow = new Date(year, mi, d).getDay();
        const filled = !!entries[dateKey(year, mi, d)];
        ctx.font = "700 10px 'Quicksand', sans-serif";
        ctx.textAlign = 'left';
        ctx.fillStyle = filled ? 'rgba(255,255,255,0.92)' : '#9c8c7c';
        ctx.fillText(String(d), cx + 4, cy + 4);
        ctx.textAlign = 'right';
        ctx.font = "700 8px 'Quicksand', sans-serif";
        ctx.fillStyle = filled ? 'rgba(255,255,255,0.6)' : '#c3b7a6';
        ctx.fillText(WD[dow], cx + dayW - 4, cy + 4);
      }
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#b7ada0';
    ctx.font = "italic 17px 'Fraunces', Georgia, serif";
    ctx.fillText(`${total} bloom${total === 1 ? '' : 's'} pressed in my Flower Journal`, W / 2, H - 22);

    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flower-journal-${year}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }, 'image/png');
  }

  prevBtn.addEventListener('click', () => stepView(-1));
  nextBtn.addEventListener('click', () => stepView(1));
  viewFlatBtn.addEventListener('click', () => setView('flat'));
  viewRingBtn.addEventListener('click', () => setView('ring'));
  viewYearBtn.addEventListener('click', () => setView('year'));
  todayBtn.addEventListener('click', () => {
    viewDate = new Date();
    viewDate.setDate(1);
    setView(currentView === 'year' ? 'flat' : currentView);
  });
  exportBtn.addEventListener('click', () => {
    exportBtn.disabled = true;
    const label = exportBtn.textContent;
    exportBtn.textContent = 'Pressing your bouquet…';
    Promise.resolve(exportYear()).finally(() => {
      exportBtn.disabled = false;
      exportBtn.textContent = label;
    });
  });
  window.addEventListener('resize', () => { if (currentView === 'ring') layoutRing(); });

  // Cover / intro screen: a diary you turn through, page by page
  // ---- Affirmation toast ----
  const affirmationEl = document.getElementById('affirmation');
  let affTimer;
  function showAffirmation(msg) {
    if (!affirmationEl) return;
    const line = msg || AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    affirmationEl.textContent = line;
    affirmationEl.hidden = false;
    requestAnimationFrame(() => affirmationEl.classList.add('show'));
    clearTimeout(affTimer);
    affTimer = setTimeout(() => {
      affirmationEl.classList.remove('show');
      setTimeout(() => { affirmationEl.hidden = true; }, 400);
    }, 3000);
  }

  // ---- Letter to your future self (five years on) ----
  const FUTURE_KEY = 'flowerJournal.futureLetter';
  const futureBtn = document.getElementById('futureBtn');
  const futureOverlay = document.getElementById('futureOverlay');
  const futureText = document.getElementById('futureText');
  const futureSub = document.getElementById('futureSub');
  const futureSalutation = document.getElementById('futureSalutation');
  const saveFutureBtn = document.getElementById('saveFuture');
  const clearFutureBtn = document.getElementById('clearFuture');
  const closeFutureBtn = document.getElementById('closeFuture');
  const futureFlower = document.getElementById('futureFlower');
  const fmtLong = d => d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const loadFuture = () => { try { return JSON.parse(localStorage.getItem(FUTURE_KEY)); } catch (e) { return null; } };

  function openFuture() {
    if (!futureOverlay) return;
    futureSalutation.textContent = `Dear me in ${new Date().getFullYear() + 5},`;
    if (futureFlower) futureFlower.innerHTML = flowerSVG('cherryblossom', 'color');
    const stored = loadFuture();
    if (stored && stored.text) {
      futureText.value = stored.text;
      futureSub.textContent = stored.opensOn
        ? `sealed ${fmtLong(new Date(stored.sealedOn))} · to reopen ${fmtLong(new Date(stored.opensOn))}`
        : '';
      clearFutureBtn.hidden = false;
      saveFutureBtn.textContent = 'Reseal';
    } else {
      futureText.value = '';
      futureSub.textContent = 'write it now, read it in five years';
      clearFutureBtn.hidden = true;
      saveFutureBtn.textContent = 'Seal this letter';
    }
    futureOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => futureText.focus(), 60);
  }
  function closeFuture() {
    futureOverlay.classList.add('closing');
    setTimeout(() => { futureOverlay.hidden = true; futureOverlay.classList.remove('closing'); document.body.style.overflow = ''; }, 160);
  }
  if (futureBtn) futureBtn.addEventListener('click', openFuture);
  if (closeFutureBtn) closeFutureBtn.addEventListener('click', closeFuture);
  if (futureOverlay) futureOverlay.addEventListener('click', e => { if (e.target === futureOverlay) closeFuture(); });
  if (saveFutureBtn) saveFutureBtn.addEventListener('click', () => {
    const text = futureText.value.trim();
    if (!text) { futureText.focus(); futureText.classList.add('nudge'); setTimeout(() => futureText.classList.remove('nudge'), 500); return; }
    const now = new Date();
    const opens = new Date(now); opens.setFullYear(opens.getFullYear() + 5);
    localStorage.setItem(FUTURE_KEY, JSON.stringify({ text, sealedOn: now.toISOString(), opensOn: opens.toISOString() }));
    closeFuture();
    showAffirmation(`Sealed. See you in ${opens.getFullYear()}. 💌`);
  });
  if (clearFutureBtn) clearFutureBtn.addEventListener('click', () => {
    localStorage.removeItem(FUTURE_KEY);
    futureText.value = '';
    futureSub.textContent = 'write it now, read it in five years';
    clearFutureBtn.hidden = true;
    saveFutureBtn.textContent = 'Seal this letter';
    futureText.focus();
  });
  document.addEventListener('keydown', e => { if (futureOverlay && !futureOverlay.hidden && e.key === 'Escape') closeFuture(); });

  renderWeekdayRow();
  renderFlowerPicker();
  renderMoodPicker();
  render();
  spawnPetalField();
})();
