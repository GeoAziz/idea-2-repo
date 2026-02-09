import fs from 'fs';
import path from 'path';

type StructureOptions = {
  outputDir: string;
  migrationPlan: string;
  projectPath: string;
  templatePath: string;
};

export function generateMigrationStructure(options: StructureOptions): string[] {
  const createdPaths: string[] = [];
  if (!fs.existsSync(options.outputDir)) {
    fs.mkdirSync(options.outputDir, { recursive: true });
  }

  const structurePaths = extractStructurePaths(options.migrationPlan);
  for (const dirPath of structurePaths) {
    const fullPath = path.join(options.outputDir, dirPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      createdPaths.push(dirPath);
    }
  }

  const guideContent = buildGuideContent(options.templatePath, options);
  const guidePath = path.join(options.outputDir, 'MIGRATION_GUIDE.md');
  fs.writeFileSync(guidePath, guideContent);
  createdPaths.push('MIGRATION_GUIDE.md');

  return createdPaths;
}

function extractStructurePaths(plan: string): string[] {
  const lines = plan.split('\n');
  const paths: string[] = [];
  let inStructure = false;

  for (const line of lines) {
    if (line.toLowerCase().startsWith('proposed structure')) {
      inStructure = true;
      continue;
    }
    if (inStructure && line.toLowerCase().startsWith('migration steps')) {
      break;
    }
    if (inStructure) {
      const cleaned = line.replace(/^[\s\-*]+/, '').trim();
      if (!cleaned || cleaned.includes(':')) continue;
      const normalized = cleaned.replace(/\/+$/, '');
      if (normalized && !normalized.includes(' ')) {
        paths.push(normalized);
      }
    }
  }

  return Array.from(new Set(paths));
}

function buildGuideContent(templatePath: string, options: StructureOptions): string {
  let template = `# Migration Guide

## Project
Source: {{projectPath}}

## Proposed Plan
{{migrationPlan}}

## Next Steps
- Review the proposed structure.
- Move files incrementally and verify tests.
`;

  if (fs.existsSync(templatePath)) {
    template = fs.readFileSync(templatePath, 'utf-8');
  }

  return template
    .replace('{{projectPath}}', options.projectPath)
    .replace('{{migrationPlan}}', options.migrationPlan.trim());
}
