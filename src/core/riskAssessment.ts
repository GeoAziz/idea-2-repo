export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface RiskFactors {
  handlesPayments: boolean;
  handlesPII: boolean;
  handlesHealthData: boolean;
  publicFacing: boolean;
  multiTenant: boolean;
  handlesAuth: boolean;
  realTimeData: boolean;
  financialData: boolean;
  childrenData: boolean;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: RiskFactors;
  recommendations: string[];
  requiredDocs: string[];
}

export class RiskAssessor {
  static async assessRisk(projectIdea: string, copilotResponse?: string): Promise<RiskAssessment> {
    const idea = projectIdea.toLowerCase();
    const response = (copilotResponse || '').toLowerCase();
    const combined = `${idea} ${response}`;

    const factors: RiskFactors = {
      handlesPayments: this.contains(combined, ['payment', 'stripe', 'paypal', 'checkout', 'billing']),
      handlesPII: this.contains(combined, ['user data', 'personal info', 'email', 'address', 'phone']),
      handlesHealthData: this.contains(combined, ['health', 'medical', 'hipaa', 'patient']),
      publicFacing: this.contains(combined, ['public', 'web app', 'website', 'marketplace']),
      multiTenant: this.contains(combined, ['multi-tenant', 'saas', 'workspace', 'organization']),
      handlesAuth: this.contains(combined, ['auth', 'login', 'signup', 'user account']),
      realTimeData: this.contains(combined, ['real-time', 'websocket', 'live', 'chat']),
      financialData: this.contains(combined, ['trading', 'crypto', 'stock', 'finance', 'banking']),
      childrenData: this.contains(combined, ['children', 'kids', 'minors', 'coppa'])
    };

    let score = 0;
    if (factors.handlesPayments) score += 25;
    if (factors.handlesPII) score += 15;
    if (factors.handlesHealthData) score += 30;
    if (factors.publicFacing) score += 10;
    if (factors.multiTenant) score += 15;
    if (factors.handlesAuth) score += 10;
    if (factors.realTimeData) score += 5;
    if (factors.financialData) score += 25;
    if (factors.childrenData) score += 30;

    let level: RiskLevel;
    if (score >= 70) level = RiskLevel.CRITICAL;
    else if (score >= 45) level = RiskLevel.HIGH;
    else if (score >= 20) level = RiskLevel.MEDIUM;
    else level = RiskLevel.LOW;

    const recommendations = this.generateRecommendations(factors, level);
    const requiredDocs = this.getRequiredDocs(factors, level);

    return {
      level,
      score,
      factors,
      recommendations,
      requiredDocs
    };
  }

  private static contains(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword));
  }

  private static generateRecommendations(factors: RiskFactors, level: RiskLevel): string[] {
    const recommendations: string[] = [];

    if (factors.handlesPayments) {
      recommendations.push('Implement PCI DSS compliance measures');
      recommendations.push('Use established payment processors (Stripe, PayPal)');
      recommendations.push('Never store raw credit card data');
    }

    if (factors.handlesPII) {
      recommendations.push('Implement GDPR/privacy compliance');
      recommendations.push('Add data encryption at rest and in transit');
      recommendations.push('Create privacy policy and terms of service');
    }

    if (factors.handlesHealthData) {
      recommendations.push('Ensure HIPAA compliance if US-based');
      recommendations.push('Implement audit logging for data access');
      recommendations.push('Add data anonymization features');
    }

    if (factors.handlesAuth) {
      recommendations.push('Use established auth providers (Auth0, Clerk, Supabase)');
      recommendations.push('Implement MFA for sensitive operations');
      recommendations.push('Add rate limiting on auth endpoints');
    }

    if (factors.financialData) {
      recommendations.push('Implement comprehensive audit logs');
      recommendations.push('Add transaction monitoring and alerts');
      recommendations.push('Use read replicas for sensitive queries');
    }

    if (factors.childrenData) {
      recommendations.push('Ensure COPPA compliance');
      recommendations.push('Implement age verification');
      recommendations.push('Add parental consent workflows');
    }

    if (level === RiskLevel.HIGH || level === RiskLevel.CRITICAL) {
      recommendations.push('Conduct regular security audits');
      recommendations.push('Implement comprehensive logging and monitoring');
      recommendations.push('Set up incident response plan');
    }

    return recommendations;
  }

  private static getRequiredDocs(factors: RiskFactors, level: RiskLevel): string[] {
    const docs: string[] = [];

    if (level === RiskLevel.HIGH || level === RiskLevel.CRITICAL) {
      docs.push('docs/security-checklist.md');
      docs.push('docs/compliance-requirements.md');
      docs.push('.github/workflows/security-scan.yml');
      docs.push('docs/incident-response.md');
    }

    if (factors.handlesPayments || factors.financialData) {
      docs.push('docs/payment-security.md');
    }

    if (factors.handlesPII || factors.handlesHealthData) {
      docs.push('docs/data-privacy.md');
      docs.push('docs/data-retention-policy.md');
    }

    if (level === RiskLevel.MEDIUM) {
      docs.push('docs/deployment-checklist.md');
      docs.push('docs/monitoring-setup.md');
    }

    if (level === RiskLevel.LOW) {
      docs.push('docs/quick-start.md');
    }

    return docs;
  }
}
