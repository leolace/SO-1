import type { TCodeSection } from "~/components/code-section";

export const MemorySectionData: TCodeSection = {
  title: "Gerenciamento de Memória",
  description:
    "Para o gerenciamento de memória, será necessário utilizarmos uma importante biblioca em C que nos dá caminhos para fazer chamadas de processos e manipulação de memória a nivel do sistema. Essa biblioteca chama-se `sys/mman.h`.",
  directory: "1",
  file: "mem.out",
  mode: "default",
  sections: [
    {
      title: "mmap() e munmap()",
      description:
        "A função mmap() é usada para mapear arquivos ou memória anônima para o espaço de endereço de um processo. Com isso, é possível acessar um arquivo diretamente como se fosse uma região de memória ou alocar memória sem usar malloc(). Já a função munmap(), é usada para desmapear uma região de memória previamente mapeada com mmap().",
    },
    {
      title: "brk()",
      description:
        "A função brk() é usada para definir o limite superior da região de heap de um processo. Em termos simples, ela ajusta o 'break' do heap, que é o ponto onde termina a memória alocada dinamicamente pelo processo.",
    },
  ],
  inputCount: 2,
};

export const ProcessSectionData: TCodeSection = {
  title: "Processos",
  description:
    "Para gerenciar processos em C, utilizamos a biblioteca <unistd.h>, que fornece funções essenciais para realizar chamadas de sistema relacionadas a processos.",
  directory: "1",
  file: "process.out",
  mode: "default",
  sections: [
    {
      title: "fork() e wait()",
      description:
        "A função fork() é usada para criar um novo processo (chamado de processo filho), que é uma cópia do processo original (processo pai). A função wait() faz com que o processo pai espere a finalização do processo filho, evitando que ele se torne um zumbi.",
    },
    {
      title: "execve()",
      description:
        "A função execve() é usada para substituir o processo atual por um novo programa. Isso significa que, após a execução de execve(), o código original do processo deixa de existir e é substituído pelo código do novo programa.",
    },
  ],
  inputCount: 2,
};

export const IOSectionData: TCodeSection = {
  title: "IO e Arquivos",
  description:
    "Assim como para o gerenciamento de processos, gerenciar arquivos e I/O também utilizamos principalmente a biblioteca`unistd.h`.",
  directory: "1",
  file: "io.out",
  mode: "default",
  sections: [
    {
      title: "open",
      description:
        "A syscall `open()` abre um arquivo e retorna um descritor de arquivo (file descriptor – FD), que será usado para operações futuras.",
    },
    {
      title: "write",
      description:
        "A syscall `write()` escreve dados em um arquivo a partir de um buffer.",
    },
    {
      title: "read",
      description:
        "A syscall `read()` lê um número específico de bytes de um arquivo para um buffer.",
    },
  ],
  inputCount: 3,
};

export const IOBoundSectionData: TCodeSection = {
  title: "IO-Bound",
  description:
    "Processos IO-Bound são aqueles que passam a maior parte do tempo esperando por operações de entrada/saída (I/O), como leitura e gravação de arquivos, acesso a bancos de dados ou comunicação de rede. O desempenho desses processos é limitado pela velocidade de acesso ao dispositivo de I/O e não pela capacidade de processamento da CPU.",
  directory: "1",
  file: "io-bound.out",
  mode: "time",
  sections: [
    {
      title: "Exemplo de IO-Bound",
      description:
        "Um exemplo de processo IO-Bound é um servidor web que passa a maior parte do tempo esperando por requisições de rede e acessando arquivos estáticos. Esses processos não exigem muito poder de processamento, mas dependem da velocidade de acesso ao disco e à rede.",
    },
  ],
};

export const CPUBoundSectionData: TCodeSection = {
  title: "CPU-Bound",
  description:
    "São processos que passam a maior parte do tempo realizando cálculos ou operações que exigem uso intenso da CPU. Eles não dependem tanto de operações de entrada/saída, como ler ou gravar dados de arquivos, mas sim de poder de processamento computacional. Programas de cálculo numérico, como simulações científicas ou criptografia, onde a principal limitação é o desempenho do processador.",
  directory: "1",
  file: "cpu-bound.out",
  mode: "time",
  sections: [
    {
      title: "Exemplo de CPU-Bound",
      description:
        "Um exemplo de processo CPU-Bound é um programa que realiza cálculos matemáticos complexos, como a fatoração de grandes números ou a simulação de sistemas físicos. Esses processos exigem muito poder de processamento e não dependem tanto de operações de I/O.",
    },
  ],
};
