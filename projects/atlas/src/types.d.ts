// Revideo scene module declarations
declare module '*?scene' {
  const scene: import('@revideo/core').SceneDescription<any>;
  export default scene;
}

// JSON module declarations (for sfx-manifest.json import)
declare module '*.json' {
  const value: any;
  export default value;
}

// SVG module declarations
declare module '*.svg' {
  const content: string;
  export default content;
}
