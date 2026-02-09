function detectAppType(text: string) {
  const lowered = text.toLowerCase();
  if (/(cli|command line|terminal tool)/.test(lowered)) return 'cli';
  if (/(api|backend|server|rest|graphql)/.test(lowered)) return 'api';
  if (/(library|sdk|package|module)/.test(lowered)) return 'library';
  if (/(web|website|frontend|react|next|dashboard|ui)/.test(lowered)) return 'web';
  return 'web';
}

function detectDomain(text: string) {
  const lowered = text.toLowerCase();
  if (/(fintech|finance|payments|bank|invoice|tax)/.test(lowered)) return 'fintech';
  if (/(health|medical|clinic|patient|telehealth)/.test(lowered)) return 'health';
  if (/(education|school|learning|course|student)/.test(lowered)) return 'education';
  if (/(commerce|marketplace|ecommerce|store|shopping)/.test(lowered)) return 'commerce';
  if (/(ai|ml|machine learning|assistant)/.test(lowered)) return 'ai';
  if (/(devtools|developer|git|cli|api)/.test(lowered)) return 'devtools';
  return 'general';
}

function detectRegion(text: string) {
  const match = text.match(/\b(?:in|for)\s+([A-Z][a-zA-Z\s]+)/);
  return match ? match[1].trim() : undefined;
}

function detectRisk(text: string, domain: string) {
  const lowered = text.toLowerCase();
  if (/(health|medical|payments|finance|bank|legal|identity)/.test(lowered)) return 'high';
  if (domain === 'fintech' || domain === 'health') return 'high';
  if (/(enterprise|compliance|security)/.test(lowered)) return 'medium';
  return 'low';
}

export function normalize(text: string) {
  const problem = text?.trim() || 'Describe your product idea.';
  const domain = detectDomain(problem);
  const region = detectRegion(problem);
  const appType = detectAppType(problem);
  const riskSensitivity = detectRisk(problem, domain);

  return {
    problem,
    domain,
    region,
    riskSensitivity,
    appType
  };
}
