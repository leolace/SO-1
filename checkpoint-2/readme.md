# Problema do Produtor/Consumidor

Esse projeto implemeta a solução para o problema do Produtor-Consumidor utilizando threads e semáforos da biblioteca pthreads.

A aplicação simula a interação de múltiplos produtores e consumidores acessando um buffer compartilhado, respeitando a sincronização necessária para evitar condições de corrida (Exclusão Mútua), inconsistências de dados ou uso excessivo de CPU em espera ativa.

## Objetivo

- Controlar o acesso concorrente ao buffer compartilhado.
- Garantir a exclusão mútua nas seções críticas utilizando mutexes.
- Evitar espera ociosa utilizando semáforos para bloqueio e liberação de threads.
- Gerenciar corretamente o número de posições livres e ocupadas no buffer.

## Funcionamento

- Produtores inserem itens no buffer enquanto houver espaço disponível.
- Consumidores retiram itens do buffer enquanto houver itens disponíveis.
- Um mutex `(pthread_mutex_t)` protege o acesso ao buffer durante inserções e remoções.
- Dois semáforos `(sem_t)` controlam a quantidade de posições ocupadas `(full)` e vagas `(empty)` no buffer.
- Quando o buffer está cheio, os produtores aguardam.
- Quando o buffer está vazio, os consumidores aguardam.

## Requisitos para execução

- Sistema Linux ou compatível com POSIX.
- Compilador gcc.
- Biblioteca pthread instalada.

## Estrutura do Código
- Buffer: Array compartilhado de tamanho limitado.
- Mutex: Garante que apenas um produtor ou consumidor modifique o buffer por vez.
- Semáforos:
  - empty: Conta o número de espaços vazios.
  - full: Conta o número de espaços preenchidos.
- Produtor:
  - Aguarda um espaço livre `(sem_wait(empty))`.
  - Bloqueia o mutex, insere o item e libera o mutex.
  - Incrementa full `(sem_post(full))`.
- Consumidor:
  - Aguarda um item disponível `(sem_wait(full))`.
  - Bloqueia o mutex, consome o item e libera o mutex.
  - Incrementa empty `(sem_post(empty))`.