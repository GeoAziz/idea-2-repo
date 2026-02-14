// Environment variables with runtime validation
const requiredEnv = ['NODE_ENV'];
const optionalEnv = ['DATABASE_URL', 'API_KEY'];

function validateEnv() {
  const missing = requiredEnv.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV as string,
  DATABASE_URL: process.env.DATABASE_URL,
  API_KEY: process.env.API_KEY,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  validate: validateEnv
};