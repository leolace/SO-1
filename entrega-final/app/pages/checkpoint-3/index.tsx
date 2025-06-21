import { CodeRun } from "~/components/code-run";
import { CommentsArea } from "~/components/comments-area";
import { Typography } from "~/components/typography";

const commands = `
P1 C 500
P1 R (0)2
P1 R (1024)2
P1 P  (1)2
P1 R (2)2
P1 P (2)2
P1 W  (1024)2
P7 C 1000
P7 R (4095)2
P7 R  (800)2
P7 I  (2)2
P7 R (801)2
P7 W  (4096)2
P1 R (3)2
P1 R  (4)2
P1 W (1025)2
P1 W  (1026)2
`.replaceAll("\n", "*");

export default function Checkpoint3() {
  return (
    <div>
      <section>
        <Typography tag="h2">
          Simulador de Gerenciamento de Memória Virtual com Paginação
        </Typography>
        <Typography>
          Este programa implementa um simulador de gerenciamento de memória
          virtual com paginação, utilizando o algoritmo de substituição de
          páginas Clock (Second Chance). O simulador demonstra conceitos
          fundamentais de sistemas operacionais como tabelas de páginas, swap,
          alocação de memória física e o tratamento de faltas de página.
        </Typography>
      </section>

      <section>
        <Typography tag="h3">Características do Sistema</Typography>
        <ul className="list-disc pl-6 space-y-2">
          <li>Memória física limitada a 8 quadros (frames)</li>
          <li>Tamanho de página fixo em 256 bytes</li>
          <li>Suporte para até 10 processos simultâneos</li>
          <li>Cada processo pode ter até 64 páginas</li>
          <li>Algoritmo de substituição de páginas: Clock (Second Chance)</li>
          <li>Suporte a processos em estados PRONTO e SUSPENSO</li>
          <li>Gerenciamento de memória secundária (SWAP)</li>
        </ul>
      </section>

      <CodeRun directory="3" file="out" mode="default" input={commands} />

      <div className="my-6">
        <CommentsArea sectionId="checkpoint3" />
      </div>
    </div>
  );
}
