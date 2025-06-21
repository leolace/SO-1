import { CodeRun } from "~/components/code-run";
import { CommentsArea } from "~/components/comments-area";
import { Typography } from "~/components/typography";

export default function Checkpoint2() {
  return (
    <div className="grid gap-4">
      <section>
        <Typography tag="h2">Problema do Produtor/Consumidor</Typography>
        <Typography>
          Esse projeto implemeta a solução para o problema do
          Produtor-Consumidor utilizando threads e semáforos da biblioteca
          pthreads.
        </Typography>
        <Typography>
          A aplicação simula a interação de múltiplos produtores e consumidores
          acessando um buffer compartilhado, respeitando a sincronização
          necessária para evitar condições de corrida (Exclusão Mútua),
          inconsistências de dados ou uso excessivo de CPU em espera ativa.
        </Typography>
      </section>

      <section>
        <Typography tag="h3">Objetivo</Typography>
        <ul className="list-disc pl-6 space-y-2">
          <li>Controlar o acesso concorrente ao buffer compartilhado.</li>
          <li>
            Garantir a exclusão mútua nas seções críticas utilizando mutexes.
          </li>
          <li>
            Evitar espera ociosa utilizando semáforos para bloqueio e liberação
            de threads.
          </li>
          <li>
            Gerenciar corretamente o número de posições livres e ocupadas no
            buffer.
          </li>
        </ul>
      </section>

      <section>
        <Typography tag="h3">Funcionamento</Typography>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Produtores inserem itens no buffer enquanto houver espaço
            disponível.
          </li>
          <li>
            Consumidores retiram itens do buffer enquanto houver itens
            disponíveis.
          </li>
          <li>
            Um mutex <code>(pthread_mutex_t)</code> protege o acesso ao buffer
            durante inserções e remoções.
          </li>
          <li>
            Dois semáforos <code>(sem_t)</code> controlam a quantidade de
            posições ocupadas <code>(full)</code> e vagas <code>(empty)</code>{" "}
            no buffer.
          </li>
          <li>Quando o buffer está cheio, os produtores aguardam.</li>
          <li>Quando o buffer está vazio, os consumidores aguardam.</li>
        </ul>
      </section>

      <CodeRun directory="2" file="out" mode="default" />

      <div className="my-6">
        <CommentsArea sectionId="checkpoint2" />
      </div>
    </div>
  );
}
