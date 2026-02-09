import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';

export function showBanner() {
  const banner = figlet.textSync('idea2repo', { horizontalLayout: 'default' });
  console.log(gradient('cyan', 'magenta')(banner));
  console.log(chalk.dim('Transform ideas into repositories with AI 🚀\n'));
}
