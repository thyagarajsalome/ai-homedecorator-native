export interface SubCategoryChoice {
  name: string;
  promptSuffix: string;
  thumbnail?: string;
}

export type StudioCategory = 'interior' | 'exterior' | 'landscape' | 'commercial';

export interface SelectionCategory {
  id: string;
  name: string;
  icon: string;
  guardrail: string;
  studioGroup?: StudioCategory;
  choices: SubCategoryChoice[];
}
