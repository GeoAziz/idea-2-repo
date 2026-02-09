export class DecisionModel {
  decisions: Record<string, any>;
  constructor(decisions: Record<string, any> = {}) {
    this.decisions = decisions;
  }
  summary() {
    return { decisions: this.decisions };
  }
}
