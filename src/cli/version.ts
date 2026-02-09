export function version() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require('../../package.json');
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}
