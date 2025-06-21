import type { CodeRunData } from "../code-run/types";

export interface CodeSectionProps extends CodeRunData {
  title: string;
  description: string;
  sections: { title: string; description: string }[];
}

export type TCodeSection = CodeSectionProps;
