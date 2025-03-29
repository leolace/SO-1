# Checkpoint 1

## Parte 1

Nesta seção, abordaremos sobre 3 tipos de chamadas de sistemas primitivas de sistemas, sendo elas: de gerenciamento de memória, processos, E/S e arquivos.

### Gerenciamento de memória

Para o gerenciamento de memória, será necessário utilizarmos uma importante biblioca em C que nos dá caminhos para fazer chamadas de processos e manipulação de memória a nivel do sistema. Essa biblioteca chama-se `<sys/mman.h>`.

[Código completo](./memory-management.c)

**Utilização:**

```c
#include <<sys/mman.h>
```

Essa biblioteca nos permite utilizar funções como `mmap()`, `munmap()`, `mprotect()` e `msync()` que são essenciais para o gerenciamento de memoria.

#### mmap() e munmap()

A função mmap() é usada para mapear arquivos ou memória anônima para o espaço de endereço de um processo. Com isso, é possível acessar um arquivo diretamente como se fosse uma região de memória ou alocar memória sem usar malloc().

Já a função munmap(), é usada para desmapear uma região de memória previamente mapeada com mmap().

```c
#define MMAP_FILE_SIZE 4096

void ex_mmap_munmap() {
  // Cria um arquivo de exemplo e dá permissão de leitura e escrita para todos os usuários
  int fd = open("./example/mmapfile", O_RDWR | O_CREAT, 0666);
  ftruncate(fd, MMAP_FILE_SIZE);  // Define o tamanho do arquivo (4kb)

  // Mapeia a memoria compartilhada utilizando a funcao mmap
  // Parametros: Endereço de memória para mapeamento (NULL, pois o sistema vai escolher); Tamanho, em bytes, da região a ser mapeada (4kb); Flags de acesso (neste caso, a memória pode ser lida e escrita); Tipo de mapeamento (compartilhado); Arquivo a ser mapeado; Posição inicial para mapear (neste caso, o inicio do arquivo).
  char *shared_mem = mmap(NULL, MMAP_FILE_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
  if (shared_mem == MAP_FAILED) {
    perror("Erro no mmap");
    return;
  }

  pid_t pid = fork();  // Criando um processo filho

  if (pid == -1) {
    perror("Erro no fork");
    return;
  }

  printf("process: %d\n", pid);

  if (pid == 0) {  // Processo filho (consumidor)
    sleep(1);  // Espera para garantir que o pai escreva primeiro
    printf("Processo Filho leu: %s\n", shared_mem);
  } else {  // Processo pai (produtor)
    strcpy(shared_mem, "Olá, processo filho!");  // Escreve na memória compartilhada
    wait(NULL);  // Espera o filho terminar
  }

  // Desmapeia utilizando a funcao munmap
  // Parametros: Endereço da memoria que será desmapeada; Tamanho, em bytes, da regiao a ser desmapeada.
  munmap(shared_mem, MMAP_FILE_SIZE);
  close(fd);
}
```

Para rodar o exemplo acima, execute `make mem` no terminal e selecione a opção `1`:

```bash
$ make mem
gcc memory-management.c -o mem.out && ./mem.out

==========================
[1] - mmap() e munmap()
[2] - brk()
Selecione um exemplo para executar: 1
Executando...
```

**Output:**

```bash
process: 64089
process: 0
Processo Filho leu: Olá, processo filho!
```

**Descrição das funções utilizadas:**

- `ftruncate()`: Ajusta o tamanho de um arquivo para o tamanho especificado.

```c
ftruncate(fd, MMAP_FILE_SIZE);
```

- `mmap()`: Mapeia um arquivo ou uma região de memória no espaço de endereçamento do processo, possibilitando acesso direto à memória.

```c
char *shared_mem = mmap(NULL, MMAP_FILE_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
```

`NULL`: O sistema escolhe o endereço base para o mapeamento.
`MMAP_FILE_SIZE`: Tamanho da região mapeada (4096 bytes).
`PROT_READ | PROT_WRITE`: Permite leitura e escrita na memória mapeada.
`MAP_SHARED`: As alterações na memória serão refletidas no arquivo subjacente, permitindo compartilhamento entre processos.
`fd`: Descritor do arquivo a ser mapeado.
`0`: Offset inicial no arquivo, ou seja, o mapeamento começa no início.

