import path from 'path';
import fs from 'fs';
import { buildStructure } from './structureBuilder';
import { contentFor } from './templateRegistry';
import { write } from './fileWriter';
import { interpretCopilotOutput } from '../copilot/interpretation';
import { generateCopilotContent } from '../copilot/contentGenerator';
import { RiskAssessor, RiskAssessment } from '../core/riskAssessment';
import { logger } from '../utils/logger';
import { suggest } from '../copilot/copilotClient';

type ScaffoldInput = {
  targetDir: string;
  name: string;
  idea: string;
  normalized: {
    problem: string;
    domain: string;
    region?: string;
    riskSensitivity: string;
    appType: string;
  };
  classification: {
    kind: string;
    complexity: string;
  };
  copilotInput: string;
  copilotOutput: string;
  dryRun?: boolean;
  teamMode?: boolean;
  language?: string;
};

export async function generateScaffold(input: ScaffoldInput) {
  const { targetDir, dryRun, name, idea, normalized, classification, copilotInput, copilotOutput, teamMode, language } =
    input;

  const interpretation = interpretCopilotOutput(copilotOutput);
  const dependencyPlan = await generateDependencyPlan(idea, classification.kind, language ?? 'node');
  const mermaidDiagram = await generateArchitectureDiagram(idea, classification.kind, interpretation.framework ?? '');
  const generatedContent = await generateCopilotContent(
    {
      idea,
      normalized,
      classification,
      copilotOutput
    },
    teamMode
      ? [
          'docs/onboarding.md',
          'docs/contribution-guide.md',
          'docs/ARCHITECTURE_DECISION_RECORD.md',
          'docs/team-setup.md'
        ]
      : []
  );
  const decisions = {
    name,
    idea,
    normalized,
    classification,
    copilotInput,
    copilotOutput,
    framework: interpretation.framework,
    database: interpretation.database,
    stackNotes: interpretation.stackNotes,
    generatedContent,
    teamMode: Boolean(teamMode),
    language: language ?? 'node',
    dependencyPlan,
    mermaidDiagram,
    createdAt: new Date().toISOString()
  };

  const riskAssessment = await RiskAssessor.assessRisk(idea, copilotOutput);
  decisions.riskAssessment = riskAssessment;

  const structure = buildStructure({
    idea,
    normalized,
    classification,
    decisions,
    teamMode: Boolean(teamMode),
    language: language ?? 'node',
    copilotInput,
    copilotOutput
  });

  const context = {
    name,
    idea,
    normalized,
    classification,
    copilotInput,
    copilotOutput,
    decisions,
    generatedContent
  };

  const writtenFiles: string[] = [];
  for (const filePath of structure.files) {
    const outputPath = path.join(targetDir, filePath);
    const content = contentFor(filePath, context);
    const result = await write(outputPath, content, { dryRun });
    if (result.written) writtenFiles.push(filePath);
  }

  const metaDir = path.join(targetDir, '.idea2repo');
  if (!dryRun) fs.mkdirSync(metaDir, { recursive: true });
  const decisionsPath = path.join(metaDir, 'decisions.json');
  const decisionsContent = JSON.stringify(decisions, null, 2);
  const metaResult = await write(decisionsPath, decisionsContent, { dryRun });
  if (metaResult.written) writtenFiles.push('.idea2repo/decisions.json');

  if (!dryRun) {
    await generateRiskDocs(targetDir, riskAssessment);
  }

  return {
    ...structure,
    decisions,
    outputDir: targetDir,
    writtenFiles
  };
}

async function generateRiskDocs(outputPath: string, assessment: RiskAssessment): Promise<void> {
  if (assessment.requiredDocs.length === 0) return;

  logger.info(`\n📊 Risk Assessment: ${assessment.level.toUpperCase()}`);
  logger.info(`Score: ${assessment.score}/100\n`);

  for (const docFile of assessment.requiredDocs) {
    const templatePath = resolveTemplatePath(docFile, assessment.level);
    if (!templatePath) continue;

    const destPath = path.join(outputPath, docFile);
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.copyFileSync(templatePath, destPath);
  }

  appendRiskSummaryToReadme(outputPath, assessment);

  if (assessment.recommendations.length > 0) {
    logger.info('\n⚠️  Security Recommendations:\n');
    assessment.recommendations.forEach((rec, index) => {
      logger.info(`  ${index + 1}. ${rec}`);
    });
    logger.info('');
  }
}

function resolveTemplatePath(docFile: string, level: RiskAssessment['level']): string | null {
  const templateRoot = path.join(__dirname, '..', 'templates');
  const candidates: string[] = [];

  if (level === 'high' || level === 'critical') {
    candidates.push(path.join(templateRoot, 'high-risk', path.basename(docFile)));
  }
  if (level === 'medium') {
    candidates.push(path.join(templateRoot, 'medium-risk', path.basename(docFile)));
  }
  if (level === 'low') {
    candidates.push(path.join(templateRoot, 'low-risk', path.basename(docFile)));
  }

  candidates.push(path.join(templateRoot, 'high-risk', path.basename(docFile)));
  candidates.push(path.join(templateRoot, 'medium-risk', path.basename(docFile)));
  candidates.push(path.join(templateRoot, 'low-risk', path.basename(docFile)));

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function appendRiskSummaryToReadme(outputPath: string, assessment: RiskAssessment): void {
  const readmePath = path.join(outputPath, 'README.md');
  if (!fs.existsSync(readmePath)) return;

  const riskFactors = Object.entries(assessment.factors)
    .filter(([, value]) => value === true)
    .map(([key]) => `- ${key.replace(/([A-Z])/g, ' $1').trim()}`)
    .join('\n');

  const docsList = assessment.requiredDocs
    .map((doc) => `- [${path.basename(doc, '.md')}](${doc})`)
    .join('\n');

  const riskSection = `\n\n## Security & Risk\n\n**Risk Level**: ${assessment.level.toUpperCase()} (Score: ${assessment.score}/100)\n\n### Key Risk Factors\n${riskFactors || '- None detected'}\n\n### Security Documentation\n${docsList || '- None generated'}\n\nSee the security checklist and compliance requirements in the \`docs/\` folder.\n`;

  fs.appendFileSync(readmePath, riskSection);
}

async function generateDependencyPlan(idea: string, projectType: string, language: string) {
  if (language !== 'node') return null;
  const prompt = `Recommend npm packages for this project.
Idea: ${idea}
Type: ${projectType}

Provide a bulleted list of packages with a short reason each.`;
  const response = await suggest(prompt);
  return parseDependencyPlan(response);
}

function parseDependencyPlan(response: string) {
  const lines = response.split('\n');
  const suggestions = lines
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const [pkg, ...rest] = line.split(' - ');
      return {
        name: pkg.trim(),
        reason: rest.join(' - ').trim()
      };
    });
  return suggestions.slice(0, 10);
}

async function generateArchitectureDiagram(idea: string, projectType: string, framework: string) {
  const prompt = `Create a Mermaid diagram for this project:
Idea: ${idea}
Type: ${projectType}
Framework: ${framework}

Return only Mermaid syntax.`;
  const response = await suggest(prompt);
  return response.trim();
}
