export function generate(decisions: any) { return `# Project\n\nDecisions:\n${JSON.stringify(decisions, null, 2)}`; }
