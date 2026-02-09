import fs from 'fs';

export async function write(targetPath: string, content: string, options: { dryRun?: boolean } = {}) {
  if (options.dryRun) return { written: false };
  fs.mkdirSync(require('path').dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
  return { written: true };
}
