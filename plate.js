/* VA-ECMO anatomy plate.
   Frame-locked: frame 0 through 1019 at 30 fps. Same frame, same picture.
   Blood stays burgundy through the pump. Vermilion starts at the membrane lung.
   The 10 μm mark is a schematic callout, not a measurement. */
(function () {
  "use strict";
  var VW = 1600, VH = 900, FPS = 30, LAST = 1019;
  var BOUNDS = [0, 150, 300, 510, 750, 1020];
  var FADE = 12;
  var VEIN = "#6A040F";
  var VEIN_LIT = "#E15A68";
  var VEIN_FLOW = "#8E1830";
  var ART = "#E63946";
  var ART_FLOW = "#FF5A66";
  var GAS = "#48CAE4";
  var BONE = "#E7E4DE";
  var SHELL = "#222938";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HEX = hexCells(5);

  var STAGES = [
    { name: "01  Console", caption: "Side profile. The mounting brackets unclamp, and the pump head translates forward along the drive axis." },
    { name: "02  Mag-lev pump", caption: "Axial cutaway. A bearingless impeller hangs in magnetic flux and drives venous blood out through the volute. No shaft crosses the blood path. This does not mean hemolysis is zero." },
    { name: "03  Membrane lung", caption: "The camera descends into the polymethylpentene hollow-fiber bundle. Sweep gas runs through the lumens. Blood runs outside the fibers, the other way." },
    { name: "04  Fiber wall", caption: "One fiber wall, drawn as a schematic. Oxygen diffuses into plasma. Carbon dioxide diffuses into the lumen. The 10 μm bracket marks the boundary on this plate only." },
    { name: "05  Full loop", caption: "Pull-out. Venous cannula, mag-lev drive, gas blender, membrane lung, heat exchanger, and arterial return, in one circuit." }
  ];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function hash(n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }
  function uOf(frame, a, b) { return clamp((frame - a) / (b - a), 0, 1); }
  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mixHex(a, b, t) {
    var A = hexToRgb(a), B = hexToRgb(b);
    return "rgb(" + Math.round(lerp(A[0], B[0], t)) + "," + Math.round(lerp(A[1], B[1], t)) + "," + Math.round(lerp(A[2], B[2], t)) + ")";
  }
  function rgba(hex, a) {
    var p = hexToRgb(hex);
    return "rgba(" + p[0] + "," + p[1] + "," + p[2] + "," + a + ")";
  }
  function roundRect(c, x, y, w, h, r) {
    var rr = Math.min(Math.abs(r), Math.abs(w) / 2, Math.abs(h) / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.arcTo(x + w, y + h, x, y + h, rr);
    c.arcTo(x, y + h, x, y, rr);
    c.arcTo(x, y, x + w, y, rr);
    c.closePath();
  }
  function hexCells(radius) {
    var cells = [], q, r;
    for (q = -radius; q <= radius; q++) {
      for (r = -radius; r <= radius; r++) {
        if (Math.abs(q + r) <= radius) cells.push([q, r]);
      }
    }
    return cells;
  }
  function weights(frame) {
    var w = [0, 0, 0, 0, 0];
    var half = FADE, i, a, c, a0, c0, enter, exit, sum = 0;
    for (i = 0; i < 5; i++) {
      a = BOUNDS[i];
      c = BOUNDS[i + 1];
      a0 = i === 0 ? a : a - half;
      c0 = i === 4 ? c : c + half;
      if (frame < a0 || frame >= c0) continue;
      enter = i === 0 ? 1 : clamp((frame - (a - half)) / (2 * half), 0, 1);
      exit = i === 4 ? 1 : clamp(((c + half) - frame) / (2 * half), 0, 1);
      w[i] = Math.min(enter, exit);
      sum += w[i];
    }
    if (!sum) return w;
    for (i = 0; i < 5; i++) w[i] /= sum;
    return w;
  }
  function dominant(frame) {
    var w = weights(frame), i, best = 0;
    for (i = 1; i < w.length; i++) if (w[i] > w[best]) best = i;
    return best;
  }

  function setView(c, target) {
    c.setTransform(target.width / VW, 0, 0, target.height / VH, 0, 0);
  }
  function fit(c, target) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, target.width, target.height);
    setView(c, target);
  }

  function drawBackdrop(c) {
    var g;
    c.fillStyle = "#0A0C10";
    c.fillRect(0, 0, VW, VH);
    c.save();
    c.strokeStyle = "rgba(255,255,255,0.035)";
    c.lineWidth = 1;
    c.beginPath();
    var x, y;
    for (x = 40; x < VW; x += 40) { c.moveTo(x, 0); c.lineTo(x, VH); }
    for (y = 40; y < VH; y += 40) { c.moveTo(0, y); c.lineTo(VW, y); }
    c.stroke();
    c.restore();
    g = c.createRadialGradient(180, 760, 20, 180, 760, 460);
    g.addColorStop(0, "rgba(106,4,15,0.22)");
    g.addColorStop(1, "rgba(106,4,15,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, VW, VH);
    g = c.createRadialGradient(1360, 160, 10, 1360, 160, 420);
    g.addColorStop(0, "rgba(72,202,228,0.09)");
    g.addColorStop(1, "rgba(72,202,228,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, VW, VH);
    g = c.createRadialGradient(800, 450, 240, 800, 450, 820);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.48)");
    c.fillStyle = g;
    c.fillRect(0, 0, VW, VH);
  }

  function leader(c, x, y, lx, ly, title, sub, alpha) {
    if (alpha <= 0.02) return;
    c.save();
    c.globalAlpha = alpha;
    var font = "600 15px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    var subfont = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    c.font = font;
    var titleW = c.measureText(title).width;
    c.font = subfont;
    var subW = sub ? c.measureText(sub).width : 0;
    var tw = Math.max(titleW, subW);
    var padL = 44, padR = VW - 44, padT = 92, padB = VH - 72;
    var dir = lx >= x ? 1 : -1;
    function room(edge, sign) { return sign > 0 ? padR - (edge + 22) : (edge - 22) - padL; }
    if (room(lx, dir) < tw && room(lx, -dir) > room(lx, dir)) dir = -dir;
    var ax = lx;
    var ay = clamp(ly, padT, padB);
    if (dir > 0) ax = clamp(ax, padL, padR - 22 - tw);
    else ax = clamp(ax, padL + 22 + tw, padR);
    c.strokeStyle = "rgba(231,228,222,0.72)";
    c.fillStyle = BONE;
    c.lineWidth = 1.25;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(ax, ay);
    c.lineTo(ax + dir * 14, ay);
    c.stroke();
    c.beginPath();
    c.arc(x, y, 2.4, 0, Math.PI * 2);
    c.fill();
    c.font = font;
    c.textAlign = dir > 0 ? "left" : "right";
    c.textBaseline = "middle";
    var tx = ax + dir * 20;
    c.fillText(title, tx, sub ? ay - 8 : ay);
    if (sub) {
      c.font = subfont;
      c.fillStyle = "rgba(231,228,222,0.66)";
      c.fillText(sub, tx, ay + 10);
    }
    c.restore();
  }

  function shellFill(c, x, y, w, h) {
    var g = c.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, "#323A4C");
    g.addColorStop(0.5, SHELL);
    g.addColorStop(1, "#151A24");
    c.fillStyle = g;
    c.fill();
    c.save();
    c.clip();
    var gloss = c.createLinearGradient(x, y, x + w, y + h * 0.4);
    gloss.addColorStop(0, "rgba(255,255,255,0.16)");
    gloss.addColorStop(0.45, "rgba(255,255,255,0.02)");
    gloss.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = gloss;
    c.fillRect(x, y, w, h * 0.42);
    c.restore();
  }

  function flowDots(c, x0, y0, x1, y1, frame, color, n, width) {
    var phase = reduceMotion ? 0 : frame;
    var i, t;
    for (i = 0; i < n; i++) {
      t = (hash(i * 3.1) + phase * 0.004) % 1;
      c.fillStyle = color;
      c.beginPath();
      c.arc(lerp(x0, x1, t), lerp(y0, y1, t), width, 0, Math.PI * 2);
      c.fill();
    }
  }

  function drawBrackets(c, x, y, open) {
    function jaw(sign) {
      c.save();
      c.translate(x, y + sign * 96);
      c.rotate(sign * open * 0.42);
      c.fillStyle = "#C5CDD8";
      roundRect(c, -118, -11, 168, 22, 6);
      c.fill();
      roundRect(c, 36, sign > 0 ? -40 : -8, 26, 48, 6);
      c.fill();
      c.beginPath();
      c.arc(-118, 0, 7, 0, Math.PI * 2);
      c.fillStyle = "#6E788A";
      c.fill();
      c.restore();
    }
    jaw(-1);
    jaw(1);
  }

  function drawPumpSide(c, x, y, frame, face) {
    c.save();
    c.translate(x, y);
    c.beginPath();
    c.moveTo(-8, -78);
    c.lineTo(54, -78);
    c.ellipse(54, 0, face, 78, 0, -Math.PI / 2, Math.PI / 2);
    c.lineTo(-8, 78);
    c.ellipse(-8, 0, 16, 78, 0, Math.PI / 2, -Math.PI / 2, true);
    c.closePath();
    var g = c.createLinearGradient(0, -78, 0, 78);
    g.addColorStop(0, "rgba(90,104,128,0.55)");
    g.addColorStop(0.5, "rgba(34,41,56,0.88)");
    g.addColorStop(1, "rgba(16,20,30,0.92)");
    c.fillStyle = g;
    c.fill();
    c.strokeStyle = "rgba(255,255,255,0.28)";
    c.lineWidth = 2;
    c.stroke();
    c.beginPath();
    c.ellipse(54, 0, face * 0.82, 64, 0, 0, Math.PI * 2);
    var blood = c.createRadialGradient(40, -16, 4, 54, 0, 64);
    blood.addColorStop(0, "#A11B2E");
    blood.addColorStop(1, VEIN);
    c.fillStyle = blood;
    c.fill();
    c.save();
    c.translate(54, 0);
    c.rotate(frame * 0.11);
    c.strokeStyle = "rgba(231,228,222,0.8)";
    c.lineWidth = 2.4;
    var i;
    for (i = 0; i < 5; i++) {
      c.rotate((Math.PI * 2) / 5);
      c.beginPath();
      c.moveTo(8, 0);
      c.quadraticCurveTo(24, 12, face * 0.7, 4);
      c.stroke();
    }
    c.restore();
    c.beginPath();
    c.ellipse(54, 0, 7, 10, 0, 0, Math.PI * 2);
    c.fillStyle = "#2A0610";
    c.fill();
    roundRect(c, 40, -116, 22, 40, 4);
    c.fillStyle = SHELL;
    c.fill();
    c.strokeStyle = "rgba(231,228,222,0.3)";
    c.stroke();
    c.restore();
  }

  function drawOxygenatorBody(c, x, y, w, h, frame, arterialMix) {
    c.save();
    roundRect(c, x, y, w, h, 28);
    shellFill(c, x, y, w, h);
    c.strokeStyle = "rgba(255,255,255,0.22)";
    c.lineWidth = 1.5;
    c.stroke();
    c.save();
    roundRect(c, x + 18, y + 48, w - 36, h - 78, 16);
    c.clip();
    c.strokeStyle = "rgba(231,228,222,0.18)";
    c.lineWidth = 1;
    var i;
    for (i = 0; i < 18; i++) {
      c.beginPath();
      c.moveTo(x + 24 + i * ((w - 48) / 18), y + 52);
      c.lineTo(x + 24 + i * ((w - 48) / 18), y + h - 36);
      c.stroke();
    }
    c.restore();
    roundRect(c, x + 28, y - 16, w - 56, 28, 8);
    c.fillStyle = rgba(GAS, 0.85);
    c.fill();
    c.fillStyle = "#071016";
    c.font = "12px ui-monospace, monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("O\u2082", x + w / 2, y - 2);
    c.textAlign = "left";
    c.textBaseline = "alphabetic";
    roundRect(c, x - 22, y + h * 0.42, 26, 18, 4);
    c.fillStyle = mixHex(VEIN_FLOW, ART_FLOW, arterialMix);
    c.fill();
    roundRect(c, x + w - 4, y + h * 0.42, 26, 18, 4);
    c.fillStyle = mixHex(VEIN_FLOW, ART_FLOW, Math.min(1, arterialMix + 0.65));
    c.fill();
    c.restore();
  }

  function drawConsole(c, frame) {
    var u = uOf(frame, 0, 150);
    var open = ease(clamp((u - 0.16) / 0.34, 0, 1));
    var slide = ease(clamp((u - 0.46) / 0.54, 0, 1));
    var zoom = lerp(1, 1.08, slide);
    var pumpX = 690 + slide * 168;
    var pumpY = 500;
    drawBackdrop(c);
    c.save();
    c.translate(760, 490);
    c.scale(zoom, zoom);
    c.translate(-760, -490);
    c.fillStyle = "rgba(0,0,0,0.35)";
    c.beginPath();
    c.ellipse(800, 760, 420, 22, 0, 0, Math.PI * 2);
    c.fill();
    roundRect(c, 470, 250, 660, 500, 22);
    shellFill(c, 470, 250, 660, 500);
    c.strokeStyle = "rgba(231,228,222,0.2)";
    c.lineWidth = 1.5;
    c.stroke();
    [[560, 742], [980, 742]].forEach(function (p) {
      c.beginPath();
      c.arc(p[0], p[1], 28, 0, Math.PI * 2);
      c.fillStyle = "#1A2030";
      c.fill();
      c.lineWidth = 6;
      c.strokeStyle = "#8E97A8";
      c.stroke();
    });
    roundRect(c, 560, 168, 280, 150, 12);
    shellFill(c, 560, 168, 280, 150);
    c.strokeStyle = "rgba(231,228,222,0.25)";
    c.stroke();
    roundRect(c, 574, 184, 252, 118, 8);
    c.fillStyle = "#07090E";
    c.fill();
    c.strokeStyle = rgba(GAS, 0.85);
    c.lineWidth = 1.5;
    c.beginPath();
    var i, t;
    for (i = 0; i <= 40; i++) {
      t = i / 40;
      var px = 586 + t * 228;
      var py = 244 + Math.sin(t * 7 + frame * 0.05) * 16;
      if (i) c.lineTo(px, py); else c.moveTo(px, py);
    }
    c.stroke();
    c.fillStyle = "rgba(231,228,222,0.55)";
    c.font = "12px ui-monospace, monospace";
    c.fillText("FLOW TRACE", 586, 206);
    c.strokeStyle = "rgba(231,228,222,0.35)";
    c.setLineDash([5, 7]);
    c.lineWidth = 1.25;
    c.beginPath();
    c.moveTo(430, pumpY);
    c.lineTo(pumpX + 120, pumpY);
    c.stroke();
    c.setLineDash([]);
    c.strokeStyle = rgba(VEIN_FLOW, 0.95);
    c.lineWidth = 8;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(80, 560);
    c.bezierCurveTo(280, 560, 420, pumpY, pumpX - 20, pumpY);
    c.stroke();
    flowDots(c, 120, 548, pumpX - 40, pumpY - 18, frame, VEIN_LIT, 7, 3.2);
    c.strokeStyle = rgba(ART_FLOW, 0.95);
    c.beginPath();
    c.moveTo(1120, 430);
    c.bezierCurveTo(1280, 430, 1360, 520, 1500, 520);
    c.stroke();
    flowDots(c, 1160, 430, 1460, 512, frame, ART_FLOW, 6, 3.2);
    c.strokeStyle = rgba(GAS, 0.9);
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(1054, 300);
    c.lineTo(1054, 210);
    c.lineTo(1320, 210);
    c.stroke();
    roundRect(c, 500, 430, 150, 140, 16);
    c.fillStyle = "#161C28";
    c.fill();
    c.strokeStyle = "rgba(231,228,222,0.28)";
    c.lineWidth = 1.5;
    c.stroke();
    c.fillStyle = "rgba(231,228,222,0.45)";
    c.font = "12px ui-monospace, monospace";
    c.fillText("DRIVE", 548, 505);
    drawOxygenatorBody(c, 980, 300, 150, 340, frame, 0.25);
    drawBrackets(c, 700, pumpY, open);
    drawPumpSide(c, pumpX, pumpY, frame, lerp(18, 46, slide));
    c.restore();
    var la = ease(clamp(frame / 28, 0, 1));
    leader(c, 560, 320, 160, 280, "Mobile console", "side profile", la);
    leader(c, 700, pumpY - 96, 160, 470, "Mounting bracket", open > 0.5 ? "unclamped" : "clamping", la);
    leader(c, pumpX + 36, pumpY + 10, 1240, 700, "Pump head", "polycarbonate shell", la);
    leader(c, 1120, 390, 1320, 250, "Membrane lung", "downstream of the pump", la * 0.95);
    if (slide > 0.08) leader(c, pumpX + 20, pumpY + 70, 1240, 560, "Drive axis", "translating forward", slide);
  }

  function drawImpeller(c, angle, R) {
    c.save();
    c.rotate(angle);
    var g = c.createLinearGradient(-R, -R, R, R);
    g.addColorStop(0, "#F2F4F8");
    g.addColorStop(1, "#8E97A8");
    var i;
    for (i = 0; i < 6; i++) {
      c.rotate(Math.PI / 3);
      c.beginPath();
      c.moveTo(R * 0.2, 6);
      c.quadraticCurveTo(R * 0.55, 26, R * 0.92, 8);
      c.quadraticCurveTo(R * 0.78, -2, R * 0.42, -6);
      c.quadraticCurveTo(R * 0.24, -2, R * 0.2, 6);
      c.closePath();
      c.fillStyle = g;
      c.fill();
      c.strokeStyle = "rgba(10,12,16,0.45)";
      c.lineWidth = 1;
      c.stroke();
    }
    c.beginPath();
    c.arc(0, 0, R * 0.22, 0, Math.PI * 2);
    c.fillStyle = "#121722";
    c.fill();
    c.lineWidth = 4;
    c.strokeStyle = "rgba(231,228,222,0.55)";
    c.stroke();
    c.restore();
  }

  function drawPump(c, frame) {
    var u = uOf(frame, 150, 300);
    var cx = 760, cy = 470;
    var angle = frame * 0.11;
    var wobble = reduceMotion ? 0 : 1;
    var ix = Math.cos(frame * 0.035) * 1.3 * wobble;
    var iy = Math.sin(frame * 0.028) * 1.1 * wobble;
    drawBackdrop(c);
    c.save();
    c.translate(cx, cy);
    var i, a, hot;
    for (i = 0; i < 8; i++) {
      a = (i / 8) * Math.PI * 2 + angle;
      c.save();
      c.translate(Math.cos(a) * 292, Math.sin(a) * 292);
      c.rotate(a);
      roundRect(c, -16, -28, 32, 56, 8);
      hot = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(a - angle));
      c.fillStyle = "rgba(231,228,222," + (0.15 + hot * 0.55) + ")";
      c.fill();
      c.restore();
    }
    c.save();
    c.strokeStyle = "rgba(231,228,222,0.78)";
    c.lineWidth = 1.7;
    c.setLineDash([4, 7]);
    c.lineDashOffset = reduceMotion ? 0 : -frame * 0.7;
    for (i = 0; i < 8; i++) {
      a = (i / 8) * Math.PI * 2 + angle;
      c.beginPath();
      c.moveTo(Math.cos(a) * 250, Math.sin(a) * 250);
      c.quadraticCurveTo(Math.cos(a + 0.3) * 180, Math.sin(a + 0.3) * 180, Math.cos(a + 0.5) * 140 + ix, Math.sin(a + 0.5) * 140 + iy);
      c.stroke();
    }
    c.restore();
    c.beginPath();
    c.arc(0, 0, 230, 0, Math.PI * 2);
    c.lineWidth = 46;
    c.strokeStyle = "#1A2130";
    c.stroke();
    c.lineWidth = 2;
    c.strokeStyle = "rgba(255,255,255,0.2)";
    c.stroke();
    c.save();
    c.beginPath();
    c.arc(0, 0, 207, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = "rgba(106,4,15,0.55)";
    c.fillRect(-230, -230, 460, 460);
    c.restore();
    c.beginPath();
    c.moveTo(210, -28);
    c.lineTo(430, -36);
    c.lineTo(430, 36);
    c.lineTo(210, 24);
    c.closePath();
    c.fillStyle = "#1A2130";
    c.fill();
    c.strokeStyle = "rgba(255,255,255,0.2)";
    c.stroke();
    for (i = 0; i < 8; i++) {
      var tt = ((reduceMotion ? 0 : frame) * 0.01 + i / 8) % 1;
      c.fillStyle = rgba(VEIN_LIT, 0.85);
      c.beginPath();
      c.arc(230 + tt * 180, Math.sin(i) * 6, 3.2, 0, Math.PI * 2);
      c.fill();
    }
    for (i = 0; i < 70; i++) {
      var speed = 0.55 + hash(i) * 0.7;
      var p = (hash(i + 4) + frame * 0.006 * speed) % 1;
      var ang = hash(i + 9) * Math.PI * 2 + p * 5.4 + angle * 0.25;
      var rad = 24 + Math.pow(p, 0.85) * 175;
      c.fillStyle = rgba(VEIN_LIT, 0.28 + (1 - p) * 0.6);
      c.beginPath();
      c.arc(Math.cos(ang) * rad, Math.sin(ang) * rad, 2.1 + (1 - p) * 1.6, 0, Math.PI * 2);
      c.fill();
    }
    c.save();
    c.translate(ix, iy);
    drawImpeller(c, angle, 132);
    c.restore();
    c.beginPath();
    c.arc(ix, iy, 22, 0, Math.PI * 2);
    var inlet = c.createRadialGradient(ix, iy, 2, ix, iy, 22);
    inlet.addColorStop(0, "#E35A68");
    inlet.addColorStop(1, VEIN);
    c.fillStyle = inlet;
    c.fill();
    c.restore();
    var la = ease(clamp((u - 0.08) / 0.2, 0, 1));
    leader(c, cx - 210, cy - 200, 250, 150, "Stator field", "outside the blood", la);
    leader(c, cx - 70, cy - 30, 250, 280, "Bearingless impeller", "suspended, no shaft", la);
    leader(c, cx - 24, cy + 8, 250, 430, "Venous inlet", "still burgundy", la);
    leader(c, cx + 360, cy, 1180, 210, "Volute discharge", "to the membrane lung", la);
    leader(c, cx + Math.cos(0.9) * 170, cy + Math.sin(0.9) * 170, 1180, 640, "Clearance gap", "no shaft in the blood", la);
  }

  function drawFiberEnd(c, x, y, rad, frame, idx) {
    c.beginPath();
    c.arc(x, y, rad, 0, Math.PI * 2);
    c.fillStyle = SHELL;
    c.fill();
    c.lineWidth = Math.max(1, rad * 0.07);
    c.strokeStyle = "rgba(231,228,222,0.38)";
    c.stroke();
    c.beginPath();
    c.arc(x, y, rad * 0.58, 0, Math.PI * 2);
    var g = c.createRadialGradient(x - rad * 0.15, y - rad * 0.18, rad * 0.05, x, y, rad * 0.58);
    g.addColorStop(0, "rgba(186,242,255,0.85)");
    g.addColorStop(1, "rgba(0,90,120,0.45)");
    c.fillStyle = g;
    c.fill();
    if (rad > 10) {
      var n = rad > 40 ? 4 : 2, i, p, py, half;
      for (i = 0; i < n; i++) {
        p = (hash(idx * 5 + i) + frame * 0.006) % 1;
        py = y + (0.5 - p) * rad * 1.05;
        half = Math.sqrt(Math.max(0, rad * rad * 0.28 - (py - y) * (py - y)));
        if (half < 1) continue;
        c.fillStyle = "rgba(255,255,255,0.85)";
        c.beginPath();
        c.arc(x, py, Math.max(1.2, rad * 0.045), 0, Math.PI * 2);
        c.fill();
      }
    }
  }

  function drawBundle(c, frame) {
    var u = uOf(frame, 300, 510);
    var approach = ease(clamp((u - 0.06) / 0.94, 0, 1));
    var zoom = lerp(0.48, 6.8, approach);
    var ox = 800, oy = 450;
    var houseA = 1 - ease(clamp((zoom - 0.55) / 1.15, 0, 1));
    drawBackdrop(c);
    if (houseA > 0.03) {
      c.save();
      c.globalAlpha = houseA;
      drawOxygenatorBody(c, 610, 175, 380, 540, frame, clamp(u * 1.4, 0, 0.65));
      c.strokeStyle = rgba(VEIN_FLOW, 0.95);
      c.lineWidth = 10;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(80, 410);
      c.lineTo(610, 410);
      c.stroke();
      flowDots(c, 120, 410, 560, 410, frame, VEIN_LIT, 6, 3.5);
      c.strokeStyle = rgba(ART_FLOW, 0.95);
      c.beginPath();
      c.moveTo(990, 410);
      c.lineTo(1500, 410);
      c.stroke();
      flowDots(c, 1040, 410, 1460, 410, frame, ART_FLOW, 6, 3.5);
      c.restore();
    }
    if (houseA < 0.85) {
      c.fillStyle = "rgba(110, 16, 32, " + (0.72 * (1 - houseA)) + ")";
      c.fillRect(0, 0, VW, VH);
    }
    var spacing = 38 * zoom;
    var rad = 13.5 * zoom;
    var focusFade = clamp((zoom - 1.1) / 2.2, 0, 1);
    HEX.forEach(function (cell, idx) {
      var q = cell[0], r = cell[1];
      var x = ox + spacing * (q + r / 2);
      var y = oy + spacing * (Math.sqrt(3) / 2 * r);
      var dist = Math.hypot(x - ox, y - oy);
      var alpha = lerp(1, clamp(1 - dist / 700, 0.12, 1), focusFade);
      if (alpha < 0.05 || rad < 0.8) return;
      if (x < -rad || x > VW + rad || y < -rad || y > VH + rad) return;
      c.save();
      c.globalAlpha = alpha;
      drawFiberEnd(c, x, y, rad, frame, idx);
      c.restore();
    });
    if (zoom < 6.2) {
      var i;
      for (i = 0; i < 48; i++) {
        var q2 = (hash(i + 20) - 0.5) * 9;
        var r2 = (hash(i + 80) - 0.5) * 9;
        var drift = (hash(i + 3) + frame * 0.0035) % 1;
        var x2 = ox + spacing * (q2 + r2 / 2);
        var y2 = oy + spacing * ((Math.sqrt(3) / 2) * r2) + (drift - 0.5) * spacing * 0.8;
        if (Math.hypot(x2 - ox, y2 - oy) < rad * 0.7) continue;
        c.fillStyle = mixHex(VEIN_FLOW, VEIN_LIT, hash(i));
        c.beginPath();
        c.arc(x2, y2, Math.max(1.6, Math.min(10, rad * 0.11)), 0, Math.PI * 2);
        c.fill();
      }
    }
    var la = ease(clamp((zoom - 0.9) / 0.8, 0, 1)) * (1 - ease(clamp((zoom - 4.6) / 1.2, 0, 1)));
    leader(c, ox + spacing * 0.9, oy - spacing * 0.2, 1280, 160, "PMP hollow fiber", "polymethylpentene", la);
    leader(c, ox, oy, 280, 200, "Sweep gas", "through the lumen", la);
    leader(c, ox + spacing * 0.5, oy + spacing * 0.55, 280, 700, "Blood path", "outside, counter-current", la);
  }

  function drawPores(c, x0, x1, y0, y1, seed) {
    c.save();
    c.beginPath();
    c.rect(x0, y0, x1 - x0, y1 - y0);
    c.clip();
    var i;
    for (i = 0; i < 70; i++) {
      c.beginPath();
      c.ellipse(lerp(x0, x1, hash(seed + i)), lerp(y0, y1, hash(seed + i + 90)), 3 + hash(seed + i + 3) * 8, 2.5 + hash(seed + i + 4) * 6, hash(seed + i) * 3, 0, Math.PI * 2);
      c.fillStyle = "rgba(10,12,16,0.72)";
      c.fill();
    }
    c.restore();
  }
  function drawO2(c, x, y, s, alpha) {
    c.save();
    c.globalAlpha = alpha;
    c.strokeStyle = GAS;
    c.fillStyle = GAS;
    c.lineWidth = 1.6;
    c.beginPath();
    c.moveTo(x - s, y);
    c.lineTo(x + s, y);
    c.stroke();
    c.beginPath();
    c.arc(x - s, y, s * 0.62, 0, Math.PI * 2);
    c.arc(x + s, y, s * 0.62, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
  function drawCO2(c, x, y, s, alpha) {
    c.save();
    c.globalAlpha = alpha;
    c.strokeStyle = BONE;
    c.fillStyle = BONE;
    c.lineWidth = 1.4;
    c.beginPath();
    c.moveTo(x - s * 1.6, y);
    c.lineTo(x + s * 1.6, y);
    c.stroke();
    c.beginPath();
    c.arc(x - s * 1.6, y, s * 0.5, 0, Math.PI * 2);
    c.arc(x, y, s * 0.42, 0, Math.PI * 2);
    c.arc(x + s * 1.6, y, s * 0.5, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  function drawFiber(c, frame) {
    var u = uOf(frame, 510, 750);
    var top = 130, bot = 790;
    var band0 = 560, band1 = 640;
    var wall0 = 660, wall1 = 1080;
    var skin0 = 820, skin1 = 940;
    drawBackdrop(c);
    c.fillStyle = "#4A0A14";
    c.fillRect(70, top, band1 - 70, bot - top);
    var bulk = c.createLinearGradient(70, top, band0, top);
    bulk.addColorStop(0, "#3C0710");
    bulk.addColorStop(1, VEIN);
    c.fillStyle = bulk;
    c.fillRect(70, top, band0 - 70, bot - top);
    var band = c.createLinearGradient(band0, 0, band1, 0);
    band.addColorStop(0, VEIN);
    band.addColorStop(1, ART);
    c.fillStyle = band;
    c.fillRect(band0, top, band1 - band0, bot - top);
    var i;
    for (i = 0; i < 16; i++) {
      var x = 110 + hash(i) * 500;
      var y = top + 40 + ((hash(i + 2) + frame * 0.0015) % 1) * (bot - top - 80);
      var col = x < band0 ? VEIN_LIT : mixHex(VEIN_LIT, ART, clamp((x - band0) / (band1 - band0), 0, 1));
      c.save();
      c.translate(x, y);
      c.rotate(hash(i + 4) * 2 - 0.4);
      c.beginPath();
      c.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2);
      c.fillStyle = col;
      c.fill();
      c.restore();
    }
    roundRect(c, wall0, top, wall1 - wall0, bot - top, 8);
    c.fillStyle = "#1A2130";
    c.fill();
    drawPores(c, wall0 + 8, skin0 - 8, top + 10, bot - 10, 11);
    drawPores(c, skin1 + 8, wall1 - 8, top + 10, bot - 10, 29);
    var skin = c.createLinearGradient(skin0, 0, skin1, 0);
    skin.addColorStop(0, "#243044");
    skin.addColorStop(0.5, "#3C4C66");
    skin.addColorStop(1, "#243044");
    c.fillStyle = skin;
    c.fillRect(skin0, top, skin1 - skin0, bot - top);
    c.strokeStyle = "rgba(72,202,228,0.35)";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo((skin0 + skin1) / 2, top + 8);
    c.lineTo((skin0 + skin1) / 2, bot - 8);
    c.stroke();
    var lumen = c.createLinearGradient(wall1, 0, 1520, 0);
    lumen.addColorStop(0, "rgba(72,202,228,0.16)");
    lumen.addColorStop(1, "rgba(72,202,228,0.38)");
    c.fillStyle = lumen;
    c.fillRect(wall1, top, 450, bot - top);
    var appear = ease(clamp(u / 0.15, 0, 1));
    for (i = 0; i < 11; i++) {
      var period = 240;
      var t = ((frame * (reduceMotion ? 0 : 1) + i * 23) % period) / period;
      var yy = top + 40 + hash(i + 6) * (bot - top - 80);
      drawO2(c, lerp(1280, 430, ease(t)), yy, 7, Math.sin(t * Math.PI) * appear);
      var t2 = ((frame * (reduceMotion ? 0 : 1) + i * 29 + 80) % period) / period;
      var y2 = top + 50 + hash(i + 15) * (bot - top - 100);
      drawCO2(c, lerp(460, 1320, ease(t2)), y2, 6, Math.sin(t2 * Math.PI) * appear);
    }
    var yb = 748;
    c.strokeStyle = BONE;
    c.fillStyle = BONE;
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(band0, yb);
    c.lineTo(band1, yb);
    c.moveTo(band0, yb - 8);
    c.lineTo(band0, yb + 8);
    c.moveTo(band1, yb - 8);
    c.lineTo(band1, yb + 8);
    c.stroke();
    c.font = "13px ui-monospace, monospace";
    c.textAlign = "center";
    c.fillText("10 \u03bcm schematic", (band0 + band1) / 2, yb + 18);
    var la = ease(clamp((u - 0.05) / 0.18, 0, 1));
    c.save();
    c.globalAlpha = la;
    c.font = "600 14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    c.fillStyle = BONE;
    c.fillText("PLASMA", 200, 168);
    c.fillText("BOUNDARY", 520, 168);
    c.fillText("MICROPOROUS", 700, 168);
    c.fillText("DENSE PMP SKIN", 820, 700);
    c.fillText("LUMEN", 1200, 168);
    c.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    c.fillStyle = "rgba(231,228,222,0.75)";
    c.fillText("venous bulk", 200, 188);
    c.fillText("burgundy to vermilion", 470, 188);
    c.fillStyle = GAS;
    c.fillText("sweep gas  ·  O\u2082 in", 1160, 188);
    c.fillStyle = BONE;
    c.fillText("plasma stays out", 820, 718);
    c.fillText("CO\u2082 out", 1200, 640);
    c.restore();
  }

  var LOOP = [
    [250, 610], [430, 540], [560, 430], [730, 400],
    [900, 400], [1080, 410], [1220, 450], [1220, 690],
    [760, 730], [250, 690]
  ];
  var LOOP_GEOM = measure(LOOP);
  function measure(pts) {
    var seg = [], L = 0, i, len;
    for (i = 1; i < pts.length; i++) {
      len = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      seg.push(len);
      L += len;
    }
    return { seg: seg, L: L };
  }
  function pointAt(pts, geom, t) {
    var d = ((t % 1) + 1) % 1 * geom.L, i, u;
    for (i = 0; i < geom.seg.length; i++) {
      if (d <= geom.seg[i] || i === geom.seg.length - 1) {
        u = geom.seg[i] === 0 ? 0 : d / geom.seg[i];
        return { x: lerp(pts[i][0], pts[i + 1][0], u), y: lerp(pts[i][1], pts[i + 1][1], u), seg: i };
      }
      d -= geom.seg[i];
    }
    return { x: pts[0][0], y: pts[0][1], seg: 0 };
  }

  function drawPatient(c, x, y, lights) {
    c.save();
    c.translate(x, y);
    c.strokeStyle = "rgba(231,228,222," + (0.45 + Math.max(lights.venous, lights.arterial) * 0.55) + ")";
    c.lineWidth = 2;
    c.beginPath();
    c.ellipse(0, -150, 26, 32, 0, 0, Math.PI * 2);
    c.stroke();
    roundRect(c, -70, -110, 140, 210, 40);
    c.stroke();
    c.beginPath();
    c.moveTo(-28, 100); c.lineTo(-36, 180);
    c.moveTo(28, 100); c.lineTo(36, 180);
    c.stroke();
    c.fillStyle = rgba(VEIN_LIT, lights.venous);
    c.beginPath(); c.arc(-20, 150, 6, 0, Math.PI * 2); c.fill();
    c.fillStyle = rgba(ART_FLOW, lights.arterial);
    c.beginPath(); c.arc(20, 150, 6, 0, Math.PI * 2); c.fill();
    c.restore();
  }
  function drawMiniPump(c, x, y, frame, lit) {
    c.save();
    c.translate(x, y);
    c.beginPath();
    c.arc(0, 0, 62, 0, Math.PI * 2);
    c.fillStyle = "rgba(34,41,56,0.9)";
    c.fill();
    c.lineWidth = 3;
    c.strokeStyle = "rgba(231,228,222," + (0.25 + lit * 0.7) + ")";
    c.stroke();
    c.save();
    c.rotate(frame * 0.11);
    c.strokeStyle = rgba(VEIN_LIT, 0.4 + lit * 0.6);
    c.lineWidth = 3;
    var i;
    for (i = 0; i < 5; i++) {
      c.rotate((Math.PI * 2) / 5);
      c.beginPath();
      c.moveTo(10, 0);
      c.quadraticCurveTo(28, 12, 48, 4);
      c.stroke();
    }
    c.restore();
    c.beginPath();
    c.arc(0, 0, 8, 0, Math.PI * 2);
    c.fillStyle = rgba(VEIN_LIT, 0.5 + lit * 0.5);
    c.fill();
    c.restore();
  }
  function drawGasBlender(c, x, y, lit) {
    [["O\u2082", -70], ["AIR", 70]].forEach(function (pair) {
      roundRect(c, x + pair[1] - 36, y - 28, 72, 44, 8);
      c.fillStyle = rgba(GAS, 0.15 + lit * 0.75);
      c.fill();
      c.strokeStyle = rgba(GAS, 0.4 + lit * 0.6);
      c.stroke();
      c.fillStyle = "#07141A";
      c.font = "13px ui-monospace, monospace";
      c.textAlign = "center";
      c.fillText(pair[0], x + pair[1], y - 2);
    });
    c.textAlign = "left";
  }
  function drawHeat(c, x, y, lit) {
    roundRect(c, x, y, 150, 150, 16);
    shellFill(c, x, y, 150, 150);
    c.strokeStyle = "rgba(231,228,222," + (0.25 + lit * 0.6) + ")";
    c.lineWidth = 1.5;
    c.stroke();
    c.strokeStyle = "rgba(154,164,184," + (0.4 + lit * 0.6) + ")";
    c.lineWidth = 3;
    var i;
    for (i = 0; i < 4; i++) {
      c.beginPath();
      c.moveTo(x + 22, y + 36 + i * 22);
      c.lineTo(x + 128, y + 36 + i * 22);
      c.stroke();
    }
    c.fillStyle = "rgba(231,228,222,0.75)";
    c.font = "12px ui-monospace, monospace";
    c.fillText("WATER", x + 48, y + 136);
  }

  function drawCircuit(c, frame) {
    var u = uOf(frame, 750, 1020);
    var pull = ease(clamp(u / 0.4, 0, 1));
    var zoom = lerp(2.15, 0.96, pull);
    var focus = { x: lerp(900, 760, pull), y: lerp(400, 500, pull) };
    function lamp(on) { return Math.max(0.2, ease(clamp((u - on) / 0.08, 0, 1))); }
    var lights = {
      venous: lamp(0.40),
      pump: lamp(0.50),
      oxy: Math.max(0.45, lamp(0.60)),
      gas: lamp(0.66),
      heat: lamp(0.76),
      arterial: lamp(0.86)
    };
    drawBackdrop(c);
    c.save();
    c.translate(focus.x, focus.y);
    c.scale(zoom, zoom);
    c.translate(-focus.x, -focus.y);
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    LOOP.forEach(function (p, i) { if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); });
    c.lineWidth = 16;
    c.strokeStyle = "rgba(8,6,10,0.9)";
    c.stroke();
    function strokePart(from, to, color) {
      var i;
      c.beginPath();
      c.moveTo(LOOP[from][0], LOOP[from][1]);
      for (i = from + 1; i <= to; i++) c.lineTo(LOOP[i][0], LOOP[i][1]);
      c.strokeStyle = color;
      c.lineWidth = 8;
      c.stroke();
    }
    strokePart(0, 4, rgba(VEIN_FLOW, 0.45 + lights.venous * 0.55));
    strokePart(4, 9, rgba(ART_FLOW, 0.35 + lights.arterial * 0.65));
    c.beginPath();
    c.moveTo(820, 180);
    c.lineTo(900, 180);
    c.lineTo(900, 300);
    c.moveTo(980, 180);
    c.lineTo(900, 180);
    c.lineWidth = 6;
    c.strokeStyle = rgba(GAS, 0.3 + lights.gas * 0.7);
    c.stroke();
    var i, t, p, col, gate;
    for (i = 0; i < 36; i++) {
      t = (i / 36 + frame * 0.0016) % 1;
      p = pointAt(LOOP, LOOP_GEOM, t);
      col = p.seg >= 4 ? ART_FLOW : VEIN_LIT;
      gate = p.seg < 2 ? lights.venous : p.seg < 4 ? lights.pump : p.seg < 6 ? lights.oxy : lights.arterial;
      c.fillStyle = rgba(col, 0.25 + gate * 0.75);
      c.beginPath();
      c.arc(p.x, p.y, 4.2, 0, Math.PI * 2);
      c.fill();
    }
    drawPatient(c, 230, 470, lights);
    drawMiniPump(c, 560, 400, frame, lights.pump);
    drawOxygenatorBody(c, 820, 300, 160, 210, frame, lights.oxy);
    drawGasBlender(c, 900, 170, lights.gas);
    drawHeat(c, 1140, 360, lights.heat);
    c.restore();
    var la = ease(clamp((u - 0.42) / 0.18, 0, 1));
    function project(x, y) {
      return { x: focus.x + (x - focus.x) * zoom, y: focus.y + (y - focus.y) * zoom };
    }
    [
      [250, 560, 300, 500, "Venous cannula", lights.venous],
      [560, 360, 430, 230, "Mag-lev drive", lights.pump],
      [900, 150, 1120, 130, "Gas blender", lights.gas],
      [900, 360, 1080, 300, "Membrane lung", lights.oxy],
      [1240, 420, 1360, 560, "Heat exchanger", lights.heat],
      [520, 730, 680, 790, "Arterial return", lights.arterial]
    ].forEach(function (row) {
      var pt = project(row[0], row[1]);
      var lb = project(row[2], row[3]);
      leader(c, pt.x, pt.y, lb.x, lb.y, row[4], "", la * (0.35 + row[5] * 0.65));
    });
  }

  function drawChrome(c, frame) {
    var scene = STAGES[dominant(frame)];
    c.save();
    c.strokeStyle = "rgba(231,228,222,0.2)";
    c.lineWidth = 1;
    c.strokeRect(26, 26, VW - 52, VH - 52);
    c.fillStyle = BONE;
    c.font = "600 16px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    c.textAlign = "left";
    c.textBaseline = "alphabetic";
    c.fillText(scene.name.toUpperCase(), 48, 58);
    c.fillStyle = "rgba(231,228,222,0.78)";
    c.font = "13px ui-monospace, monospace";
    c.textAlign = "right";
    c.fillText("SCHEMATIC  ·  NOT A MEASURED DRAWING", VW - 48, VH - 46);
    c.textAlign = "left";
    var f = clamp(Math.round(frame), 0, LAST);
    var sec = f / FPS;
    var m = Math.floor(sec / 60);
    var s = sec - m * 60;
    c.fillText((m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s.toFixed(1) + "   F" + String(f).padStart(4, "0"), 48, VH - 46);
    if (frame > 960) {
      c.globalAlpha = clamp((frame - 960) / 30, 0, 1);
      c.textAlign = "center";
      c.font = "600 18px ui-monospace, monospace";
      c.fillStyle = BONE;
      c.fillText("LOOP IN CIRCULATION SYNC", VW / 2, 78);
    }
    c.restore();
  }

  var DRAW = [drawConsole, drawPump, drawBundle, drawFiber, drawCircuit];

  function paintScene(context, target, index, frame) {
    fit(context, target);
    DRAW[index](context, frame);
  }

  function renderFrame(ctx, canvas, offA, octxA, offB, octxB, frame) {
    var w = weights(frame);
    var layers = [];
    var i;
    for (i = 0; i < w.length; i++) if (w[i] > 0.004) layers.push({ weight: w[i], index: i });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (layers.length <= 1) {
      paintScene(ctx, canvas, layers.length ? layers[0].index : 0, frame);
    } else {
      var ordered = layers.slice(0, 2).sort(function (a, b) { return a.weight - b.weight; });
      paintScene(octxA, offA, ordered[0].index, frame);
      paintScene(octxB, offB, ordered[1].index, frame);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(offA, 0, 0);
      ctx.globalAlpha = ordered[1].weight / (ordered[0].weight + ordered[1].weight);
      ctx.drawImage(offB, 0, 0);
      ctx.globalAlpha = 1;
    }
    setView(ctx, canvas);
    drawChrome(ctx, frame);
  }

  function boot(canvas) {
    var ctx = canvas.getContext("2d");
    var offA = document.createElement("canvas");
    var offB = document.createElement("canvas");
    var octxA = offA.getContext("2d");
    var octxB = offB.getContext("2d");
    var params = new URLSearchParams(location.search);
    var state = {
      frame: 0,
      playing: !reduceMotion && params.get("pause") !== "1",
      speed: 1,
      loop: params.get("loop") !== "0",
      scrubbing: false,
      last: 0
    };
    if (params.has("frame")) state.frame = clamp(Number(params.get("frame")), 0, LAST);
    if (params.has("t")) state.frame = clamp(Number(params.get("t")) * FPS, 0, LAST);

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      var w = Math.max(2, Math.round(rect.width * dpr));
      var h = Math.max(2, Math.round((rect.width * 9 / 16) * dpr));
      canvas.style.height = (rect.width * 9 / 16) + "px";
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        offA.width = w; offA.height = h;
        offB.width = w; offB.height = h;
      }
    }
    function emit() {
      var f = clamp(state.frame, 0, LAST);
      var scene = dominant(f);
      canvas.dispatchEvent(new CustomEvent("va-frame", {
        detail: { frame: f, scene: scene, caption: STAGES[scene].caption, name: STAGES[scene].name, playing: state.playing }
      }));
    }
    function render() {
      resize();
      if (!canvas.width) return;
      renderFrame(ctx, canvas, offA, octxA, offB, octxB, state.frame);
      emit();
    }
    function seek(frame) {
      state.frame = clamp(frame, 0, LAST);
      render();
    }
    function tick(now) {
      if (!state.last) state.last = now;
      var dt = Math.min(0.05, (now - state.last) / 1000);
      state.last = now;
      if (state.playing && !state.scrubbing) {
        state.frame += dt * state.speed * FPS;
        if (state.frame > LAST) {
          if (state.loop) state.frame = state.frame % 1020;
          else { state.frame = LAST; state.playing = false; }
        }
      }
      render();
      requestAnimationFrame(tick);
    }
    window.addEventListener("resize", render);
    window.__ecmo = {
      seek: seek,
      play: function (on) { state.playing = on; },
      toggle: function () { state.playing = !state.playing; return state.playing; },
      setSpeed: function (s) { state.speed = s; },
      setLoop: function (on) { state.loop = on; },
      setScrubbing: function (on) { state.scrubbing = on; },
      stages: STAGES,
      bounds: BOUNDS,
      get frame() { return state.frame; },
      get playing() { return state.playing; }
    };
    requestAnimationFrame(tick);
  }

  window.VAEcmo = { boot: boot, stages: STAGES, bounds: BOUNDS, last: LAST };
})();
