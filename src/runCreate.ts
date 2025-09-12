import * as path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import prompts from 'prompts';
import { clearLine } from './utils.js';
import { promptQuestions } from './questions.js';
import type { PromptsResults } from './types.js';
import { generateProject } from './generateProject.js';

export async function runCLI(): Promise<void> {
  try {
    const rootDir = process.argv[2];
    await runCreate(rootDir);

    process.exit(0);
  } catch (error: unknown) {
    clearLine(process.stderr);
    clearLine(process.stdout);
    if (error instanceof Error && Boolean(error?.stack)) {
      console.error(chalk.red(error.stack));
    } else {
      console.error(chalk.red(error));
    }

    process.exit(1);
  }
}

export async function runCreate(rootDir = process.cwd()): Promise<void> {
  if (fs.existsSync(path.join(rootDir, "package.json"))) {
    throw new Error("O diretório já contém um projeto Node.js (package.json já existe).");
  }

  console.log();
  console.log(chalk.underline('Configurações do projeto\n'));

  let promptAborted = false;

  const results = (await prompts(promptQuestions, {
    onCancel: () => {
      promptAborted = true;
    },
  })) as PromptsResults;

  if (promptAborted) {
    console.log();
    console.log('Abortando...');
    return;
  }

  const projectFolder = path.join(rootDir, results.projectName);
  if (fs.existsSync(projectFolder)) {
    throw new Error(`O diretório "${results.projectName}" já existe.`);
  }

  await generateProject(results, projectFolder);

  console.log('');
  console.log(chalk.green(`✅ Projeto criado com sucesso em "${projectFolder}"!`));
  console.log('');
  console.log('Próximos passos:');
  console.log(chalk.gray('---------------------'));
  if (results.language === 'TS' || results.language === 'JS') {
    console.log(chalk.cyan(`  cd ${results.projectName}`));
    console.log(chalk.cyan('  npm install'));
    console.log(chalk.cyan('  npm run local'));
  } else if (results.language === 'PYTHON') {
    console.log(chalk.cyan(`  cd ${results.projectName}`));
    console.log(chalk.cyan('  python -m venv venv'));
    console.log(chalk.cyan('  source venv/bin/activate  no Windows use `venv\\Scripts\\activate`'));
    console.log(chalk.cyan('  pip install -r requirements.txt'));
    console.log(chalk.cyan('  doobots-run'));
  }
  console.log(chalk.gray('---------------------'));
  console.log('');
}
