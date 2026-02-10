export function buildStructure(parsed: any) {
  const { idea, classification, decisions, teamMode, language } = parsed;
  const framework = decisions?.framework ?? 'generic';
  const database = decisions?.database;
  const lang = language ?? 'node';
  const baseFiles = ['README.md', '.gitignore', 'TODO.md', '.env.example', 'Makefile'];
  const testFiles: string[] = [];
  const dbFiles: string[] = [];
  const docFiles = ['docs/architecture.md', 'docs/roadmap.md', 'docs/decisions.md', 'docs/dependencies.md'];
  const configFiles: string[] = ['Dockerfile', 'docker-compose.yml'];
  
  if (teamMode) {
    docFiles.push(
      'docs/onboarding.md',
      'docs/contribution-guide.md',
      'docs/ARCHITECTURE_DECISION_RECORD.md',
      'docs/team-setup.md'
    );
  }

  // Add DB schema files based on database choice
  if (database) {
    if (database.toLowerCase() === 'mongodb' || database.toLowerCase() === 'mongo') {
      dbFiles.push('models/index.ts');
    } else {
      dbFiles.push('migrations/001_init.sql');
      if (lang === 'node' || !lang) {
        dbFiles.push('prisma/schema.prisma');
      }
    }
  }

  let srcFiles: string[] = [];
  let ciFiles: string[] = [];

  if (lang === 'python') {
    baseFiles.push('requirements.txt', 'pyproject.toml', 'pytest.ini');
    srcFiles = ['src/main.py', 'src/__init__.py'];
    testFiles.push('tests/test_main.py');
    ciFiles = ['.github/workflows/python.yml'];
  } else if (lang === 'go') {
    baseFiles.push('go.mod');
    srcFiles = ['cmd/app/main.go'];
    testFiles.push('tests/main_test.go');
    ciFiles = ['.github/workflows/go.yml'];
  } else if (lang === 'rust') {
    baseFiles.push('Cargo.toml');
    srcFiles = ['src/main.rs'];
    ciFiles = ['.github/workflows/rust.yml'];
  } else {
    baseFiles.push('package.json', 'tsconfig.json');
    srcFiles = ['src/env.ts', 'src/config/index.ts'];
    testFiles.push('tests/main.test.ts');
    ciFiles = ['.github/workflows/node.yml'];
    if (classification.kind === 'cli') {
      srcFiles.push('src/cli.ts', 'src/commands/help.ts', 'src/index.ts');
    } else if (classification.kind === 'api') {
      srcFiles.push('src/server.ts', 'src/routes.ts', 'src/controllers/index.ts');
    } else if (classification.kind === 'web') {
      if (framework === 'nextjs') {
        srcFiles.push('src/pages/index.tsx', 'src/components/Header.tsx');
      } else if (framework === 'react') {
        srcFiles.push('src/App.tsx', 'src/main.tsx', 'src/components/Header.tsx');
      } else {
        srcFiles.push('src/App.tsx', 'src/pages/index.tsx', 'src/components/Header.tsx');
      }
    } else {
      srcFiles.push('src/index.ts', 'src/main.ts');
    }
  }

  const allFiles = [...baseFiles, ...srcFiles, ...testFiles, ...dbFiles, ...docFiles, ...ciFiles, ...configFiles];

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
      db: dbFiles,
      docs: docFiles,
      ci: ciFiles,
      config: configFiles,
      root: baseFiles
    }
  };
}
