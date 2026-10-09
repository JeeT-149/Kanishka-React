/**
 * scripts/generate-product-art.mjs
 * Plain Node ESM, zero runtime dependencies.
 * Reads src/data/products.json and writes:
 *   - public/images/products/<id>.svg (front view)
 *   - public/images/products/<id>-notes.svg (tasting notes archival card)
 *
 * GUARD: Brew Gear (category === "gear") images are NEVER overwritten.
 *
 * Packaging by category:
 *   - Single Origin Coffee: flat-bottom pouch, palette by origin region + roast
 *   - Blends: off-white / cream pouch with accent band
 *   - Tea: cylindrical tin, type-specific colour
 *   - Gift box: kraft box with Kiln & Leaf wordmark
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const dataPath = path.join(rootDir, "src", "data", "products.json");
const outDir = path.join(rootDir, "public", "images", "products");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const rawData = fs.readFileSync(dataPath, "utf-8");
const products = JSON.parse(rawData);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeXml(unsafe) {
  return String(unsafe ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Wrap text into lines; each line is at most maxChars wide. */
function wrapText(text, maxChars = 20, maxLines = 3) {
  const words = String(text ?? "").split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + " " + word).length <= maxChars) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) {
        // Collect remaining words onto last allowed line
        break;
      }
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  return lines.slice(0, maxLines);
}

// ---------------------------------------------------------------------------
// Palette system
// ---------------------------------------------------------------------------

/**
 * Six muted, brand-harmonious palettes.
 * Each palette has a name, body fill, gradient stop, accent, and label colours.
 *
 * paletteName  – used in the combination table and uniqueness check
 * bodyFill     – main packaging colour
 * gradStop     – darker variant for gradient / shadow edge
 * accentFill   – lid / band / detail colour
 * labelBg      – sticker / label background
 * labelText    – text on the label sticker
 * textColor    – direct on-packaging text colour
 */
const PALETTES = {
  terracotta: {
    name: "terracotta",
    bodyFill: "#A44C26",
    gradStop: "#7D3516",
    accentFill: "#E8A374",
    labelBg: "#FCFAF6",
    labelText: "#161412",
    textColor: "#FAF6EE",
  },
  charcoal: {
    name: "charcoal",
    bodyFill: "#2B2927",
    gradStop: "#1B1918",
    accentFill: "#D48B47",
    labelBg: "#F7F4EE",
    labelText: "#161412",
    textColor: "#FAF6EE",
  },
  sand: {
    name: "sand",
    bodyFill: "#D9C6A5",
    gradStop: "#C4AD89",
    accentFill: "#8C3A14",
    labelBg: "#FCFAF5",
    labelText: "#161412",
    textColor: "#2B2117",
  },
  olive: {
    name: "olive",
    bodyFill: "#4A5240",
    gradStop: "#333929",
    accentFill: "#C8A96E",
    labelBg: "#F8F6EE",
    labelText: "#161412",
    textColor: "#EDF0E6",
  },
  slate: {
    name: "slate",
    bodyFill: "#3D4756",
    gradStop: "#283040",
    accentFill: "#C89547",
    labelBg: "#F7F5EF",
    labelText: "#161412",
    textColor: "#EEF2F8",
  },
  plum: {
    name: "plum",
    bodyFill: "#5B3050",
    gradStop: "#3E2038",
    accentFill: "#D4A46A",
    labelBg: "#FAF7F2",
    labelText: "#161412",
    textColor: "#F5EDF8",
  },
};

/**
 * Three accent motifs: band (horizontal stripe), stripe (diagonal),
 * corner (small L-shaped corner mark).
 */
const ACCENT_MOTIFS = ["band", "stripe", "corner"];

/**
 * Deterministically pick a palette for coffee / blends / tea products,
 * then pick an accent motif from the product id hash.
 *
 * Assignment rules:
 *   - coffee single origin: roast-first (sand=light, terracotta=medium,
 *     charcoal=dark), then vary by origin region to distinguish adjacent cards.
 *   - blends: always use a cream/pale palette + accent; assigned below.
 *   - tea: type-driven palette selections (same as before).
 */
