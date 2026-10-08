/**
 * scripts/generate-product-art.mjs
 * Plain Node ESM, zero runtime dependencies.
 * Reads src/data/products.json and writes:
 *   - public/images/products/<id>.svg (front view)
 *   - public/images/products/<id>-notes.svg (tasting notes archival card)
 *
 * Packaging by category:
 *   - Single Origin Coffee: flat-bottom pouch (light=sand, medium=terracotta, dark=charcoal)
 *   - Blends: cream pouch with colored accent band
 *   - Tea: cylindrical tin (green=forest, black=deep bronze/brown, oolong=muted teal, spiced=saffron)
 *   - Brew Gear: flat minimalist illustrations by artKind (no brand text)
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

function escapeXml(unsafe) {
  return String(unsafe ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text, maxChars = 22, maxLines = 3) {
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
        break;
      }
    }
  }

  if (current && lines.length < maxLines) {
    const remainingWords = words.slice(words.indexOf(current.split(" ")[0]) + current.split(" ").length);
    if (remainingWords.length > 0 && lines.length === maxLines - 1) {
      current += " " + remainingWords.join(" ");
      if (current.length > maxChars + 3) {
        current = current.slice(0, maxChars) + "…";
      }
    }
    lines.push(current);
  }

  return lines;
}

/**
 * Returns { packaging, colorName, bodyFill, gradStop, accentFill, labelBg, labelText }
 */
function getArtStyles(product) {
  const cat = product.category;
  const roast = product.roast ?? 3;
  const id = product.id;

  if (product.artKind === "gift-box" || id.includes("gift-box") || id.includes("reserve-limited")) {
    return {
      packaging: "Gift Box",
      colorName: "Warm Kraft & Charcoal",
      bodyFill: "#C8AE8D",
      gradStop: "#B59976",
      accentFill: "#24201D",
      labelBg: "#FAF6EE",
      labelText: "#161412",
      textColor: "#FAF6EE",
    };
  }

  if (cat === "gear") {
    return {
      packaging: `Gear (${product.artKind ?? "gear"})`,
      colorName: "Brushed Steel & Matte Slate",
      bodyFill: "#363A40",
      gradStop: "#26282D",
      accentFill: "#C59B27",
      labelBg: "#EDEBE6",
      labelText: "#161412",
      textColor: "#FAF6EE",
    };
  }

  if (cat === "tea") {
    // Determine tea color
    const isGreen = id.includes("sencha") || id.includes("genmaicha") || id.includes("green");
    const isOolong = id.includes("oolong") || id.includes("alishan");
    const isSpiced = id.includes("kahwa") || id.includes("smoked") || id.includes("chai");
    
    if (isGreen) {
      return {
        packaging: "Cylindrical Tin",
        colorName: "Forest Green",
        bodyFill: "#284436",
        gradStop: "#1B3026",
        accentFill: "#C49A45",
        labelBg: "#F7F4EC",
        labelText: "#1B3026",
        textColor: "#EAF2EC",
      };
    }
    if (isOolong) {
      return {
        packaging: "Cylindrical Tin",
        colorName: "Muted Teal",
        bodyFill: "#2C484D",
        gradStop: "#1C3236",
        accentFill: "#D4AF37",
        labelBg: "#F6F5ED",
        labelText: "#1C3236",
        textColor: "#E6F0F2",
      };
    }
    if (isSpiced) {
      return {
        packaging: "Cylindrical Tin",
        colorName: "Saffron Spiced",
        bodyFill: "#B86624",
        gradStop: "#8E4A13",
        accentFill: "#24180E",
        labelBg: "#FDF8EE",
        labelText: "#3A1E0B",
        textColor: "#FFF7ED",
      };
    }
    // Default black tea (Darjeeling, Assam)
    return {
      packaging: "Cylindrical Tin",
      colorName: "Deep Bronze Brown",
      bodyFill: "#422B1E",
      gradStop: "#2A1910",
      accentFill: "#C89547",
      labelBg: "#FAF6EE",
      labelText: "#2A1910",
      textColor: "#F7EFE6",
    };
  }

  if (cat === "blends") {
    return {
      packaging: "Cream Pouch w/ Band",
      colorName: "Ivory Cream & Terracotta",
      bodyFill: "#F4EFE6",
      gradStop: "#E5DDD0",
      accentFill: "#8C3A14",
      labelBg: "#FAF7F0",
      labelText: "#161412",
      textColor: "#161412",
    };
  }

  // Single Origin Coffee
  if (roast <= 1) {
    return {
      packaging: "Flat-Bottom Pouch",
      colorName: "Warm Sand / Kraft (Light Roast)",
      bodyFill: "#D9C6A5",
      gradStop: "#C4AD89",
      accentFill: "#8C3A14",
      labelBg: "#FCFAF5",
      labelText: "#161412",
      textColor: "#2B2117",
    };
  }
  if (roast >= 4) {
    return {
      packaging: "Flat-Bottom Pouch",
      colorName: "Charcoal Slate (Dark Roast)",
      bodyFill: "#2B2927",
      gradStop: "#1B1918",
      accentFill: "#D48B47",
      labelBg: "#F7F4EE",
      labelText: "#161412",
      textColor: "#FAF6EE",
    };
  }
  // Medium roast (2, 3)
  return {
    packaging: "Flat-Bottom Pouch",
    colorName: "Terracotta (Medium Roast)",
    bodyFill: "#A44C26",
    gradStop: "#7D3516",
    accentFill: "#E8A374",
    labelBg: "#FCFAF6",
    labelText: "#161412",
    textColor: "#FAF6EE",
  };
}

