import type { CodeSectionProps, TCodeSection } from "./type";
import { CodeRun } from "../code-run";

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
        <h3 className="text-xl font-bold">{title}</h3>
        <p>{description}</p>
      </div>

      {sections.map((section, index) => (
        <div key={index}>
          <h4 className="text-lg font-medium">{section.title}</h4>
          <p>{section.description}</p>
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
