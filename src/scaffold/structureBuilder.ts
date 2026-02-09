export function buildStructure(parsed: any) {
  const { idea, classification, decisions, teamMode } = parsed;
  const framework = decisions?.framework ?? 'generic';
  const baseFiles = ['README.md', '.gitignore', 'package.json', 'tsconfig.json', 'TODO.md'];
  const testFiles = ['tests/main.test.ts'];
  const docFiles = ['docs/architecture.md', 'docs/roadmap.md', 'docs/decisions.md'];
  if (teamMode) {
    docFiles.push(
      'docs/onboarding.md',
      'docs/contribution-guide.md',
      'docs/ARCHITECTURE_DECISION_RECORD.md',
      'docs/team-setup.md'
    );
  }

  let srcFiles: string[] = [];
  if (classification.kind === 'cli') {
    srcFiles = ['src/cli.ts', 'src/commands/help.ts', 'src/index.ts'];
  } else if (classification.kind === 'api') {
    srcFiles = ['src/server.ts', 'src/routes.ts', 'src/controllers/index.ts'];
  } else if (classification.kind === 'web') {
    if (framework === 'nextjs') {
      srcFiles = ['src/pages/index.tsx', 'src/components/Header.tsx'];
    } else if (framework === 'react') {
      srcFiles = ['src/App.tsx', 'src/main.tsx', 'src/components/Header.tsx'];
    } else {
      srcFiles = ['src/App.tsx', 'src/pages/index.tsx', 'src/components/Header.tsx'];
    }
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
