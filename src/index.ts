import { route } from './cli/commandRouter';

export async function run(argv: string[]) {
  const cmd = argv[0] ?? 'help';
  return route(cmd, argv.slice(1));
}

export default { run };
