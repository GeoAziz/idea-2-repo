import fs from 'fs';
import path from 'path';
import os from 'os';

export interface WriteOptions {
  dryRun?: boolean;
  atomic?: boolean; // Write to temp file then rename (safer)
}

export interface WriteResult {
  written: boolean;
  filePath: string;
  preview?: string; // For dry-run mode
}

/**
 * Write content to a file, optionally with atomic writes (safer for critical files).
 * In dry-run mode, returns a preview without writing.
 */
export async function write(
  targetPath: string,
  content: string,
  options: WriteOptions = {}
): Promise<WriteResult> {
  const { dryRun = false, atomic = false } = options;
  const dir = path.dirname(targetPath);

  if (dryRun) {
    // Return a preview without writing
    const preview = content.length > 100 ? content.slice(0, 100) + '...' : content;
    return { written: false, filePath: targetPath, preview };
  }

  try {
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (atomic) {
      // Atomic write: write to temp file, then rename
      const tmpFile = path.join(os.tmpdir(), `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      fs.writeFileSync(tmpFile, content, 'utf8');
      fs.renameSync(tmpFile, targetPath);
    } else {
      // Standard write
      fs.writeFileSync(targetPath, content, 'utf8');
    }

    return { written: true, filePath: targetPath };
  } catch (error) {
    throw new Error(`Failed to write ${targetPath}: ${error}`);
  }
}