function renderRoastDots(roastLevel, cx, cy) {
  const dots = [];
  const startX = cx - 36;
  for (let i = 1; i <= 5; i++) {
    const x = startX + (i - 1) * 18;
    const filled = i <= roastLevel;
    dots.push(`
      <circle cx="${x}" cy="${cy}" r="4.5" fill="${filled ? "#8C3A14" : "none"}" stroke="#8C3A14" stroke-width="1.5" />
    `);
  }
  return dots.join("");
}

function renderPouchArt(product, styles) {
  const nameLines = wrapText(product.name, 19, 3);
  const originText = escapeXml(product.origin ?? "Specialty Roastery");
  const weightText = escapeXml(product.weight ?? "250g");
  const isBlend = product.category === "blends";

  const nameSvgLines = nameLines
    .map((line, i) => {
      const y = 432 + i * 26;
      return `<text x="400" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="600" fill="#161412">${escapeXml(line)}</text>`;
    })
    .join("\n      ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none">
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
  <ellipse cx="400" cy="855" rx="230" ry="28" fill="url(#shadow-${product.id})" />

  <!-- Pouch Body -->
  <g>
    <!-- Back gusset fold hint -->
    <path d="M 235 220 L 565 220 L 585 790 Q 400 812 215 790 Z" fill="${styles.gradStop}" opacity="0.6" />

    <!-- Main pouch front -->
    <path d="M 240 220 L 560 220 Q 580 320 575 780 Q 400 812 225 780 Q 220 320 240 220 Z" fill="url(#pouch-body-${product.id})" />

    <!-- Side crease highlights -->
    <path d="M 240 220 L 255 785" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="2" />
    <path d="M 560 220 L 545 785" stroke="#000000" stroke-opacity="0.22" stroke-width="2" />

    <!-- Top seal / zipper band -->
    <rect x="236" y="170" width="328" height="52" rx="4" fill="${styles.bodyFill}" stroke="${styles.gradStop}" stroke-width="1.5" />
    <rect x="236" y="170" width="328" height="52" rx="4" fill="url(#top-seal-${product.id})" />
    <line x1="244" y1="192" x2="556" y2="192" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 3" />
    <line x1="244" y1="202" x2="556" y2="202" stroke="#000000" stroke-opacity="0.2" stroke-width="1" />

    <!-- Tear notches -->
    <path d="M 236 195 L 246 190 L 246 200 Z" fill="#FFFFFF" fill-opacity="0.4" />
    <path d="M 564 195 L 554 190 L 554 200 Z" fill="#000000" fill-opacity="0.3" />

    ${isBlend ? `
    <!-- Blend Accent Band -->
    <rect x="230" y="320" width="340" height="14" fill="${styles.accentFill}" opacity="0.9" />
    <rect x="230" y="700" width="340" height="4" fill="${styles.accentFill}" opacity="0.8" />
    ` : ""}

    <!-- One-way degassing valve -->
    <circle cx="400" cy="272" r="14" fill="#000000" fill-opacity="0.12" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1" />
    <circle cx="400" cy="272" r="4" fill="#000000" fill-opacity="0.25" />
    <circle cx="395" cy="272" r="1.5" fill="#FFFFFF" fill-opacity="0.4" />
    <circle cx="405" cy="272" r="1.5" fill="#FFFFFF" fill-opacity="0.4" />

    <!-- Label Sticker -->
    <g filter="drop-shadow(0 4px 12px rgba(0,0,0,0.08))">
      <rect x="268" y="324" width="264" height="376" rx="6" fill="${styles.labelBg}" stroke="#E2DCD0" stroke-width="1.5" />
      
      <!-- Wordmark -->
      <text x="400" y="364" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="11" font-weight="700" letter-spacing="4" fill="#8C3A14">KILN &amp; LEAF</text>
      <text x="400" y="380" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="8.5" font-weight="600" letter-spacing="2" fill="#786F66">ROASTERY · ARTISAN LOT</text>
      <line x1="308" y1="394" x2="492" y2="394" stroke="#E2DCD0" stroke-width="1" />

      <!-- Product Name -->
      ${nameSvgLines}

      <line x1="330" y1="532" x2="470" y2="532" stroke="#E2DCD0" stroke-width="1" />

      <!-- Origin & Details -->
      <text x="400" y="562" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="600" fill="#4E473F">${originText}</text>
      <text x="400" y="582" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="10.5" font-weight="500" fill="#786F66">Whole Bean · ${weightText}</text>

      <!-- Roast dots -->
      <g transform="translate(0, 16)">
        <text x="400" y="612" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="8.5" font-weight="600" letter-spacing="1.5" fill="#786F66">ROAST PROFILE</text>
        ${renderRoastDots(product.roast ?? 3, 400, 630)}
      </g>
    </g>
  </g>
</svg>`;
}

function renderTeaTinArt(product, styles) {
  const nameLines = wrapText(product.name, 18, 3);
  const originText = escapeXml(product.origin ?? "Artisan Estate");
  const weightText = escapeXml(product.weight ?? "100g");

  const nameSvgLines = nameLines
    .map((line, i) => {
      const y = 464 + i * 26;
      return `<text x="400" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="600" fill="${styles.labelText}">${escapeXml(line)}</text>`;
    })
    .join("\n      ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none">
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
  <ellipse cx="400" cy="850" rx="210" ry="26" fill="url(#shadow-${product.id})" />

  <!-- Tin Cylinder Body -->
  <g>
    <!-- Base Body -->
    <rect x="250" y="270" width="300" height="530" rx="16" fill="${styles.bodyFill}" />
    <rect x="250" y="270" width="300" height="530" rx="16" fill="url(#tin-body-${product.id})" />

    <!-- Top Rim Collar -->
    <rect x="246" y="254" width="308" height="26" rx="4" fill="${styles.accentFill}" stroke="${styles.gradStop}" stroke-width="1" />
    <rect x="246" y="254" width="308" height="26" rx="4" fill="url(#lid-sheen-${product.id})" opacity="0.6" />

    <!-- Stepped Lid Dome -->
    <path d="M 256 254 L 270 190 Q 400 178 530 190 L 544 254 Z" fill="${styles.bodyFill}" stroke="${styles.gradStop}" stroke-width="1" />
    <path d="M 256 254 L 270 190 Q 400 178 530 190 L 544 254 Z" fill="url(#tin-body-${product.id})" opacity="0.75" />

    <!-- Lid Knob -->
    <rect x="360" y="166" width="80" height="26" rx="6" fill="${styles.accentFill}" />
    <ellipse cx="400" cy="166" rx="40" ry="8" fill="#FFFFFF" fill-opacity="0.25" />

    <!-- Embossed Gold/Copper Trim Lines -->
    <line x1="250" y1="310" x2="550" y2="310" stroke="${styles.accentFill}" stroke-opacity="0.4" stroke-width="1.5" />
    <line x1="250" y1="750" x2="550" y2="750" stroke="${styles.accentFill}" stroke-opacity="0.4" stroke-width="1.5" />

    <!-- Elegant Label Plate -->
    <g filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))">
      <rect x="278" y="340" width="244" height="370" rx="8" fill="${styles.labelBg}" stroke="${styles.accentFill}" stroke-opacity="0.5" stroke-width="1.5" />
      <rect x="284" y="346" width="232" height="358" rx="5" fill="none" stroke="${styles.accentFill}" stroke-opacity="0.25" stroke-width="1" />

      <!-- Wordmark -->
      <text x="400" y="390" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="11" font-weight="700" letter-spacing="4" fill="${styles.labelText}">KILN &amp; LEAF</text>
      <text x="400" y="408" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="8.5" font-weight="600" letter-spacing="2" fill="#786F66">HERITAGE TEA CANISTER</text>
      <line x1="316" y1="422" x2="484" y2="422" stroke="${styles.accentFill}" stroke-opacity="0.3" stroke-width="1" />

      <!-- Product Name -->
      ${nameSvgLines}

      <line x1="334" y1="568" x2="466" y2="568" stroke="${styles.accentFill}" stroke-opacity="0.3" stroke-width="1" />

      <!-- Origin & Details -->
      <text x="400" y="602" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="11.5" font-weight="600" fill="${styles.labelText}">${originText}</text>
      <text x="400" y="624" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="10" font-weight="500" fill="#786F66">Single Estate · Net Wt. ${weightText}</text>
      
      <circle cx="400" cy="656" r="4" fill="${styles.accentFill}" opacity="0.7" />
    </g>
  </g>
</svg>`;
}

function renderGiftBoxArt(product, styles) {
  const nameLines = wrapText(product.name, 22, 2);
  const nameSvgLines = nameLines
    .map((line, i) => {
      const y = 520 + i * 26;
      return `<text x="400" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-weight="600" fill="#161412">${escapeXml(line)}</text>`;
    })
    .join("\n      ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none">
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
  <ellipse cx="400" cy="810" rx="270" ry="32" fill="url(#shadow-${product.id})" />

  <!-- Box Base -->
  <g>
    <!-- Main Box Body -->
    <rect x="180" y="340" width="440" height="430" rx="10" fill="url(#kraft-box-${product.id})" stroke="#9C805D" stroke-width="1.5" />
    
    <!-- Box Lid Lip -->
    <rect x="170" y="290" width="460" height="90" rx="12" fill="#E2CCAD" stroke="#9C805D" stroke-width="1.5" />
    <line x1="170" y1="380" x2="630" y2="380" stroke="#000000" stroke-opacity="0.15" stroke-width="3" />

    <!-- Dark Ribbon Band -->
    <rect x="360" y="290" width="80" height="480" fill="#24201D" />
    <line x1="362" y1="290" x2="362" y2="770" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1" />
    <line x1="438" y1="290" x2="438" y2="770" stroke="#000000" stroke-opacity="0.3" stroke-width="1" />

    <!-- Label Seal on Box -->
    <g filter="drop-shadow(0 4px 12px rgba(0,0,0,0.12))">
      <rect x="250" y="420" width="300" height="240" rx="8" fill="#FDFCFA" stroke="#D8CFC4" stroke-width="1.5" />
      <text x="400" y="465" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="12" font-weight="700" letter-spacing="4" fill="#8C3A14">KILN &amp; LEAF</text>
      <text x="400" y="485" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="9" font-weight="600" letter-spacing="2" fill="#786F66">LIMITED TASTING RESERVE</text>
      <line x1="290" y1="498" x2="510" y2="498" stroke="#E2DCD0" stroke-width="1" />
      
      ${nameSvgLines}

      <text x="400" y="612" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="600" fill="#786F66">Hand-Numbered Boxed Set · 3 × 100g</text>
    </g>
  </g>
</svg>`;
}

function renderGearArt(product, styles) {
  const kind = product.artKind ?? "generic";

  let illustrationSvg = "";

  if (kind === "kettle") {
    // Gooseneck kettle
    illustrationSvg = `
      <!-- Kettle base & body -->
      <path d="M 280 680 L 520 680 Q 530 520 480 440 L 320 440 Q 270 520 280 680 Z" fill="#2E3238" stroke="#1E2024" stroke-width="3" />
      <!-- Gooseneck Spout -->
      <path d="M 285 620 C 170 580, 160 380, 290 310 C 275 330, 220 450, 310 590 Z" fill="#2E3238" stroke="#1E2024" stroke-width="2" />
      <!-- Lid & Wooden Knob -->
      <path d="M 320 440 L 480 440 L 460 395 L 340 395 Z" fill="#3A3E45" stroke="#1E2024" stroke-width="2" />
      <ellipse cx="400" cy="380" rx="24" ry="14" fill="#9E5D2A" stroke="#7A4218" stroke-width="2" />
      <!-- Ergonomic Handle -->
      <path d="M 480 460 C 600 470, 620 620, 505 660" fill="none" stroke="#2E3238" stroke-width="24" stroke-linecap="round" />
      <path d="M 480 460 C 600 470, 620 620, 505 660" fill="none" stroke="#9E5D2A" stroke-width="16" stroke-linecap="round" />
    `;
  } else if (kind === "dripper") {
    // Ceramic dripper on glass server
    illustrationSvg = `
      <!-- Glass server carafe -->
      <path d="M 320 540 L 480 540 L 520 720 Q 400 740 280 720 Z" fill="#E8ECEE" fill-opacity="0.35" stroke="#6F7C85" stroke-width="2.5" />
      <path d="M 320 640 L 480 640" stroke="#8C3A14" stroke-opacity="0.5" stroke-width="1.5" stroke-dasharray="8 6" />
      <path d="M 480 570 C 570 580, 570 690, 495 700" fill="none" stroke="#6F7C85" stroke-width="10" stroke-linecap="round" />
      <!-- Ceramic Dripper Cone -->
      <path d="M 250 360 L 550 360 L 440 520 L 360 520 Z" fill="#FDFCFA" stroke="#D0C7BC" stroke-width="3" />
      <!-- Dripper rim & ribs -->
      <ellipse cx="400" cy="360" rx="150" ry="24" fill="#EDE6DC" stroke="#D0C7BC" stroke-width="2" />
      <line x1="330" y1="380" x2="380" y2="500" stroke="#D0C7BC" stroke-width="2" />
      <line x1="400" y1="384" x2="400" y2="510" stroke="#D0C7BC" stroke-width="2" />
      <line x1="470" y1="380" x2="420" y2="500" stroke="#D0C7BC" stroke-width="2" />
    `;
  } else if (kind === "grinder") {
    // Hand grinder
    illustrationSvg = `
      <!-- Cylindrical body -->
      <rect x="330" y="320" width="140" height="420" rx="12" fill="#2A2C30" stroke="#1C1D20" stroke-width="3" />
      <!-- Textured silicone grip band -->
      <rect x="328" y="440" width="144" height="150" fill="#3D4148" />
      <line x1="328" y1="470" x2="472" y2="470" stroke="#25272B" stroke-width="2" />
      <line x1="328" y1="500" x2="472" y2="500" stroke="#25272B" stroke-width="2" />
      <line x1="328" y1="530" x2="472" y2="530" stroke="#25272B" stroke-width="2" />
      <line x1="328" y1="560" x2="472" y2="560" stroke="#25272B" stroke-width="2" />
      <!-- Top lid & crank handle -->
      <rect x="340" y="295" width="120" height="25" rx="4" fill="#5A5F6B" />
      <rect x="390" y="240" width="20" height="60" fill="#888E9B" />
      <path d="M 400 240 C 490 220, 550 260, 580 320" fill="none" stroke="#888E9B" stroke-width="12" stroke-linecap="round" />
      <ellipse cx="580" cy="320" rx="18" ry="26" fill="#9E5D2A" stroke="#7A4218" stroke-width="2" />
    `;
  } else if (kind === "scale") {
    // Brew scale
    illustrationSvg = `
      <!-- Ultra-thin body -->
      <rect x="220" y="520" width="360" height="180" rx="18" fill="#24262A" stroke="#161719" stroke-width="3" />
      <!-- Weighing platform plate -->
      <rect x="240" y="535" width="320" height="110" rx="10" fill="#343840" stroke="#222428" stroke-width="1.5" />
      <!-- Illuminated LED readout -->
      <rect x="300" y="655" width="200" height="32" rx="4" fill="#141517" />
      <text x="350" y="677" text-anchor="middle" font-family="monospace" font-size="16" font-weight="700" fill="#C59B27">02:14</text>
      <text x="450" y="677" text-anchor="middle" font-family="monospace" font-size="16" font-weight="700" fill="#E8ECEE">345.8 g</text>
      <circle cx="260" cy="671" r="7" fill="#C59B27" opacity="0.8" />
    `;
  } else {
    // Generic coffee gear
    illustrationSvg = `
      <ellipse cx="400" cy="680" rx="180" ry="34" fill="#E2DDD5" stroke="#C8C0B4" stroke-width="2" />
      <path d="M 280 480 Q 280 650 400 650 Q 520 650 520 480 Z" fill="#FBF8F2" stroke="#D8D0C4" stroke-width="3" />
      <ellipse cx="400" cy="480" rx="120" ry="30" fill="#4A2818" stroke="#D8D0C4" stroke-width="2" />
      <path d="M 515 510 C 580 520, 580 610, 505 620" fill="none" stroke="#D8D0C4" stroke-width="14" stroke-linecap="round" />
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" fill="none">
  <defs>
    <radialGradient id="shadow-${product.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.18" />
      <stop offset="70%" stop-color="#000000" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Ground shadow -->
  <ellipse cx="400" cy="800" rx="220" ry="26" fill="url(#shadow-${product.id})" />

  <!-- Gear Illustration (No brand text on gear) -->
  <g id="gear-illustration">
    ${illustrationSvg}
  </g>
</svg>`;
}

function renderNotesCard(product) {
  const cat = product.category;
  const nameLines = wrapText(product.name, 22, 3);
  const notes = product.tastingNotes ?? [];
  const recipe = escapeXml(product.brewRecipe ?? "Standard extraction recommended");
  const origin = escapeXml(product.origin ?? "Artisan roastery batch");
  const weight = escapeXml(product.weight ?? "250g");

  const nameSvgLines = nameLines
    .map((line, i) => {
      const y = 250 + i * 30;
      return `<text x="400" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="25" font-weight="600" fill="#161412">${escapeXml(line)}</text>`;
    })
    .join("\n      ");

  // Render tasting notes pills
  const notePills = notes
    .slice(0, 4)
    .map((n, i) => {
      const x = 200 + i * 110;
      return `
      <g transform="translate(${160 + i * 125}, 460)">
        <rect x="0" y="0" width="112" height="34" rx="17" fill="#F4EFE6" stroke="#E2DCD0" stroke-width="1.5" />
        <text x="56" y="21" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="11" font-weight="600" fill="#4E473F">${escapeXml(n)}</text>
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
    <rect x="120" y="90" width="560" height="820" rx="16" fill="#FDFCFA" stroke="#E2DCD0" stroke-width="2" />
    <rect x="136" y="106" width="528" height="788" rx="12" fill="none" stroke="#EAE4D8" stroke-width="1" />

    <!-- Card Header -->
    <text x="400" y="160" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="13" font-weight="700" letter-spacing="4" fill="#8C3A14">KILN &amp; LEAF</text>
    <text x="400" y="180" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="9" font-weight="600" letter-spacing="2" fill="#786F66">CUPPING ARCHIVE &amp; TASTING CARD</text>
    <line x1="200" y1="198" x2="600" y2="198" stroke="#E2DCD0" stroke-width="1" />

    <!-- Product Title -->
    ${nameSvgLines}

    <!-- Origin & Specs Bar -->
    <rect x="180" y="340" width="440" height="42" rx="6" fill="#F7F4EE" />
    <text x="210" y="366" font-family="-apple-system, system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#4E473F">ORIGIN: ${origin}</text>
    <text x="590" y="366" text-anchor="end" font-family="-apple-system, system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#786F66">${weight}</text>

    <!-- Tasting Notes Section -->
    <text x="400" y="434" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="9.5" font-weight="700" letter-spacing="2" fill="#786F66">CURATED FLAVOR PROFILE</text>
    ${notePills}

    <line x1="180" y1="540" x2="620" y2="540" stroke="#E2DCD0" stroke-width="1" />

    ${isCoffee ? `
    <!-- Roast Meter Block -->
    <text x="400" y="580" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="9.5" font-weight="700" letter-spacing="2" fill="#786F66">ROAST LEVEL (${product.roast ?? 3} / 5)</text>
    <g transform="translate(0, 10)">
      ${renderRoastDots(product.roast ?? 3, 400, 606)}
    </g>
    ` : `
    <!-- Category Block -->
    <text x="400" y="580" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="9.5" font-weight="700" letter-spacing="2" fill="#786F66">CATEGORY: ${cat.toUpperCase()}</text>
    <text x="400" y="612" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="12" font-weight="500" fill="#4E473F">Curated harvest &amp; equipment</text>
    `}

    <line x1="180" y1="656" x2="620" y2="656" stroke="#E2DCD0" stroke-width="1" />

    <!-- Brew Recipe Block -->
    <text x="400" y="694" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="9.5" font-weight="700" letter-spacing="2" fill="#786F66">BREW &amp; EXTRACTION RECIPE</text>
    <rect x="180" y="714" width="440" height="54" rx="8" fill="#F7F4EE" stroke="#E2DCD0" stroke-width="1" />
    <text x="400" y="746" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="13" font-style="italic" fill="#161412">${recipe}</text>

    <!-- Bottom seal -->
    <text x="400" y="830" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="8.5" letter-spacing="2" fill="#786F66">AUTHENTIC SPECIALTY GRADE · DIRECT ROASTER SELECTION</text>
  </g>
</svg>`;
}

console.log("\n========================================================");
console.log("KILN & LEAF: Generating Product Packaging Art & Cards");
console.log("========================================================\n");

const tableRows = [];

for (const product of products) {
  const styles = getArtStyles(product);
  let frontSvg = "";

  if (styles.packaging === "Gift Box") {
    frontSvg = renderGiftBoxArt(product, styles);
  } else if (product.category === "gear") {
    frontSvg = renderGearArt(product, styles);
  } else if (product.category === "tea") {
    frontSvg = renderTeaTinArt(product, styles);
  } else {
    // Coffee pouch (single origin or blends)
    frontSvg = renderPouchArt(product, styles);
  }

  const notesSvg = renderNotesCard(product);

  const frontFile = `${product.id}.svg`;
  const notesFile = `${product.id}-notes.svg`;

  fs.writeFileSync(path.join(outDir, frontFile), frontSvg, "utf-8");
  fs.writeFileSync(path.join(outDir, notesFile), notesSvg, "utf-8");

  tableRows.push({
    id: product.id,
    packaging: styles.packaging,
    color: styles.colorName,
  });
}

// Print summary table
console.log("| ID | Packaging Type | Color Tone |");
console.log("|---|---|---|");
for (const row of tableRows) {
  console.log(`| ${row.id.padEnd(28)} | ${row.packaging.padEnd(24)} | ${row.color} |`);
}

// Validate that every product has both files
let allValid = true;
for (const product of products) {
  const p1 = path.join(outDir, `${product.id}.svg`);
  const p2 = path.join(outDir, `${product.id}-notes.svg`);
  if (!fs.existsSync(p1) || !fs.existsSync(p2)) {
    console.error(`Validation failed for: ${product.id}`);
    allValid = false;
  }
}

if (allValid) {
  console.log(`\nAll ${products.length} products verified with both front (.svg) and notes (-notes.svg) views!`);
} else {
  process.exit(1);
}