- `fork()`: Cria um novo processo duplicando o processo atual. O processo original é chamado de pai, e o novo processo, de filho.

```c
pid_t pid = fork();
```

- `strcpy()`: Copia uma string (terminada em \0) de um buffer de origem para um buffer de destino.

```c
strcpy(shared_mem, "Olá, processo filho!");
```

Propósito: Escreve a mensagem na área de memória mapeada, permitindo que o processo filho leia essa informação.

- `munmap()`: Desfaz o mapeamento de uma região de memória previamente criada com mmap(), liberando os recursos associados.

```c
munmap(shared_mem, MMAP_FILE_SIZE);
```

`shared_mem`: Endereço inicial da memória mapeada.
`MMAP_FILE_SIZE`: Tamanho da região a ser desmapeada (4096 bytes).

**Strace (chamadas de sistemas):**

```
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 94.96    0.015450       15450         1           wait4
  1.67    0.000272           6        42           mmap
  1.27    0.000206          17        12           openat
  0.35    0.000057           5        10           mprotect
  0.23    0.000037           1        19           fstat
  0.20    0.000032           2        14         5 newfstatat
  0.18    0.000030          15         2           readlink
  0.18    0.000029           2        10           read
  0.15    0.000025           1        13           close
  0.13    0.000021          10         2           munmap
  0.13    0.000021           5         4           brk
  0.12    0.000020           2        10           rt_sigaction
  0.11    0.000018           9         2           getdents64
  0.10    0.000016           2         6           ioctl
  0.07    0.000011           2         5           fcntl
  0.03    0.000005           5         1           getcwd
  0.02    0.000004           2         2           pread64
  0.02    0.000003           3         1           prlimit64
  0.02    0.000003           3         1           getrandom
  0.01    0.000002           0         7           rt_sigprocmask
  0.01    0.000002           2         1           arch_prctl
  0.01    0.000002           2         1           set_tid_address
  0.01    0.000002           2         1           set_robust_list
  0.01    0.000002           2         1           rseq
  0.00    0.000000           0         1           write
  0.00    0.000000           0         2         1 access
  0.00    0.000000           0         1           execve
  0.00    0.000000           0         1           chdir
  0.00    0.000000           0         1           getuid
  0.00    0.000000           0         1           getgid
  0.00    0.000000           0         1           geteuid
  0.00    0.000000           0         1           getegid
  0.00    0.000000           0         1           clone3
------ ----------- ----------- --------- --------- ----------------
100.00    0.016270          91       178         6 total
```

**Descrição das syscalls identificadas:**

`wait4`: Aguarda a mudança de estado de um ou mais processos filhos (por exemplo, que terminem ou sejam interrompidos) e pode coletar informações sobre seu status.

`mmap`: Mapeia um arquivo ou um dispositivo na memória do processo, criando uma região de memória que pode ser lida e/ou escrita diretamente.

`openat`: Abre um arquivo relativo a um descritor de diretório, permitindo operações de abertura com caminhos relativos a um diretório já aberto.

`mprotect`: Altera as permissões de acesso (como leitura, escrita e execução) de uma região de memória já mapeada.

`fstat`: Obtém informações (metadados) sobre um arquivo, a partir de um descritor de arquivo.

`newfstatat`: É uma versão mais recente e versátil para recuperar informações de arquivos (semelhante ao fstat), podendo ser utilizada com caminhos relativos a um diretório.

`readlink`: Lê o conteúdo de um link simbólico (symlink) e retorna o caminho para o qual ele aponta.

`read`: Lê dados de um descritor de arquivo e os armazena em um buffer na memória do processo.

`close`: Fecha um descritor de arquivo, liberando os recursos associados e invalidando o descritor.

`munmap`: Desfaz o mapeamento criado por mmap(), liberando a região de memória associada.

`brk`: Ajusta o final (break) do segmento de dados do processo, ou seja, altera o tamanho do heap.

`rt_sigaction`: Configura um manipulador (handler) para sinais (signals) em tempo real, definindo como o processo reage a interrupções.

