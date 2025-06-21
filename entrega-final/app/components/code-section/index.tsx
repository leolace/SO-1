import type { CodeSectionProps, TCodeSection } from "./type";
import { CodeRun } from "../code-run";
import { Typography } from "../typography";

export const CodeSection = ({
  file,
  title,
  description,
  sections,
  inputCount,
  directory,
  mode,
}: CodeSectionProps) => {
  return (
    <section className="grid gap-4">
      <div>
        <Typography tag="h3">{title}</Typography>
        <Typography>{description}</Typography>
      </div>

      {sections.map((section, index) => (
        <div key={index}>
          <Typography tag="h4">{section.title}</Typography>
          <Typography>{section.description}</Typography>
        </div>
      ))}

      <CodeRun
        inputCount={inputCount}
        file={file}
        directory={directory}
        mode={mode}
      />
    </section>
  );
};

export type { TCodeSection };
