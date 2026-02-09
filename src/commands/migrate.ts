import path from 'path';
import fs from 'fs';
import { CodeScanner } from '../scanner/codeScanner';
import { planMigration } from '../migration/migrationPlanner';
import { generateMigrationStructure } from '../migration/structureGenerator';
import { logger } from '../utils/logger';

function parseArgs(args: string[]) {
  const restructure = args.includes('--restructure');
  const pathIndex = args.findIndex((arg) => arg === '--path' || arg === '-p');
  const targetPath =
    pathIndex >= 0 && args[pathIndex + 1] ? args[pathIndex + 1] : args.find((arg) => !arg.startsWith('-'));
  return { restructure, targetPath: targetPath ?? '.' };
}

export async function migrate(args: string[]) {
  const { restructure, targetPath } = parseArgs(args);
  const projectPath = path.resolve(targetPath);

  if (!fs.existsSync(projectPath)) {
    logger.error(`Path does not exist: ${projectPath}`);
    return { ok: false, error: 'Missing project path' };
  }

  logger.info(`\n🧭 Scanning project: ${projectPath}\n`);
  const scanner = new CodeScanner(projectPath);
  const scan = scanner.scan();

  logger.info(`Detected frameworks: ${scan.frameworks.join(', ') || 'Unknown'}`);
  logger.info(`Dependencies found: ${scan.dependencies.length}`);
  logger.info(`Config files: ${scan.configFiles.join(', ') || 'None'}\n`);

  logger.info('• Generating migration plan with Copilot...');
  const plan = await planMigration({
    structure: scan.structure,
    dependencies: scan.dependencies,
    frameworks: scan.frameworks
  });
  logger.info('  ✓ Migration plan ready\n');

  logger.info(plan.response);

  if (restructure) {
    const outputDir = path.join(projectPath, 'restructured-project');
    const templatePath = path.join(__dirname, '..', 'templates', 'migration', 'MIGRATION_GUIDE.md');
    const created = generateMigrationStructure({
      outputDir,
      migrationPlan: plan.response,
      projectPath,
      templatePath
    });

    logger.info(`\n📁 Restructure plan created at ${outputDir}`);
    logger.info(`Created ${created.length} items`);
  }

  return { ok: true, plan: plan.response };
}