`getdents64`: Lê entradas de diretórios (como nomes de arquivos) de forma eficiente, retornando dados em um formato específico (estrutura de diretório).

`ioctl`: Realiza operações de entrada/saída específicas de dispositivos, permitindo controle fino sobre dispositivos de hardware.

`fcntl`: Realiza operações de controle em descritores de arquivos, como alterar bandeiras (flags) ou definir propriedades de bloqueio.

`getcwd`: Retorna o caminho absoluto do diretório de trabalho atual do processo.

`pread64`: Lê dados de um descritor de arquivo em uma posição específica, sem alterar o offset associado ao descritor.

`prlimit64`: Permite obter e definir limites de recursos (como tamanho máximo de arquivo, uso de memória, etc.) para um processo.

`getrandom`: Gera dados aleatórios, utilizando fontes de entropia do sistema.

`rt_sigprocmask`: Gerencia a máscara de sinais do processo, permitindo bloquear ou desbloquear sinais específicos.

`arch_prctl`: Realiza operações específicas da arquitetura (como configurar registradores ou atributos de execução) em processos.

`set_tid_address`: Registra um endereço na memória onde o kernel poderá atualizar o ID da thread (usado em implementações de robust futex).

`set_robust_list`: Define uma lista robusta (robust list) para um thread, que ajuda a gerenciar bloqueios (mutexes) em casos de falha da thread.

`rseq`: Suporta sequências reiniciáveis (restartable sequences), permitindo que operações críticas sejam realizadas de forma atômica e eficiente em código de usuário.

`write`: Escreve dados de um buffer para um descritor de arquivo.

`access`: Verifica se o processo tem permissão para acessar um determinado arquivo (por exemplo, leitura ou escrita).

`execve`: Substitui o processo atual por um novo programa, carregando o executável especificado e iniciando sua execução.

`chdir`: Altera o diretório de trabalho atual do processo para o especificado.

`getuid`: Retorna o identificador (ID) do usuário real que iniciou o processo.

`getgid`: Retorna o identificador do grupo real do usuário que iniciou o processo.

`geteuid`: Retorna o identificador do usuário efetivo (que pode ser diferente do real, em casos de programas setuid).

`getegid`: Retorna o identificador do grupo efetivo do processo.

`clone3`: Cria um novo processo ou thread com opções estendidas (mais flexíveis e configuráveis que a chamada clone tradicional).

#### brk()

A função `brk()` é usada para definir o limite superior da região de heap de um processo. Em termos simples, ela ajusta o "break" do heap, que é o ponto onde termina a memória alocada dinamicamente pelo processo.

```c
int brk(void *end_data_segment);

// recebe um ponteiro que indica um novo endereço para o break do heap
```

```c
void ex_brk() {
	void *current_brk, *new_brk;

	// Obtém o endereço atual do break
	current_brk = sbrk(0);
	printf("Endereço inicial do break: %p\n", current_brk);

	// Move o break para frente, alocando 4096 bytes (4 KB)
	if (brk(current_brk + 4096) == -1) {
		perror("Erro ao expandir o heap");
		return;
	}

	new_brk = sbrk(0); // Obtém o novo endereço do break
	printf("Endereço após expansão: %p\n", new_brk);

	// Retorna o break para a posição original, liberando a memória
	if (brk(current_brk) == -1) {
		perror("Erro ao liberar a memória");
		return;
	}

	printf("Endereço após liberar a memória: %p\n", sbrk(0));

	return;
}
```

Para rodar o exemplo acima, execute `make mem` no terminal e selecione a opção `2`:

```bash
$ make mem
gcc memory-management.c -o mem.out && ./mem.out

==========================
[1] - mmap() e munmap()
[2] - brk()
Selecione um exemplo para executar: 2
Executando...
```

**Output:**

```bash
Endereço inicial do break: 0x56bf8b7fc000
Endereço após expansão: 0x56bf8b7fd000
Endereço após liberar a memória: 0x56bf8b7fc000
```

**Descrição das funções utilizadas:**

`sbrk(0)`: Obtém o endereço atual do break do heap, ou seja, o final da região de memória alocada dinamicamente.

`brk(current_brk + 4096)`: Move o break 4 KB à frente, alocando memória adicional.

