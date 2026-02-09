import ora, { Ora } from 'ora';
import { colors } from './colors';

export function startSpinner(text: string): Ora {
  return ora({ text: colors.ai(text), spinner: 'dots' }).start();
}
