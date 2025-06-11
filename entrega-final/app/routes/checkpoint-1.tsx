import { useState } from "react";
import { useFetcher } from "react-router";

export default function Checkpoint1() {
  const [selectedInput, setSelectedInput] = useState("1");
  const fetcher = useFetcher();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Chamadas ao Sistema</h1>
      <p className="text-lg mb-6">
        Nesta seção, abordaremos sobre 3 tipos de chamadas de sistemas
        primitivas de sistemas, sendo elas: de gerenciamento de memória,
        processos, E/S e arquivos..
      </p>

      <h1 className="text-xl font-bold mb-4">Memoria</h1>
      <div className="input-selection mb-6">
        <label htmlFor="input-select" className="mr-4 text-lg font-medium">
          Selecione o input para o programa C:
        </label>
        <select
          id="input-select"
          value={selectedInput}
          defaultValue="1"
          onChange={(e) => setSelectedInput(e.target.value)}
          className="p-2 rounded border border-gray-300"
        >
          <option value="1">Input 1</option>
          <option value="2">Input 2</option>
          <option value="3">Input 3</option>
        </select>
        <button
          onClick={() => fetcher.load(`/c-1?input=${selectedInput}`)}
          className="ml-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Clicar
        </button>
      </div>

      <div className="output p-4 bg-gray-200 rounded">
        <h3 className="text-xl font-semibold mb-2">
          Saída do programa C (input: {selectedInput}):
        </h3>
        <pre className="p-2 bg-gray-300 rounded">{fetcher.data}</pre>
      </div>
    </div>
  );
}
