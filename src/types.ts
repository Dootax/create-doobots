export type PromptsResults = {
  includeInputJsonExample: boolean;
  includeTests: boolean;
  projectName: string;
  language: Language;
};

export type Language = 'TS' | 'JS' | 'PYTHON';