import fs from "fs";
import path from "path";

const productsPath = path.resolve("src/data/products.json");
const reviewsPath = path.resolve("src/data/reviews.json");

const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

// Enriched data mappings per product id
const enrichments = {
  "chikmagalur-estate": {
    about: "Nestled high in the mist-draped Baba Budangiri ranges where coffee was first planted in India, this harvest represents generations of careful shade-grown farming. Hand-picked at peak ripeness and washed in mountain spring water, the beans yield a comforting cup rich with velvety milk chocolate, toasted almond, and a sweet lingering whisper of green cardamom.",
    details: [
      { label: "Process", value: "Washed & Sun-dried" },
      { label: "Altitude", value: "1,350 – 1,450 m" },
      { label: "Harvest", value: "December – February 2026" },
      { label: "Variety", value: "Selection 795 & SLN 9" },
      { label: "Best for", value: "Pour-over, Aeropress, French Press" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a degassing valve pouch",
      "Roaster's batch details & cupping card",
      "Step-by-step pourover brew guide",
      "Recyclable kraft parcel packaging"
    ]
  },
  "monsooned-malabar": {
    about: "Subjected to the salt-laden monsoon squalls of the Malabar coast, these large AA beans undergo a historic curing method that mellows their acidity while amplifying body. The cup pours dense and syrupy, unfurling robust baker's chocolate, toasted cloves, and deep malted cedar.",
    details: [
      { label: "Process", value: "Monsooned Natural" },
      { label: "Altitude", value: "1,100 – 1,200 m" },
      { label: "Harvest", value: "Monsoon Season 2026" },
      { label: "Variety", value: "Kent & S.795" },
      { label: "Best for", value: "South Indian Filter, Moka Pot, Espresso" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in an airtight valve pouch",
      "Monsooning harvest history card",
      "Traditional filter decoction recipe guide",
      "Plastic-free protective parcel"
    ]
  },
  "araku-valley": {
    about: "Grown by tribal farmer collectives on the red-laterite slopes of the Eastern Ghats, this washed lot showcases biodynamic agroforestry at its finest. The cup balances bright mandarin acidity with raw cane sugar sweetness and a crisp finish reminiscent of fresh hazelnut.",
    details: [
      { label: "Process", value: "Fully Washed" },
      { label: "Altitude", value: "1,150 – 1,300 m" },
      { label: "Harvest", value: "January 2026" },
      { label: "Variety", value: "S.795 & Selection 4" },
      { label: "Best for", value: "V60, Chemex, Iced Drip" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a nitrogen-flushed valve pouch",
      "Farmer cooperative impact card",
      "Precision filter brewing card",
      "Eco-certified kraft parcel"
    ]
  },
  "coorg-rainforest": {
    about: "Beneath a dense native jungle canopy alongside black pepper vines and wild cardamom in Kodagu, this shade-grown Arabica matures at a slow, deliberate pace. Slow drying imparts a buttery mouthfeel and deep notes of dark forest honey, roasted walnut, and cacao nibs.",
    details: [
      { label: "Process", value: "Eco-Pulped Natural" },
      { label: "Altitude", value: "1,100 – 1,250 m" },
      { label: "Harvest", value: "January – February 2026" },
      { label: "Variety", value: "Cauvery & Chandragiri" },
      { label: "Best for", value: "French Press, Clever Dripper, Cold Brew" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a recyclable valve pouch",
      "Rainforest Alliance estate notes",
      "Immersion brewing guide card",
      "Recyclable corrugated outer box"
    ]
  },
  "ethiopia-yirgacheffe": {
    about: "From smallholder plots in Kochere, this iconic lot represents the birthplace of wild Arabica coffees. Intensely aromatic, it greets the senses with fragrant jasmine blossoms, sparkling bergamot, and a luminous candied peach sweetness that stays transparent on the palate.",
    details: [
      { label: "Process", value: "Washed & Raised African Beds" },
      { label: "Altitude", value: "1,900 – 2,100 m" },
      { label: "Harvest", value: "December 2025 – January 2026" },
      { label: "Variety", value: "Heirloom Ethiopian Landraces" },
      { label: "Best for", value: "V60, Kalita Wave, Aeropress" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in an airtight barrier pouch",
      "Kochere washing station terroir card",
      "Light-roast extraction ratio chart",
      "Recyclable protective mailer"
    ]
  },
  "colombia-huila": {
    about: "Perched near the snow-capped volcanoes of Huila, Finca Las Margaritas benefits from mineral-rich volcanic soil and high-altitude diurnal temperature swings. An extended 36-hour aerobic fermentation brings forth bright red cherry sweetness, panela caramel, and a creamy dulce de leche finish.",
    details: [
      { label: "Process", value: "Extended Fermentation Washed" },
      { label: "Altitude", value: "1,750 – 1,900 m" },
      { label: "Harvest", value: "Mitaca Crop 2026" },
      { label: "Variety", value: "Castillo & Caturra" },
      { label: "Best for", value: "Espresso, Aeropress, Moka Pot" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a fresh-lock valve pouch",
      "Huila grower profile & roast log",
      "Dialing-in espresso guide",
      "Plastic-free padded shipper"
    ]
  },
  "kenya-nyeri": {
    about: "Cultivated in nutrient-dense red volcanic soil along the southern slopes of Mount Kenya, Gatomboya is renowned for vibrant, laser-sharp acidity. Double washed with glacial runoff, it delivers a punchy medley of blackcurrant, ruby red grapefruit, and brown sugar sweetness.",
    details: [
      { label: "Process", value: "Double Fermented Washed" },
      { label: "Altitude", value: "1,750 – 1,850 m" },
      { label: "Harvest", value: "Main Crop 2026" },
      { label: "Variety", value: "SL28 & SL34" },
      { label: "Best for", value: "Chemex, V60, Siphon" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a degassing valve pouch",
      "Nyeri Cooperative lot certificate",
      "High-extraction pourover guide",
      "FSC-certified kraft box"
    ]
  },
  "guatemala-antigua": {
    about: "Sheltered by three majestic volcanoes, Antigua's microclimate and rich volcanic pumice create classic Central American elegance. A pristine washed process unlocks delicate milk chocolate, stewed red apple, and a warm hazelnut praline finish that pairs gracefully with any brew style.",
    details: [
      { label: "Process", value: "Washed & Patio Sun-dried" },
      { label: "Altitude", value: "1,500 – 1,650 m" },
      { label: "Harvest", value: "February – March 2026" },
      { label: "Variety", value: "Bourbon & Caturra" },
      { label: "Best for", value: "French Press, Drip, Flat White" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in an airtight valve pouch",
      "Antigua estate lineage card",
      "Balanced immersion recipe guide",
      "Recyclable protective parcel"
    ]
  },
  "brazil-cerrado": {
    about: "Basking under consistent plateau sunshine in Minas Gerais, Cerrado Mineiro naturally dries the whole coffee cherries on expansive brick patios. The resulting cup is famously low in acidity, showcasing creamy peanut butter sweetness, rich milk chocolate, and dark molasses.",
    details: [
      { label: "Process", value: "Pulped Natural / Patio Dried" },
      { label: "Altitude", value: "1,000 – 1,150 m" },
      { label: "Harvest", value: "May – July 2026" },
      { label: "Variety", value: "Mundo Novo & Yellow Catuai" },
      { label: "Best for", value: "Espresso, Cold Brew, Milk Drinks" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a valve pouch",
      "Cerrado Mineiro designation card",
      "Cold brew & espresso guide",
      "Recyclable outer mailer"
    ]
  },
  "sumatra-mandheling": {
    about: "Sourced from the volcanic volcanic highlands surrounding Lake Toba, this bean undergoes traditional Giling Basah wet-hulling. The rustic technique yields an intensely heavy, syrupy liquor loaded with dark forest peat, earthy cedar, dark baker's cocoa, and pipe tobacco.",
    details: [
      { label: "Process", value: "Wet-Hulled (Giling Basah)" },
      { label: "Altitude", value: "1,200 – 1,450 m" },
      { label: "Harvest", value: "November 2025 – January 2026" },
      { label: "Variety", value: "Ateng & Tim Tim" },
      { label: "Best for", value: "French Press, Moka Pot, Aeropress" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a valve pouch",
      "Lake Toba origin story card",
      "Full-body French press guide",
      "Plastic-free parcel packaging"
    ]
  },
  "rwanda-nyamasheke": {
    about: "Nurtured along the terraced banks of Lake Kivu, this washed Bourbon lot is carefully hand-sorted under cool mountain skies. It opens with an unexpected, tea-like profile of dried apricot, black tea tannins, and sweet red currant that rewards attentive, patient brewing.",
    details: [
      { label: "Process", value: "Double Washed & Sun-dried" },
      { label: "Altitude", value: "1,700 – 1,950 m" },
      { label: "Harvest", value: "March – May 2026" },
      { label: "Variety", value: "Red Bourbon" },
      { label: "Best for", value: "V60, Kalita Wave, Cupping" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a fresh-lock pouch",
      "Kivu cooperative washing card",
      "Fine-filter brewing recipe",
      "Recyclable kraft box"
    ]
  },
  "kiln-house-blend": {
    about: "Our signature roastery pillar, marrying high-grown washed Chikmagalur Arabica with a rich Colombian Huila component. Roasted to an immaculate medium level to bridge comforting milk chocolate richness with a vibrant splash of blood orange and roasted pecan.",
    details: [
      { label: "Components", value: "60% Chikmagalur Washed, 40% Huila Caturra" },
      { label: "Roast Level", value: "Medium (Kiln Profile III)" },
      { label: "Profile", value: "Chocolate Fudge, Blood Orange, Pecan" },
      { label: "Best for", value: "Daily Drip, Aeropress, Moka Pot" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a resealable valve pouch",
      "Roastmaster recipe ratio card",
      "All-round brewing guide",
      "Recyclable protective parcel"
    ]
  },
  "morning-ember": {
    about: "Formulated specifically for effortless dawn extraction, blending shade-grown Coorg Arabica with naturally processed Brazilian Cerrado. Warm, welcoming, and gentle on the stomach, it pours with velvety caramelized brown sugar, roasted hazelnuts, and a buttery shortbread finish.",
    details: [
      { label: "Components", value: "50% Coorg Shade-Grown, 50% Brazil Cerrado" },
      { label: "Roast Level", value: "Medium-Light (Kiln Profile II)" },
      { label: "Profile", value: "Toffee, Roasted Hazelnut, Shortbread" },
      { label: "Best for", value: "Filter Machine, French Press, Pour-over" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a resealable valve pouch",
      "Morning brew timer guide",
      "Roastery origin card",
      "Recyclable kraft parcel"
    ]
  },
  "midnight-espresso": {
    about: "Designed for dense golden crema and deep milk cut-through, this bold blend pairs monsooned Arabica with a volcanic Guatemalan dark roast. Deep, commanding, and syrup-thick with bittersweet dark chocolate, roasted campfire embers, and molasses caramel.",
    details: [
      { label: "Components", value: "70% Monsooned Malabar, 30% Antigua Dark" },
      { label: "Roast Level", value: "Dark (Kiln Profile V)" },
      { label: "Profile", value: "90% Dark Cocoa, Molasses, Smoke" },
      { label: "Best for", value: "Espresso, South Indian Filter, Flat White" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean coffee in a valve pouch",
      "Espresso pressure & dial-in guide",
      "Tasting notes collector card",
      "Corrugated eco-friendly box"
    ]
  },
  "decaf-swiss-water": {
    about: "Crafted exclusively using the pure chemical-free Swiss Water® method, gently removing 99.9% of caffeine while preserving delicate terroir oils. Sourced from high-altitude Coorg estates, the brew maintains impressive sweetness with hints of milk chocolate, stewed dates, and toasted oats.",
    details: [
      { label: "Decaffeination", value: "100% Swiss Water® Process (Chemical-free)" },
      { label: "Origin", value: "Kodagu (Coorg), Karnataka" },
      { label: "Residual Caffeine", value: "Under 0.1%" },
      { label: "Best for", value: "Evening Pour-over, Aeropress, Moka Pot" },
      { label: "Packed", value: "Roasted to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "250g whole-bean decaf coffee in a freshness valve pouch",
      "Swiss Water® process certificate card",
      "Evening brewing recipe guide",
      "Recyclable outer mailer"
    ]
  },
  "holiday-reserve-limited-edition-whole-bean-gift-box-with-hand-numbered-tin": {
    about: "An opulent celebratory release pairing a micro-lot Ethiopian heirloom with our darkest winter roast, aged inside oak barrels before packaging. Housed in a collectible embossed tin, it delivers decadent festive notes of brandied dark plum, dark chocolate ganache, and warm baking spices.",
    details: [
      { label: "Curation", value: "Barrel-Conditioned Winter Reserve Micro-lot" },
      { label: "Packaging", value: "Airtight Embossed Tin with Numbered Seal" },
      { label: "Tasting Profile", value: "Brandied Plum, Dark Ganache, Allspice" },
      { label: "Edition", value: "Limited to 500 Numbered Tins" },
      { label: "Packed", value: "Hand-packed to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "Collectible hand-numbered matte-finish gift tin",
      "250g Winter Reserve whole-bean sealed foil bag",
      "Letterpress tasting booklet by head roaster",
      "Wax-sealed authenticity certificate",
      "Gold foil embossed gift packaging"
    ]
  },
  "darjeeling-first-flush": {
    about: "Plucked in mid-spring from organic slopes in Kurseong following the winter dormancy of the Himalayas. The tender two leaves and a bud yield an amber liquor with luminous muscatel grape brightness, fresh spring meadow florals, and a crisp flinty finish.",
    details: [
      { label: "Estate", value: "Makaibari Organic Estate, Darjeeling" },
      { label: "Flush", value: "First Flush (Spring 2026)" },
      { label: "Grade", value: "FTGFOP1 (Fine Tippy Golden Flowery Orange Pekoe)" },
      { label: "Water Temp", value: "85°C – 88°C (Do not boil)" },
      { label: "Steep Time", value: "3 – 3.5 minutes" },
      { label: "Packed", value: "Packed fresh to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "100g loose-leaf tea in an airtight sealed caddy tin",
      "Estate harvesting and elevation certificate",
      "Gongfu and Western steeping chart",
      "Recyclable kraft presentation box"
    ]
  },
  "assam-breakfast": {
    about: "Harvested along the Brahmaputra river plains at Mangalam Estate, celebrated for its rare high-density clonal tea bushes. Dotted with velvety golden tips, the brewed tea pours ruby-red with unmatched maltiness, sweet honeyed undertones, and robust briskness that embraces milk gracefully.",
    details: [
      { label: "Estate", value: "Mangalam Estate, Upper Assam" },
      { label: "Harvest", value: "Second Flush Summer 2026" },
      { label: "Grade", value: "TGFOP Clonal Golden Tips" },
      { label: "Water Temp", value: "95°C – 98°C" },
      { label: "Steep Time", value: "4 minutes" },
      { label: "Packed", value: "Packed fresh to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "100g loose-leaf orthodox tea in a foil-sealed barrier pouch",
      "Assam clonal tea guide card",
      "Traditional milk tea brewing ratios",
      "Recyclable protective parcel"
    ]
  },
  "nilgiri-frost-tea": {
    about: "An extraordinary cold-weather specialty plucked only on frosty winter dawns in the Blue Mountains at 2,000m elevation. Extreme diurnal chill concentrates natural essential oils, resulting in sweet white orchid perfume, wintergreen crispness, and a lingering citrus sweetness.",
    details: [
      { label: "Region", value: "Kallari Hills, Nilgiris, Tamil Nadu" },
      { label: "Harvest", value: "Winter Frost Pluck (January 2026)" },
      { label: "Grade", value: "Whole Leaf Imperial Reserve" },
      { label: "Water Temp", value: "88°C – 90°C" },
      { label: "Steep Time", value: "3 minutes" },
      { label: "Packed", value: "Packed fresh to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "100g loose-leaf frost tea in an airtight tin",
      "Nilgiri microclimate harvest card",
      "Cold-steep & hot-steep instruction card",
      "Plastic-free padded mailer"
    ]
  },
  "kashmiri-kahwa": {
    about: "An authentic celebratory green tea blend inspired by the historic courtyards of Srinagar. Hand-blended whole-leaf green tea scented with pure Kashmiri saffron stigmas, sweet green cardamom pods, crushed cinnamon bark, and slivers of raw sweet Mamra almonds.",
    details: [
      { label: "Base", value: "High-Grown Himalayan Green Tea" },
      { label: "Spices", value: "Pure Kashmiri Saffron, Green Cardamom, Cinnamon" },
      { label: "Nuts", value: "Sliced Mamra Almonds" },
      { label: "Water Temp", value: "85°C – 90°C" },
      { label: "Steep Time", value: "3 – 4 minutes" },
      { label: "Packed", value: "Hand-blended fresh to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: ["Tree nuts (Almonds)"],
      mayContain: ["Milk", "Sesame"],
      note: "Contains real tree nuts (sliced almonds). Hand-blended in a dedicated spice facility."
    },
    box: [
      "100g whole-spice kahwa blend in a gold-foil sealed pouch",
      "Traditional samovar kahwa recipe card",
      "Saffron purity verification note",
      "Recyclable gift packaging"
    ]
  },
  "japanese-sencha": {
    about: "Cultivated in the misty valleys of Shizuoka, this first-pick Yabukita cultivar undergoes precise deep steaming (Fukamushi). It yields an emerald liquor brimming with savory umami, sweet oceanic nori notes, and a refreshing, thirst-quenching crispness.",
    details: [
      { label: "Cultivar", value: "100% Yabukita" },
      { label: "Origin", value: "Shizuoka Prefecture, Japan" },
      { label: "Steaming", value: "Fukamushi (Deep Steamed)" },
      { label: "Water Temp", value: "70°C – 75°C" },
      { label: "Steep Time", value: "60 – 75 seconds" },
      { label: "Packed", value: "Packed fresh to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "100g nitrogen-sealed vacuum pouch",
      "Kyusu Japanese steeping technique card",
      "Cultivar origin and harvest notes",
      "Recyclable protective parcel"
    ]
  },
  "genmaicha": {
    about: "A beloved traditional blend of tender Japanese green bancha tea combined with slowly fire-roasted brown rice (genmai). Mild, nutty, and comforting with an unmistakable aroma of toasted popcorn and fresh steamed grains that is comforting any time of day.",
    details: [
      { label: "Ingredients", value: "Japanese Green Tea & Roasted Brown Rice" },
      { label: "Origin", value: "Kagoshima, Japan" },
      { label: "Caffeine", value: "Low (approx. 15mg per cup)" },
      { label: "Water Temp", value: "85°C – 90°C" },
      { label: "Steep Time", value: "2 minutes" },
      { label: "Packed", value: "Packed fresh to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Gluten-free puffed rice. Packed in a facility handling tree nuts."
    },
    box: [
      "100g foil barrier resealable pouch",
      "Roasting process card",
      "Everyday teapot steeping instructions",
      "Eco-friendly corrugated mailer"
    ]
  },
  "oolong-alishan": {
    about: "Grown above the cloud line at 1,500m on Taiwan's famed Mount Ali, where mountain mists shield the bushes from harsh noon sun. Lightly oxidized and tightly ball-rolled, it unfurls across multiple steepings with aromas of creamy gardenia, fresh cream, and sweet honeydew.",
    details: [
      { label: "Origin", value: "Alishan High Mountain (Gaoshan), Taiwan" },
      { label: "Oxidation", value: "Light (approx. 20%)" },
      { label: "Elevation", value: "1,500 – 1,600 m" },
      { label: "Water Temp", value: "90°C – 95°C" },
      { label: "Steep Time", value: "Multiple infusions: 45s, 60s, 90s" },
      { label: "Packed", value: "Packed fresh to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "100g vacuum-sealed foil block with freshness valve",
      "Gongfu tea ritual and re-steeping guide",
      "High mountain terroir card",
      "Recyclable kraft box"
    ]
  },
  "earl-grey-smoked": {
    about: "A dramatic artisanal re-imagining of classic Earl Grey. Single-estate orthodox black tea is gently cold-smoked over native applewood before being scented with cold-pressed Calabrian bergamot oil, striking a balance between campfire smoke and citrus brilliance.",
    details: [
      { label: "Tea Base", value: "Whole Leaf Orthodox Black Tea" },
      { label: "Flavoring", value: "Natural Cold-Pressed Bergamot Oil & Smoked Wood" },
      { label: "Origin", value: "Nilgiris base, scented in-house" },
      { label: "Water Temp", value: "95°C – 98°C" },
      { label: "Steep Time", value: "3.5 – 4 minutes" },
      { label: "Packed", value: "Packed fresh to order, ships in 1-2 days" }
    ],
    allergens: {
      contains: [],
      mayContain: ["Tree nuts", "Milk"],
      note: "Contains no major allergens. Packed in a facility that also handles tree nuts and milk."
    },
    box: [
      "100g loose-leaf tea in an airtight ultraviolet-safe tin",
      "Smoking technique and citrus pairing card",
      "Classic afternoon tea brew guide",
      "Recyclable protective parcel"
    ]
  },
  "hand-grinder": {
    about: "Engineered for exact grind consistency across both espresso and coarse cold brew. Crafted with a CNC-machined 420 stainless steel pentagonal burr set, dual bearing stabilization, and a textured aluminum unibody that eliminates wobble during cranking.",
    details: [
      { label: "Burr Material", value: "48mm CNC 420 Stainless Steel Pentagonal" },
      { label: "Body", value: "Anodized Aerospace Aluminum" },
      { label: "Capacity", value: "30 – 35 g whole beans" },
      { label: "Adjustment", value: "Stepped internal click ring (0.02mm per click)" },
      { label: "Weight", value: "620 g" }
    ],
    materials: [
      "Aerospace-grade anodized aluminum body",
      "420 hardened stainless steel conical burr set",
      "Natural walnut wood handle knob",
      "Dual stainless steel ball bearings"
    ],
    care: "Do not wash burrs with water. Clean with included natural bristle brush and silicone air blower only.",
    box: [
      "Precision manual hand grinder with magnetic catch-cup",
      "Natural walnut wood crank handle",
      "Soft natural-bristle cleaning brush",
      "Silicone bulb dust blower",
      "Canvas travel pouch & grind setting chart"
    ]
  },
  "pour-over-kit": {
    about: "A classic ceramic dripper and borosilicate glass server designed for optimal thermal stability and extraction geometry. Features interior spiral ribs that promote uniform flow rate and a heat-resistant glass decanter graduated for two cups.",
    details: [
      { label: "Dripper", value: "High-fired Ceramic (Size 02)" },
      { label: "Server", value: "Heat-resistant Borosilicate Glass (600ml)" },
      { label: "Dimensions", value: "135 x 110 x 185 mm" },
      { label: "Compatible with", value: "Standard cone V02 paper filters" },
      { label: "Capacity", value: "1 – 4 cups (600 ml)" }
    ],
    materials: [
      "High-density kiln-fired ceramic dripper",
      "Thermal shock-resistant borosilicate glass server",
      "Food-grade silicone rubber sealing lid"
    ],
    care: "Dishwasher safe. Avoid sudden thermal shocks above 120°C differential. Hand wash recommended for long-term glaze luster.",
    box: [
      "Glazed ceramic cone dripper (02 size)",
      "600ml borosilicate glass decanter server with lid",
      "Pack of 40 unbleached Japanese paper filters",
      "Acrylic coffee measure spoon",
      "Comprehensive pourover technique booklet"
    ]
  },
  "gooseneck-kettle": {
    about: "Designed for effortless laminar water flow control during manual pour-over extraction. The angled gooseneck spout ensures steady vertical water drops without splashing, while the counter-balanced ergonomic handle protects hands from steam.",
    details: [
      { label: "Material", value: "Food-grade 304 Stainless Steel" },
      { label: "Capacity", value: "900 ml (0.9 L max capacity)" },
      { label: "Spout", value: "Precision 6.5mm curved gooseneck" },
      { label: "Stove Compatibility", value: "Induction, Gas, Ceramic, Electric" },
      { label: "Weight", value: "480 g (empty)" }
    ],
    materials: [
      "Heavy-gauge 18/8 (304) stainless steel interior & exterior",
      "Heat-resistant matte powder-coat finish",
      "Ergonomic counter-weighted polymer handle"
    ],
    care: "Hand wash with mild detergent. Descale periodically with citric acid or diluted white vinegar. Never boil dry.",
    box: [
      "0.9L gooseneck pouring kettle with steam-vent lid",
      "Built-in lid thermometer port grommet",
      "Silicone heat protection trivet",
      "Care, cleaning & descaling manual"
    ]
  },
  "digital-scale": {
    about: "Accurate to 0.1 grams with an integrated automatic timer, this compact scale provides the precision necessary for repeatable brewing. The water-resistant matte silicone pad insulates against heat from hot carafes while the hidden LED display shines crisp and clear.",
    details: [
      { label: "Precision", value: "0.1 g resolution (0.3 g to 2,000 g range)" },
      { label: "Timer", value: "Built-in chronograph stopwatch (up to 99m 59s)" },
      { label: "Power", value: "USB-C rechargeable 1,200mAh lithium battery" },
      { label: "Display", value: "Invisible-until-lit dual white LED matrix" },
      { label: "Dimensions", value: "152 x 130 x 26 mm" }
    ],
    materials: [
      "Matte ABS durable polymer body",
      "Removable food-grade heat-insulating silicone pad",
      "High-precision strain-gauge aluminum load cell"
    ],
    care: "Surface is water-resistant against minor spills; do not submerge in water. Wipe clean with a damp microfiber cloth.",
    box: [
      "Digital coffee scale with auto-timer function",
      "Heat-insulating non-slip silicone rubber pad",
      "Braided USB-C charging cable (1 m)",
      "Calibration & quick-start manual"
    ]
  }
};

// Reviews data: 2-3 reviews per product
const reviewsData = [
  // chikmagalur-estate (4.9 rating)
  {
    id: "rev-chik-1",
    productId: "chikmagalur-estate",
    author: "Arjun K.",
    rating: 5,
    date: "2026-03-14",
    title: "The standard for Indian specialty coffee",
    body: "Brewed on a V60 at 92 degrees. The cardamom note is remarkably delicate and marries perfectly with the milk chocolate backbone. Hands down my everyday morning cup.",
    verified: true
  },
  {
    id: "rev-chik-2",
    productId: "chikmagalur-estate",
    author: "Sarah M.",
    rating: 5,
    date: "2026-04-22",
    title: "Sweet and beautifully balanced",
    body: "Extracted with an Aeropress using the inverted method. Incredible sweetness and clean mouthfeel with zero astringency. Roasted fresh within 24 hours of dispatch.",
    verified: true
  },
  {
    id: "rev-chik-3",
    productId: "chikmagalur-estate",
    author: "Rohan B.",
    rating: 5,
    date: "2026-07-09",
    title: "Consistent and nostalgic",
    body: "Reminds me of plantation visits in Karnataka but roasted to modern specialty standards. The almond praline finish lingers nicely.",
    verified: true
  },

  // monsooned-malabar (4.8 rating)
  {
    id: "rev-mon-1",
    productId: "monsooned-malabar",
    author: "Vikram N.",
    rating: 5,
    date: "2026-02-18",
    title: "Unbeatable crema and body",
    body: "Pulls a thick, golden crema on my manual lever machine. The low acidity makes it ideal for late afternoon milk drinks with deep cocoa and spice.",
    verified: true
  },
  {
    id: "rev-mon-2",
    productId: "monsooned-malabar",
    author: "Elena P.",
    rating: 5,
    date: "2026-05-11",
    title: "Rich and comforting in South Indian filter",
    body: "Classic monsooned earthy sweetness without any unpleasant harshness. Brewed in a brass filter decoction with hot frothy milk.",
    verified: true
  },

  // araku-valley (4.8 rating)
  {
    id: "rev-arak-1",
    productId: "araku-valley",
    author: "Devika S.",
    rating: 5,
    date: "2026-01-29",
    title: "Crisp citrus sweetness",
    body: "Clean washed cup with a vibrant mandarin orange brightness. Outstanding work by the tribal grower collective in Andhra.",
    verified: true
  },
  {
    id: "rev-arak-2",
    productId: "araku-valley",
    author: "Carlos T.",
    rating: 5,
    date: "2026-06-03",
    title: "Luminous on ice",
    body: "I flash-chilled this over ice on a Kalita Wave. Sparkling citrus acidity and honeyed aftertaste make it super refreshing.",
    verified: true
  },

  // coorg-rainforest (4.7 rating)
  {
    id: "rev-coorg-1",
    productId: "coorg-rainforest",
    author: "Preeti R.",
    rating: 5,
    date: "2026-03-05",
    title: "Deep forest honey and nuts",
    body: "Made in a French press with a coarse grind. The natural pulped processing gives it a rounded, comforting syrup texture.",
    verified: true
  },
  {
    id: "rev-coorg-2",
    productId: "coorg-rainforest",
    author: "Marcus V.",
    rating: 4,
    date: "2026-05-30",
    title: "Great everyday immersion brew",
    body: "Smooth and low bitterness. Pairs exceptionally well with a drop of warm oat milk on rainy mornings.",
    verified: true
  },

  // ethiopia-yirgacheffe (4.9 rating)
  {
    id: "rev-yirg-1",
    productId: "ethiopia-yirgacheffe",
    author: "Anya D.",
    rating: 5,
    date: "2026-02-14",
    title: "Like drinking jasmine tea and peaches",
    body: "One of the finest Kochere lots I have cupped this season. Incredibly floral aroma that fills the entire kitchen when grinding.",
    verified: true
  },
  {
    id: "rev-yirg-2",
    productId: "ethiopia-yirgacheffe",
    author: "Karan J.",
    rating: 5,
    date: "2026-06-18",
    title: "Laser precision light roast",
    body: "No roasty notes whatsoever, pure origin expression. Bergamot and candied peach all the way down to room temperature.",
    verified: true
  },

  // colombia-huila (4.7 rating)
  {
    id: "rev-huila-1",
    productId: "colombia-huila",
    author: "Mateo R.",
    rating: 5,
    date: "2026-04-12",
    title: "Sweet panela caramel and cherry",
    body: "Dialed in as a 1:2.2 ratio espresso. Bright red cherry fruit upfront settling into dense caramel dulce de leche.",
    verified: true
  },
  {
    id: "rev-huila-2",
    productId: "colombia-huila",
    author: "Siddharth P.",
    rating: 4,
    date: "2026-08-01",
    title: "Complex washed Colombian",
    body: "The 36-hour fermentation brings pleasant fruit notes without funk. Excellent clarity on the Chemex.",
    verified: true
  },

  // kenya-nyeri (4.8 rating)
  {
    id: "rev-nyeri-1",
    productId: "kenya-nyeri",
    author: "Liam O.",
    rating: 5,
    date: "2026-03-22",
    title: "Vibrant blackcurrant acidity",
    body: "Classic SL28 profile with juicy blackcurrant and grapefruit notes. Pours sparkling clean when brewed at 94°C on V60.",
    verified: true
  },
  {
    id: "rev-nyeri-2",
    productId: "kenya-nyeri",
    author: "Aditi G.",
    rating: 5,
    date: "2026-07-14",
    title: "Punchy and memorable",
    body: "If you enjoy high-altitude Kenyan coffees with laser brightness, this lot is phenomenal. Sweet brown sugar finish.",
    verified: true
  },

  // guatemala-antigua (4.6 rating)
  {
    id: "rev-anti-1",
    productId: "guatemala-antigua",
    author: "Nikhil T.",
    rating: 5,
    date: "2026-02-27",
    title: "Classic Central American sweetness",
    body: "Smooth stewed apple and milk chocolate notes. Very forgiving to brew whether using a drip machine or French press.",
    verified: true
  },
  {
    id: "rev-anti-2",
    productId: "guatemala-antigua",
    author: "Hannah W.",
    rating: 4,
    date: "2026-05-19",
    title: "Comforting hazelnut aroma",
    body: "A clean, comforting medium roast that satisfies everyone who visits. Balanced sweetness and gentle acidity.",
    verified: true
  },

  // brazil-cerrado (4.5 rating)
  {
    id: "rev-braz-1",
    productId: "brazil-cerrado",
    author: "Rahul M.",
    rating: 5,
    date: "2026-03-08",
    title: "Peanut butter and chocolate powerhouse",
    body: "Heavy body, practically zero sourness, and delicious nuttiness. Makes the creamiest flat whites and iced lattes.",
    verified: true
  },
  {
    id: "rev-braz-2",
    productId: "brazil-cerrado",
    author: "Chloe S.",
    rating: 4,
    date: "2026-06-25",
    title: "Great for cold brew concentrate",
    body: "Steeped for 16 hours in the fridge. Incredibly smooth dark chocolate and molasses profile without bitterness.",
    verified: true
  },

  // sumatra-mandheling (4.4 rating)
  {
    id: "rev-sum-1",
    productId: "sumatra-mandheling",
    author: "Tariq A.",
    rating: 5,
    date: "2026-01-19",
    title: "Heavy, earthy, and profound",
    body: "For fans of traditional wet-hulled Mandheling, this hits the spot. Deep cedar, dark cocoa nibs, and heavy forest floor notes.",
    verified: true
  },
  {
    id: "rev-sum-2",
    productId: "sumatra-mandheling",
    author: "Oliver B.",
    rating: 4,
    date: "2026-04-05",
    title: "Rustic and bold",
    body: "Brewed on the Moka pot with whole milk. It has genuine punch and depth that stands up to hearty breakfasts.",
    verified: true
  },

  // rwanda-nyamasheke (3.9 rating - Acquired taste badge)
  {
    id: "rev-rwa-1",
    productId: "rwanda-nyamasheke",
    author: "Varun H.",
    rating: 4,
    date: "2026-02-11",
    title: "Distinctive black tea and apricot notes",
    body: "Very unusual profile that drinks more like an aromatic black tea with dried stone fruit than a traditional coffee. Takes patience to extract well.",
    verified: true
  },
  {
    id: "rev-rwa-2",
    productId: "rwanda-nyamasheke",
    author: "Simon K.",
    rating: 3,
    date: "2026-05-16",
    title: "An acquired taste — very delicate and tea-like",
    body: "Slightly too tart and light-bodied for my usual morning espresso, but pleasant as a slow Sunday afternoon pour-over once you adjust the grind.",
    verified: true
  },

  // kiln-house-blend (4.9 rating)
  {
    id: "rev-khb-1",
    productId: "kiln-house-blend",
    author: "Ananya C.",
    rating: 5,
    date: "2026-03-30",
    title: "Our household staple",
    body: "The balance between Chikmagalur chocolate and Colombian citrus makes this impossible to get tired of. Ordered three 250g bags already.",
    verified: true
  },
  {
    id: "rev-khb-2",
    productId: "kiln-house-blend",
    author: "James L.",
    rating: 5,
    date: "2026-06-12",
    title: "Perfect all-rounder",
    body: "Works equally well as a morning black Americano and an afternoon milky cortado. Rich chocolate fudge with a hint of orange peel.",
    verified: true
  },

  // morning-ember (4.7 rating)
  {
    id: "rev-morn-1",
    productId: "morning-ember",
    author: "Sunita G.",
    rating: 5,
    date: "2026-02-23",
    title: "Gentle and buttery dawn coffee",
    body: "So easy to drink first thing in the morning without jolting your palate. Roasted hazelnuts and sweet buttery shortbread.",
    verified: true
  },
  {
    id: "rev-morn-2",
    productId: "morning-ember",
    author: "David L.",
    rating: 4,
    date: "2026-07-20",
    title: "Smooth toffee profile",
    body: "Brewed on a Moccamaster batch brewer. Even extraction and no bitterness whatsoever. Very satisfying everyday cup.",
    verified: true
  },

  // midnight-espresso (4.8 rating)
  {
    id: "rev-mid-1",
    productId: "midnight-espresso",
    author: "Prashant K.",
    rating: 5,
    date: "2026-04-09",
    title: "Crema monster for traditionalists",
    body: "If you love a dark, bittersweet espresso that punches right through steamed milk, look no further. Smoky dark cocoa notes that stay rich.",
    verified: true
  },
  {
    id: "rev-mid-2",
    productId: "midnight-espresso",
    author: "Marco F.",
    rating: 5,
    date: "2026-08-15",
    title: "Bold and syrup-thick",
    body: "Pulls like warm melted chocolate at a 1:1.8 ratio on 9 bar. Molasses and campfire notes linger for minutes.",
    verified: true
  },

  // decaf-swiss-water (4.6 rating)
  {
    id: "rev-dec-1",
    productId: "decaf-swiss-water",
    author: "Kavita N.",
    rating: 5,
    date: "2026-03-17",
    title: "Finally a decaf that actually tastes like coffee",
    body: "No cardboard or chemical taste like cheap decafs. Sweet dates and milk chocolate make this my favorite post-dinner ritual.",
    verified: true
  },
  {
    id: "rev-dec-2",
    productId: "decaf-swiss-water",
    author: "Tobias H.",
    rating: 4,
    date: "2026-06-08",
    title: "Impressive body and sweetness",
    body: "Swiss Water process preserves the delicate Coorg character. Brews cleanly in an Aeropress without bitterness.",
    verified: true
  },

  // holiday-reserve-limited-edition-whole-bean-gift-box-with-hand-numbered-tin (4.9 rating)
  {
    id: "rev-hol-1",
    productId: "holiday-reserve-limited-edition-whole-bean-gift-box-with-hand-numbered-tin",
    author: "Meera D.",
    rating: 5,
    date: "2026-01-05",
    title: "Unbelievable presentation and flavor",
    body: "The embossed tin is a work of art on the counter. The coffee itself has rich brandied plum and dark ganache notes that feel deeply festive.",
    verified: true
  },
  {
    id: "rev-hol-2",
    productId: "holiday-reserve-limited-edition-whole-bean-gift-box-with-hand-numbered-tin",
    author: "Jonathan P.",
    rating: 5,
    date: "2026-02-02",
    title: "A luxury gift for any coffee lover",
    body: "Gave this to my brother who is an avid home barista. The batch card and tasting notes made the unwrapping experience memorable.",
    verified: true
  },

  // darjeeling-first-flush (4.9 rating)
  {
    id: "rev-darj-1",
    productId: "darjeeling-first-flush",
    author: "Deepak S.",
    rating: 5,
    date: "2026-04-18",
    title: "Exquisite muscatel and spring florals",
    body: "Steeped at 85°C for 3 minutes. The champagne-hued liquor is luminous with muscatel grape and meadow flower sweetness. Truly orthodox craftsmanship.",
    verified: true
  },
  {
    id: "rev-darj-2",
    productId: "darjeeling-first-flush",
    author: "Claire R.",
    rating: 5,
    date: "2026-07-27",
    title: "Pure spring in a porcelain cup",
    body: "Whole unbroken leaves with silver downy tips. Crisp, delicate, and leaves a cooling floral sweetness on the palate.",
    verified: true
  },

  // assam-breakfast (4.8 rating)
  {
    id: "rev-assm-1",
    productId: "assam-breakfast",
    author: "Rajesh V.",
    rating: 5,
    date: "2026-03-11",
    title: "Golden tips and deep malt",
    body: "You can see the abundance of golden tips in the dry leaf. Takes a splash of milk and raw sugar to create the ultimate morning chai.",
    verified: true
  },
  {
    id: "rev-assm-2",
    productId: "assam-breakfast",
    author: "Emma G.",
    rating: 5,
    date: "2026-05-24",
    title: "Robust, honeyed and brisk",
    body: "Rich ruby liquor that warms you through. Steeps cleanly in 4 minutes with zero harshness.",
    verified: true
  },

  // nilgiri-frost-tea (4.8 rating)
  {
    id: "rev-nilg-1",
    productId: "nilgiri-frost-tea",
    author: "Shreya M.",
    rating: 5,
    date: "2026-02-28",
    title: "Rare winter harvest magic",
    body: "The frost harvest concentrates the floral oils in a way you rarely taste in South Indian teas. Distinct white orchid aroma and crisp finish.",
    verified: true
  },
  {
    id: "rev-nilg-2",
    productId: "nilgiri-frost-tea",
    author: "Lucas N.",
    rating: 5,
    date: "2026-06-15",
    title: "Incredible cold brew tea",
    body: "I cold-steeped 5g in 500ml cold water in the fridge overnight. Sweet citrus and orchid blossom notes shone through effortlessly.",
    verified: true
  },

  // kashmiri-kahwa (4.9 rating)
  {
    id: "rev-kahw-1",
    productId: "kashmiri-kahwa",
    author: "Tanvi B.",
    rating: 5,
    date: "2026-01-22",
    title: "Generous with real saffron and almonds",
    body: "So many commercial kahwa blends skimp on ingredients, but this one is loaded with fragrant saffron strands and slivered almonds. Truly warming.",
    verified: true
  },
  {
    id: "rev-kahw-2",
    productId: "kashmiri-kahwa",
    author: "Zainab M.",
    rating: 5,
    date: "2026-04-03",
    title: "Authentic celebratory brew",
    body: "Steeped with a touch of wild honey. The cardamom and saffron aroma fill the dining room instantly. Absolute comfort in a cup.",
    verified: true
  },

  // japanese-sencha (4.7 rating)
  {
    id: "rev-sen-1",
    productId: "japanese-sencha",
    author: "Kenji Y.",
    rating: 5,
    date: "2026-03-02",
    title: "Deep steamed umami perfection",
    body: "Fukamushi steaming gives this an emerald-cloudy liquor and rich savory umami. Brew at 70°C for 60 seconds to avoid astringency.",
    verified: true
  },
  {
    id: "rev-sen-2",
    productId: "japanese-sencha",
    author: "Nisha P.",
    rating: 4,
    date: "2026-05-18",
    title: "Refreshing oceanic greens",
    body: "Sweet maritime aroma and vivid green color. Great quality Shizuoka harvest that can easily be re-steeped two or three times.",
    verified: true
  },

  // genmaicha (4.6 rating)
  {
    id: "rev-genm-1",
    productId: "genmaicha",
    author: "Aarav K.",
    rating: 5,
    date: "2026-02-17",
    title: "Toasted popcorn comfort",
    body: "The aroma of roasted rice immediately relaxes you. Light in caffeine and easy on the stomach for late evening sipping.",
    verified: true
  },
  {
    id: "rev-genm-2",
    productId: "genmaicha",
    author: "Emily C.",
    rating: 4,
    date: "2026-06-29",
    title: "Nutty and wholesome",
    body: "A wonderful balanced blend with puffed rice kernels that add so much depth. Pairs nicely with savoury snacks.",
    verified: true
  },

  // oolong-alishan (4.8 rating)
  {
    id: "rev-ool-1",
    productId: "oolong-alishan",
    author: "Wei L.",
    rating: 5,
    date: "2026-03-25",
    title: "Milky gardenia and endless infusions",
    body: "Tightly rolled high mountain pearls that open up across seven gongfu infusions. Notes of honeydew melon, sweet cream, and gardenia flowers.",
    verified: true
  },
  {
    id: "rev-ool-2",
    productId: "oolong-alishan",
    author: "Pooja V.",
    rating: 5,
    date: "2026-07-04",
    title: "High mountain mist in a gaiwan",
    body: "Sublime buttery texture and zero astringency. One of the finest Taiwanese high-mountain lots available in India.",
    verified: true
  },

  // earl-grey-smoked (4.7 rating)
  {
    id: "rev-eg-1",
    productId: "earl-grey-smoked",
    author: "Arthur P.",
    rating: 5,
    date: "2026-01-30",
    title: "Intriguing woodsmoke and citrus harmony",
    body: "The applewood cold smoke adds an unexpected savory depth to the bright bergamot citrus. Pours rich and amber with real personality.",
    verified: true
  },
  {
    id: "rev-eg-2",
    productId: "earl-grey-smoked",
    author: "Smriti R.",
    rating: 4,
    date: "2026-05-09",
    title: "Bold twist on a timeless classic",
    body: "If standard Earl Grey feels too perfumed, this smoky variation grounds it with comforting hearthside character. Beautiful with a dash of milk.",
    verified: true
  },

  // hand-grinder (4.9 rating)
  {
    id: "rev-grind-1",
    productId: "hand-grinder",
    author: "Akash T.",
    rating: 5,
    date: "2026-02-09",
    title: "Smooth cranking and unimpeachable burr alignment",
    body: "The dual bearings eliminate any shaft play. Grinds 18g of dense Ethiopian beans for pourover in under 35 seconds with minimal effort.",
    verified: true
  },
  {
    id: "rev-grind-2",
    productId: "hand-grinder",
    author: "Felix W.",
    rating: 5,
    date: "2026-06-22",
    title: "Replaced my bulky electric grinder",
    body: "Particle distribution is remarkably uniform with very few fines. The magnetic catch-cup and walnut handle feel exceptionally premium in the hand.",
    verified: true
  },

  // pour-over-kit (4.8 rating)
  {
    id: "rev-pour-1",
    productId: "pour-over-kit",
    author: "Manish S.",
    rating: 5,
    date: "2026-03-07",
    title: "Superb thermal stability and handsome design",
    body: "The heavy ceramic cone retains heat far better than plastic equivalents. Glass server pours without drips and the included filters fit like a glove.",
    verified: true
  },
  {
    id: "rev-pour-2",
    productId: "pour-over-kit",
    author: "Sophie B.",
    rating: 5,
    date: "2026-05-14",
    title: "Essential for starting specialty coffee",
    body: "Everything you need to brew clean artisan coffee at home. Looks stunning sitting on the kitchen counter when not in use.",
    verified: true
  },

  // gooseneck-kettle (4.8 rating)
  {
    id: "rev-kett-1",
    productId: "gooseneck-kettle",
    author: "Harish N.",
    rating: 5,
    date: "2026-02-25",
    title: "Pinpoint pouring control",
    body: "The curved spout enables a steady, pencil-thin vertical water stream directly into the coffee bed. Balanced handle keeps wrist fatigue away.",
    verified: true
  },
  {
    id: "rev-kett-2",
    productId: "gooseneck-kettle",
    author: "Daniel K.",
    rating: 5,
    date: "2026-07-11",
    title: "Heats fast on induction",
    body: "Works like a charm on my induction cooktop. 0.9L is the sweet spot for brewing two cups without feeling heavy.",
    verified: true
  },

  // digital-scale (4.7 rating)
  {
    id: "rev-scale-1",
    productId: "digital-scale",
    author: "Gaurav D.",
    rating: 5,
    date: "2026-04-01",
    title: "Fast 0.1g response with clean hidden display",
    body: "Zero perceptible delay when pouring water. The auto-timer starts cleanly when flow begins and the silicone mat protects against heat.",
    verified: true
  },
  {
    id: "rev-scale-2",
    productId: "digital-scale",
    author: "Mia L.",
    rating: 4,
    date: "2026-06-19",
    title: "Compact and USB-C rechargeable",
    body: "Battery lasts for weeks of multiple daily brews on a single charge. Fits comfortably under the portafilter of my espresso machine.",
    verified: true
  }
];

// Enrich each product in products
const enrichedProducts = products.map((p) => {
  const data = enrichments[p.id];
  if (!data) {
    throw new Error(`Missing enrichment for product id: ${p.id}`);
  }
  return {
    ...p,
    about: data.about,
    details: data.details,
    ...(data.allergens ? { allergens: data.allergens } : {}),
    ...(data.materials ? { materials: data.materials } : {}),
    ...(data.care ? { care: data.care } : {}),
    box: data.box,
  };
});

fs.writeFileSync(productsPath, JSON.stringify(enrichedProducts, null, 2), "utf-8");
console.log(`Updated ${enrichedProducts.length} products with new fields in ${productsPath}`);

fs.writeFileSync(reviewsPath, JSON.stringify(reviewsData, null, 2), "utf-8");
console.log(`Written ${reviewsData.length} reviews to ${reviewsPath}`);
