import { colors } from '../ui/colors';

export function help() {
  const helpText = `
${colors.success('idea2repo')} — Transform ideas into repositories with AI 🚀

${colors.info('QUICK START:')}
  idea2repo "Your app idea here"
  idea2repo generate "Build an e-commerce marketplace"
  
${colors.info('USAGE:')}
  idea2repo <command> [options]
  
${colors.info('COMMON COMMANDS:')}
  generate      Scaffold a new project from an idea
  init          Initialize a new project interactively
  explain       Explain architecture decisions
  chat          Chat with Copilot about the project
  examples      Show example projects
  use           Create a project from an example
  config        Manage configuration
  
${colors.info('OPTIONS:')}
  -o, --out     Output directory (default: current directory)
  -l, --lang    Programming language (node, python, go, rust)
  --team        Enable team collaboration features
  --dry-run     Preview without writing files
  
${colors.info('EXAMPLES:')}
  # Shorthand (generates project directly)
  idea2repo "AI-powered note-taking app"
  
  # With options
  idea2repo generate "Real-time chat application" -o ./my-project
  idea2repo "Mobile app backend" --lang python
  idea2repo generate "E-commerce site" --team --lang node
  
${colors.info('LEARN MORE:')}
  GitHub: https://github.com/yourusername/idea2repo
  Docs:   idea2repo docs
`;

  console.log(helpText);
}
