import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Output } from "~/components/output";
import type { CodeSectionProps, TCodeSection } from "./type";

export const CodeSection = ({
  file,
  title,
  description,
  sections,
  inputCount,
}: CodeSectionProps) => {
  const fetcher = useFetcher();
  const [input, setInput] = useState<string | null>(null);

  useEffect(() => {
    fetcher.load(`/1?file=${file}&input=${input}`);
  }, [input]);

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

      <div>
        <div className="input-selection my-3 flex gap-2 items-center">
          <label htmlFor="input-select" className="text-lg font-medium">
            Selecione uma opção:
          </label>
          <select
            id="input-select"
            value={input || "0"}
            onChange={(e) => setInput(e.target.value)}
            className="px-2 py-1 w-52 rounded border border-gray-300"
          >
            <option value="0">Selecione</option>
            {Array.from({ length: inputCount }, (_, i) => (
              <option key={i} value={i + 1}>
                Input {i + 1}
              </option>
            ))}
          </select>
        </div>

        <Output output={fetcher.data} loading={fetcher.state === "loading"} />
      </div>
    </section>
  );
};

export type { TCodeSection };
