import fs from 'fs';
import path from 'path';

type ScanResult = {
  root: string;
  fileTypes: Record<string, number>;
  dependencies: string[];
  frameworks: string[];
  configFiles: string[];
  structure: Record<string, unknown>;
};

const DEFAULT_IGNORES = new Set(['node_modules', '.git', 'dist', 'build', 'coverage']);

export class CodeScanner {
  private root: string;

  constructor(root: string) {
    this.root = root;
  }

  scan(): ScanResult {
    const fileTypes: Record<string, number> = {};
    const configFiles: string[] = [];
    const dependencies = this.readDependencies();
    const frameworks = this.detectFrameworks(dependencies);
    const structure = this.scanStructure(this.root, fileTypes, configFiles);

    return {
      root: this.root,
      fileTypes,
      dependencies,
      frameworks,
      configFiles,
      structure
    };
  }

  private scanStructure(
    dir: string,
    fileTypes: Record<string, number>,
    configFiles: string[],
    depth = 0
  ): Record<string, unknown> {
    if (depth > 3) return {};
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const result: Record<string, unknown> = {};

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        if (['.eslintrc', '.prettierrc', '.env.example', '.env'].includes(entry.name)) {
          configFiles.push(entry.name);
        }
      }

      if (entry.isDirectory()) {
        if (DEFAULT_IGNORES.has(entry.name)) continue;
        const childPath = path.join(dir, entry.name);
        result[entry.name] = this.scanStructure(childPath, fileTypes, configFiles, depth + 1);
      } else {
        const ext = path.extname(entry.name) || 'unknown';
        fileTypes[ext] = (fileTypes[ext] ?? 0) + 1;
        if (entry.name.endsWith('.config.js') || entry.name.endsWith('.config.ts')) {
          configFiles.push(entry.name);
        }
        result[entry.name] = 'file';
      }
    }

    return result;
  }

  private readDependencies(): string[] {
    const deps = new Set<string>();
    const packagePath = path.join(this.root, 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      Object.keys(pkg.dependencies ?? {}).forEach((dep) => deps.add(dep));
      Object.keys(pkg.devDependencies ?? {}).forEach((dep) => deps.add(dep));
    }

    const requirementsPath = path.join(this.root, 'requirements.txt');
    if (fs.existsSync(requirementsPath)) {
      const lines = fs
        .readFileSync(requirementsPath, 'utf-8')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      lines.forEach((line) => deps.add(line.split('==')[0]));
    }

    return Array.from(deps).sort();
  }

  private detectFrameworks(dependencies: string[]): string[] {
    const found: string[] = [];
    const lower = dependencies.map((dep) => dep.toLowerCase());
    const has = (name: string) => lower.includes(name);

    if (has('react')) found.push('React');
    if (has('next')) found.push('Next.js');
    if (has('express')) found.push('Express');
    if (has('fastify')) found.push('Fastify');
    if (has('vue')) found.push('Vue');
    if (has('@nestjs/core')) found.push('NestJS');
    if (has('django')) found.push('Django');
    if (has('flask')) found.push('Flask');

    return found;
  }
}
