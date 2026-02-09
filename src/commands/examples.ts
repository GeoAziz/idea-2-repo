import fs from 'fs';
import path from 'path';
import { renderTable } from '../ui/table';
import { colors } from '../ui/colors';
import { logger } from '../utils/logger';

type Example = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  riskLevel: string;
};

export async function examples() {
  const examplesDir = path.join(process.cwd(), 'examples');
  if (!fs.existsSync(examplesDir)) {
    logger.error(colors.error('Examples directory not found.'));
    return { ok: false, error: 'Missing examples' };
  }

  const files = fs.readdirSync(examplesDir).filter((file) => file.endsWith('.json'));
  const items: Example[] = files.map((file) =>
    JSON.parse(fs.readFileSync(path.join(examplesDir, file), 'utf-8'))
  );

  const rows = items.map((item, index) => [
    `${index + 1}. ${item.emoji} ${item.name}`,
    item.description,
    item.riskLevel
  ]);

  logger.info(colors.info('Available Example Projects:\n'));
  logger.info(renderTable(['Project', 'Description', 'Risk'], rows));
  return { ok: true, count: items.length };
}
