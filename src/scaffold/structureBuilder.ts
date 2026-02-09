export function buildStructure(parsed: any) {
  const { idea, classification } = parsed;
  const baseFiles = ['README.md', '.gitignore', 'package.json', 'tsconfig.json'];
  const testFiles = ['tests/main.test.ts'];
  const docFiles = ['docs/architecture.md', 'docs/roadmap.md'];

  let srcFiles: string[] = [];
  if (classification.kind === 'cli') {
    srcFiles = ['src/cli.ts', 'src/commands/help.ts', 'src/index.ts'];
  } else if (classification.kind === 'api') {
    srcFiles = ['src/server.ts', 'src/routes.ts', 'src/controllers/index.ts'];
  } else if (classification.kind === 'web') {
    srcFiles = ['src/App.tsx', 'src/pages/index.tsx', 'src/components/Header.tsx'];
  } else {
    srcFiles = ['src/index.ts', 'src/main.ts'];
  }

  const allFiles = [...baseFiles, ...srcFiles, ...testFiles, ...docFiles];

  return {
    files: allFiles,
    decisions: {
      appType: classification.kind,
      complexity: classification.complexity,
      idea,
      rationale: `Optimized for ${classification.kind} projects at ${classification.complexity} scope`
    },
    structure: {
      src: srcFiles,
      tests: testFiles,
      docs: docFiles,
      root: baseFiles
    }
  };
}
