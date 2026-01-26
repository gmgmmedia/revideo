# Brand Identity Extractor

Extract comprehensive brand identity from a company URL and/or images. Outputs a hyper-detailed JSON with everything needed to understand and recreate the brand's visual identity.

---

## INPUT

**At least one of the following is required:**

### Option 1: URL Only
```
https://example.com
```

### Option 2: Images Only
```
[image1.png, image2.png, ...]
```

### Option 3: URL + Images (Recommended for highest accuracy)
```
URL: https://example.com
Images: [screenshot.png, social_post.png, brand_asset.png]
```

**Accepted image types:**
- Website screenshots (hero, full page, mobile)
- Social media posts (Twitter/X, Instagram, LinkedIn)
- Brand assets (logos, color palettes, icon sets)
- Marketing materials (pitch decks, ads, banners)
- Product UI (app screenshots, dashboards)

The agent will auto-detect the image type and extract relevant brand signals.

---

## OUTPUT

A complete `brand-identity.json` with the following structure:

```json
{
  "company": { ... },
  "colors": { ... },
  "typography": { ... },
  "visual_style": { ... },
  "components": { ... },
  "brand_voice": { ... },
  "sources": { ... },
  "field_confidence": { ... },
  "extraction_metadata": { ... },
  "web3_signals": { ... }
}
```

---

## EXECUTION FLOW

### Step 1: Input Validation & Intake

```
VALIDATE inputs:
- At least one source required (URL or images)
- If URL provided: validate format
- If images provided: confirm they are readable

DETERMINE extraction mode:
- URL_ONLY: Only URL provided, no images
- IMAGES_ONLY: Only images provided, no URL
- COMBINED: Both URL and images provided (highest accuracy potential)

STORE input sources for later attribution in output.
```

### Step 2: Image Classification (if images provided)

```
FOR each image provided:

1. DETECT IMAGE TYPE by analyzing visual patterns:

   | Type | Detection Signals |
   |------|-------------------|
   | website_screenshot | Browser chrome, URL bar, navigation, typical web layouts, scroll indicators |
   | social_post | Platform UI (Twitter cards, IG frame, LinkedIn header), profile pics, engagement metrics, timestamps |
   | brand_asset | Logo isolation, color swatches, typography specimens, icon grids, style guide layouts |
   | marketing_material | Slide layouts, ad formats, promotional text overlays, campaign-specific design |
   | product_ui | App interfaces, dashboard views, mobile screens, software UI |
   | other | General imagery with brand colors/style but no clear category |

2. EXTRACT platform-specific signals:
   - Social posts: Identify platform (Twitter/X, Instagram, LinkedIn, etc.)
   - Screenshots: Detect if desktop/mobile, which section visible
   - Brand assets: Identify if logo, palette, typography specimen

3. ASSIGN detection_confidence (high/medium/low) based on clarity of signals

4. STORE classification for each image:
   {
     "image_id": "img_001",
     "detected_type": "social_post",
     "platform": "twitter",
     "detection_confidence": "high"
   }
```

### Step 3: URL Extraction (if URL provided)

```
FETCH the provided URL and extract:
1. Page title → company name
2. Meta description → initial company description
3. Hero section content (headline, subheadline, CTA text)
4. Navigation items → understand product/service scope
5. Footer content (tagline, social links, copyright text)

TRACK source for each extracted value (e.g., "source": "css_variable")

IF FETCH FAILS (page too large, timeout, blocked):
- If images were provided: Continue with image-based extraction
- If no images: Request user to provide screenshots
```

### Step 4: Discover Additional Pages (if URL provided)

```
AUTOMATICALLY FETCH these paths if they exist:
- /about, /about-us, /company, /our-story
- /brand, /brand-guidelines, /press, /media
- /pricing (reveals target market)
- /team, /careers (reveals company culture)

EXTRACT from each:
- Company mission/vision statements
- Value propositions
- Brand voice examples from copy
- Any stated brand values or principles
```

### Step 5: Extract Colors from CSS (if URL provided)

```
ANALYZE CSS and HTML for colors:

1. CSS CUSTOM PROPERTIES (highest priority)
   Look for: --primary, --brand, --accent, --background, --text
   These are intentional brand colors.

2. COLOR FORMAT HANDLING
   Colors may appear in different formats. Convert all to hex:
   - Hex: #RRGGBB (use as-is)
   - RGB: rgb(r, g, b) → convert to hex
   - HSL: hsl(h, s%, l%) → convert to hex
   - OKLch: oklch(L C H) → convert to approximate hex
   - Named: "blue", "red" → convert to hex

3. COMPUTED STYLES
   - Header/navbar background
   - Primary button background → accent color
   - Link colors
   - Hero section background
   - Footer background

4. MOST FREQUENT COLORS
   - Count color occurrences in stylesheets
   - Exclude grays (#fff, #000, #888, etc.) initially
   - Top non-gray color → likely primary

5. GRADIENT DETECTION
   Look for: linear-gradient, radial-gradient
   Extract stops and direction
```

### Step 6: Image Data Extraction (if images provided)

