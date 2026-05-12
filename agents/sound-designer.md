# Sound Designer — ElevenLabs SFX Prompts + Revideo Manifest

Generate ElevenLabs SFX prompts AND a structured `sfx-plan.json` manifest that the Python script `scripts/generate_sfx.py` consumes to produce MP3s + a `sfx-manifest.json` that the code-generator wires into `<Audio>` components.

---

## Step 0: Read motion_design First

Before generating any prompts, read `projects/{brand}/brand-identity.json` and use the `motion_design` block to align sound aesthetic with motion personality.

```
EXTRACT these decision inputs:
- motion_design.sound_aesthetic_hint  → primary style choice
- motion_design.energy_curve          → vocabulary intensity (calm vs. frenetic)
- motion_design.pace.beat_density     → SFX density quota (sparse → max 1 per 2 beats; hyperactive → 1 per beat)
- motion_design.pace.average_beat_duration → beat_offset granularity
- motion_design.transition_vocabulary  → which transition SFX to use
- motion_design.secondary_motion.trail_intensity → whether to add trail SFX
```

If `motion_design` is missing or incomplete, default to **Minimal & Subtle** style with sparse density.

---

## Style Decision Table (from motion_design)

Pick a primary style based on `motion_design.sound_aesthetic_hint`. The hint is set by `brand-extractor.md`.

| Style | When to Use | Vocabulary Notes |
|---|---|---|
| **Minimal & Subtle** | `sound_aesthetic_hint == 'Minimal & Subtle'` OR `energy_curve == 'calm'` | "soft", "gentle", "warm", "very quiet". Avoid "punchy", "crisp". |
| **Bold & Punchy** | `sound_aesthetic_hint == 'Bold & Punchy'` AND `energy_curve in ['high','frenetic']` | "crisp", "tight", "sharp", "impact". Avoid "soft", "gentle". |
| **Ambient & Atmospheric** | `sound_aesthetic_hint == 'Ambient & Atmospheric'` | "layered", "textural", "ethereal", "spacious", "resonant". |
| **Tech & Digital** | `sound_aesthetic_hint == 'Tech & Digital'` OR Web3/dev tools | "digital", "synth", "data-flow", "electronic", "circuit". |

**Cross-check:** Does the chosen style match `motion_design.transition_vocabulary.primary`?
- If transitions are `glitch`: pair with Tech & Digital and use "digital glitch", "bit-crushed" descriptors.
- If transitions are `fade`: pair with Minimal & Subtle or Ambient & Atmospheric.

---

## Beat-Synced SFX Planning Rules

These rules govern WHEN each SFX plays. Every entry in the output `sfx-plan.json` must follow them.

### Anchor Types

Each SFX has an anchor specifying WHEN it plays. Use one:

- **`beat_offset`** (PREFERRED): seconds from the start of the scene. Most portable.
- **`vo_word_index`**: word index in the scene's VO line. Use when the SFX must land on a specific VO syllable.
- **`absolute_seconds`**: seconds from the start of the whole video. Use only when scene start times are known and fixed.

### Lead Time Rule

Sound has attack — visual perception leads audio. Adjust beat_offset based on SFX type:

| SFX Type | Lead Time |
|---|---|
| Percussive (UI click, impact, snap) | -0.0 to -0.03s (lands ON visual beat) |
| Ambient (atmosphere, layer) | -0.1 to -0.2s (starts before visual) |
| Transition (whoosh, wipe) | -0.05 to -0.1s |
| Glow/light | -0.05 (just before visual peak) |

### Density Quota (per scene)

Capped by `motion_design.pace.beat_density`:
- `sparse`: max 1 SFX per 0.6s (every other beat)
- `moderate`: max 1 foreground SFX per beat (0.3s default)
- `dense`: max 2 SFX per beat (1 foreground + 1 background/accent)
- `hyperactive`: max 3 SFX per beat (1 foreground + 1 accent + 1 background loop)

### Layer Rules

- **`foreground`**: percussive events — UI clicks, impacts, snaps. Volume 0.7-1.0. Max 1 concurrent.
- **`accent`**: emphasis events — glows, sparkles, pulse hits. Volume 0.6-0.9.
- **`background`**: ambient layers — hums, drones, atmosphere. Volume 0.2-0.4. Max 1 layer per scene.
- **`ambient`**: subtle textures — particles, low whispers. Volume 0.3-0.5.

### Forbidden Overlaps

- NEVER two `foreground` SFX overlap in time.
- NEVER two `background` loops simultaneously (mud).
- Accent + foreground simultaneous is OK if their volumes don't compete.

---

## Output Schema: sfx-plan.json

This is the agent's deliverable. Output to `projects/{brand}/sfx-plan.json`.

