import type { TCodeSection } from "~/components/section";

export const MemorySectionData: TCodeSection = {
  title: "Gerenciamento de Memória",
  description:
    "Para o gerenciamento de memória, será necessário utilizarmos uma importante biblioca em C que nos dá caminhos para fazer chamadas de processos e manipulação de memória a nivel do sistema. Essa biblioteca chama-se `sys/mman.h`.",
  file: "mem.out",
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
  file: "process.out",
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
    "Nesta seção, abordaremos sobre as chamadas de sistema relacionadas a entrada e saída (I/O) e manipulação de arquivos.",
  file: "io.out",
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