```
FOR each classified image, extract brand signals:

1. COLOR EXTRACTION
   - Extract dominant colors using visual analysis
   - Identify primary (most prominent), secondary, accent colors
   - Note color relationships (complementary, analogous, etc.)
   - For social posts: Focus on intentional brand colors, ignore platform UI colors

2. TYPOGRAPHY EXTRACTION
   - Identify visible font styles (serif, sans-serif, display, mono)
   - Note font weights visible in headings vs body
   - Observe letter-spacing and text treatments
   - For social posts: Extract from branded text, not platform UI

3. VISUAL STYLE EXTRACTION
   - Overall aesthetic (minimal, bold, playful, professional)
   - Effects visible (shadows, glows, gradients)
   - Shape language (rounded, sharp, organic)
   - Imagery style (photography, illustration, 3D)

4. BRAND VOICE EXTRACTION (from text in images)
   - Extract readable text content
   - Note tone indicators (formal, casual, technical)
   - Identify key phrases or taglines

5. STORE with source attribution:
   {
     "field": "colors.primary",
     "value": "#298DFF",
     "source": "social_post_dominant",
     "confidence": "high"
   }
```

### Step 7: Multi-Source Reconciliation

```
IF both URL and images were provided:

1. COMPARE extracted values for each field:
   - Colors: Compare hex values, calculate visual similarity
   - Typography: Compare font identifications
   - Visual style: Cross-reference observations

2. CALCULATE agreement level:
   - AGREE: Values match or are visually similar
   - PARTIAL: Values are close but noticeably different
   - CONFLICT: Values are clearly different

3. RESOLVE using priority matrix:

   | Scenario | Winner | Confidence |
   |----------|--------|------------|
   | CSS + Images agree | CSS value | HIGH |
   | CSS only, no images | CSS value | MEDIUM |
   | Images only, no CSS | Image dominant | MEDIUM-HIGH |
   | CSS + Multiple images agree | Images | HIGH |
   | CSS + Images conflict (images consistent) | Images | MEDIUM |
   | Single image conflicts with CSS | CSS | MEDIUM-LOW |
   | All sources conflict | Most frequent | LOW |

4. ASSIGN source attribute to each color:
   - "css_confirmed_by_image" - CSS verified by image (highest confidence)
   - "css_only" - Only from CSS
   - "image_only" - Only from image analysis
   - "image_dominant" - Most frequent across multiple images

5. If IMAGES_ONLY mode:
   - Use image-extracted values as primary
   - Note lower confidence for typography font family names
   - Visual style confidence can still be HIGH if images are consistent
```

### Step 8: Extract Typography

```
ANALYZE for typography:

1. FONT IMPORTS
   - Google Fonts links
   - Adobe Fonts (Typekit)
   - @font-face declarations
   - Font file URLs (.woff, .woff2)

2. FONT FAMILIES
   - Heading font (h1, h2, h3 styles)
   - Body font (p, body styles)
   - Any monospace/code fonts

3. FONT CHARACTERISTICS
   - Weights used (400, 500, 600, 700, etc.)
   - Letter-spacing patterns
   - Text-transform usage (uppercase headers?)
   - Line-height patterns

4. IF FONTS UNCLEAR
   Describe the style: "Modern geometric sans-serif"
   Rather than guessing a specific font name
```

### Step 9: Analyze Visual Style

```
EXAMINE the overall design language:

1. AESTHETIC CATEGORY
   - Minimal/clean vs information-dense
   - Dark mode vs light mode dominant
   - Tech-forward vs traditional
   - Playful vs professional

2. IMAGERY ANALYSIS
   - Photography: Do they use photos? Stock photos of people, product shots, lifestyle imagery, or none?
   - Illustrations: What style? Flat vector, isometric, 3D renders, line art, abstract shapes?
   - Examples: Describe specific visual elements (e.g., "floating UI mockups", "gradient mesh backgrounds", "hand-drawn icons")

3. SHAPE LANGUAGE
   - Border radius patterns (sharp, rounded, pill)
   - Geometric vs organic shapes
   - Card/container styling

4. EFFECTS & TREATMENTS
   - Shadow usage (none, subtle, dramatic)
   - Glassmorphism presence
   - Gradients (where and how used)
   - Grain/noise textures
   - Glow effects

5. ICONOGRAPHY
   - Style: outlined, filled, duotone, custom
   - Stroke width if outlined
   - Consistent icon set or mixed sources?
```

### Step 9B: Extract Component Styles

```
ANALYZE specific UI components:

1. BUTTONS
   - Primary button: fill color, text color, border-radius, padding
   - Secondary button: outline vs text-only, colors
   - Hover states: lift, glow, color shift, underline?
   - Active/pressed states
   - Disabled appearance

2. CARDS
   - Background color (solid, transparent, gradient)
   - Shadow style and intensity
   - Border-radius
   - Border (if any)
   - Padding/spacing patterns

3. FORM INPUTS
   - Border style (full border, bottom-only, none)
   - Border-radius
   - Focus state (border color, glow, label behavior)
   - Placeholder text styling

4. NAVIGATION
   - Header: sticky, transparent, solid?
   - Background color/blur effect
   - Logo placement
   - Link styling (underline, color, weight)
   - Mobile: hamburger, bottom nav, slide-out?
```

### Step 10: Determine Brand Voice