```json
{
  "project": "brand_name",
  "framerate": 30,
  "default_volume": 0.7,
  "schema_version": "1.0",
  "style": "Minimal & Subtle | Bold & Punchy | Ambient & Atmospheric | Tech & Digital",
  "scenes": {
    "scene1": [
      {
        "id": "s1_001",
        "name": "logo_appears",
        "scene": "scene1",
        "anchor": "beat_offset | vo_word_index | absolute_seconds",
        "beat_offset": 0.0,
        "vo_word_index": null,
        "absolute_seconds": null,
        "duration": 0.5,
        "prompt": "ElevenLabs prompt text — use vocabulary matching the chosen style",
        "category": "ui | transition | impact | ambient | data | mechanical | glow",
        "layer": "foreground | background | accent | ambient",
        "volume": 0.8
      }
    ],
    "scene2": [ /* ... */ ]
  }
}
```

**Rules:**
- Every entry must have an `id` unique across the file (`s{scene}_{ordinal_3digits}`)
- `anchor` field declares which timing field is authoritative; the other two may be null
- `category` matches the taxonomy tables below (`ui`, `transition`, `impact`, `ambient`, `data`, `mechanical`, `glow`)
- `volume` defaults by `layer` if omitted (foreground=0.8, accent=0.7, background=0.3, ambient=0.4)

---

## Wiring Up: How code-generator Consumes This

The flow is:

1. **Sound-designer agent** writes `projects/{brand}/sfx-plan.json`
2. **`python scripts/generate_sfx.py --project {brand}`** reads `sfx-plan.json`, generates MP3s into `projects/{brand}/sfx/{scene}/{id}_{name}.mp3`, and writes `projects/{brand}/sfx-manifest.json` (with `file` paths and computed `start_offset_seconds`)
3. **code-generator agent** imports `sfx-manifest.json` and wires `<Audio>` components per the pattern in `agents/code-generator.md` → "Wiring SFX from sfx-manifest.json"

The agent's deliverable is `sfx-plan.json` ONLY. The Python script is responsible for producing the manifest. The code-generator handles the final `<Audio>` wiring.

**Schema versioning:** Always set `"schema_version": "1.0"`. The Python script warns and falls back if mismatched.

---

## Duration Guide

| Category | Duration | Use Case |
|---|---|---|
| Quick hit | 0.5s | UI pops, dots appearing |
| Short | 1s | Icon reveals, small transitions |
| Standard | 1-2s | Box appearances, pulses |
| Medium | 2-3s | Builds, sustained glows |
| Long | 3-5s | Ambient layers, flowing data |

---

## Sound Categories & Prompts

### UI/Interface (`category: ui`)

| Sound | ElevenLabs Prompt | Duration |
|---|---|---|
| Icon appears | `soft UI confirmation tone, delicate interface sound` | 0.5s |
| Text reveals | `quiet text reveal, soft ethereal tone` | 0.5s |
| Checkmark success | `gentle satisfying confirmation tone, soft success chime` | 0.5s |
| Button click | `soft digital click, gentle interface tap` | 0.3s |
| Error/denied | `soft authoritative tone, gentle denial sound` | 0.4s |

### Transitions/Whooshes (`category: transition`)

| Sound | ElevenLabs Prompt | Duration |
|---|---|---|
| Element appears | `gentle upward whoosh with soft bounce, subtle spring sound` | 1s |
| Shrink/minimize | `soft descending tone, gentle compression sound` | 0.5s |
| Beam launch | `soft energy beam launching, gentle directed whoosh` | 0.5s |
| Slide in | `quiet smooth sliding, soft movement sound` | 0.5s |
| Zoom in | `gentle forward whoosh, soft approaching sound` | 0.5s |
| Whip pan | `quick directional whoosh with motion blur character` | 0.3s |
| Mask reveal | `soft sweep across, fabric-tearing-open texture` | 0.6s |

### Impacts/Hits (`category: impact`)

| Sound | ElevenLabs Prompt | Duration |
|---|---|---|
| Soft collision | `soft collision impact, gentle shield block sound, not harsh` | 0.5s |
| Shatter | `glass shattering gently, soft crystalline break with subtle tonal burst` | 1s |
| Pulse emphasis | `gentle unified resonance, soft triumphant glow` | 0.5s |
| Landing | `quiet low thud, soft landing on surface, minimal` | 0.5s |
| Snap | `crisp tactile snap, tight wood-block character` | 0.2s |

### Ambient/Atmosphere (`category: ambient`)

