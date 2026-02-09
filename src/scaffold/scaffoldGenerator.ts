import path from 'path';
import fs from 'fs';
import { buildStructure } from './structureBuilder';
import { contentFor } from './templateRegistry';
import { write } from './fileWriter';
import { interpretCopilotOutput } from '../copilot/interpretation';
import { generateCopilotContent } from '../copilot/contentGenerator';

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
};

export async function generateScaffold(input: ScaffoldInput) {
  const { targetDir, dryRun, name, idea, normalized, classification, copilotInput, copilotOutput } = input;

  const interpretation = interpretCopilotOutput(copilotOutput);
  const generatedContent = await generateCopilotContent({
    idea,
    normalized,
    classification,
    copilotOutput
  });
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
    createdAt: new Date().toISOString()
  };

  const structure = buildStructure({
    idea,
    normalized,
    classification,
    decisions,
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

  return {
    ...structure,
    decisions,
    outputDir: targetDir,
    writtenFiles
  };
}