function paletteKeyForCoffee(product) {
  const roast = product.roast ?? 3;
  const origin = (product.origin ?? "").toLowerCase();

  if (roast <= 1) {
    // Light: sand base; vary by continent
    if (origin.includes("africa") || origin.includes("ethiopia") || origin.includes("kenya") || origin.includes("rwanda")) return "olive";
    return "sand";
  }
  if (roast >= 4) {
    // Dark: charcoal or slate
    if (origin.includes("sumatra") || origin.includes("indonesia")) return "slate";
    return "charcoal";
  }
  // Medium (2-3): terracotta or plum
  if (origin.includes("colombia") || origin.includes("guatemala") || origin.includes("brazil")) return "plum";
  if (origin.includes("araku") || origin.includes("coorg") || origin.includes("chikmagalur")) return "terracotta";
  return "terracotta";
}

function paletteKeyForTea(product) {
  const id = product.id;
  if (id.includes("sencha") || id.includes("genmaicha")) return "olive";
  if (id.includes("oolong") || id.includes("alishan")) return "slate";
  if (id.includes("kahwa") || id.includes("smoked")) return "terracotta";
  // Darjeeling, Assam, Nilgiri → plum or charcoal
  if (id.includes("darjeeling")) return "plum";
  if (id.includes("nilgiri")) return "sand";
  return "charcoal";
}

function paletteKeyForBlend(product) {
  const id = product.id;
  if (id.includes("midnight")) return "charcoal";
  if (id.includes("morning")) return "sand";
  if (id.includes("decaf")) return "olive";
  if (id.includes("holiday") || id.includes("reserve")) return "plum";
  return "terracotta"; // kiln-house
}

function productPaletteKey(product) {
  const cat = product.category;
  if (cat === "single") return paletteKeyForCoffee(product);
  if (cat === "tea") return paletteKeyForTea(product);
  if (cat === "blends") return paletteKeyForBlend(product);
  return "sand";
}

/** Simple deterministic hash of a string → integer */
function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function accentMotifForProduct(product) {
  return ACCENT_MOTIFS[hashString(product.id) % ACCENT_MOTIFS.length];
}

/**
 * Build combination table with uniqueness enforcement (multi-pass):
 *   - No two ADJACENT products share the same palette+motif combination.
 *   - No palette+motif combination appears more than twice overall.
 * Uses a greedy forward pass followed by re-checks until stable.
 */
function buildCombinations(productsToCheck) {
  const combos = productsToCheck.map((p) => ({
    product: p,
    palette: productPaletteKey(p),
    motif: accentMotifForProduct(p),
  }));

  // Multi-pass: keep iterating until no violation remains
  let changed = true;
  let safetyCounter = 0;
  while (changed && safetyCounter < 20) {
    changed = false;
    safetyCounter++;

    // 1. Adjacency pass: adjacent pairs must not share palette+motif
    for (let i = 1; i < combos.length; i++) {
      if (combos[i].palette === combos[i - 1].palette && combos[i].motif === combos[i - 1].motif) {
        // Cycle current item's motif forward by one
        combos[i].motif = ACCENT_MOTIFS[(ACCENT_MOTIFS.indexOf(combos[i].motif) + 1) % ACCENT_MOTIFS.length];
        changed = true;
      }
    }

    // 2. Frequency pass: count occurrences and cap at 2
    const freq = {};
    for (const c of combos) {
      const key = `${c.palette}+${c.motif}`;
      freq[key] = (freq[key] ?? 0) + 1;
    }
    for (const c of combos) {
      const key = `${c.palette}+${c.motif}`;
      if (freq[key] > 2) {
        // Try each motif rotation and pick the one with the lowest current count
        let best = c.motif;
        let bestCount = freq[key];
        for (let t = 1; t <= ACCENT_MOTIFS.length; t++) {
          const candidate = ACCENT_MOTIFS[(ACCENT_MOTIFS.indexOf(c.motif) + t) % ACCENT_MOTIFS.length];
          const candidateKey = `${c.palette}+${candidate}`;
          const candidateCount = freq[candidateKey] ?? 0;
          if (candidateCount < bestCount) {
            best = candidate;
            bestCount = candidateCount;
          }
        }
        if (best !== c.motif) {
          freq[key]--;
          c.motif = best;
          const newKey = `${c.palette}+${c.motif}`;
          freq[newKey] = (freq[newKey] ?? 0) + 1;
          changed = true;
        }
      }
    }
  }

  return combos;
}

// ---------------------------------------------------------------------------
// SVG rendering helpers
// ---------------------------------------------------------------------------

function renderRoastDots(roastLevel, cx, cy) {
  const dots = [];
  const startX = cx - 44;
  for (let i = 1; i <= 5; i++) {
    const x = startX + (i - 1) * 22;
    const filled = i <= roastLevel;
    dots.push(
      `<circle cx="${x}" cy="${cy}" r="6" fill="${filled ? "#8C3A14" : "none"}" stroke="#8C3A14" stroke-width="1.5" />`,
    );
  }
  return dots.join("\n      ");
}

