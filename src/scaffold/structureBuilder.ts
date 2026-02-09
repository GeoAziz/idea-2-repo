export function buildStructure(parsed: any) {
  const { idea, classification, decisions, teamMode, language } = parsed;
  const framework = decisions?.framework ?? 'generic';
  const lang = language ?? 'node';
  const baseFiles = ['README.md', '.gitignore', 'TODO.md'];
  const testFiles: string[] = [];
  const docFiles = ['docs/architecture.md', 'docs/roadmap.md', 'docs/decisions.md', 'docs/dependencies.md'];
  if (teamMode) {
    docFiles.push(
      'docs/onboarding.md',
      'docs/contribution-guide.md',
      'docs/ARCHITECTURE_DECISION_RECORD.md',
      'docs/team-setup.md'
    );
  }

  let srcFiles: string[] = [];
  if (lang === 'python') {
    baseFiles.push('requirements.txt', 'pyproject.toml');
    srcFiles = ['src/main.py'];
    testFiles.push('tests/test_main.py');
  } else if (lang === 'go') {
    baseFiles.push('go.mod');
    srcFiles = ['cmd/app/main.go'];
    testFiles.push('tests/main_test.go');
  } else if (lang === 'rust') {
    baseFiles.push('Cargo.toml');
    srcFiles = ['src/main.rs'];
  } else {
    baseFiles.push('package.json', 'tsconfig.json');
    testFiles.push('tests/main.test.ts');
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
