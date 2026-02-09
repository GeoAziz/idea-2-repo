import { ConfigManager } from '../config/configManager';
import { colors } from '../ui/colors';
import { renderTable } from '../ui/table';
import { logger } from '../utils/logger';
import { spawnSync } from 'child_process';
import os from 'os';
import path from 'path';

function getConfigPath() {
  return path.join(os.homedir(), '.idea2repo.config.json');
}

export async function config(args: string[]) {
  const [action, key, value] = args;
  const config = ConfigManager.load();

  if (!action || action === 'show') {
    const rows = Object.entries(config.defaults).map(([k, v]) => [k, String(v)]);
    logger.info(colors.info('Current Configuration:'));
    logger.info(renderTable(['Setting', 'Value'], rows));
    return { ok: true };
  }

  if (action === 'set') {
    if (!key) {
      logger.error(colors.error('Provide a key to set.'));
      return { ok: false, error: 'Missing key' };
    }
    const newConfig = ConfigManager.load();
    newConfig.defaults[key] = parseValue(value);
    ConfigManager.save(newConfig);
    logger.info(colors.success(`Updated ${key}`));
    return { ok: true };
  }

  if (action === 'reset') {
    ConfigManager.reset();
    logger.info(colors.success('Configuration reset to defaults.'));
    return { ok: true };
  }

  if (action === 'edit') {
    const editor = process.env.EDITOR ?? 'vi';
    spawnSync(editor, [getConfigPath()], { stdio: 'inherit' });
    return { ok: true };
  }

  logger.error(colors.error(`Unknown config action: ${action}`));
  return { ok: false, error: 'Unknown action' };
}

function parseValue(input?: string) {
  if (input === undefined) return true;
  if (input === 'true') return true;
  if (input === 'false') return false;
  const num = Number(input);
  if (!Number.isNaN(num)) return num;
  return input;
}
