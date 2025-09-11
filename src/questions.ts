import type { PromptObject } from 'prompts';

export const promptQuestions: Array<PromptObject> = [
  {
    initial: 'hello-world',
    message: 'Qual o nome do seu projeto?',
    name: 'projectName',
    type: 'text',
  },
  {
    choices: [
      { title: 'TypeScript', value: 'TS' },
      { title: 'JavaScript', value: 'JS' },
    ],
    initial: 0,
    message: 'Qual linguagem você quer usar?',
    name: 'language',
    type: 'select',
  },
  {
    initial: true,
    message: 'Você gostaria de incluir testes (Jest)?',
    name: 'includeTests',
    type: 'confirm',
  },
  {
    initial: true,
    message: 'Você gostaria de incluir um exemplo de "input.json"?',
    name: 'includeInputJsonExample',
    type: 'confirm',
  }
];
