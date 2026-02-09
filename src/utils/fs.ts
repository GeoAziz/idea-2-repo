import fs from 'fs';
export const exists = (p: string) => fs.existsSync(p);
