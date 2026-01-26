# Revideo Workspace

A monorepo for generating automated short-form video content using [Revideo](https://revideo.dev/).

## Project Structure

```
/revideo/
├── agents/                    # Generic agent templates (brand-agnostic)
│   ├── brand-extractor.md     # Extract brand identity from URLs/images
│   ├── code-generator.md      # Generate Revideo TSX scenes
│   └── sound-designer.md      # Create ElevenLabs SFX prompts
│
├── docs/
│   └── technical-reference.md # Revideo API documentation
│
├── scripts/
│   └── generate_sfx.py        # Generate SFX using ElevenLabs API
│
├── projects/
│   ├── raiku/                 # Raiku brand project
│   │   ├── brand-identity.json
│   │   ├── code-generator.md  # Raiku-specific agent (extends generic)
│   │   └── src/...
│   │
│   └── realmotion/            # RealMotion brand project
│       ├── brand-identity.json
│       ├── code-generator.md  # RealMotion-specific agent
│       └── src/...
│
└── node_modules/              # Single hoisted node_modules (npm workspaces)
```

## Automation Workflow

### 1. Brand Identity Extraction

Use `agents/brand-extractor.md` to generate a brand identity JSON from:
- Company website URL
- Screenshots/images
- Existing brand assets

Output: `projects/{brand}/brand-identity.json`

### 2. Video Code Generation

Each project has a brand-specific `code-generator.md` that:
1. References `agents/code-generator.md` for the generic workflow
2. Loads brand colors/styles from local `brand-identity.json`
3. Uses brand constants from `src/lib/brand.ts`

Workflow:
1. Read `docs/technical-reference.md` first
2. Read project's `brand-identity.json`
3. Parse user's timestamp script (VO + visual directions)
4. Generate TSX scene files with visual beats every 0.3s
5. Output to `src/scenes/`

### 3. Sound Design

Use `agents/sound-designer.md` to create ElevenLabs SFX prompts for each scene.
Run `scripts/generate_sfx.py` to generate audio files.

## Commands

```bash
# From root directory:
npm install              # Install all workspace dependencies

npm run raiku:start      # Launch Raiku in Revideo editor
npm run raiku:render     # Render Raiku video

npm run realmotion:start # Launch RealMotion in Revideo editor
npm run realmotion:render # Render RealMotion video

# From project directory:
cd projects/raiku
npm run start            # Launch editor
npm run render           # Render video
```

## Adding a New Brand Project

1. Create `projects/{brand}/` directory
2. Copy `package.json` and `tsconfig.json` from existing project
3. Update package name to `@revideo-workspace/{brand}`
4. Run brand-extractor agent → save to `brand-identity.json`
5. Create `src/lib/brand.ts` with brand constants
6. Create `code-generator.md` that references generic agent + brand specifics
7. Run `npm install` from root

## Key Files

| File | Purpose |
|------|---------|
| `agents/code-generator.md` | Generic video generation workflow |
| `projects/{brand}/code-generator.md` | Brand-specific agent (colors, patterns) |
| `projects/{brand}/brand-identity.json` | Full brand specification |
| `projects/{brand}/src/lib/brand.ts` | TypeScript brand constants |
| `docs/technical-reference.md` | Revideo API patterns & gotchas |

## Important Notes

- Revideo uses `@revideo/core` and `@revideo/2d` (NOT `@motion-canvas/*`)
- `makeScene2D` requires a scene name: `makeScene2D('sceneName', function* (view) {...})`
- Visual beats should occur every 0.3 seconds for short-form content
- Scenes should be 800+ lines for sufficient visual density
