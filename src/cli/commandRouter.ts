export async function route(cmd: string, args: string[]) {
  if (cmd === 'init') {
    const { init } = await import('../commands/init');
    return init(args);
  }
  if (cmd === 'generate') {
    const { generate } = await import('../commands/generate');
    return generate(args);
  }
  if (cmd === 'explain') {
    const { explain } = await import('../commands/explain');
    return explain(args);
  }
  const { help } = await import('./help');
  return help();
}
