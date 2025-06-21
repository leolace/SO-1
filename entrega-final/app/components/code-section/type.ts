export interface CodeSectionProps {
  file: string;
  title: string;
  description: string;
  sections: { title: string; description: string }[];
  inputCount?: number;
  directory: "1" | "2" | "3";
  mode: "default" | "time";
}

export type TCodeSection = CodeSectionProps;
