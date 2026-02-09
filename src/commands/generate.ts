import { normalize } from '../core/ideaNormalizer';
import { classify } from '../core/projectClassifier';
import { suggest } from '../copilot/copilotClient';
import { buildStructure } from '../scaffold/structureBuilder';
import { logger } from '../utils/logger';

export async function generate(args: string[]) {
  const idea = args.join(' ');

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
    const structure = buildStructure({
      idea,
      normalized,
      classification,
      copilotInput: copilotPrompt,
      copilotOutput: copilotSuggestion
    });
    logger.info(`  ✓ Structure ready (${structure.files.length} files)\n`);

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