```
ANALYZE the copy/text for:

1. TONE INDICATORS
   - Formal vs conversational
   - Technical vs accessible
   - Confident vs humble
   - Serious vs playful

2. LANGUAGE PATTERNS
   - Jargon usage (industry-specific terms)
   - Sentence length (punchy vs flowing)
   - Use of questions
   - Call-to-action style

3. KEY PHRASES
   - Taglines and slogans
   - Repeated phrases across pages
   - How they describe themselves
   - How they address the audience

4. WHAT THEY AVOID
   - Infer from absence (no emojis, no hype, no technical jargon, etc.)
```

### Step 11: Synthesize Company Profile

```
COMBINE all signals to determine:

1. INDUSTRY/SECTOR
   Based on: products, services, terminology, competitors mentioned

   FOR WEB3 BRANDS, categorize as:
   - L1 Protocol (Sui, Aptos, Solana)
   - L2/Rollup (Arbitrum, Optimism)
   - DeFi (exchanges, lending, yield)
   - NFT/Gaming
   - Infrastructure (oracles, bridges, indexers)
   - Marketing Agency (Myosin, GIGA, Scrib3, Shillr)
   - PR/Communications (Wachsman)
   - Investment/VC (IBC Group)
   - DAO (decentralized organizations)
   - Developer Tools

2. TARGET AUDIENCE
   Based on: pricing, language complexity, imagery, pain points addressed

3. BRAND PERSONALITY
   Select 3-5 adjectives that capture the brand's character

   COMMON ADJECTIVES BY TYPE:
   - Protocols: innovative, technical, trustworthy, scalable, decentralized
   - Marketing agencies: creative, strategic, execution-focused, global, crypto-native
   - Investment: institutional, visionary, ambitious, selective, value-add
   - DAOs: community-driven, collaborative, transparent, contributor-owned
   - Developer tools: developer-first, reliable, fast, well-documented

   WEB3-SPECIFIC ADJECTIVES:
   - crypto-native, builder-focused, decentralized, permissionless
   - anti-hype, execution-focused, community-driven, contributor-owned
   - on-chain, trustless, composable, interoperable

4. KEY MESSAGES
   The 3-4 core value propositions they communicate
```

### Step 11B: Detect Web3 Signals

```
IF the brand appears to be in crypto/Web3 space, identify:

1. CRYPTO-NATIVE INDICATORS
   - Dark mode dominant (90%+ of Web3 sites)
   - Neon accent colors (greens, blues, purples)
   - "Builder" language and terminology
   - Decentralization/ownership messaging
   - DAO or contributor-owned structure
   - Tokenomics or protocol references

2. TECH STACK HINTS
   Look for in HTML/JS:
   - GSAP (scroll animations)
   - Spline/Three.js (3D elements)
   - Framer Motion (React animations)
   - Lottie (vector animations)

3. ANTI-PATTERNS (what they avoid)
   - "Moon", "lambo", meme language
   - Hype/speculative framing
   - Get-rich-quick messaging
   - Excessive emoji usage
```

---

## OUTPUT JSON SCHEMA

