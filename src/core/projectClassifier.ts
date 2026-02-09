function complexityScore(text: string) {
  const lowered = text.toLowerCase();
  let score = 0;
  if (/(real-time|realtime|stream|chat)/.test(lowered)) score += 2;
  if (/(marketplace|payments|subscription|billing)/.test(lowered)) score += 2;
  if (/(ai|ml|recommendation)/.test(lowered)) score += 1;
  if (/(multi-tenant|enterprise|scale)/.test(lowered)) score += 2;
  if (/(offline|sync|mobile)/.test(lowered)) score += 1;
  return score;
}

function detectKind(text: string) {
  const lowered = text.toLowerCase();
  if (/(cli|command line|terminal tool)/.test(lowered)) return 'cli';
  if (/(api|backend|server|rest|graphql)/.test(lowered)) return 'api';
  if (/(library|sdk|package|module)/.test(lowered)) return 'library';
  if (/(web|website|frontend|react|next|dashboard|ui)/.test(lowered)) return 'web';
  return 'web';
}

export function classify(text: string) {
  const score = complexityScore(text);
  let complexity = 'mvp';
  if (score >= 4) complexity = 'high';
  if (score >= 2 && score < 4) complexity = 'medium';
  return { kind: detectKind(text), complexity };
}