**Strace (chamadas de sistema):**

```
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 91.33    0.015531       15531         1           wait4
  2.61    0.000443          10        42           mmap
  2.41    0.000410         410         1           execve
  0.69    0.000117           9        12           openat
  0.41    0.000070           3        19           fstat
  0.38    0.000065           4        14         5 newfstatat
  0.35    0.000059           5        10           read
  0.34    0.000058           4        13           close
  0.24    0.000040          40         1           clone3
  0.19    0.000033          16         2           getdents64
  0.18    0.000031          15         2           readlink
  0.14    0.000023           5         4           brk
  0.13    0.000022           2        10           rt_sigaction
  0.12    0.000021           3         7           rt_sigprocmask
  0.08    0.000014           2         6           ioctl
  0.08    0.000014           7         2         1 access
  0.06    0.000011          11         1           chdir
  0.05    0.000009           4         2           munmap
  0.05    0.000009           4         2           pread64
  0.05    0.000008           1         5           fcntl
  0.04    0.000007           7         1           write
  0.02    0.000003           3         1           getcwd
  0.01    0.000002           2         1           getuid
  0.01    0.000002           2         1           getgid
  0.01    0.000002           2         1           getegid
  0.01    0.000001           1         1           geteuid
  0.00    0.000000           0        10           mprotect
  0.00    0.000000           0         1           arch_prctl
  0.00    0.000000           0         1           set_tid_address
  0.00    0.000000           0         1           set_robust_list
  0.00    0.000000           0         1           prlimit64
  0.00    0.000000           0         1           getrandom
  0.00    0.000000           0         1           rseq
------ ----------- ----------- --------- --------- ----------------
100.00    0.017005          95       178         6 total
```

### Processos

Para gerenciar processos em C, utilizamos a biblioteca <unistd.h>, que fornece funções essenciais para realizar chamadas de sistema relacionadas a processos.

#### fork() e wait()

A função fork() é usada para criar um novo processo (chamado de processo filho), que é uma cópia do processo original (processo pai).
```c
#include <unistd.h>

pid_t fork(void);
```

A função wait() faz com que o processo pai espere a finalização do processo filho, evitando que ele se torne um zumbi.
```c
#include <sys/types.h>
#include <sys/wait.h>

pid_t wait(int *status);
```

```c
void ex_fork_wait() {
	pid_t pid = fork();
	if (pid == 0) {
		printf("Processo filho finalizando\n");
	} else {
		wait(NULL); // Pai espera o filho terminar
		printf("Processo pai finalizou\n");
	}
	return;
}
```

Para rodar o exemplo acima, execute `make process` no terminal e selecione a opção `1`:

```bash
$ make process
gcc process.c -o process.out && ./process.out

==========================
[1] - fork() e wait()
[2] - execve()
Selecione um exemplo para executar: 1
```

**Output:**

```
Processo filho finalizando
Processo pai finalizou
```

**Strace (chamadas de sistema):**

```
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 90.79    0.018193       18193         1           wait4
  2.56    0.000513          12        42           mmap
  2.01    0.000403         403         1           execve
  0.65    0.000131          10        12           openat
  0.45    0.000091           4        19           fstat
  0.43    0.000086           6        14         5 newfstatat
  0.39    0.000079           7        10           mprotect
  0.32    0.000065           5        13           close
  0.32    0.000064          64         1           clone3
  0.27    0.000055           5        10           read
  0.23    0.000046          23         2           munmap
  0.21    0.000043          21         2           readlink
  0.20    0.000040           4        10           rt_sigaction
  0.19    0.000039           9         4           brk
  0.15    0.000030           4         7           rt_sigprocmask
  0.14    0.000029           4         6           ioctl
  0.11    0.000022          11         2           getdents64
  0.08    0.000017           3         5           fcntl
  0.08    0.000017          17         1           chdir
  0.07    0.000015           7         2         1 access
  0.05    0.000011           5         2           pread64
  0.04    0.000009           9         1           write
  0.03    0.000007           7         1           getcwd
  0.03    0.000007           7         1           getrandom
  0.02    0.000005           5         1           arch_prctl
  0.02    0.000004           4         1           set_tid_address
  0.02    0.000004           4         1           set_robust_list
  0.02    0.000004           4         1           rseq
  0.01    0.000003           3         1           getgid
  0.01    0.000003           3         1           geteuid
  0.01    0.000002           2         1           getuid
  0.01    0.000002           2         1           getegid
  0.00    0.000000           0         1           prlimit64
------ ----------- ----------- --------- --------- ----------------
100.00    0.020039         112       178         6 total
```

