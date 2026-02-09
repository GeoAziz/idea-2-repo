export const defaultConfig = {
  defaults: {
    stack: 'nextjs',
    includeTests: true,
    testFramework: 'jest',
    cicdProvider: 'github-actions',
    licenseType: 'MIT',
    packageManager: 'npm',
    styling: 'tailwind',
    database: 'postgresql',
    orm: 'prisma',
    teamMode: false
  },
  preferences: {
    autoGitInit: true,
    autoGitCommit: true,
    verboseOutput: false,
    skipConfirmations: false
  },
  templates: {
    customReadmeTemplate: '',
    customGitignore: ''
  },
  copilot: {
    contextWindow: 10,
    conversationMode: 'enabled'
  },
  projectTypes: {
    webapp: {
      stack: 'nextjs',
      includeAuth: true
    },
    api: {
      stack: 'express',
      includeAuth: true,
      includeSwagger: true
    },
    cli: {
      stack: 'typescript',
      includeTests: true,
      packageManager: 'npm'
    }
  }
};