```json
{
  "company": {
    "name": "Company Name",
    "url": "https://example.com",
    "tagline": "Their main tagline or slogan",
    "description": "2-4 sentence description of what they do, their market position, and unique value proposition. Be specific and insightful, not generic.",
    "industry": "Specific industry/sector classification",
    "industry_category": "For Web3: 'L1 Protocol' | 'L2/Rollup' | 'DeFi' | 'NFT/Gaming' | 'Infrastructure' | 'Marketing Agency' | 'PR/Communications' | 'Investment/VC' | 'DAO' | 'Developer Tools' | 'Other'",
    "target_audience": "Who they serve - be specific about demographics, roles, or company types",
    "brand_personality": ["adjective1", "adjective2", "adjective3", "adjective4", "adjective5"],
    "key_messages": [
      "Core value proposition 1",
      "Core value proposition 2",
      "Core value proposition 3"
    ]
  },

  "colors": {
    "primary": {
      "hex": "#XXXXXX",
      "name": "Descriptive color name (e.g., 'Deep Forest Green')",
      "usage": "Where and how this color is used",
      "source": "css_confirmed_by_image | css_only | image_only | image_dominant"
    },
    "secondary": {
      "hex": "#XXXXXX",
      "name": "Descriptive color name",
      "usage": "Where and how this color is used",
      "source": "css_confirmed_by_image | css_only | image_only | image_dominant"
    },
    "accent": {
      "hex": "#XXXXXX",
      "name": "Descriptive color name",
      "usage": "CTAs, highlights, interactive elements",
      "source": "css_confirmed_by_image | css_only | image_only | image_dominant"
    },
    "background": {
      "dark": "#XXXXXX",
      "light": "#XXXXXX",
      "preferred": "dark | light"
    },
    "text": {
      "primary": "#XXXXXX",
      "secondary": "#XXXXXX",
      "on_light": "#XXXXXX",
      "on_primary": "#XXXXXX"
    },
    "data_colors": {
      "positive": "#XXXXXX",
      "negative": "#XXXXXX",
      "highlight": "#XXXXXX"
    },
    "gradients": [
      {
        "name": "Gradient name",
        "type": "linear | radial",
        "direction": "to bottom | to right | etc.",
        "stops": ["#XXXXXX", "#XXXXXX"]
      }
    ],
    "palette_mood": "2-3 sentence description of the emotional impact and reasoning behind the color choices"
  },

  "typography": {
    "heading": {
      "family": "Font name or style description",
      "weights": [500, 600, 700],
      "letter_spacing": "tight | normal | wide",
      "text_transform": "none | uppercase | sentence case"
    },
    "body": {
      "family": "Font name or style description",
      "weights": [400, 500],
      "line_height": "tight | normal | relaxed"
    },
    "data": {
      "family": "Tabular/monospace for statistics (if applicable)",
      "usage": "Large numbers, percentages, KPIs"
    },
    "style_notes": "2-3 sentence description of the typography personality and how it supports the brand"
  },

  "visual_style": {
    "overall_aesthetic": "One-line summary of the visual direction (e.g., 'Premium dark-mode fintech meets Swiss minimalism')",
    "imagery": {
      "photography": "Description of photography usage - stock photos, lifestyle, product shots, or none",
      "illustration_style": "flat vector | isometric | 3D | line art | abstract | none",
      "illustration_examples": "Specific examples of illustration types used (e.g., 'Floating dashboard elements, gradient orbs/meshes, 3D-rendered workflows')"
    },
    "iconography": {
      "style": "outlined | filled | duotone | custom geometric",
      "stroke_width": "thin | medium | thick"
    },
    "shapes": {
      "language": "geometric | organic | mixed",
      "border_radius": "0px (sharp) | 4-8px (subtle) | 12-16px (rounded) | pill"
    },
    "effects": {
      "shadows": "none | subtle | medium | dramatic",
      "glassmorphism": true | false,
      "grain_texture": true | false,
      "glow_accents": true | false
    }
  },

  "components": {
    "buttons": {
      "primary": "Description of primary button style (fill color, text color, border-radius, hover states)",
      "secondary": "Description of secondary button style",
      "states": "Description of interactive states (hover, active, disabled, success, error)"
    },
    "cards": {
      "style": "Description of card styling (background, shadow, border-radius, padding)",
      "variants": "Different card types if applicable"
    },
    "inputs": {
      "style": "Description of form input styling",
      "focus_state": "How inputs behave on focus"
    },
    "navigation": {
      "style": "Description of navigation/header styling",
      "mobile": "Mobile navigation approach if detectable"
    }
  },

  "brand_voice": {
    "tone": ["adjective1", "adjective2", "adjective3"],
    "language_style": "Description of how they write - formal vs casual, technical vs accessible, etc.",
    "key_phrases": [
      "Phrases they use repeatedly",
      "Signature terminology",
      "Taglines or slogans"
    ],
    "avoid": ["Things they clearly don't do in their messaging"],
    "energy_level": "calm | moderate | high"
  },

  "sources": {
    "url": "https://example.com | null (if images only)",
    "url_pages_fetched": ["homepage", "about"],
    "images_provided": 0,
    "image_types_detected": ["website_screenshot", "social_post", "brand_asset"]
  },

  "field_confidence": {
    "colors": "high | medium | low",
    "typography": "high | medium | low",
    "visual_style": "high | medium | low",
    "components": "high | medium | low",
    "brand_voice": "high | medium | low"
  },

  "extraction_metadata": {
    "primary_source": "url | images | combined",
    "confidence": "high | medium | low",
    "confidence_notes": "Explanation of confidence level and source agreement",
    "extracted_at": "ISO timestamp"
  },

  "web3_signals": {
    "is_web3_brand": true | false,
    "crypto_native_indicators": [
      "List of signals that indicate crypto/Web3 positioning",
      "Examples: dark mode, neon accents, 'builder' language, DAO structure, decentralization messaging"
    ],
    "tech_stack_hints": [
      "Detected technologies: GSAP, Spline 3D, Three.js, etc.",
      "Animation libraries, 3D frameworks, etc."
    ],
    "positioning": "Protocol | Infrastructure | Service Provider | Investment | Community",
    "anti_patterns": ["Things they explicitly avoid: hype language, meme culture, etc."]
  }
}
```

---

## CONFIDENCE LEVELS

| Level | Criteria |
|-------|----------|
| **high** | Clear CSS variables, consistent visual identity, brand page found, or screenshot provided |
| **medium** | Colors extracted from CSS but no brand guidelines, consistent visual identity |
| **low** | Limited color data, inconsistent styling, or generic template-like design |

---

## QUALITY REQUIREMENTS

Before outputting JSON:

1. **Colors must be specific** - No generic descriptions. "#3B82F6" not "blue"
2. **Descriptions must be insightful** - Analyze what makes THIS brand unique, not generic statements
3. **Personality must match** - brand_personality should align with visual evidence
4. **All hex codes valid** - 6-character format with # prefix
5. **JSON must be parseable** - Valid syntax, no trailing commas

---

## WHAT NOT TO INCLUDE

This agent focuses ONLY on brand identity. Do NOT output:
- Logo recreation code
- Animation parameters
- Motion graphics guidance
- Motion Canvas configuration
- Technical implementation details

---

## EXAMPLE OUTPUT

### Sui (L1 Protocol)

