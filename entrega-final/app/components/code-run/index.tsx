import { useState } from "react";
import { Output } from "../output";
import { Button } from "../form/button";
import { useRunQuery } from "./queries";

export interface CodeRunProps {
  inputCount?: number;
  file: string;
  directory: "1" | "2" | "3";
  mode: "default" | "time";
}

export const CodeRun = ({
  inputCount,
  file,
  directory,
  mode,
}: CodeRunProps) => {
  const [input, setInput] = useState(inputCount ? "0" : undefined);
  const { data, refetch, isLoading } = useRunQuery(
    file,
    directory,
    mode,
    input,
  );

  return (
    <div>
      <div className="input-selection my-3 flex gap-2 items-center justify-between">
        {inputCount && (
          <select
            id="input-select"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="px-2 py-1 w-52 rounded border border-gray-300"
          >
            <option value="0">Selecione um input</option>
            {Array.from({ length: inputCount }, (_, i) => (
              <option key={i} value={i + 1}>
                Input {i + 1}
              </option>
            ))}
          </select>
        )}
        <Button
          onClick={() => refetch()}
          type="secondary"
          disabled={input === "0" || isLoading}
        >
          Executar
        </Button>
      </div>

      <Output output={data || ""} loading={isLoading} />
    </div>
  );
};
