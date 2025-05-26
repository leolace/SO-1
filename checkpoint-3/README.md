# Simulador de Gerenciamento de Memória Virtual com Paginação

Este programa implementa um simulador de gerenciamento de memória virtual com paginação, utilizando o algoritmo de substituição de páginas *Clock* (Second Chance). O simulador demonstra conceitos fundamentais de sistemas operacionais como tabelas de páginas, swap, alocação de memória física e o tratamento de faltas de página.

## Características do Sistema

* Memória física limitada a 8 quadros (frames)
* Tamanho de página fixo em 256 bytes
* Suporte para até 10 processos simultâneos
* Cada processo pode ter até 64 páginas
* Algoritmo de substituição de páginas: Clock (Second Chance)
* Suporte a processos em estados PRONTO e SUSPENSO
* Gerenciamento de memória secundária (SWAP)

## Estruturas de Dados Principais

### Processo
Representa um processo no sistema com:
- PID (identificador do processo)
- Tamanho em bytes
- Estado (PRONTO ou SUSPENSO)
- Número de páginas
- Tabela de páginas
- Informações sobre páginas em SWAP

### Tabela de Páginas
Cada processo possui uma tabela de páginas onde cada entrada contém:
- Flag de presença (presente na memória física)
- Flag de modificação (dirty bit)
- Quadro associado na memória física
- Bit de referência (usado no algoritmo Clock)
- Timestamp do último acesso

### Memória Física
Representada por um array de quadros (frames), onde cada quadro contém:
- Flag de disponibilidade (livre ou ocupado)
- PID do processo que o utiliza
- Número da página associada

## Operações Suportadas

O simulador processa um arquivo de entrada contendo comandos no seguinte formato:

- `Pn C tamanho`: Cria um processo com id 'n' e tamanho especificado em bytes
- `Pn R endereco`: Simula leitura do endereço lógico pelo processo 'n'
- `Pn W endereco`: Simula escrita no endereço lógico pelo processo 'n'
- `Pn P`: Simula uma instrução de CPU pelo processo 'n'
- `Pn I`: Simula uma instrução de E/S (I/O) pelo processo 'n'

Os endereços podem ser fornecidos em formato decimal ou binário (entre parênteses).

## Algoritmo de Substituição de Páginas (Clock)

O algoritmo Clock (também conhecido como Second Chance) utiliza um ponteiro que percorre ciclicamente os quadros da memória física. Quando é necessário substituir uma página:

1. O ponteiro examina o bit de referência da página atual
2. Se o bit de referência estiver ativo (1), ele é desativado (0) e o ponteiro avança
3. Se o bit de referência estiver inativo (0), a página é escolhida para substituição

Este algoritmo é eficiente e evita o overhead de ordenação das páginas por tempo de acesso como ocorre no LRU (Least Recently Used).

## Tratamento de Faltas de Página

Quando ocorre uma falta de página, o simulador:

1. Tenta encontrar um quadro livre na memória física
2. Se não encontrar, utiliza o algoritmo Clock para selecionar uma página para substituição
3. Se a página selecionada foi modificada, marca-a como presente na área de SWAP
4. Carrega a nova página no quadro liberado

## Swap In/Out

- **Swap Out**: Quando um processo é suspenso, todas as suas páginas são removidas da memória física e marcadas como presentes na área de swap.
- **Swap In**: Quando um processo suspenso é acessado, ele é reativado e suas páginas são marcadas como não presentes na área de swap (serão trazidas de volta à memória conforme necessário).

## Compilação e Execução

Para compilar e executar o simulador, utilize:

```bash
make
```

Ou manualmente:

```bash
gcc -o out main.c
./out arquivo_de_entrada.txt
```

O arquivo de entrada deve conter comandos conforme descrito anteriormente.

## Saída

O programa exibe informações detalhadas sobre:
- Processos criados
- Operações de leitura e escrita de memória
- Faltas de página e alocações
- Substituições de página
- Operações de swap

Ao final da execução, exibe:
- Estado das tabelas de página de todos os processos
- Estado atual da memória física

## Exemplo de Arquivo de Entrada

```
P1 C 500
P1 R (0)2
P1 R (1024)2
P1 P  (1)2
P1 R (2)2
P1 P (2)2
P1 W  (1024)2
P7 C 1000
P7 R (4095)2
```

## Exemplo de Saída

```
Processo P1 criado (500 bytes, 2 páginas).
[!] Falta de página em P1 página 0.
[+] Página 0 de P1 alocada no quadro 0.
P1 leu página 0 (quadro 0).
P1 executando instrução de CPU.
P1 leu página 0 (quadro 0).
P1 executando instrução de CPU.
P1 escreveu página 0 (quadro 0).
Processo P7 criado (1000 bytes, 4 páginas).
[!] Falta de página em P7 página 0.
[+] Página 0 de P7 alocada no quadro 1.

Tabela de Páginas do Processo P1 (PRONTO):
Página | Presente | Modificado | Quadro | Referenciado | Swap
     0 |        1 |          1 |      0 |             1 |    0
     1 |        0 |          0 |     -1 |             0 |    0

Tabela de Páginas do Processo P7 (PRONTO):
Página | Presente | Modificado | Quadro | Referenciado | Swap
     0 |        1 |          0 |      1 |             1 |    0
     1 |        0 |          0 |     -1 |             0 |    0
     2 |        0 |          0 |     -1 |             0 |    0
     3 |        0 |          0 |     -1 |             0 |    0

Estado da Memória Física:
Quadro | Livre | PID | Página
     0 |     0 |   1 |      0
     1 |     0 |   7 |      0
     2 |     1 |  -1 |     -1
     3 |     1 |  -1 |     -1
     4 |     1 |  -1 |     -1
     5 |     1 |  -1 |     -1
     6 |     1 |  -1 |     -1
     7 |     1 |  -1 |     -1
```

## Limitações

- Tamanho fixo de página (256 bytes)
- Número máximo de processos (10)
- Número máximo de páginas por processo (64)
- Número fixo de quadros na memória física (8)