```json
{
  "company": {
    "name": "Sui",
    "url": "https://sui.io",
    "tagline": "Build full stack",
    "description": "Sui is a Layer 1 blockchain platform delivering the full stack for a new global economy. The platform enables assets, data, and permissions to be owned, programmed, and verified, emphasizing superior products, real user trust, and shared value rather than extraction.",
    "industry": "Blockchain Infrastructure / Layer 1 Protocol",
    "industry_category": "L1 Protocol",
    "target_audience": "Blockchain developers, Web3 builders, enterprises seeking programmable ownership and decentralized infrastructure",
    "brand_personality": ["innovative", "technical", "trustworthy", "ambitious", "builder-focused"],
    "key_messages": [
      "The full stack for a new global economy",
      "Assets, data, and permissions - owned, programmed, verified",
      "Value that's shared, not extracted",
      "Superior products with real user trust"
    ]
  },

  "colors": {
    "primary": {
      "hex": "#298DFF",
      "name": "Sui Blue",
      "usage": "Primary brand color, CTAs, interactive elements, logo accent",
      "source": "css_only"
    },
    "secondary": {
      "hex": "#5CA9FF",
      "name": "Light Sui Blue",
      "usage": "Secondary accents, hover states, gradients",
      "source": "css_only"
    },
    "accent": {
      "hex": "#298DFF",
      "name": "Sui Blue",
      "usage": "Buttons, links, focus states",
      "source": "css_only"
    },
    "background": {
      "dark": "#000000",
      "light": "#FFFFFF",
      "preferred": "dark"
    },
    "text": {
      "primary": "#FFFFFF",
      "secondary": "#89919F",
      "on_light": "#343940",
      "on_primary": "#FFFFFF"
    },
    "data_colors": {
      "positive": "#4ADE80",
      "negative": "#F87171",
      "highlight": "#298DFF"
    },
    "gradients": [
      {
        "name": "Blue gradient",
        "type": "linear",
        "direction": "to right",
        "stops": ["#298DFF", "#5CA9FF"]
      }
    ],
    "palette_mood": "Technical and trustworthy. The blue palette conveys stability and innovation - appropriate for critical infrastructure. Dark mode dominance signals modern, developer-focused positioning while blue inspires confidence."
  },

  "typography": {
    "heading": {
      "family": "System sans-serif (fluid typography)",
      "weights": [500, 600, 700],
      "letter_spacing": "tight",
      "text_transform": "none"
    },
    "body": {
      "family": "System sans-serif",
      "weights": [400, 500],
      "line_height": "relaxed"
    },
    "data": {
      "family": "Monospace",
      "usage": "Code examples, technical specs, addresses"
    },
    "style_notes": "Fluid typography scales responsively across devices (320px-1920px). Clean, antialiased rendering with modular scale system. Technical precision in type hierarchy."
  },

  "visual_style": {
    "overall_aesthetic": "Dark mode tech infrastructure. Premium L1 blockchain positioning with interactive depth.",
    "imagery": {
      "photography": "Minimal, focuses on abstract visualizations",
      "illustration_style": "Abstract, interactive gradients",
      "illustration_examples": "Cursor-reactive radial gradients, floating geometric elements, depth layers"
    },
    "iconography": {
      "style": "Custom outlined with animated states",
      "stroke_width": "medium"
    },
    "shapes": {
      "language": "geometric",
      "border_radius": "8-12px"
    },
    "effects": {
      "shadows": "subtle",
      "glassmorphism": true,
      "grain_texture": false,
      "glow_accents": true
    }
  },

  "components": {
    "buttons": {
      "primary": "Blue background (#298DFF), white text, animated arrow icons on hover, medium radius",
      "secondary": "Dark/muted variant (#4B515B) with reduced opacity",
      "states": "Hover: color shift with arrow translateX. Disabled: muted gray. Success: checkmark icon"
    },
    "cards": {
      "style": "Dark backgrounds with glassmorphism effects, backdrop blur",
      "variants": "Feature cards, ecosystem partner cards"
    },
    "inputs": {
      "style": "Dark theme, subtle borders",
      "focus_state": "Blue accent border"
    },
    "navigation": {
      "style": "Fixed header with backdrop blur",
      "mobile": "Responsive with mobile menu"
    }
  },

  "brand_voice": {
    "tone": ["technical", "confident", "visionary"],
    "language_style": "Developer-focused but accessible. Emphasizes ownership, programmability, and trust. Avoids hype in favor of capability statements.",
    "key_phrases": [
      "Build full stack",
      "New global economy",
      "Owned, programmed, verified",
      "Shared, not extracted"
    ],
    "avoid": ["Hype language", "Vague promises", "Non-technical marketing speak"],
    "energy_level": "moderate"
  },

  "sources": {
    "url": "https://sui.io",
    "url_pages_fetched": ["homepage"],
    "images_provided": 0,
    "image_types_detected": []
  },

  "field_confidence": {
    "colors": "high",
    "typography": "medium",
    "visual_style": "high",
    "components": "high",
    "brand_voice": "high"
  },

  "extraction_metadata": {
    "primary_source": "url",
    "confidence": "high",
    "confidence_notes": "Clear hex codes for brand blue (#298DFF). GSAP animations and glassmorphism effects detected. Strong design system with consistent interactive patterns.",
    "extracted_at": "2026-01-07"
  },

  "web3_signals": {
    "is_web3_brand": true,
    "crypto_native_indicators": [
      "Dark mode dominant",
      "Builder-focused language",
      "Decentralization/ownership messaging",
      "Protocol-level positioning",
      "Technical documentation emphasis"
    ],
    "tech_stack_hints": [
      "GSAP (scroll animations)",
      "Glassmorphism effects",
      "Cursor-reactive gradients"
    ],
    "positioning": "Protocol",
    "anti_patterns": ["Avoids hype language", "No speculative framing", "No meme references"]
  }
}
```

