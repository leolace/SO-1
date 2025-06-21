import { CodeSection } from "~/components/code-section";
import {
  CPUBoundSectionData,
  IOBoundSectionData,
  IOSectionData,
  MemorySectionData,
  ProcessSectionData,
} from "./data";
import { CommentsArea } from "~/components/comments-area";
import { Typography } from "~/components/typography";

export default function Checkpoint1() {
  return (
    <div className="grid gap-12">
      <section className="grid gap-12 border-b-2 py-8 border-gray-300">
        <div>
          <h2 className="text-2xl font-bold">Chamadas ao Sistema</h2>
          <p className="text-lg">
            Nesta seção, abordaremos sobre 3 tipos de chamadas de sistemas
            primitivas de sistemas, sendo elas: de gerenciamento de memória,
            processos, E/S e arquivos..
          </p>
        </div>

        <CodeSection {...MemorySectionData} />
        <CodeSection {...ProcessSectionData} />
        <CodeSection {...IOSectionData} />
      </section>

      <section className="grid gap-6">
        <div>
          <Typography tag="h2">Processos CPU-Bound e IO-Bound</Typography>
          <Typography>
            Processos CPU-Bound e I/O-Bound são dois tipos de processos que se
            comportam de maneiras diferentes em relação ao uso de recursos do
            sistema, como o processador (CPU) e a entrada/saída (I/O). A seguir,
            escolheremos uma das funções anteriores e, a partir do uso de
            algumas técnicas e ferramentas de análise, determinaremos se a
            função escolhida é CPU-Bound ou IO-Bound.
          </Typography>
        </div>

        <div>
          <Typography tag="h3">CPU-Bound</Typography>
          <Typography>
            São processos que passam a maior parte do tempo realizando cálculos
            ou operações que exigem uso intenso da CPU. Eles não dependem tanto
            de operações de entrada/saída, como ler ou gravar dados de arquivos,
            mas sim de poder de processamento computacional. Programas de
            cálculo numérico, como simulações científicas ou criptografia, onde
            a principal limitação é o desempenho do processador.
          </Typography>
        </div>

        <CodeSection {...IOBoundSectionData} />
        <CodeSection {...CPUBoundSectionData} />
      </section>

      <div className="mb-6">
        <CommentsArea sectionId="checkpoint1" />
      </div>
    </div>
  );
}
