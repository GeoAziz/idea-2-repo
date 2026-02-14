// Configuration loader
import { env } from '../env';

export const config = {
  app: {
    name: 'a-cli-tool-that-automates-developer-workflows-with-interacti',
    version: '0.1.0',
    environment: env.NODE_ENV
  },
  database: {
    url: env.DATABASE_URL
  }
};

// Validate on load
env.validate();