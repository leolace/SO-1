import { useState } from "react";
import { Output } from "../output";
import { Button } from "../form/button";
import { useRunQuery } from "./queries";
import type { CodeRunData } from "./types";

export const CodeRun = ({ input, file, directory, mode }: CodeRunData) => {
  const [selectedInput, setSelectedInput] = useState(
    typeof input === "string" ? input : "0",
  );

  const { data, refetch, isFetching } = useRunQuery(
    file,
    directory,
    mode,
    selectedInput,
  );

  return (
    <div className="grid gap-2">
      <div className="my-3 flex justify-between items-end">
        {Array.isArray(input) && (
          <select
            id="input-select"
            value={selectedInput}
            onChange={(e) => setSelectedInput(e.target.value)}
            className="px-2 py-1 w-52 rounded border border-gray-300"
          >
            <option value="0">Selecione um input</option>
            {input.map((inp, index) => (
              <option key={index} value={index + 1}>
                [{index + 1}] - {inp}
              </option>
            ))}
          </select>
        )}
        {typeof input === "string" && (
          <div className="relative block text-md text-gray-900 bg-gray-100 rounded-lg border border-gray-300">
            <span className="absolute top-0 left-0 px-5 py-1 bg-gray-300 w-full text-neutral-700">
              Input
            </span>
            <textarea
              placeholder="Digite seu comentário aqui..."
              required
              value={selectedInput.replaceAll("*", "\n").trim()}
              onChange={(e) =>
                setSelectedInput(e.target.value.replaceAll("\n", "*"))
              }
              className="w-full min-h-50 p-2.5 pt-8 focus:outline-none"
              cols={30}
              name="data"
            />
          </div>
        )}
        <Button
          onClick={() => refetch()}
          type="secondary"
          disabled={isFetching}
        >
          Executar
        </Button>
      </div>

      <Output output={data || ""} loading={isFetching} />
    </div>
  );
};
