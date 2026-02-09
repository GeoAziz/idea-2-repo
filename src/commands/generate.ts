import { normalize } from '../core/ideaNormalizer';
import { classify } from '../core/projectClassifier';
import { suggest } from '../reasoning';
import { generateScaffold } from '../scaffold/scaffoldGenerator';
import { logger } from '../utils/logger';
import { slugify } from '../utils/slug';
import path from 'path';

function parseArgs(args: string[]) {
  const outIndex = args.findIndex((arg) => arg === '--out' || arg === '-o');
  let outDir: string | undefined;
  if (outIndex >= 0 && args[outIndex + 1]) {
    outDir = args[outIndex + 1];
  }
  const ideaParts =
    outIndex >= 0
      ? args.filter((_, idx) => idx !== outIndex && idx !== outIndex + 1)
      : [...args];
  return { idea: ideaParts.join(' ').trim(), outDir };
}

export async function generate(args: string[]) {
  const { idea, outDir } = parseArgs(args);

  if (!idea) {
    logger.error('Please provide an idea: idea2repo generate "your awesome app idea"');
    return { ok: false, error: 'Missing idea' };
  }

  logger.info(`\n📝 Processing idea: "${idea}"\n`);

  try {
    // Normalize the idea into structured intent
    logger.info('• Normalizing idea...');
    const normalized = normalize(idea);
    logger.info(`  → Problem: ${normalized.problem}`);
    logger.info(`  → Domain: ${normalized.domain}`);
    logger.info(`  → Risk sensitivity: ${normalized.riskSensitivity}`);
    logger.info(`  → App type: ${normalized.appType}\n`);

    // Classify the project
    logger.info('• Classifying project...');
    const classification = classify(idea);
    logger.info(`  → Kind: ${classification.kind}`);
    logger.info(`  → Complexity: ${classification.complexity}\n`);

    // Get Copilot CLI suggestions for structure
    logger.info('• Consulting GitHub Copilot CLI for architecture...');
    const copilotPrompt = `Design a clean, opinionated repository structure for this ${normalized.appType}: ${normalized.problem}. Prioritize MVP speed and clarity. Explain rationale.`;
    const copilotSuggestion = await suggest(copilotPrompt);
    logger.info('  ✓ Received architecture suggestion\n');

    // Build the repository structure
    logger.info('• Building repository structure...');
    const name = slugify(normalized.problem);
    const targetDir = path.resolve(outDir ?? name);
    const structure = await generateScaffold({
      idea,
      name,
      normalized,
      classification,
      copilotInput: copilotPrompt,
      copilotOutput: copilotSuggestion,
      targetDir
    });
    logger.info(`  ✓ Structure ready (${structure.files.length} files)\n`);
    logger.info(`📁 Output directory: ${structure.outputDir}`);
    logger.info(`🧭 Next steps: cd ${structure.outputDir} && npm install`);

    logger.info('✅ Generate complete!\n');
    return {
      ok: true,
      idea,
      normalized,
      classification,
      structure,
      copilotInput: copilotPrompt,
      copilotOutput: copilotSuggestion
    };
  } catch (error: any) {
    logger.error(`Generate failed: ${error.message}`);
    return { ok: false, error: error.message };
  }
}
