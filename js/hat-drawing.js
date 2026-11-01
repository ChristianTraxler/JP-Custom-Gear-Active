// Hat builder drawing: plain-JS SVG port of the mockup's HatDrawing.jsx and Patch.jsx.
// Browser global: window.HatDrawing. Needs js/hat-builder-core.js first.
//
//   HatDrawing.render(container, { body, color, patch })   draws the tech-pack hat front view
//   HatDrawing.patchSvg({ shape, type, tone, long })       returns a small standalone patch SVG string
//   HatDrawing.swatchBackground(colorName)                 CSS background for a color dot
//   HatDrawing.patchBox(shapeId, long)                     { w, h } for a shape at a long-side length
//
// patch = { shape, size, type, tone, text, font, logo, placeholder }
// The drawing has no animation, so there is nothing to switch off for prefers-reduced-motion.
(function (root) {
  'use strict';

  const Core = root.HatBuilderCore;

  // 1 inch = 40 drawing units, so the patch is shown at its real proportion.
  const INCH = 40;
  let uidCounter = 0;

  const BLOBS = [
    'M6 18 C 14 4, 34 8, 40 16 C 48 10, 60 14, 58 26 C 66 34, 52 46, 40 40 C 30 50, 12 44, 14 34 C 2 32, 0 24, 6 18 Z',
    'M70 6 C 82 0, 100 6, 98 16 C 110 18, 112 32, 100 36 C 96 46, 80 44, 78 36 C 66 38, 60 26, 68 20 C 62 14, 64 8, 70 6 Z',
    'M30 62 C 40 52, 58 56, 60 66 C 72 64, 80 76, 72 84 C 76 96, 60 102, 52 94 C 42 104, 24 98, 28 86 C 16 84, 18 68, 30 62 Z',
    'M86 60 C 96 52, 114 58, 112 70 C 120 78, 112 92, 100 88 C 94 98, 78 94, 80 84 C 70 80, 74 64, 86 60 Z',
    'M4 92 C 10 84, 22 88, 22 96 C 30 100, 26 114, 16 112 C 8 120, 0 110, 2 102 C 0 98, 0 92, 4 92 Z',
    'M48 30 C 54 24, 64 28, 62 34 C 68 40, 60 48, 54 44 C 46 48, 40 40, 44 36 C 40 32, 44 28, 48 30 Z',
    'M92 104 C 98 98, 110 102, 108 110 C 112 118, 100 122, 94 116 C 86 118, 84 108, 92 104 Z',
    'M58 104 C 64 100, 72 104, 70 110 C 72 116, 64 120, 58 116 C 52 118, 50 108, 58 104 Z'
  ];

  // ---- Patch geometry (JP's 13 stock shapes, numbers match the shape chart) ----
  const POLYS = {
    'tall-hex': [[0.5, 0], [1, 0.2], [1, 0.8], [0.5, 1], [0, 0.8], [0, 0.2]],
    'mini-hex': [[0.5, 0], [1, 0.25], [1, 0.75], [0.5, 1], [0, 0.75], [0, 0.25]],
    'wide-hex': [[0, 0.5], [0.2, 0], [0.8, 0], [1, 0.5], [0.8, 1], [0.2, 1]],
    'large-hex': [[0, 0.5], [0.19, 0], [0.81, 0], [1, 0.5], [0.81, 1], [0.19, 1]],
    diamond: [[0, 0.5], [0.5, 0], [1, 0.5], [0.5, 1]],
    'wide-diamond': [[0, 0.5], [0.5, 0], [1, 0.5], [0.5, 1]]
  };
  // Free-form outline for "bring your own shape" (normalized cubic curve points)
  const BLOB = [
    [0.117, 0.275],
    [[0.25, 0.05], [0.533, 0.175], [0.65, 0.1]],
    [[0.8, 0.025], [0.933, 0.25], [0.883, 0.475]],
    [[0.833, 0.7], [0.933, 0.825], [0.75, 0.9]],
    [[0.55, 0.975], [0.433, 0.825], [0.283, 0.9]],
    [[0.117, 0.975], [0.05, 0.75], [0.1, 0.575]],
    [[0.133, 0.45], [0.033, 0.4], [0.117, 0.275]]
  ];
  const ROUND = { 'rounded-top': 0.1, 'tall-hex': 0.08, 'mini-hex': 0.08, 'wide-hex': 0.09, 'large-hex': 0.08, diamond: 0.1, 'wide-diamond': 0.14 };
  const RECT_R = { square: 0.06, 'rounded-square': 0.2, 'wide-rect': 0.08, 'rounded-rect': 0.3 };
  // Usable engraving area as a share of the patch box, per shape
  const CONTENT = {
    'wide-hex': [0.64, 0.56],
    'large-hex': [0.68, 0.58],
    diamond: [0.5, 0.4],
    'wide-diamond': [0.52, 0.4],
    circle: [0.7, 0.5],
    oval: [0.72, 0.52],
    'tall-hex': [0.74, 0.56],
    'mini-hex': [0.7, 0.5],
    'rounded-top': [0.66, 0.5],
    custom: [0.6, 0.46]
  };

  const f = n => Math.round(n * 100) / 100;
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  function rawPath(id, x, y, w, h) {
    if (id === 'custom') {
      const P = p => f(x + p[0] * w) + ',' + f(y + p[1] * h);
      return 'M' + P(BLOB[0]) + ' ' + BLOB.slice(1).map(c => 'C' + c.map(P).join(' ')).join(' ') + ' Z';
    }
    if (POLYS[id]) return 'M' + POLYS[id].map(p => f(x + p[0] * w) + ',' + f(y + p[1] * h)).join(' L') + ' Z';
    if (id === 'rounded-top') {
      return 'M' + f(x + 0.03 * w) + ',' + f(y + 0.25 * h) + ' Q' + f(x + 0.5 * w) + ',' + f(y - 0.24 * h) + ' ' + f(x + 0.97 * w) + ',' + f(y + 0.25 * h) +
        ' L' + f(x + 0.83 * w) + ',' + f(y + h) + ' L' + f(x + 0.17 * w) + ',' + f(y + h) + ' Z';
    }
    if (id === 'oval' || id === 'circle') {
      const rx = w / 2;
      const ry = h / 2;
      return 'M' + f(x) + ',' + f(y + ry) + ' A' + f(rx) + ',' + f(ry) + ' 0 1 0 ' + f(x + w) + ',' + f(y + ry) +
        ' A' + f(rx) + ',' + f(ry) + ' 0 1 0 ' + f(x) + ',' + f(y + ry) + ' Z';
    }
    const r = Math.min(w, h) * (RECT_R[id] != null ? RECT_R[id] : 0.06);
    return 'M' + f(x + r) + ',' + f(y) + ' H' + f(x + w - r) + ' Q' + f(x + w) + ',' + f(y) + ' ' + f(x + w) + ',' + f(y + r) +
      ' V' + f(y + h - r) + ' Q' + f(x + w) + ',' + f(y + h) + ' ' + f(x + w - r) + ',' + f(y + h) +
      ' H' + f(x + r) + ' Q' + f(x) + ',' + f(y + h) + ' ' + f(x) + ',' + f(y + h - r) +
      ' V' + f(y + r) + ' Q' + f(x) + ',' + f(y) + ' ' + f(x + r) + ',' + f(y) + ' Z';
  }

  // A path plus the stroke needed to round its corners, fitted to the box.
  function shapeGeom(id, x, y, w, h) {
    const k = ROUND[id] ? Math.min(w, h) * ROUND[id] : 0;
    return { d: rawPath(id, x + k / 2, y + k / 2, w - k, h - k), round: k };
  }

  // Patch box for a shape at a given long-side length.
  function patchBox(shapeId, long) {
    const aspect = Core.shapeById(shapeId).aspect;
    return aspect >= 1 ? { w: long, h: long / aspect } : { w: long * aspect, h: long };
  }

  function splitText(text) {
    const t = (text || '').trim().replace(/\s+/g, ' ');
    if (!t) return [];
    if (t.length <= 12 || t.indexOf(' ') === -1) return [t];
    const mid = t.length / 2;
    let best = -1;
    for (let i = 0; i < t.length; i += 1) {
      if (t[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
    }
    return best > 0 ? [t.slice(0, best), t.slice(best + 1)] : [t];
  }

  const FONTS = {
    block: { family: "'Archivo', 'Helvetica Neue', Arial, sans-serif", weight: 800, stretch: '125%', charW: 0.78, upper: true, spacing: '0.03em' },
    serif: { family: "'Newsreader', Georgia, serif", weight: 600, stretch: '100%', charW: 0.56, upper: false, spacing: '0' }
  };

  // The patch itself, drawn into an SVG at (x, y, w, h). Returns a <g> string.
  function patchArt(o) {
    const shape = o.shape || 'wide-hex';
    const type = o.type || 'leatherette';
    const t = Core.patchTypeById(type);
    const tn = o.tone || t.tones[0];
    const x = o.x || 0;
    const y = o.y || 0;
    const w = o.w;
    const h = o.h;
    const uid = o.uid;
    const min = Math.min(w, h);
    const outer = shapeGeom(shape, x, y, w, h);
    const insetD = min * (type === 'embroidered' ? 0.1 : 0.075);
    const inner = shapeGeom(shape, x + insetD, y + insetD, w - insetD * 2, h - insetD * 2);

    const cwh = CONTENT[shape] || [0.76, 0.6];
    const box = { w: w * cwh[0], h: h * cwh[1], cx: x + w / 2, cy: y + h / 2 + (shape === 'rounded-top' ? h * 0.08 : 0) };

    const F = FONTS[o.font] || FONTS.block;
    const ghost = !(o.text || '').trim() && !o.logo && o.placeholder;
    const rawText = ghost ? o.placeholder : o.text;
    const lines = splitText(F.upper ? String(rawText || '').toUpperCase() : rawText);
    const hasLogo = Boolean(o.logo);
    const textBoxH = hasLogo ? box.h * 0.32 : box.h;
    const textLines = hasLogo ? lines.slice(0, 1) : lines;
    let size = 0;
    if (textLines.length) {
      const longest = Math.max.apply(null, textLines.map(l => l.length));
      size = Math.min(textBoxH / (textLines.length * 1.08), box.w / (longest * F.charW));
    }
    const lineGap = size * 1.08;
    const textTop = hasLogo ? box.cy + box.h / 2 - textBoxH / 2 : box.cy;
    const firstY = textTop - ((textLines.length - 1) * lineGap) / 2;
    const logoBox = hasLogo
      ? { x: box.cx - box.w / 2, y: box.cy - box.h / 2, w: box.w, h: textLines.length ? box.h * 0.64 : box.h }
      : null;

    const ids = { tex: 'tex' + uid, sheen: 'sheen' + uid, eng: 'eng' + uid, weave: 'weave' + uid };
    const textStyle = "font-family:" + F.family + ";font-weight:" + F.weight + ";font-stretch:" + F.stretch + ";letter-spacing:" + F.spacing;
    const leather = type === 'leatherette';
    const inkOpacity = ghost ? 0.35 : leather ? 0.9 : 1;

    let engraving = '<g>';
    if (hasLogo) {
      engraving += '<image href="' + esc(o.logo) + '" x="' + logoBox.x + '" y="' + logoBox.y + '" width="' + logoBox.w + '" height="' + logoBox.h +
        '" preserveAspectRatio="xMidYMid meet" filter="url(#' + ids.eng + ')"/>';
    }
    textLines.forEach((line, i) => {
      engraving += '<g>';
      if (leather && !ghost) {
        engraving += '<text x="' + box.cx + '" y="' + (firstY + i * lineGap + size * 0.045) + '" text-anchor="middle" dominant-baseline="central" font-size="' + size +
          '" style="' + textStyle + '" fill="rgba(255,240,220,0.22)">' + esc(line) + '</text>';
      }
      engraving += '<text x="' + box.cx + '" y="' + (firstY + i * lineGap) + '" text-anchor="middle" dominant-baseline="central" font-size="' + size +
        '" style="' + textStyle + '" fill="' + tn.ink + '" fill-opacity="' + inkOpacity + '" stroke="' + (type === 'embroidered' ? tn.ink : 'none') +
        '" stroke-width="' + (type === 'embroidered' ? size * 0.03 : 0) + '">' + esc(line) + '</text>';
      engraving += '</g>';
    });
    engraving += '</g>';

    let g = '<g>';
    g += '<defs>' +
      '<filter id="' + ids.tex + '" x="0" y="0" width="100%" height="100%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.22 0" result="a"/>' +
      '<feComposite in="a" in2="SourceGraphic" operator="in" result="t"/>' +
      '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="t"/></feMerge></filter>' +
      '<radialGradient id="' + ids.sheen + '" cx="38%" cy="28%" r="80%">' +
      '<stop offset="0" stop-color="#fff" stop-opacity="0.2"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/></radialGradient>' +
      '<filter id="' + ids.eng + '" color-interpolation-filters="sRGB">' +
      '<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.33 -0.33 -0.34 1 0" result="a"/>' +
      '<feFlood flood-color="' + tn.ink + '"/><feComposite in2="a" operator="in"/></filter>' +
      '<pattern id="' + ids.weave + '" width="4" height="4" patternUnits="userSpaceOnUse">' +
      (type === 'embroidered'
        ? '<path d="M0 4 L4 0" stroke="#fff" stroke-opacity="0.08" stroke-width="1"/>'
        : '<path d="M0 1 H4" stroke="#fff" stroke-opacity="0.1" stroke-width="0.8"/>') +
      '</pattern></defs>';

    // drop shadow
    g += '<path d="' + outer.d + '" transform="translate(' + min * 0.015 + ' ' + min * 0.035 + ')" fill="#000" fill-opacity="0.28" stroke="#000" stroke-opacity="0.28" stroke-width="' + outer.round + '" stroke-linejoin="round"/>';
    // body
    g += '<path d="' + outer.d + '" fill="' + tn.fill + '" stroke="' + tn.fill + '" stroke-width="' + outer.round + '" stroke-linejoin="round"' + (leather ? ' filter="url(#' + ids.tex + ')"' : '') + '/>';
    if (type === 'embroidered' || type === 'woven') g += '<path d="' + outer.d + '" fill="url(#' + ids.weave + ')" stroke="none"/>';
    g += '<path d="' + outer.d + '" fill="url(#' + ids.sheen + ')" stroke="url(#' + ids.sheen + ')" stroke-width="' + outer.round + '" stroke-linejoin="round" opacity="' + (type === 'pvc' ? 0.9 : 0.75) + '"/>';

    // edge treatment per material
    if (leather) {
      g += '<path d="' + outer.d + '" fill="none" stroke="' + tn.edge + '" stroke-width="' + (Math.max(0.8, min * 0.014) + outer.round) + '" stroke-opacity="0.5" stroke-linejoin="round"/>';
      g += '<path d="' + inner.d + '" fill="none" stroke="' + tn.ink + '" stroke-opacity="0.78" stroke-width="' + Math.max(0.8, min * 0.016) + '" stroke-linejoin="round"/>';
    }
    if (type === 'pvc') g += '<path d="' + inner.d + '" fill="none" stroke="' + tn.edge + '" stroke-width="' + min * 0.05 + '" stroke-linejoin="round"/>';
    if (type === 'embroidered') {
      g += '<path d="' + outer.d + '" fill="none" stroke="' + tn.edge + '" stroke-width="' + (min * 0.07 + outer.round) + '" stroke-linejoin="round"/>';
      g += '<path d="' + outer.d + '" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="' + (min * 0.07 + outer.round) + '" stroke-dasharray="' + min * 0.012 + ' ' + min * 0.018 + '" stroke-linejoin="round"/>';
    }
    if (type === 'woven') g += '<path d="' + inner.d + '" fill="none" stroke="' + tn.edge + '" stroke-width="' + min * 0.03 + '" stroke-linejoin="round"/>';

    g += engraving + '</g>';
    return g;
  }

  // Small standalone patch (shape picker tiles).
  function patchSvg(o) {
    const uid = 'p' + ++uidCounter;
    const box = patchBox(o.shape, o.long || 200);
    const pad = (o.long || 200) * 0.06;
    return '<svg viewBox="' + -pad + ' ' + -pad + ' ' + (box.w + pad * 2) + ' ' + (box.h + pad * 2) + '" aria-hidden="true" focusable="false">' +
      patchArt({ shape: o.shape, w: box.w, h: box.h, type: o.type, tone: o.tone, text: '', uid }) + '</svg>';
  }

  const lum = hex => {
    const n = parseInt(hex.slice(1), 16);
    return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  };

  function camoGradient(c) {
    return 'radial-gradient(circle at 30% 30%, ' + c.blobs[2] + ' 0 18%, transparent 19%), radial-gradient(circle at 70% 62%, ' + c.blobs[0] +
      ' 0 22%, transparent 23%), radial-gradient(circle at 28% 78%, ' + c.blobs[1] + ' 0 16%, transparent 17%), ' + c.base;
  }

  function swatchBackground(name) {
    const cw = Core.colorway(name);
    if (cw.camo) return camoGradient(Core.CAMO[cw.camo]);
    if (cw.top) return 'linear-gradient(135deg, ' + cw.top + ' 0 28%, ' + cw.front + ' 28% 62%, ' + cw.second + ' 62% 100%)';
    if (cw.second) return 'linear-gradient(135deg, ' + cw.front + ' 0 55%, ' + cw.second + ' 55% 100%)';
    return cw.front;
  }

  // ---- The hat ----
  function hatSvg(body, colorName, patch, uid) {
    const cw = Core.colorway(colorName);
    const id = k => k + uid;
    const paint = v => (String(v).indexOf('camo:') === 0 ? 'url(#' + id('camo') + ')' : v);
    const camo = cw.camo ? Core.CAMO[cw.camo] : null;
    const meshDark = lum(cw.mesh) > 0.5;

    const isBeanie = body.drawing === 'beanie';
    const tops = { trucker: 58, seven: 46, flat: 54, rope: 80 };
    const top = tops[body.drawing] != null ? tops[body.drawing] : 58;
    const base = 242;

    // Patch placement
    const shape = Core.shapeById(patch.shape);
    const inches = parseFloat(patch.size) || 3;
    const pb = patchBox(patch.shape, inches * INCH);
    let w = pb.w;
    let h = pb.h;
    const maxW = isBeanie ? 210 : 220;
    const maxH = isBeanie ? 66 : 128;
    const k = Math.min(1, maxW / w, maxH / h);
    w *= k;
    h *= k;
    const cx = 240;
    const cy = isBeanie ? 236 : top + (base - top) * 0.56;
    const px = cx - w / 2;
    const py = cy - h / 2;

    const front = 'M106 ' + base + ' C 102 ' + (base - 96) + ', 150 ' + (top + 8) + ', 240 ' + (top + 2) + ' C 330 ' + (top + 8) + ', 378 ' + (base - 96) + ', 374 ' + base + ' Z';
    const mesh = 'M66 ' + base + ' C 62 ' + (base - 92) + ', 118 ' + (top + 12) + ', 240 ' + top + ' C 362 ' + (top + 12) + ', 418 ' + (base - 92) + ', 414 ' + base + ' Z';
    const bill = body.drawing === 'flat'
      ? 'M44 ' + (base - 3) + ' L436 ' + (base - 3) + ' C 447 ' + (base + 6) + ', 445 ' + (base + 21) + ', 431 ' + (base + 28) + ' C 330 ' + (base + 38) + ', 150 ' + (base + 38) + ', 49 ' + (base + 28) + ' C 35 ' + (base + 21) + ', 33 ' + (base + 6) + ', 44 ' + (base - 3) + ' Z'
      : 'M46 ' + (base - 5) + ' C 120 ' + (base + 14) + ', 360 ' + (base + 14) + ', 434 ' + (base - 5) + ' C 448 ' + (base + 24) + ', 384 ' + (base + 66) + ', 240 ' + (base + 72) + ' C 96 ' + (base + 66) + ', 32 ' + (base + 24) + ', 46 ' + (base - 5) + ' Z';

    // Dimension line for the patch's long side
    const horizontal = shape.aspect >= 1;
    const dimY = isBeanie ? 312 : base + 92;
    const dimX = 452;

    const label = body.name + ' in ' + colorName + ' with a ' + patch.size + ' ' + shape.name.toLowerCase() + ' patch';
    let s = '<svg viewBox="0 0 480 360" role="img" aria-label="' + esc(label) + '"><defs>';
    if (camo) {
      s += '<pattern id="' + id('camo') + '" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="scale(0.95) rotate(-14)"><rect width="120" height="120" fill="' + camo.base + '"/>' +
        BLOBS.map((d, i) => '<path d="' + d + '" fill="' + camo.blobs[i % 3] + '"/>').join('') + '</pattern>';
    }
    s += '<pattern id="' + id('holes') + '" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.25" fill="' + (meshDark ? '#000' : '#fff') + '" fill-opacity="' + (meshDark ? 0.22 : 0.12) + '"/></pattern>';
    s += '<pattern id="' + id('ribs') + '" width="7" height="10" patternUnits="userSpaceOnUse"><rect width="3" height="10" fill="#000" fill-opacity="0.16"/></pattern>';
    s += '<filter id="' + id('fabric') + '" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0" result="a"/><feComposite in="a" in2="SourceGraphic" operator="in" result="t"/>' +
      '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="t"/></feMerge></filter>';
    s += '<linearGradient id="' + id('shadeX') + '" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0.42"/><stop offset="0.3" stop-color="#000" stop-opacity="0"/>' +
      '<stop offset="0.62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></linearGradient>';
    s += '<radialGradient id="' + id('light') + '" cx="44%" cy="18%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>';
    s += '<linearGradient id="' + id('billShade') + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.45"/><stop offset="0.35" stop-color="#000" stop-opacity="0.08"/><stop offset="1" stop-color="#000" stop-opacity="0.2"/></linearGradient>';
    s += '<radialGradient id="' + id('spot') + '"><stop offset="0" stop-color="#e9e8df" stop-opacity="0.13"/><stop offset="1" stop-color="#e9e8df" stop-opacity="0"/></radialGradient>';
    s += '<filter id="' + id('soft') + '" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>';

    // soft spotlight and ground shadow
    s += '<ellipse cx="240" cy="190" rx="230" ry="170" fill="url(#' + id('spot') + ')"/>';
    s += '<ellipse cx="240" cy="' + (isBeanie ? 290 : 326) + '" rx="176" ry="14" fill="#000" opacity="0.4" filter="url(#' + id('soft') + ')"/>';

    const fillPath = (d, fill, extra) => '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>';
    if (isBeanie) {
      const crown = 'M118 214 C 110 126, 164 64, 240 60 C 316 64, 370 126, 362 214 Z';
      s += fillPath(crown, paint(cw.front), ' filter="url(#' + id('fabric') + ')"');
      s += fillPath(crown, 'url(#' + id('ribs') + ')');
      s += fillPath(crown, 'url(#' + id('shadeX') + ')');
      s += fillPath(crown, 'url(#' + id('light') + ')');
      const cuff = '<rect x="100" y="196" width="280" height="82" rx="12" fill="';
      s += cuff + paint(cw.front) + '" filter="url(#' + id('fabric') + ')"/>';
      s += cuff + 'url(#' + id('ribs') + ')"/>';
      s += cuff + 'url(#' + id('shadeX') + ')"/>';
      s += '<path d="M106 199 Q240 191 374 199" stroke="#000" stroke-opacity="0.35" stroke-width="3" fill="none"/>';
    } else {
      // mesh back
      s += fillPath(mesh, cw.mesh) + fillPath(mesh, 'url(#' + id('holes') + ')') + fillPath(mesh, 'url(#' + id('shadeX') + ')');
      // front panels
      s += fillPath(front, paint(cw.front), ' filter="url(#' + id('fabric') + ')"');
      if (cw.top) {
        // white upper front panel, cut along a slanted seam like the real 168
        s += '<clipPath id="' + id('topclip') + '"><path d="' + front + '"/></clipPath>';
        s += '<path d="M90 ' + (top - 4) + ' H400 V' + (top + 56) + ' C 330 ' + (top + 40) + ', 190 ' + (top + 70) + ', 90 ' + (top + 98) + ' Z" fill="' + cw.top + '" clip-path="url(#' + id('topclip') + ')"/>';
      }
      s += fillPath(front, 'url(#' + id('shadeX') + ')', ' opacity="0.85"');
      s += fillPath(front, 'url(#' + id('light') + ')');
      s += '<path d="' + front + '" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="1.4"/>';
      if (body.drawing === 'trucker') {
        s += '<path d="M240 ' + (top + 3) + ' V' + base + '" stroke="#000" stroke-opacity="0.4" stroke-width="1.6"/>';
        s += '<path d="M235 ' + (top + 6) + ' V' + (base - 2) + '" stroke="#fff" stroke-opacity="0.16" stroke-width="1" stroke-dasharray="3 3"/>';
        s += '<path d="M245 ' + (top + 6) + ' V' + (base - 2) + '" stroke="#fff" stroke-opacity="0.16" stroke-width="1" stroke-dasharray="3 3"/>';
      }
      // button
      s += '<ellipse cx="240" cy="' + (top + 1) + '" rx="13" ry="5.5" fill="' + paint(cw.front) + '"/>';
      s += '<ellipse cx="240" cy="' + (top + 1) + '" rx="13" ry="5.5" fill="none" stroke="#000" stroke-opacity="0.4"/>';
      // bill
      s += fillPath(bill, paint(cw.bill), ' filter="url(#' + id('fabric') + ')"');
      s += fillPath(bill, 'url(#' + id('billShade') + ')');
      for (let i = 0; i < 4; i += 1) {
        if (body.drawing === 'flat') {
          s += '<path d="M' + (66 + i * 4) + ' ' + (base + 6 + i * 6) + ' C 170 ' + (base + 13 + i * 6) + ', 310 ' + (base + 13 + i * 6) + ', ' + (414 - i * 4) + ' ' + (base + 6 + i * 6) +
            '" stroke="#fff" stroke-opacity="0.18" stroke-dasharray="3 3" fill="none"/>';
        } else {
          s += '<path d="M' + (74 + i * 10) + ' ' + (base + 10 + i * 11) + ' Q240 ' + (base + 50 + i * 8) + ' ' + (406 - i * 10) + ' ' + (base + 10 + i * 11) +
            '" stroke="#fff" stroke-opacity="0.18" stroke-dasharray="3 3" fill="none"/>';
        }
      }
      if (body.drawing === 'rope') {
        const rope = 'M84 ' + (base - 9) + ' C 160 ' + (base + 4) + ', 320 ' + (base + 4) + ', 396 ' + (base - 9);
        s += '<path d="' + rope + '" stroke="#d8c7a2" stroke-width="7" fill="none" stroke-linecap="round"/>';
        s += '<path d="' + rope + '" stroke="#6d5a3a" stroke-width="7" fill="none" stroke-dasharray="3 4" stroke-opacity="0.55"/>';
      }
    }

    // patch
    if (patch.type !== 'none') {
      s += patchArt({ shape: patch.shape, x: px, y: py, w, h, type: patch.type, tone: patch.tone, text: patch.text, font: patch.font, logo: patch.logo, placeholder: patch.placeholder, uid: uid + 'p' });
    }

    // dimension line, tech-pack style
    s += '<g stroke="#e9e8df" stroke-opacity="0.55" fill="none" stroke-width="1">';
    if (horizontal) {
      s += '<path d="M' + px + ' ' + (py + h + 6) + ' V' + (dimY + 6) + '" stroke-dasharray="2 4"/>';
      s += '<path d="M' + (px + w) + ' ' + (py + h + 6) + ' V' + (dimY + 6) + '" stroke-dasharray="2 4"/>';
      s += '<path d="M' + px + ' ' + dimY + ' H' + (px + w) + '"/>';
      s += '<path d="M' + px + ' ' + (dimY - 5) + ' V' + (dimY + 5) + ' M' + (px + w) + ' ' + (dimY - 5) + ' V' + (dimY + 5) + '"/>';
    } else {
      s += '<path d="M' + (px + w + 6) + ' ' + py + ' H' + (dimX + 6) + '" stroke-dasharray="2 4"/>';
      s += '<path d="M' + (px + w + 6) + ' ' + (py + h) + ' H' + (dimX + 6) + '" stroke-dasharray="2 4"/>';
      s += '<path d="M' + dimX + ' ' + py + ' V' + (py + h) + '"/>';
      s += '<path d="M' + (dimX - 5) + ' ' + py + ' H' + (dimX + 5) + ' M' + (dimX - 5) + ' ' + (py + h) + ' H' + (dimX + 5) + '"/>';
    }
    s += '</g>';
    s += '<text x="' + (horizontal ? cx : dimX) + '" y="' + (horizontal ? dimY + 20 : py - 14) + '" text-anchor="middle" dominant-baseline="central" fill="#e9e8df" fill-opacity="0.8" ' +
      'style="font-family:\'Martian Mono\',ui-monospace,monospace;font-size:11px;letter-spacing:0.04em">' + esc(patch.size) + '</text>';
    return s + '</svg>';
  }

  // Draw into a container, replacing what was there. SVG ids are unique per call.
  function render(container, opts) {
    uidCounter += 1;
    container.innerHTML = hatSvg(opts.body, opts.color, opts.patch, 'h' + uidCounter);
  }

  root.HatDrawing = { render, patchSvg, swatchBackground, patchBox, hatSvg };
})(typeof window !== 'undefined' ? window : globalThis);