### Myosin (Marketing Agency / DAO)

```json
{
  "company": {
    "name": "Myosin",
    "url": "https://myosin.xyz",
    "tagline": "Campaigns Crossing Borders",
    "description": "Myosin is a global crypto marketing network operating as a DAO with 100+ members across 6 continents. They connect top-tier marketing talent with leading crypto brands, emphasizing contributor ownership over traditional agency structure.",
    "industry": "Web3 Marketing / DAO-based Agency",
    "industry_category": "Marketing Agency",
    "target_audience": "Crypto projects and Web3 brands seeking global marketing reach, decentralized teams, and community-driven campaign execution",
    "brand_personality": ["global", "decentralized", "innovative", "collaborative", "crypto-native"],
    "key_messages": [
      "Where Human Expertise Meets Machine Intelligence",
      "Contributor-owned, not agency-structured",
      "100+ members across 6 continents"
    ]
  },

  "colors": {
    "primary": {
      "hex": "#BFBFBD",
      "name": "Warm Beige",
      "usage": "Primary background, neutral base",
      "source": "css_only"
    },
    "secondary": {
      "hex": "#6989FE",
      "name": "Electric Blue",
      "usage": "Secondary accents, links",
      "source": "css_only"
    },
    "accent": {
      "hex": "#FFFF6A",
      "name": "Bright Yellow",
      "usage": "CTAs, highlights",
      "source": "css_only"
    },
    "background": {
      "dark": "#000000",
      "light": "#BFBFBD",
      "preferred": "light"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#666666",
      "on_light": "#000000",
      "on_primary": "#000000"
    },
    "data_colors": {
      "positive": "#80FAA3",
      "negative": "#FF29E8",
      "highlight": "#FFFF6A"
    },
    "gradients": [
      {
        "name": "Beige to Yellow",
        "type": "linear",
        "direction": "to bottom",
        "stops": ["#BFBFBD", "#FFFF6A"]
      }
    ],
    "palette_mood": "Warm and approachable with high-energy accents. Bridges DAO community warmth with crypto innovation."
  },

  "typography": {
    "heading": {
      "family": "Inter",
      "weights": [500, 600, 700],
      "letter_spacing": "normal",
      "text_transform": "none"
    },
    "body": {
      "family": "IBM Plex Sans",
      "weights": [400, 500],
      "line_height": "relaxed"
    },
    "data": {
      "family": "IBM Plex Mono",
      "usage": "Code, technical specs"
    },
    "style_notes": "Inter + IBM Plex creates technical yet approachable feel. Monospace signals crypto/tech credibility."
  },

  "visual_style": {
    "overall_aesthetic": "Warm minimalism meets Web3 tech",
    "imagery": {
      "photography": "Minimal, abstract visuals",
      "illustration_style": "Geometric, abstract",
      "illustration_examples": "Gradient backgrounds, clean vectors"
    },
    "iconography": {
      "style": "Custom minimal",
      "stroke_width": "medium"
    },
    "shapes": {
      "language": "geometric",
      "border_radius": "20px"
    },
    "effects": {
      "shadows": "subtle",
      "glassmorphism": false,
      "grain_texture": false,
      "glow_accents": false
    }
  },

  "components": {
    "buttons": {
      "primary": "Dark background, light text, 20px radius, 50px height",
      "secondary": "Light/outlined variant",
      "states": "Smooth hover transitions"
    },
    "cards": {
      "style": "Clean backgrounds, subtle shadows, rounded corners",
      "variants": "Project cards in carousel"
    },
    "inputs": {
      "style": "Clean, minimal borders",
      "focus_state": "Accent highlight"
    },
    "navigation": {
      "style": "Clean header, logo left, links right",
      "mobile": "Responsive"
    }
  },

  "brand_voice": {
    "tone": ["collaborative", "global", "innovative"],
    "language_style": "Professional yet community-focused. Uses DAO/Web3 terminology naturally.",
    "key_phrases": [
      "Campaigns Crossing Borders",
      "Talk to the Hive",
      "Contributor-owned"
    ],
    "avoid": ["Traditional agency language", "Corporate jargon"],
    "energy_level": "moderate"
  },

  "sources": {
    "url": "https://myosin.xyz",
    "url_pages_fetched": ["homepage"],
    "images_provided": 0,
    "image_types_detected": []
  },

  "field_confidence": {
    "colors": "high",
    "typography": "high",
    "visual_style": "medium",
    "components": "medium",
    "brand_voice": "high"
  },

  "extraction_metadata": {
    "primary_source": "url",
    "confidence": "high",
    "confidence_notes": "Explicit hex codes in CSS. Typography clearly defined via Google Fonts imports.",
    "extracted_at": "2026-01-07"
  },

  "web3_signals": {
    "is_web3_brand": true,
    "crypto_native_indicators": [
      "DAO structure",
      "Contributor ownership emphasis",
      "Global/decentralized positioning",
      "Crypto brand clients"
    ],
    "tech_stack_hints": [],
    "positioning": "Service Provider",
    "anti_patterns": ["Avoids traditional agency framing"]
  }
}
```

