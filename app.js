(() => {
  'use strict';

  const STORAGE_KEY = 'flowerJournal.entries';

  // Muted-warm botanical palette, echoing hand-painted gouache/watercolor references.
  // Each flower carries a vivid, contrasting stamp background (Bloomie-style),
  // so a captured day turns from a pale blank stamp into a colourful one.
  const FLOWERS = {
    rose:        { label: 'Rose',        petal: '#e8a0aa', petal2: '#f2c2c8', ink: '#bd6d78', leaf: '#3f8f5e', leafInk: '#2c6b43', bg: '#3d7ff2', draw: 'rose' },
    poppy:       { label: 'Poppy',       petal: '#e86a50', petal2: '#f28e77', ink: '#b3452f', leaf: '#2f8f6a', leafInk: '#1f6e50', core: '#3d3a46', bg: '#22b3bf', draw: 'poppy' },
    anemone:     { label: 'Anemone',     petal: '#bcd2dc', petal2: '#dbe9ee', ink: '#5f7d8a', core: '#2a2942', bg: '#f2683d', leaf: '#3f8f5e', leafInk: '#2c6b43', draw: 'anemone' },
    sunflower:   { label: 'Sunflower',   petal: '#f0be48', petal2: '#f7d574', ink: '#cf9528', leaf: '#3f8f5e', leafInk: '#2c6b43', core: '#7a4e29', bg: '#7a5cf0', draw: 'sunflower' },
    daisy:       { label: 'Daisy',       petal: '#ffffff', petal2: '#ffffff', ink: '#d9d0e0', leaf: '#3f8f5e', leafInk: '#2c6b43', core: '#f0be48', coreInk: '#cf9528', bg: '#f24b8b', draw: 'daisy' },
    tulip:       { label: 'Tulip',       petal: '#e8788f', petal2: '#f2a6b6', ink: '#bf5a72', leaf: '#2f8f5e', leafInk: '#1f6e43', bg: '#3fb37a', draw: 'tulip' },
    ranunculus:  { label: 'Ranunculus',  petal: '#ee9a80', petal2: '#f6c1ae', ink: '#cd7157', leaf: '#3f8f5e', leafInk: '#2c6b43', bg: '#6c5cf0', draw: 'ranunculus' },
    lavender:    { label: 'Lavender',    petal: '#a98ecd', petal2: '#c4addf', ink: '#7c62a6', leaf: '#3f8f5e', leafInk: '#2c6b43', bg: '#f5b70f', draw: 'lavender' },
    forgetmenot: { label: 'Forget-me-not', petal: '#8fb6e6', petal2: '#b3d0f0', ink: '#5f88bf', core: '#f0be48', leaf: '#3f8f5e', leafInk: '#2c6b43', bg: '#ef5a7a', draw: 'forgetmenot' },
    cherryblossom: { label: 'Cherry blossom', petal: '#f7b9cd', petal2: '#fcd6e1', ink: '#d97fa0', core: '#e0587a', leaf: '#3f8f5e', leafInk: '#2c6b43', bg: '#3d7ff2', draw: 'sakura' },
    bluebell:    { label: 'Bluebell',    petal: '#7b7fd6', petal2: '#9ca0e4', ink: '#565aa8', leaf: '#3f8f5e', leafInk: '#2c6b43', bg: '#f5b70f', draw: 'bluebell' },
    marigold:    { label: 'Marigold',    petal: '#f2913a', petal2: '#f8b566', ink: '#cf6f1e', leaf: '#3f8f5e', leafInk: '#2c6b43', bg: '#22839f', draw: 'ranunculus' },
    cosmos:      { label: 'Cosmos',      petal: '#f0a6c4', petal2: '#f7c6da', ink: '#d97fa8', leaf: '#3f8f5e', leafInk: '#2c6b43', core: '#f0be48', coreInk: '#cf9528', bg: '#3fb37a', draw: 'daisy' },
    crocus:      { label: 'Crocus',      petal: '#9b7ad6', petal2: '#b89ee6', ink: '#7856b0', leaf: '#3f8f5e', leafInk: '#2c6b43', bg: '#f5b70f', draw: 'tulip' },
    dahlia:      { label: 'Dahlia',      petal: '#dd5b9a', petal2: '#ea86b6', ink: '#b23b76', leaf: '#3f8f5e', leafInk: '#2c6b43', core: '#6b2a4a', seed: '#4a1832', bg: '#22b3bf', draw: 'sunflower' },
    cornflower:  { label: 'Cornflower',  petal: '#6b86d8', petal2: '#93a9e6', ink: '#4a63ad', core: '#2a2f5a', seed: '#1c2044', leaf: '#3f8f5e', leafInk: '#2c6b43', bg: '#f2913a', draw: 'sunflower' },
  };

  const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

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
    const stroke = mode === 'ink' ? PENCIL.stroke : f.leafInk;
    const fill = mode === 'ink' ? 'none' : f.leaf;
    return `<g fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">
      <path d="M60 96 C60 108 60 112 60 116" fill="none" stroke-linecap="round"/>
      <path d="M60 104 C50 100 44 104 42 112 C52 112 58 110 60 104 Z"/>
      <path d="M60 100 C70 96 76 100 78 108 C68 108 62 106 60 100 Z"/>
    </g>`;
  }

  function base(f, mode, opts) {
    return (opts && opts.leaves === false) ? '' : leaves(f, mode);
  }

  function drawRose(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
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
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
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
    return `${base(f, mode, opts)}
      <g fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round">${petals}</g>
      <g fill="${fill2}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round">
        ${[0,72,144,216,288].map(a => teardrop(60,52,24,12,a)).join('')}
      </g>
      <g stroke="${core}" stroke-width="1.4" stroke-linecap="round" opacity="${mode === 'ink' ? 0 : 1}">${stamens}</g>
      <circle cx="60" cy="52" r="7" fill="${core}" stroke="${stroke}" stroke-width="1.4"/>`;
  }

  function drawSunflower(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
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
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
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
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
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
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
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
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
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
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
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
    return `${base(f, mode, opts)}<g>${buds}</g>`;
  }

  function drawForgetmenot(f, mode, opts) {
    const stroke = mode === 'ink' ? PENCIL.stroke : f.ink;
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

  const DRAWERS = {
    rose: drawRose, poppy: drawPoppy, anemone: drawAnemone, sunflower: drawSunflower,
    daisy: drawDaisy, tulip: drawTulip, ranunculus: drawRanunculus, lavender: drawLavender,
    forgetmenot: drawForgetmenot, sakura: drawSakura, bluebell: drawBluebell,
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

  // Hand-stitched cherry-blossom wreath for the diary cover.
  function embroideryCoverSVG() {
    const W = 300, H = 400;
    const white = '#fdeff3', pink = '#f3c2d1', budDeep = '#cf5b7e', knot = '#f2d59a';
    const leafCol = '#6f9a62', leafInk = '#4f7746';
    const rnd = s => { const x = Math.sin(s * 99.71) * 10000; return x - Math.floor(x); };
    const leaf = (cx, cy, ang, len) =>
      `<path d="M0 0 C ${-len * 0.22} ${-len * 0.45} ${-len * 0.18} ${-len * 0.85} 0 ${-len} C ${len * 0.18} ${-len * 0.85} ${len * 0.22} ${-len * 0.45} 0 0 Z" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${ang.toFixed(1)})" fill="${leafCol}" stroke="${leafInk}" stroke-width="0.4"/>`;
    const blossom = (cx, cy, r, fill, seed) => {
      let petals = '';
      for (let i = 0; i < 5; i++) {
        petals += `<path d="M0 0 C ${-r * 0.5} ${-r * 0.5} ${-r * 0.55} ${-r * 1.15} 0 ${-r * 1.25} C ${r * 0.55} ${-r * 1.15} ${r * 0.5} ${-r * 0.5} 0 0 Z" transform="rotate(${i * 72 + seed * 24})" fill="${fill}"/>`;
      }
      let knots = '';
      for (let k = 0; k < 4; k++) { const a = k * 90 * Math.PI / 180; knots += `<circle cx="${(Math.cos(a) * r * 0.26).toFixed(1)}" cy="${(Math.sin(a) * r * 0.26).toFixed(1)}" r="${(r * 0.15).toFixed(1)}" fill="${knot}"/>`; }
      return `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})" stroke="#d69bad" stroke-width="0.4">${petals}<g stroke="none">${knots}</g></g>`;
    };

    const cx = 150, cy = 202, rx = 116, ry = 152, N = 22;
    let leaves = '', blooms = '';
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2;
      const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
      const tang = a * 180 / Math.PI + 90;
      leaves += leaf(x, y, tang + 34, 15) + leaf(x, y, tang - 34, 13);
    }
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2;
      const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
      const r = 6.5 + rnd(i) * 3;
      blooms += blossom(x, y, r, i % 2 ? white : pink, rnd(i * 3));
      const a2 = (i + 0.5) / N * Math.PI * 2;
      const x2 = cx + Math.cos(a2) * (rx - 6), y2 = cy + Math.sin(a2) * (ry - 8);
      if (rnd(i + 1) > 0.4) blooms += `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="${(2 + rnd(i) * 1.3).toFixed(1)}" fill="${budDeep}"/>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs><filter id="embStitch" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0.7" stdDeviation="0.5" flood-color="#20080f" flood-opacity="0.4"/></filter></defs>
      <g filter="url(#embStitch)">${leaves}</g>
      <g filter="url(#embStitch)">${blooms}</g>
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

  function render() {
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

    grid.querySelectorAll('.day-card:not(.empty)').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.key));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.key); }
      });
      if (!ring && !prefersReducedMotion) attachTilt(card);
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
          body += `<div class="yp-cell filled${weekend}${today}" data-key="${key}" style="--c:${f.bg}" title="${MONTH_NAMES[mi]} ${d}${note ? ' — ' + note : ''}">
            <span class="yp-dnum">${d}</span>
            <span class="yp-wd">${WD[dow]}</span>
            <div class="yp-fl">${flowerHeadSVG(entry.flower, 'color')}</div>
          </div>`;
        } else {
          body += `<div class="yp-cell${weekend}${today}" data-key="${key}" title="${MONTH_NAMES[mi]} ${d}">
            <span class="yp-dnum">${d}</span>
            <span class="yp-wd">${WD[dow]}</span>
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
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-3px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
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
        modalFlowerDisplay.innerHTML = stampPreviewHTML(selectedFlower);
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

  function stampPreviewHTML(type) {
    const f = FLOWERS[type] || FLOWERS.rose;
    let dnum = '', mon = '';
    if (activeDateKey) {
      const p = activeDateKey.split('-');
      dnum = String(Number(p[2]));
      mon = MONTH_ABBR[Number(p[1]) - 1];
    }
    return `<div class="stamp" style="--stamp-bg:${f.bg}"><div class="stamp-face">
      <span class="stamp-date">${dnum}<small>${mon}</small></span>
      <div class="day-flower">${flowerSVG(type, 'color')}</div>
    </div></div>`;
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

    modalFlowerDisplay.innerHTML = stampPreviewHTML(selectedFlower);
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
      render();
    }, 260);
  });

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
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
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
    const outClass = delta > 0 ? 'slide-out-left' : 'slide-out-right';
    const inClass = delta > 0 ? 'slide-in-right' : 'slide-in-left';
    grid.classList.add(outClass);
    setTimeout(() => {
      viewDate.setMonth(viewDate.getMonth() + delta);
      renderCalendar(currentView);
      grid.classList.remove(outClass);
      grid.classList.add(inClass);
      setTimeout(() => grid.classList.remove(inClass), 300);
    }, 170);
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

  // Cover / intro screen — a diary you turn through, page by page
  const coverScreen = document.getElementById('coverScreen');
  const book = document.getElementById('book');
  const startBtn = document.getElementById('startBtn');
  const turnHint = document.getElementById('turnHint');
  const leafCover = document.getElementById('leafCover');
  const leafWelcome = document.getElementById('leafWelcome');
  const coverEmbroidery = document.getElementById('coverEmbroidery');
  const coverPageArt = document.getElementById('coverPageArt');
  const welcomeFlower = document.getElementById('welcomeFlower');
  const coverYear = document.getElementById('coverYear');
  const insideYear = document.getElementById('insideYear');

  if (coverEmbroidery) coverEmbroidery.innerHTML = embroideryCoverSVG();
  if (coverPageArt) coverPageArt.innerHTML = flowerHeadSVG('cherryblossom', 'color');
  if (welcomeFlower) welcomeFlower.innerHTML = flowerHeadSVG('rose', 'color');
  if (coverYear) coverYear.textContent = String(new Date().getFullYear());
  if (insideYear) insideYear.textContent = `a garden of small moments · ${new Date().getFullYear()}`;
  const welcomeDate = document.getElementById('welcomeDate');
  if (welcomeDate) welcomeDate.textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  if (leafCover) leafCover.style.zIndex = 3;
  if (leafWelcome) leafWelcome.style.zIndex = 2;

  const bookLeaves = [leafCover, leafWelcome];   // turned in this order
  const HINTS = ['tap the cover to open', 'now turn the page', ''];
  let turnStep = 0;
  let turning = false;

  function refreshHint() {
    if (!turnHint) return;
    turnHint.textContent = HINTS[Math.min(turnStep, HINTS.length - 1)] || '';
    turnHint.classList.toggle('gone', !turnHint.textContent);
  }
  refreshHint();

  function turnPage() {
    if (turning || turnStep >= bookLeaves.length) return;
    const leaf = bookLeaves[turnStep];
    turning = true;
    if (startBtn && turnStep === 0) startBtn.classList.add('gone');
    leaf.classList.add('turning', 'turned');
    leaf.style.zIndex = 1;                     // drop behind the page underneath
    turnStep++;
    refreshHint();
    setTimeout(() => { leaf.classList.remove('turning'); turning = false; }, 980);
    if (turnStep >= bookLeaves.length) {
      setTimeout(enterJournal, 700);           // last page turned → step inside
    }
  }

  function enterJournal() {
    coverScreen.classList.add('lifting');
    setTimeout(() => { coverScreen.style.display = 'none'; }, 600);
  }

  if (startBtn) startBtn.addEventListener('click', e => { e.stopPropagation(); turnPage(); });
  if (book) book.addEventListener('click', turnPage);

  // Re-open the diary (from the closed cover) by clicking the in-app wordmark
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    heroTitle.style.cursor = 'pointer';
    heroTitle.title = 'Close the journal';
    heroTitle.addEventListener('click', () => {
      bookLeaves.forEach((lf, i) => { lf.classList.remove('turned', 'turning'); lf.style.zIndex = 3 - i; });
      turnStep = 0;
      turning = false;
      if (startBtn) startBtn.classList.remove('gone');
      refreshHint();
      coverScreen.style.display = '';
      requestAnimationFrame(() => coverScreen.classList.remove('lifting'));
    });
  }

  renderWeekdayRow();
  renderFlowerPicker();
  renderMoodPicker();
  render();
  spawnPetalField();
})();
