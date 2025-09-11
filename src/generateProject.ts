import fs from 'fs';
import path from 'path';
import type { PromptsResults } from './types';
import degit from 'degit';
import chalk from 'chalk';

const REPOS: Record<"TS" | "JS", string> = {
  TS: 'dootax/doobots-typescript-example',
  JS: 'dootax/doobots-javascript-example',
};

export const generateProject = async (results: PromptsResults, projectFolder: string): Promise<void> => {
  const { includeInputJsonExample, includeTests, language, projectName } = results;

  fs.mkdirSync(projectFolder);

  const repoToClone = REPOS[language];

  console.log(chalk.green(`📦 Criando projeto "${projectName}" com o template "${repoToClone}"...`));

  const emitter = degit(repoToClone, {
    cache: false,
    force: true,
    verbose: true,
  });

  await emitter.clone(projectFolder);

  if (!includeInputJsonExample) {
    fs.rmSync(path.join(projectFolder, 'input.json'));
  }

  if (!includeTests) {
    fs.rmSync(path.join(projectFolder, 'tests'), { recursive: true, force: true });
    fs.rmSync(path.join(projectFolder, 'jest.config.js'));

    const packageJsonPath = path.join(projectFolder, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    if (packageJson.devDependencies) {
      delete packageJson.devDependencies['jest'];
      delete packageJson.devDependencies['cross-env'];

      if (language === 'TS') {
        delete packageJson.devDependencies['ts-jest'];
        delete packageJson.devDependencies['@types/jest'];

        const tsconfigPath = path.join(projectFolder, 'tsconfig.json');
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
        if (tsconfig.compilerOptions && Array.isArray(tsconfig.compilerOptions.types)) {
          tsconfig.compilerOptions.types = tsconfig.compilerOptions.types.filter((type: string) => type !== 'jest');
          fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
        }
      }
    }

    delete packageJson.scripts['test'];

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  fs.rmSync(path.join(projectFolder, '.gitignore'));
  fs.rmSync(path.join(projectFolder, 'README.md'));
  fs.rmSync(path.join(projectFolder, 'package-lock.json'));
};