#### execve()

A função execve() é usada para substituir o processo atual por um novo programa. Isso significa que, após a execução de execve(), o código original do processo deixa de existir e é substituído pelo código do novo programa.

```c
#include <unistd.h>

int execve(const char *pathname, char *const argv[], char *const envp[]);
```

`pathname`: Caminho absoluto ou relativo do executável.
`argv[]`: Lista de argumentos passados para o programa (o primeiro argumento deve ser o próprio nome do programa).
`envp[]`: Lista de variáveis de ambiente (geralmente usa-se NULL).


```c
void ex_execve() {
	char *args[] = {"/bin/ls", "-l", NULL};
	execve("/bin/ls", args, NULL);  // Substitui o processo pelo comando ls
	printf("Nunca serei printado.\n"); // Só será executado se execve falhar
	return;
}
```

Para rodar o exemplo acima, execute `make process` no terminal e selecione a opção `2`:

```bash
$ make process
gcc process.c -o process.out && ./process.out

==========================
[1] - fork() e wait()
[2] - execve()
Selecione um exemplo para executar: 2
```

**Output:**

```
total 88
-rw-r--r-- 1 leolarch leolarch   205 Mar 29 10:58  Makefile
-rw-r--r-- 1 leolarch leolarch 19390 Mar 29 14:40  README.md
drwxr-xr-x 1 leolarch leolarch    16 Mar 29 10:58  example
-rw-r--r-- 1 leolarch leolarch    28 Mar 29 10:58  io.c
-rwxr-xr-x 1 leolarch leolarch 16200 Mar 29 12:51  mem.out
-rw-r--r-- 1 leolarch leolarch  2797 Mar 29 12:39  memory-management.c
-rw-r--r-- 1 leolarch leolarch 15173 Mar 29 12:17  memory-management.strace
-rw-r--r-- 1 leolarch leolarch   974 Mar 29 14:11  process.c
-rwxr-xr-x 1 leolarch leolarch 15808 Mar 29 14:40  process.out
```

**Strace (chamadas de sistema):**

```c
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 91.67    0.020807       20807         1           wait4
  2.99    0.000679          16        42           mmap
  0.73    0.000165          13        12           openat
  0.52    0.000119           8        14         5 newfstatat
  0.51    0.000115           6        19           fstat
  0.50    0.000114          11        10           mprotect
  0.40    0.000091           7        13           close
  0.37    0.000084           8        10           read
  0.27    0.000062          62         1           clone3
  0.23    0.000052          26         2           munmap
  0.23    0.000052           7         7           rt_sigprocmask
  0.22    0.000050          25         2           readlink
  0.19    0.000044           4        10           rt_sigaction
  0.16    0.000036           9         4           brk
  0.16    0.000036          18         2           getdents64
  0.14    0.000032           5         6           ioctl
  0.11    0.000025           5         5           fcntl
  0.10    0.000022          11         2         1 access
  0.10    0.000022          22         1           chdir
  0.07    0.000015          15         1           write
  0.06    0.000014           7         2           pread64
  0.04    0.000008           8         1           getcwd
  0.03    0.000007           7         1           getrandom
  0.03    0.000006           6         1           arch_prctl
  0.03    0.000006           6         1           prlimit64
  0.03    0.000006           6         1           rseq
  0.02    0.000005           5         1           geteuid
  0.02    0.000005           5         1           getegid
  0.02    0.000005           5         1           set_tid_address
  0.02    0.000005           5         1           set_robust_list
  0.02    0.000004           4         1           getuid
  0.02    0.000004           4         1           getgid
  0.00    0.000000           0         1           execve
------ ----------- ----------- --------- --------- ----------------
100.00    0.022697         127       178         6 total
```

### E/S e Arquivos
