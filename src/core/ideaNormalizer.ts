export function normalize(text: string) {
  return {
    problem: text || 'sample problem',
    domain: 'general',
    region: undefined,
    riskSensitivity: 'medium',
    appType: 'cli'
  };
}
