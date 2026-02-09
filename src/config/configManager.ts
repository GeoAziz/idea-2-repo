import fs from 'fs';
import path from 'path';
import os from 'os';
import { defaultConfig } from './defaults';

export class ConfigManager {
  static load() {
    const projectConfig = this.resolveConfig(path.join(process.cwd(), '.idea2repo.config.json'));
    const homeConfig = this.resolveConfig(path.join(os.homedir(), '.idea2repo.config.json'));
    return this.mergeConfigs(defaultConfig, homeConfig ?? {}, projectConfig ?? {});
  }

  static save(config: Record<string, unknown>, targetPath?: string) {
    const outputPath = targetPath ?? path.join(os.homedir(), '.idea2repo.config.json');
    fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
  }

  static reset() {
    this.save(defaultConfig);
  }

  static resolveConfig(filePath: string) {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  static mergeConfigs(...configs: Record<string, any>[]) {
    return configs.reduce((acc, curr) => this.deepMerge(acc, curr), {});
  }

  private static deepMerge(target: Record<string, any>, source: Record<string, any>) {
    const output = { ...target };
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        output[key] = this.deepMerge(output[key] ?? {}, value as Record<string, any>);
      } else {
        output[key] = value;
      }
    }
    return output;
  }
}
