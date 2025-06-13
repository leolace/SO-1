import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Output } from "~/components/output";

export const IOSection = () => {
  const fetcher = useFetcher();
  const [input, setInput] = useState<string | null>(null);

  useEffect(() => {
    fetcher.load(`/1?file=io.out&input=${input}`);
  }, [input]);

  return (
    <section>
      <h3 className="text-xl font-bold">IO e Arquivos</h3>
      <p>
        Assim como para o gerenciamento de processos, gerenciar arquivos e I/O
        também utilizamos principalmente a biblioteca`unistd.h`.
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
          <option value="2">Input 3</option>
        </select>
      </div>

      <Output output={fetcher.data} />
    </section>
  );
};