### Multi-Source Example (URL + Screenshots + Social Post)

This example demonstrates extraction from multiple sources with reconciliation:

**Input provided:**
- URL: https://example-brand.io
- Images: homepage_screenshot.png, twitter_post.png, brand_colors.png

```json
{
  "company": {
    "name": "Example Brand",
    "url": "https://example-brand.io",
    "tagline": "Build the future",
    "description": "Example Brand is a developer platform providing infrastructure tools. Their visual identity emphasizes technical precision with vibrant accent colors.",
    "industry": "Developer Tools",
    "industry_category": "Developer Tools",
    "target_audience": "Software developers and engineering teams",
    "brand_personality": ["technical", "modern", "reliable", "innovative", "developer-first"],
    "key_messages": [
      "Build faster with better tools",
      "Developer experience matters",
      "Scale without complexity"
    ]
  },

  "colors": {
    "primary": {
      "hex": "#6366F1",
      "name": "Indigo",
      "usage": "Primary brand color, navigation, key UI elements",
      "source": "css_confirmed_by_image"
    },
    "secondary": {
      "hex": "#8B5CF6",
      "name": "Violet",
      "usage": "Gradients, secondary accents",
      "source": "css_confirmed_by_image"
    },
    "accent": {
      "hex": "#22D3EE",
      "name": "Cyan",
      "usage": "CTAs, highlights, success states",
      "source": "image_dominant"
    },
    "background": {
      "dark": "#0F172A",
      "light": "#F8FAFC",
      "preferred": "dark"
    },
    "text": {
      "primary": "#F8FAFC",
      "secondary": "#94A3B8",
      "on_light": "#1E293B",
      "on_primary": "#FFFFFF"
    },
    "data_colors": {
      "positive": "#22C55E",
      "negative": "#EF4444",
      "highlight": "#22D3EE"
    },
    "gradients": [
      {
        "name": "Primary gradient",
        "type": "linear",
        "direction": "to right",
        "stops": ["#6366F1", "#8B5CF6", "#22D3EE"]
      }
    ],
    "palette_mood": "Modern and technical with energetic accents. The indigo-violet-cyan progression creates depth while maintaining accessibility. Dark mode preference signals developer focus."
  },

  "typography": {
    "heading": {
      "family": "Inter",
      "weights": [600, 700],
      "letter_spacing": "tight",
      "text_transform": "none"
    },
    "body": {
      "family": "Inter",
      "weights": [400, 500],
      "line_height": "relaxed"
    },
    "data": {
      "family": "JetBrains Mono",
      "usage": "Code snippets, terminal output, technical specs"
    },
    "style_notes": "Inter provides clarity for technical content. JetBrains Mono reinforces developer credibility. Clean hierarchy supports documentation-heavy content."
  },

  "visual_style": {
    "overall_aesthetic": "Modern developer platform - dark mode with gradient accents and technical precision",
    "imagery": {
      "photography": "Minimal, abstract tech visualizations",
      "illustration_style": "Gradient-filled abstract shapes",
      "illustration_examples": "Floating code blocks, gradient orbs, wireframe elements"
    },
    "iconography": {
      "style": "outlined",
      "stroke_width": "medium"
    },
    "shapes": {
      "language": "geometric",
      "border_radius": "8px"
    },
    "effects": {
      "shadows": "subtle",
      "glassmorphism": true,
      "grain_texture": false,
      "glow_accents": true
    }
  },

  "components": {
    "buttons": {
      "primary": "Gradient background (indigo to violet), white text, 8px radius, glow on hover",
      "secondary": "Transparent with border, text matches primary color",
      "states": "Hover: enhanced glow. Focus: ring outline. Disabled: muted opacity"
    },
    "cards": {
      "style": "Dark glass effect, subtle border, 12px radius",
      "variants": "Feature cards, code snippet cards, pricing cards"
    },
    "inputs": {
      "style": "Dark background, subtle border, 6px radius",
      "focus_state": "Cyan border glow"
    },
    "navigation": {
      "style": "Sticky header with backdrop blur",
      "mobile": "Hamburger menu with slide-out drawer"
    }
  },

  "brand_voice": {
    "tone": ["technical", "direct", "helpful"],
    "language_style": "Developer-focused, concise, code examples over lengthy explanations",
    "key_phrases": [
      "Build the future",
      "Developer experience",
      "Ship faster"
    ],
    "avoid": ["Marketing fluff", "Vague promises", "Non-technical language"],
    "energy_level": "moderate"
  },

  "sources": {
    "url": "https://example-brand.io",
    "url_pages_fetched": ["homepage", "docs", "pricing"],
    "images_provided": 3,
    "image_types_detected": ["website_screenshot", "social_post", "brand_asset"]
  },

  "field_confidence": {
    "colors": "high",
    "typography": "high",
    "visual_style": "high",
    "components": "high",
    "brand_voice": "medium"
  },

  "extraction_metadata": {
    "primary_source": "combined",
    "confidence": "high",
    "confidence_notes": "CSS colors confirmed by homepage screenshot. Brand asset provided official color palette. Social post validated consistent usage across channels. Typography identified from both CSS imports and visual analysis.",
    "extracted_at": "2026-01-07"
  },

  "web3_signals": {
    "is_web3_brand": false,
    "crypto_native_indicators": [],
    "tech_stack_hints": ["React", "Tailwind CSS", "Framer Motion"],
    "positioning": "N/A",
    "anti_patterns": []
  }
}
```

