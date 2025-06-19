export interface CodeSectionProps {
  file: string;
  title: string;
  description: string;
  sections: { title: string; description: string }[];
  inputCount: number;
}

export type TCodeSection = CodeSectionProps;