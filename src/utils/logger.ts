export const logger = {
  info(...args: any[]) {
    console.log(...args);
  },
  error(...args: any[]) {
    console.error('\x1b[31m%s\x1b[0m',...args); // Red color
  },
  warn(...args: any[]) {
    console.warn('\x1b[33m%s\x1b[0m', ...args); // Yellow color
  },
  success(...args: any[]) {
    console.log('\x1b[32m%s\x1b[0m', ...args); // Green color
  }
};