### Images-Only Example (Social Posts)

This example demonstrates extraction when only social media posts are provided:

**Input provided:**
- Images: twitter_post_1.png, twitter_post_2.png, instagram_post.png

```json
{
  "company": {
    "name": "Detected Brand",
    "url": null,
    "tagline": "Extracted from social post text",
    "description": "Brand identity extracted from social media presence. Limited company details available without URL.",
    "industry": "Unable to determine precisely",
    "industry_category": "Other",
    "target_audience": "Inferred from social post content and visual style",
    "brand_personality": ["bold", "modern", "engaging"],
    "key_messages": [
      "Message extracted from post 1",
      "Message extracted from post 2"
    ]
  },

  "colors": {
    "primary": {
      "hex": "#FF6B35",
      "name": "Vibrant Orange",
      "usage": "Dominant color across all posts",
      "source": "image_dominant"
    },
    "secondary": {
      "hex": "#1A1A2E",
      "name": "Deep Navy",
      "usage": "Background color in posts",
      "source": "image_only"
    },
    "accent": {
      "hex": "#F7F7F7",
      "name": "Off White",
      "usage": "Text and highlights",
      "source": "image_only"
    },
    "background": {
      "dark": "#1A1A2E",
      "light": "#F7F7F7",
      "preferred": "dark"
    },
    "text": {
      "primary": "#F7F7F7",
      "secondary": "#B0B0B0",
      "on_light": "#1A1A2E",
      "on_primary": "#FFFFFF"
    },
    "data_colors": {
      "positive": "#4CAF50",
      "negative": "#F44336",
      "highlight": "#FF6B35"
    },
    "gradients": [],
    "palette_mood": "Bold and energetic. The orange-navy combination creates strong contrast and high visibility for social media. Suggests a confident, attention-grabbing brand."
  },

  "typography": {
    "heading": {
      "family": "Bold sans-serif (visual identification)",
      "weights": [700],
      "letter_spacing": "normal",
      "text_transform": "none"
    },
    "body": {
      "family": "Clean sans-serif (visual identification)",
      "weights": [400, 500],
      "line_height": "normal"
    },
    "data": {
      "family": "Unknown",
      "usage": "N/A"
    },
    "style_notes": "Typography identified visually from social posts. Exact font family cannot be confirmed without URL or brand guidelines. Appears to be a geometric sans-serif with bold weights for headlines."
  },

  "visual_style": {
    "overall_aesthetic": "Bold social-first branding with high contrast and attention-grabbing colors",
    "imagery": {
      "photography": "Product-focused shots with branded backgrounds",
      "illustration_style": "Minimal, graphic elements",
      "illustration_examples": "Geometric shapes, bold typography treatments"
    },
    "iconography": {
      "style": "filled",
      "stroke_width": "N/A"
    },
    "shapes": {
      "language": "geometric",
      "border_radius": "4-8px"
    },
    "effects": {
      "shadows": "none",
      "glassmorphism": false,
      "grain_texture": false,
      "glow_accents": false
    }
  },

  "components": {
    "buttons": {
      "primary": "Unable to determine from social posts",
      "secondary": "Unable to determine from social posts",
      "states": "N/A"
    },
    "cards": {
      "style": "N/A - no UI components visible",
      "variants": "N/A"
    },
    "inputs": {
      "style": "N/A",
      "focus_state": "N/A"
    },
    "navigation": {
      "style": "N/A",
      "mobile": "N/A"
    }
  },

  "brand_voice": {
    "tone": ["bold", "casual", "engaging"],
    "language_style": "Conversational, uses emojis sparingly, direct messaging",
    "key_phrases": [
      "Phrases extracted from post captions"
    ],
    "avoid": ["Unknown without more content"],
    "energy_level": "high"
  },

  "sources": {
    "url": null,
    "url_pages_fetched": [],
    "images_provided": 3,
    "image_types_detected": ["social_post", "social_post", "social_post"]
  },

  "field_confidence": {
    "colors": "high",
    "typography": "low",
    "visual_style": "medium",
    "components": "low",
    "brand_voice": "medium"
  },

  "extraction_metadata": {
    "primary_source": "images",
    "confidence": "medium",
    "confidence_notes": "Colors extracted with high confidence from consistent social posts. Typography family cannot be confirmed (visual identification only). Component styles unavailable without website. Brand voice inferred from limited post captions.",
    "extracted_at": "2026-01-07"
  },

  "web3_signals": {
    "is_web3_brand": false,
    "crypto_native_indicators": [],
    "tech_stack_hints": [],
    "positioning": "N/A",
    "anti_patterns": []
  }
}
```
