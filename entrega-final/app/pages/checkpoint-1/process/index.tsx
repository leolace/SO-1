import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Output } from "~/components/output";

export const ProcessSection = () => {
  const fetcher = useFetcher();
  const [input, setInput] = useState<string | null>(null);

  useEffect(() => {
    fetcher.load(`/1?file=process.out&input=${input}`);
  }, [input]);

  return (
    <section>
      <h3 className="text-xl font-bold">Processos</h3>
      <p>
        Para gerenciar processos em C, utilizamos a biblioteca `unistd.h`, que
        fornece funções essenciais para realizar chamadas de sistema
        relacionadas a processos.
      </p>
      <div className="input-selection my-3 flex gap-2 items-center">
        <label htmlFor="input-select" className="text-lg font-medium">
          Selecione uma opção:
        </label>
        <select
          id="input-select"
          value={input || "0"}
          defaultValue="0"
          onChange={(e) => setInput(e.target.value)}
          className="px-2 py-1 w-52 rounded border border-gray-300"
        >
          <option value="0">Selecione</option>
          <option value="1">Input 1</option>
          <option value="2">Input 2</option>
        </select>
      </div>

      <Output output={fetcher.data} />
    </section>
  );
};
