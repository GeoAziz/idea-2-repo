export async function route(cmd: string, args: string[]) {
  // Recognized commands
  const commands = ['init', 'generate', 'explain', 'chat', 'migrate', 'examples', 'use', 'config', 'help'];

  // If cmd is not a recognized command and doesn't start with '-', treat it as generate with that idea
  if (!commands.includes(cmd) && !cmd.startsWith('-')) {
    // cmd is the idea, prepend it back to args
    return route('generate', [cmd, ...args]);
  }

  if (cmd !== 'help') {
    const { showBanner } = await import('../ui/banner');
    showBanner();
  }

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
  if (cmd === 'chat') {
    const { chat } = await import('../commands/chat');
    return chat(args);
  }
  if (cmd === 'migrate') {
    const { migrate } = await import('../commands/migrate');
    return migrate(args);
  }
  if (cmd === 'examples') {
    const { examples } = await import('../commands/examples');
    return examples();
  }
  if (cmd === 'use') {
    const { useExample } = await import('../commands/use');
    return useExample(args);
  }
  if (cmd === 'config') {
    const { config } = await import('../commands/config');
    return config(args);
  }
  const { help } = await import('./help');
  return help();
}