| Sound | ElevenLabs Prompt | Duration |
|---|---|---|
| Background hum | `soft ambient hum fading in, gentle electronic warmth, very quiet` | 2s |
| Particles | `very soft whisper texture, gentle floating particles, ambient` | 2s |
| Data stream | `quiet flowing ambient tone, soft river-like data` | 1.5s |
| Glow sustained | `gentle resonant hum, soft sustained power tone` | 1s |

### Data Flow/Digital (`category: data`)

| Sound | ElevenLabs Prompt | Duration |
|---|---|---|
| Data flowing | `gentle data flowing through channels, soft movement` | 1s |
| Typing/keystrokes | `quiet keystroke, soft typing sound` | 0.1s |
| Binary bits | `soft digital bleeps, gentle bit sounds, staccato` | 0.5s |
| Loading | `soft ascending digital tone, gentle progress sound` | 1s |

### Mechanical (`category: mechanical`)

| Sound | ElevenLabs Prompt | Duration |
|---|---|---|
| Gear sounds | `quiet mechanical click, soft inner mechanism` | 0.5s |
| Line drawing | `soft pen stroke sound, soft drawing line` | 0.5s |
| Brackets | `soft pen drawing strokes, gentle` | 0.5s |
| Rotation | `soft whoosh, gentle mechanical turn, subtle` | 0.5s |

### Glows & Lights (`category: glow`)

| Sound | ElevenLabs Prompt | Duration |
|---|---|---|
| Neon glow | `quiet neon hum, soft glowing bar sound` | 0.5s |
| Light pulse | `gentle electronic pulse, soft glow sound, brief shimmer` | 0.5s |
| Shimmer sweep | `soft shimmer sweep, gentle light passing over surface` | 1s |
| Sparkle | `quiet sparkle wave, delicate luminescence sound` | 1s |

---

## Prompt Writing Tips

### Structure

```
[adjective] [sound type], [descriptive quality], [intensity modifier]
```

Examples:
- `soft ambient hum fading in, gentle electronic warmth, very quiet`
- `gentle upward whoosh with soft bounce, subtle spring sound`
- `quiet cascading pings, soft glass-like tones spreading outward, delicate`

### Sound Vocabulary by energy_curve

Match prompt vocabulary to `motion_design.energy_curve`:

- **`calm`**: drop "punchy", "sharp", "crisp", "tight". Add "warm", "soft", "spacious", "resonant", "gentle".
- **`moderate`**: balanced — "clear", "present", "defined" mixed with softening modifiers as needed.
- **`high`**: drop "soft", "gentle", "very quiet". Add "crisp", "tight", "punchy", "impact", "snap".
- **`frenetic`**: emphasize speed — "rapid", "staccato", "machine-gun", "blast", "shred".

### Adjective Bank

**Quiet modifiers:** soft, gentle, quiet, subtle, delicate, minimal, very quiet
**Texture modifiers:** crystalline, electronic, metallic, organic, ethereal
**Motion modifiers:** flowing, cascading, ascending, descending, spreading
**Quality modifiers:** smooth, sharp, warm, cool, resonant

### Intensity Scale

| Level | Keywords |
|---|---|
| Very subtle | `very quiet, minimal, almost imperceptible` |
| Subtle | `soft, gentle, quiet, delicate` |
| Moderate | `clear, present, defined` |
| Prominent | `bold, impactful, resonant` |

---

## Usage Tips for ElevenLabs

1. **Copy the prompt text between backticks** (the text after "ElevenLabs Prompt")
2. **Adjust duration** in ElevenLabs to match the Duration column
3. **Layer sounds** — some moments benefit from 2-3 subtle sounds stacked
4. **Consistent volume** — keep all sounds at similar levels for mixing flexibility
5. **Leave headroom** — subtle sounds are easier to boost than loud sounds to reduce

---

## Quality Checklist (Before Outputting sfx-plan.json)

Before emitting the JSON, verify:

- [ ] Style choice aligns with `motion_design.sound_aesthetic_hint`
- [ ] Total SFX count respects `motion_design.pace.beat_density` quota
- [ ] No two `foreground` SFX overlap in time
- [ ] Every entry has a valid `category` from the taxonomy (`ui` | `transition` | `impact` | `ambient` | `data` | `mechanical` | `glow`)
- [ ] Every entry has a valid `layer` (`foreground` | `accent` | `background` | `ambient`)
- [ ] Every entry has exactly ONE active anchor field (others null)
- [ ] Vocabulary in prompts matches the `energy_curve` (no "soft" in `frenetic`; no "punchy" in `calm`)
- [ ] `schema_version: "1.0"` is present
- [ ] All IDs unique
- [ ] JSON parseable (no trailing commas)

---

*This template defines the contract between sound design, the Python SFX generator, and the code-generator. Adapt prompts and timing to the brand's motion_design block.*
