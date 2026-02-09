type CopilotInterpretation = {
  framework: 'nextjs' | 'react' | 'express' | 'fastify' | 'none';
  database: 'postgres' | 'mysql' | 'mongo' | 'sqlite' | 'none';
  stackNotes: string[];
};

function detectFramework(text: string): CopilotInterpretation['framework'] {
  const lowered = text.toLowerCase();
  if (/(next\.js|nextjs)/.test(lowered)) return 'nextjs';
  if (/(react)/.test(lowered)) return 'react';
  if (/(fastify)/.test(lowered)) return 'fastify';
  if (/(express)/.test(lowered)) return 'express';
  return 'none';
}

function detectDatabase(text: string): CopilotInterpretation['database'] {
  const lowered = text.toLowerCase();
  if (/(postgres|postgresql)/.test(lowered)) return 'postgres';
  if (/(mysql)/.test(lowered)) return 'mysql';
  if (/(mongodb|mongo)/.test(lowered)) return 'mongo';
  if (/(sqlite)/.test(lowered)) return 'sqlite';
  return 'none';
}

export function interpretCopilotOutput(output: string): CopilotInterpretation {
  const framework = detectFramework(output);
  const database = detectDatabase(output);
  const stackNotes: string[] = [];

  if (framework !== 'none') stackNotes.push(`Framework: ${framework}`);
  if (database !== 'none') stackNotes.push(`Database: ${database}`);

  return {
    framework,
    database,
    stackNotes
  };
}
