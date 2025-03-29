# Checkpoint 1

## Parte 1

Nesta seção, abordaremos sobre 3 tipos de chamadas de sistemas primitivas de sistemas, sendo elas: de gerenciamento de memória, processos, E/S e arquivos.

### Gerenciamento de memória

Para o gerenciamento de memória, será necessário utilizarmos uma importante biblioca em C que nos dá caminhos para fazer chamadas de processos e manipulação de memória a nivel do sistema. Essa biblioteca chama-se `<sys/mman.h>`.

*Utilização:*

```c
#include <<sys/mman.h>
```

Essa biblioteca nos permite utilizar funções como `mmap()`, `munmap()`, `mprotect()` e `msync()`.

#### mmap() e munmap()

[Código completo](./memory-management.c)

Para rodar o exemplo, execute `make mem` no terminal e selecione a opção 1:

Este

#### brk()

### Processos

### E/S e Arquivos