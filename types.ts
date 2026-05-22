export interface SubCategoryChoice {
  name: string;
  promptSuffix: string;
  thumbnail?: string;
}

export interface SelectionCategory {
  id: string;
  name: string;
  icon: string;
  guardrail: string;
  choices: SubCategoryChoice[];
}