/** Render accent motif SVG fragment inside the label sticker area */
function renderMotif(motif, styles, labelX, labelY, labelW, labelH) {
  if (motif === "band") {
    // Horizontal stripe near top of label
    return `<rect x="${labelX}" y="${labelY + labelH - 28}" width="${labelW}" height="10" fill="${styles.accentFill}" opacity="0.22" />`;
  }
  if (motif === "stripe") {
    // Diagonal corner stripe
    return `<path d="M ${labelX + labelW - 48} ${labelY} L ${labelX + labelW} ${labelY} L ${labelX + labelW} ${labelY + 48} Z" fill="${styles.accentFill}" opacity="0.18" />`;
  }
  // corner: small L bracket mark bottom-left
  return `<path d="M ${labelX + 18} ${labelY + labelH - 18} L ${labelX + 18} ${labelY + labelH - 54} M ${labelX + 18} ${labelY + labelH - 18} L ${labelX + 54} ${labelY + labelH - 18}" stroke="${styles.accentFill}" stroke-width="3" stroke-linecap="round" opacity="0.4" />`;
}

// ---------------------------------------------------------------------------
// Front art renderers
// ---------------------------------------------------------------------------

/**
 * Pouch art (coffee: single origin and blends).
 *
 * viewBox 0 0 800 1100 — pack occupies roughly rows 100-900 (800px of 1000px
 * usable height), about 73% of the tile height at 4/5 aspect ratio.
 */
