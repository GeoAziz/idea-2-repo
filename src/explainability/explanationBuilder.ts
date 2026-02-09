export function build(decisions: any) {
  const normalized = decisions?.decisions?.normalized ?? {};
  const classification = decisions?.decisions?.classification ?? {};
  const framework = decisions?.decisions?.framework ?? 'none';
  const database = decisions?.decisions?.database ?? 'none';
  const notes = decisions?.decisions?.stackNotes ?? [];

  return `## Decisions Summary

**Problem:** ${normalized.problem ?? 'Unknown'}

**App Type:** ${normalized.appType ?? 'unknown'}  
**Domain:** ${normalized.domain ?? 'general'}  
**Risk Sensitivity:** ${normalized.riskSensitivity ?? 'unknown'}  
**Complexity:** ${classification.complexity ?? 'mvp'}

**Framework:** ${framework}  
**Database:** ${database}

${notes.length ? `**Copilot Notes:** ${notes.join(', ')}` : ''}

---

### Raw Decisions
\`\`\`json
${JSON.stringify(decisions, null, 2)}
\`\`\``;
}
