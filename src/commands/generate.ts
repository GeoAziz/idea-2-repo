import { normalize } from '../core/ideaNormalizer';
import { classify } from '../core/projectClassifier';
import { suggest } from '../copilot/copilotClient';
import { generateScaffold } from '../scaffold/scaffoldGenerator';
import { GitManager } from '../git/gitManager';
import { logger } from '../utils/logger';
import { slugify } from '../utils/slug';
import { ConfigManager } from '../config/configManager';
import { startSpinner } from '../ui/spinner';
import { colors } from '../ui/colors';
import { renderBox } from '../ui/box';
import path from 'path';

function parseArgs(args: string[]) {
  const outIndex = args.findIndex((arg) => arg === '--out' || arg === '-o');
  const teamMode = args.includes('--team');
  const langIndex = args.findIndex((arg) => arg === '--lang' || arg === '-l');
  const language = langIndex >= 0 && args[langIndex + 1] ? args[langIndex + 1] : undefined;
  let outDir: string | undefined;
  if (outIndex >= 0 && args[outIndex + 1]) {
    outDir = args[outIndex + 1];
  }
  const ideaParts =
    outIndex >= 0
      ? args.filter(
          (_, idx) =>
            idx !== outIndex &&
            idx !== outIndex + 1 &&
            idx !== langIndex &&
            idx !== langIndex + 1 &&
            args[idx] !== '--team'
        )
      : args.filter((arg, idx) => arg !== '--team' && idx !== langIndex && idx !== langIndex + 1);
  return { idea: ideaParts.join(' ').trim(), outDir, teamMode, language };
}

export async function generate(args: string[]) {
  const config = ConfigManager.load();
  const { idea, outDir, teamMode, language } = parseArgs(args);
  const resolvedTeamMode = teamMode || config.defaults.teamMode;
  const resolvedLanguage = language ?? config.defaults.language;

  if (!idea) {
    logger.error(colors.error('Please provide an idea: idea2repo generate "your awesome app idea"'));
    return { ok: false, error: 'Missing idea' };
  }

  logger.info(colors.info(`\n📝 Processing idea: "${idea}"\n`));

  try {
    // Normalize the idea into structured intent
    const normalizeSpinner = startSpinner('Analyzing idea...');
    const normalized = normalize(idea);
    normalizeSpinner.succeed(colors.success('Idea normalized'));
    logger.info(colors.muted(`  → Problem: ${normalized.problem}`));
    logger.info(colors.muted(`  → Domain: ${normalized.domain}`));
    logger.info(colors.muted(`  → Risk sensitivity: ${normalized.riskSensitivity}`));
    logger.info(colors.muted(`  → App type: ${normalized.appType}\n`));

    // Classify the project
    const classifySpinner = startSpinner('Detecting project type...');
    const classification = classify(idea);
    classifySpinner.succeed(colors.success(`Project type: ${classification.kind}`));
    logger.info(colors.muted(`  → Complexity: ${classification.complexity}\n`));

    // Get Copilot CLI suggestions for structure
    const copilotSpinner = startSpinner('Consulting Copilot for architecture...');
    const copilotPrompt = `Design a clean, opinionated repository structure for this ${normalized.appType}: ${normalized.problem}. Prioritize MVP speed and clarity. Explain rationale.`;
    const copilotSuggestion = await suggest(copilotPrompt);
    copilotSpinner.succeed(colors.success('Architecture suggestion ready\n'));

    // Build the repository structure
    const scaffoldSpinner = startSpinner('Generating project scaffold...');
    const name = slugify(normalized.problem);
    const targetDir = path.resolve(outDir ?? name);
    const structure = await generateScaffold({
      idea,
      name,
      normalized,
      classification,
      copilotInput: copilotPrompt,
      copilotOutput: copilotSuggestion,
      targetDir,
      teamMode: resolvedTeamMode,
      language: resolvedLanguage
    });
    scaffoldSpinner.succeed(colors.success(`Structure ready (${structure.files.length} files)\n`));
    logger.info(renderBox(`🎉 Project Created Successfully!\n\nName: ${name}\nPath: ${structure.outputDir}\nType: ${classification.kind}`, {
      borderColor: 'green'
    }));
    logger.info(colors.info(`Next steps:\n  cd ${structure.outputDir}\n  npm install\n  npm run dev`));

    await GitManager.interactiveSetup({
      projectPath: structure.outputDir,
      projectName: name,
      preferences: config.preferences
    });

    logger.info(colors.success('✅ Generate complete!\n'));
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