function renderPouchArt(product, styles, motif) {
  const nameLines = wrapText(product.name, 20, 3);
  const originText = escapeXml(product.origin ?? "Specialty Roastery");
  const weightText = escapeXml(product.weight ?? "250g");
  const isBlend = product.category === "blends";

  // Name lines: placed inside label at ~y=450 baseline for first line
  const nameSvgLines = nameLines
    .map((line, i) => {
      const y = 454 + i * 32;
      return `<text x="400" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-weight="600" fill="#161412">${escapeXml(line)}</text>`;
    })
    .join("\n      ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" fill="none">
  <defs>
    <radialGradient id="shadow-${product.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.18" />
      <stop offset="70%" stop-color="#000000" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="pouch-body-${product.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${styles.gradStop}" />
      <stop offset="18%" stop-color="${styles.bodyFill}" />
      <stop offset="50%" stop-color="${styles.bodyFill}" />
      <stop offset="85%" stop-color="${styles.gradStop}" />
      <stop offset="100%" stop-color="${styles.bodyFill}" />
    </linearGradient>
    <linearGradient id="top-seal-${product.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.15" />
    </linearGradient>
  </defs>

  <!-- Ground shadow -->
  <ellipse cx="400" cy="960" rx="240" ry="28" fill="url(#shadow-${product.id})" />

  <!-- Pouch Body -->
  <g>
    <!-- Back gusset fold hint -->
    <path d="M 215 150 L 585 150 L 610 900 Q 400 924 190 900 Z" fill="${styles.gradStop}" opacity="0.6" />

    <!-- Main pouch front (taller: top ~150, bottom ~900) -->
    <path d="M 220 150 L 580 150 Q 606 250 600 890 Q 400 924 200 890 Q 194 250 220 150 Z" fill="url(#pouch-body-${product.id})" />

    <!-- Side crease highlights -->
    <path d="M 220 150 L 236 892" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="2" />
    <path d="M 580 150 L 564 892" stroke="#000000" stroke-opacity="0.22" stroke-width="2" />

    <!-- Top seal / zipper band -->
    <rect x="216" y="96" width="368" height="58" rx="4" fill="${styles.bodyFill}" stroke="${styles.gradStop}" stroke-width="1.5" />
    <rect x="216" y="96" width="368" height="58" rx="4" fill="url(#top-seal-${product.id})" />
    <line x1="226" y1="120" x2="574" y2="120" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 3" />
    <line x1="226" y1="132" x2="574" y2="132" stroke="#000000" stroke-opacity="0.2" stroke-width="1" />

    <!-- Tear notches -->
    <path d="M 216 124 L 230 117 L 230 131 Z" fill="#FFFFFF" fill-opacity="0.4" />
    <path d="M 584 124 L 570 117 L 570 131 Z" fill="#000000" fill-opacity="0.3" />

    ${isBlend ? `
    <!-- Blend Accent Band -->
    <rect x="208" y="280" width="384" height="16" fill="${styles.accentFill}" opacity="0.9" />
    <rect x="208" y="820" width="384" height="5" fill="${styles.accentFill}" opacity="0.8" />
    ` : ""}

    <!-- One-way degassing valve -->
    <circle cx="400" cy="210" r="16" fill="#000000" fill-opacity="0.12" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1" />
    <circle cx="400" cy="210" r="5" fill="#000000" fill-opacity="0.25" />
    <circle cx="394" cy="210" r="2" fill="#FFFFFF" fill-opacity="0.4" />
    <circle cx="406" cy="210" r="2" fill="#FFFFFF" fill-opacity="0.4" />

    <!-- Label Sticker: taller to match bigger pack -->
    <g filter="drop-shadow(0 4px 12px rgba(0,0,0,0.08))">
      <rect x="256" y="300" width="288" height="440" rx="6" fill="${styles.labelBg}" stroke="#E2DCD0" stroke-width="1.5" />

      ${renderMotif(motif, styles, 256, 300, 288, 440)}

      <!-- Wordmark -->
      <text x="400" y="344" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="13" font-weight="700" letter-spacing="4" fill="#8C3A14">KILN &amp; LEAF</text>
      <line x1="296" y1="360" x2="504" y2="360" stroke="#E2DCD0" stroke-width="1" />

      <!-- Product Name (min 28px rendered, ≈12px+ at card width) -->
      ${nameSvgLines}

      <line x1="316" y1="578" x2="484" y2="578" stroke="#E2DCD0" stroke-width="1" />

      <!-- Origin & Weight (14px rendered) -->
      <text x="400" y="612" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="14" font-weight="600" fill="#4E473F">${originText}</text>
      <text x="400" y="634" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="12" font-weight="500" fill="#786F66">Whole Bean · ${weightText}</text>

      ${product.roast ? `
      <!-- Roast dots (coffee) -->
      <g>
        ${renderRoastDots(product.roast, 400, 692)}
      </g>
      ` : ""}
    </g>
  </g>
</svg>`;
}

/**
 * Tea tin art — occupies ~65-70% of 4/5 tile.
 * viewBox 0 0 800 1100; tin body runs ~180-950.
 */
function renderTeaTinArt(product, styles, motif) {
  const nameLines = wrapText(product.name, 18, 3);
  const originText = escapeXml(product.origin ?? "Artisan Estate");
  const weightText = escapeXml(product.weight ?? "100g");

  const nameSvgLines = nameLines
    .map((line, i) => {
      const y = 500 + i * 32;
      return `<text x="400" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-weight="600" fill="${styles.labelText}">${escapeXml(line)}</text>`;
    })
    .join("\n      ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" fill="none">
  <defs>
    <radialGradient id="shadow-${product.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.22" />
      <stop offset="70%" stop-color="#000000" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="tin-body-${product.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${styles.gradStop}" />
      <stop offset="15%" stop-color="${styles.bodyFill}" />
      <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.18" />
      <stop offset="65%" stop-color="${styles.bodyFill}" />
      <stop offset="100%" stop-color="${styles.gradStop}" />
    </linearGradient>
    <linearGradient id="lid-sheen-${product.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${styles.gradStop}" />
      <stop offset="30%" stop-color="${styles.accentFill}" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.25" />
      <stop offset="75%" stop-color="${styles.accentFill}" />
      <stop offset="100%" stop-color="${styles.gradStop}" />
    </linearGradient>
  </defs>

  <!-- Ground shadow -->
  <ellipse cx="400" cy="960" rx="220" ry="26" fill="url(#shadow-${product.id})" />

  <!-- Tin Cylinder Body (body 250-950, lid+dome 110-250) -->
  <g>
    <rect x="240" y="250" width="320" height="700" rx="18" fill="${styles.bodyFill}" />
    <rect x="240" y="250" width="320" height="700" rx="18" fill="url(#tin-body-${product.id})" />

    <!-- Top Rim Collar -->
    <rect x="234" y="232" width="332" height="28" rx="4" fill="${styles.accentFill}" stroke="${styles.gradStop}" stroke-width="1" />
    <rect x="234" y="232" width="332" height="28" rx="4" fill="url(#lid-sheen-${product.id})" opacity="0.6" />

    <!-- Stepped Lid Dome -->
    <path d="M 244 232 L 260 160 Q 400 148 540 160 L 556 232 Z" fill="${styles.bodyFill}" stroke="${styles.gradStop}" stroke-width="1" />
    <path d="M 244 232 L 260 160 Q 400 148 540 160 L 556 232 Z" fill="url(#tin-body-${product.id})" opacity="0.75" />

    <!-- Lid Knob -->
    <rect x="352" y="136" width="96" height="28" rx="7" fill="${styles.accentFill}" />
    <ellipse cx="400" cy="136" rx="48" ry="9" fill="#FFFFFF" fill-opacity="0.25" />

    <!-- Embossed trim lines -->
    <line x1="240" y1="298" x2="560" y2="298" stroke="${styles.accentFill}" stroke-opacity="0.4" stroke-width="1.5" />
    <line x1="240" y1="890" x2="560" y2="890" stroke="${styles.accentFill}" stroke-opacity="0.4" stroke-width="1.5" />

    <!-- Elegant Label Plate -->
    <g filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))">
      <rect x="268" y="330" width="264" height="440" rx="8" fill="${styles.labelBg}" stroke="${styles.accentFill}" stroke-opacity="0.5" stroke-width="1.5" />
      <rect x="276" y="338" width="248" height="424" rx="5" fill="none" stroke="${styles.accentFill}" stroke-opacity="0.22" stroke-width="1" />

      ${renderMotif(motif, styles, 268, 330, 264, 440)}

      <!-- Wordmark -->
      <text x="400" y="378" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="13" font-weight="700" letter-spacing="4" fill="${styles.labelText}">KILN &amp; LEAF</text>
      <line x1="306" y1="394" x2="494" y2="394" stroke="${styles.accentFill}" stroke-opacity="0.3" stroke-width="1" />

      <!-- Product Name -->
      ${nameSvgLines}

      <line x1="320" y1="612" x2="480" y2="612" stroke="${styles.accentFill}" stroke-opacity="0.3" stroke-width="1" />

      <!-- Origin & Weight -->
      <text x="400" y="648" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="14" font-weight="600" fill="${styles.labelText}">${originText}</text>
      <text x="400" y="672" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="12" font-weight="500" fill="#786F66">Net Wt. ${weightText}</text>
    </g>
  </g>
</svg>`;
}

function renderGiftBoxArt(product, styles) {
  const nameLines = wrapText(product.name, 22, 2);
  const nameSvgLines = nameLines
    .map((line, i) => {
      const y = 526 + i * 32;
      return `<text x="400" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="600" fill="#161412">${escapeXml(line)}</text>`;
    })
    .join("\n      ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" fill="none">
  <defs>
    <radialGradient id="shadow-${product.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.22" />
      <stop offset="70%" stop-color="#000000" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="kraft-box-${product.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D4BC9B" />
      <stop offset="100%" stop-color="#B89C76" />
    </linearGradient>
  </defs>

  <!-- Ground shadow -->
  <ellipse cx="400" cy="900" rx="280" ry="34" fill="url(#shadow-${product.id})" />

  <!-- Box Base -->
  <g>
    <!-- Main Box Body -->
    <rect x="170" y="380" width="460" height="480" rx="10" fill="url(#kraft-box-${product.id})" stroke="#9C805D" stroke-width="1.5" />

    <!-- Box Lid Lip -->
    <rect x="158" y="320" width="484" height="100" rx="12" fill="#E2CCAD" stroke="#9C805D" stroke-width="1.5" />
    <line x1="158" y1="420" x2="642" y2="420" stroke="#000000" stroke-opacity="0.15" stroke-width="3" />

    <!-- Dark Ribbon Band -->
    <rect x="360" y="320" width="80" height="540" fill="#24201D" />
    <line x1="362" y1="320" x2="362" y2="860" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1" />
    <line x1="438" y1="320" x2="438" y2="860" stroke="#000000" stroke-opacity="0.3" stroke-width="1" />

    <!-- Label Seal on Box -->
    <g filter="drop-shadow(0 4px 12px rgba(0,0,0,0.12))">
      <rect x="240" y="450" width="320" height="280" rx="8" fill="#FDFCFA" stroke="#D8CFC4" stroke-width="1.5" />
      <text x="400" y="498" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="14" font-weight="700" letter-spacing="4" fill="#8C3A14">KILN &amp; LEAF</text>
      <text x="400" y="518" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="2" fill="#786F66">LIMITED TASTING RESERVE</text>
      <line x1="280" y1="530" x2="520" y2="530" stroke="#E2DCD0" stroke-width="1" />

      ${nameSvgLines}

      <text x="400" y="688" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="12" font-weight="600" fill="#786F66">Hand-Numbered Boxed Set · 3 × 100g</text>
    </g>
  </g>
</svg>`;
}

/**
 * Gear art — Brew Gear images are NEVER regenerated (guarded at the call site).
 * This function exists for completeness but should never be invoked.
 */
function renderGearArt(product, styles) {
  const kind = product.artKind ?? "generic";
  let illustrationSvg = "";

  if (kind === "kettle") {
    illustrationSvg = `
      <path d="M 280 680 L 520 680 Q 530 520 480 440 L 320 440 Q 270 520 280 680 Z" fill="#2E3238" stroke="#1E2024" stroke-width="3" />
      <path d="M 285 620 C 170 580, 160 380, 290 310 C 275 330, 220 450, 310 590 Z" fill="#2E3238" stroke="#1E2024" stroke-width="2" />
      <path d="M 320 440 L 480 440 L 460 395 L 340 395 Z" fill="#3A3E45" stroke="#1E2024" stroke-width="2" />
      <ellipse cx="400" cy="380" rx="24" ry="14" fill="#9E5D2A" stroke="#7A4218" stroke-width="2" />
      <path d="M 480 460 C 600 470, 620 620, 505 660" fill="none" stroke="#2E3238" stroke-width="24" stroke-linecap="round" />
      <path d="M 480 460 C 600 470, 620 620, 505 660" fill="none" stroke="#9E5D2A" stroke-width="16" stroke-linecap="round" />
    `;
  } else if (kind === "dripper") {
    illustrationSvg = `
      <path d="M 320 540 L 480 540 L 520 720 Q 400 740 280 720 Z" fill="#E8ECEE" fill-opacity="0.35" stroke="#6F7C85" stroke-width="2.5" />
      <path d="M 320 640 L 480 640" stroke="#8C3A14" stroke-opacity="0.5" stroke-width="1.5" stroke-dasharray="8 6" />
      <path d="M 480 570 C 570 580, 570 690, 495 700" fill="none" stroke="#6F7C85" stroke-width="10" stroke-linecap="round" />
      <path d="M 250 360 L 550 360 L 440 520 L 360 520 Z" fill="#FDFCFA" stroke="#D0C7BC" stroke-width="3" />
      <ellipse cx="400" cy="360" rx="150" ry="24" fill="#EDE6DC" stroke="#D0C7BC" stroke-width="2" />
      <line x1="330" y1="380" x2="380" y2="500" stroke="#D0C7BC" stroke-width="2" />
      <line x1="400" y1="384" x2="400" y2="510" stroke="#D0C7BC" stroke-width="2" />
      <line x1="470" y1="380" x2="420" y2="500" stroke="#D0C7BC" stroke-width="2" />
    `;
  } else if (kind === "grinder") {
    illustrationSvg = `
      <rect x="330" y="320" width="140" height="420" rx="12" fill="#2A2C30" stroke="#1C1D20" stroke-width="3" />
      <rect x="328" y="440" width="144" height="150" fill="#3D4148" />
      <line x1="328" y1="470" x2="472" y2="470" stroke="#25272B" stroke-width="2" />
      <line x1="328" y1="500" x2="472" y2="500" stroke="#25272B" stroke-width="2" />
      <line x1="328" y1="530" x2="472" y2="530" stroke="#25272B" stroke-width="2" />
      <line x1="328" y1="560" x2="472" y2="560" stroke="#25272B" stroke-width="2" />
      <rect x="340" y="295" width="120" height="25" rx="4" fill="#5A5F6B" />
      <rect x="390" y="240" width="20" height="60" fill="#888E9B" />
      <path d="M 400 240 C 490 220, 550 260, 580 320" fill="none" stroke="#888E9B" stroke-width="12" stroke-linecap="round" />
      <ellipse cx="580" cy="320" rx="18" ry="26" fill="#9E5D2A" stroke="#7A4218" stroke-width="2" />
    `;
  } else if (kind === "scale") {
    illustrationSvg = `
      <rect x="220" y="520" width="360" height="180" rx="18" fill="#24262A" stroke="#161719" stroke-width="3" />
      <rect x="240" y="535" width="320" height="110" rx="10" fill="#343840" stroke="#222428" stroke-width="1.5" />
      <rect x="300" y="655" width="200" height="32" rx="4" fill="#141517" />
      <text x="350" y="677" text-anchor="middle" font-family="monospace" font-size="16" font-weight="700" fill="#C59B27">02:14</text>
      <text x="450" y="677" text-anchor="middle" font-family="monospace" font-size="16" font-weight="700" fill="#E8ECEE">345.8 g</text>
      <circle cx="260" cy="671" r="7" fill="#C59B27" opacity="0.8" />
    `;
  } else {
    illustrationSvg = `
      <ellipse cx="400" cy="680" rx="180" ry="34" fill="#E2DDD5" stroke="#C8C0B4" stroke-width="2" />
      <path d="M 280 480 Q 280 650 400 650 Q 520 650 520 480 Z" fill="#FBF8F2" stroke="#D8D0C4" stroke-width="3" />
      <ellipse cx="400" cy="480" rx="120" ry="30" fill="#4A2818" stroke="#D8D0C4" stroke-width="2" />
      <path d="M 515 510 C 580 520, 580 610, 505 620" fill="none" stroke="#D8D0C4" stroke-width="14" stroke-linecap="round" />
    `;
  }

  void styles;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" fill="none">
  <defs>
    <radialGradient id="shadow-${product.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.18" />
      <stop offset="70%" stop-color="#000000" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Ground shadow -->
  <ellipse cx="400" cy="870" rx="220" ry="26" fill="url(#shadow-${product.id})" />

  <!-- Gear Illustration (No brand text on gear) -->
  <g id="gear-illustration">
    ${illustrationSvg}
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// Notes card — shared across all non-gear categories
// ---------------------------------------------------------------------------

function renderNotesCard(product) {
  const cat = product.category;
  const nameLines = wrapText(product.name, 22, 3);
  const notes = product.tastingNotes ?? [];
  const recipe = escapeXml(product.brewRecipe ?? "Standard extraction recommended");
  const origin = escapeXml(product.origin ?? "Artisan roastery batch");
  const weight = escapeXml(product.weight ?? "250g");

  const nameSvgLines = nameLines
    .map((line, i) => {
      const y = 260 + i * 36;
      return `<text x="400" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-weight="600" fill="#161412">${escapeXml(line)}</text>`;
    })
    .join("\n      ");

  const notePills = notes
    .slice(0, 4)
    .map((n, i) => {
      return `
      <g transform="translate(${148 + i * 130}, 468)">
        <rect x="0" y="0" width="118" height="38" rx="19" fill="#F4EFE6" stroke="#E2DCD0" stroke-width="1.5" />
        <text x="59" y="24" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="13" font-weight="600" fill="#4E473F">${escapeXml(n)}</text>
      </g>`;
    })
    .join("\n");

  const isCoffee = cat === "single" || cat === "blends";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none">
  <defs>
    <filter id="card-shadow-${product.id}" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Archival Tasting Card Background -->
  <g filter="url(#card-shadow-${product.id})">
    <rect x="100" y="80" width="600" height="840" rx="16" fill="#FDFCFA" stroke="#E2DCD0" stroke-width="2" />
    <rect x="116" y="96" width="568" height="808" rx="12" fill="none" stroke="#EAE4D8" stroke-width="1" />

    <!-- Card Header -->
    <text x="400" y="152" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="14" font-weight="700" letter-spacing="4" fill="#8C3A14">KILN &amp; LEAF</text>
    <text x="400" y="174" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="2" fill="#786F66">CUPPING ARCHIVE &amp; TASTING CARD</text>
    <line x1="180" y1="192" x2="620" y2="192" stroke="#E2DCD0" stroke-width="1" />

    <!-- Product Title -->
    ${nameSvgLines}

    <!-- Origin & Specs Bar -->
    <rect x="160" y="358" width="480" height="46" rx="6" fill="#F7F4EE" />
    <text x="190" y="386" font-family="-apple-system, system-ui, sans-serif" font-size="13" font-weight="600" fill="#4E473F">ORIGIN: ${origin}</text>
    <text x="610" y="386" text-anchor="end" font-family="-apple-system, system-ui, sans-serif" font-size="13" font-weight="600" fill="#786F66">${weight}</text>

    <!-- Tasting Notes Section -->
    <text x="400" y="448" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="#786F66">CURATED FLAVOR PROFILE</text>
    ${notePills}

    <line x1="160" y1="558" x2="640" y2="558" stroke="#E2DCD0" stroke-width="1" />

    ${isCoffee ? `
    <!-- Roast Meter Block -->
    <text x="400" y="598" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="#786F66">ROAST LEVEL (${product.roast ?? 3} / 5)</text>
    <g transform="translate(0, 10)">
      ${renderRoastDots(product.roast ?? 3, 400, 626)}
    </g>
    ` : `
    <!-- Category Block -->
    <text x="400" y="598" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="#786F66">CATEGORY: ${cat.toUpperCase()}</text>
    <text x="400" y="630" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="14" font-weight="500" fill="#4E473F">Curated harvest &amp; estate selection</text>
    `}

    <line x1="160" y1="672" x2="640" y2="672" stroke="#E2DCD0" stroke-width="1" />

    <!-- Brew Recipe Block -->
    <text x="400" y="712" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="#786F66">BREW &amp; EXTRACTION RECIPE</text>
    <rect x="160" y="730" width="480" height="60" rx="8" fill="#F7F4EE" stroke="#E2DCD0" stroke-width="1" />
    <text x="400" y="766" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="14" font-style="italic" fill="#161412">${recipe}</text>

    <!-- Bottom seal -->
    <text x="400" y="852" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="10" letter-spacing="2" fill="#786F66">AUTHENTIC SPECIALTY GRADE · DIRECT ROASTER SELECTION</text>
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// Category tile tint tokens (CSS-side definitions in styles.ts)
// These are printed as a reference table for the dev to verify.
// ---------------------------------------------------------------------------
const TILE_TINT_MAP = {
  single: "bg-[#f0e9df]",   // warm tan — visibly distinct from paper (#f7f4ee)
  blends: "bg-[#e8e1d4]",   // deeper warm grey — clearly distinguishable
  tea:    "bg-[#e6ede5]",   // muted sage green
  gear:   "bg-[#e8eaed]",   // cool grey
  "gift-box": "bg-[#f0e4d6]", // warm peach-kraft
};

// ---------------------------------------------------------------------------
// Main generation loop
// ---------------------------------------------------------------------------

console.log("\n========================================================");
console.log("KILN & LEAF: Generating Product Packaging Art v2");
console.log("========================================================\n");

// Separate gear products (skipped) from non-gear (regenerated)
const nonGearProducts = products.filter((p) => p.category !== "gear");
const gearProducts = products.filter((p) => p.category === "gear");

// Build combination table with uniqueness validation for non-gear products
const combos = buildCombinations(nonGearProducts);

// Print combination table
console.log("| ID | Category | Palette | Motif |");
console.log("|---|---|---|---|");
for (const { product, palette, motif } of combos) {
  console.log(`| ${product.id.padEnd(64)} | ${product.category.padEnd(8)} | ${palette.padEnd(12)} | ${motif} |`);
}

console.log(`\nBrew Gear products (SKIPPED — images preserved):`);
for (const p of gearProducts) {
  console.log(`  • ${p.id}`);
}

// Generate SVGs for non-gear products
let allValid = true;
for (const { product, palette, motif } of combos) {
  const styles = PALETTES[palette];
  let frontSvg = "";

  if (product.artKind === "gift-box" || product.id.includes("reserve-limited") || product.id.includes("gift-box")) {
    frontSvg = renderGiftBoxArt(product, styles);
  } else if (product.category === "tea") {
    frontSvg = renderTeaTinArt(product, styles, motif);
  } else {
    // coffee: single or blends
    frontSvg = renderPouchArt(product, styles, motif);
  }

  const notesSvg = renderNotesCard(product);

  const frontFile = path.join(outDir, `${product.id}.svg`);
  const notesFile = path.join(outDir, `${product.id}-notes.svg`);

  fs.writeFileSync(frontFile, frontSvg, "utf-8");
  fs.writeFileSync(notesFile, notesSvg, "utf-8");
}

// Validate all products have both files
for (const product of products) {
  // Gear: check files exist (they should, preserved from before)
  const p1 = path.join(outDir, `${product.id}.svg`);
  // Gear products may use .jpg, so only validate SVG-based products
  if (product.image.endsWith(".svg")) {
    const p2 = path.join(outDir, `${product.id}-notes.svg`);
    if (!fs.existsSync(p1) || !fs.existsSync(p2)) {
      console.error(`Validation failed for: ${product.id}`);
      allValid = false;
    }
  }
}

if (allValid) {
  console.log(`\nAll non-gear products regenerated successfully!`);
  console.log(`\nTile tint reference (update src/lib/styles.ts if needed):`);
  for (const [cat, cls] of Object.entries(TILE_TINT_MAP)) {
    console.log(`  ${cat.padEnd(12)} → ${cls}`);
  }
} else {
  process.exit(1);
}
