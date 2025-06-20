import { execSync } from "child_process";
import { type LoaderFunctionArgs } from "react-router";
import { CodeSection } from "~/components/section";
import { IOSectionData, MemorySectionData, ProcessSectionData } from "./data";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const input = url.searchParams.get("input");
  const file = url.searchParams.get("file") || "io.out";

  try {
    const output = execSync(
      `cd ./checkpoints/1 && ./${file}`,
      !!input
        ? {
            input,
          }
        : undefined
    ).toString();
    return Response.json(output.trim());
  } catch (error) {
    console.error("Error executing C program:", error);
    return Response.json("Error executing C program", { status: 500 });
  }
}

export default function Checkpoint1() {
  return (
    <div className="grid gap-12">
      <div className="grid gap-12">
        <section>
          <h2 className="text-2xl font-bold">Chamadas ao Sistema</h2>
          <p className="text-lg">
            Nesta seção, abordaremos sobre 3 tipos de chamadas de sistemas
            primitivas de sistemas, sendo elas: de gerenciamento de memória,
            processos, E/S e arquivos..
          </p>
        </section>

        <CodeSection {...MemorySectionData} />
        <CodeSection {...ProcessSectionData} />
        <CodeSection {...IOSectionData} />
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          Processos CPU-Bound e IO-Bound
        </h2>
        <p>
          Processos CPU-Bound e I/O-Bound são dois tipos de processos que se
          comportam de maneiras diferentes em relação ao uso de recursos do
          sistema, como o processador (CPU) e a entrada/saída (I/O). A seguir,
          escolheremos uma das funções anteriores e, a partir do uso de algumas
          técnicas e ferramentas de análise, determinaremos se a função
          escolhida é CPU-Bound ou IO-Bound.
        </p>
        
        <h3>IO-Bound</h3>
        <p>São processos que passam a maior parte do tempo esperando por operações de entrada/saída (I/O), como leitura e gravação de arquivos, acesso a bancos de dados ou comunicação de rede. O desempenho desses processos é limitado pela velocidade de acesso ao dispositivo de I/O e não pela capacidade de processamento da CPU. Aplicações de servidores web, programas que fazem backup ou qualquer outro processo que envolva operações frequentes de leitura e escrita em disco ou na rede.</p>

        <h3>CPU-Bound</h3>
        <p>São processos que passam a maior parte do tempo realizando cálculos ou operações que exigem uso intenso da CPU. Eles não dependem tanto de operações de entrada/saída, como ler ou gravar dados de arquivos, mas sim de poder de processamento computacional. Programas de cálculo numérico, como simulações científicas ou criptografia, onde a principal limitação é o desempenho do processador.</p>
      </section>
    </div>
  );
}
