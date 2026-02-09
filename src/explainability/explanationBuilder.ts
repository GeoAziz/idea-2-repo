export function build(decisions: any) {
  return `## Decisions\n\n\`\`\`json\n${JSON.stringify(decisions, null, 2)}\n\`\`\``;
}
