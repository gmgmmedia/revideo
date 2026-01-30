import { renderVideo } from '@revideo/renderer';

async function render() {
  console.log('Rendering Figure FGRD video...');

  const file = await renderVideo({
    projectFile: './src/project.tsx',
    settings: { logProgress: true },
  });

  console.log(`Rendered video to ${file}`);
}

render();
