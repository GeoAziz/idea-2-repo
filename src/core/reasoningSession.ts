export class ReasoningSession {
  log: any[] = [];
  record(entry: any) { this.log.push(entry); }
  dump() { return this.log.slice(); }
}
