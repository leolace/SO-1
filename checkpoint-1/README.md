# Chamadas aos Sistema (parte 1)
	
Nesta seção, abordaremos sobre 3 tipos de chamadas de sistemas primitivas de sistemas, sendo elas: de gerenciamento de memória, processos, E/S e arquivos.

## Gerenciamento de memória

Para o gerenciamento de memória, será necessário utilizarmos uma importante biblioca em C que nos dá caminhos para fazer chamadas de processos e manipulação de memória a nivel do sistema. Essa biblioteca chama-se `<sys/mman.h>`.

[Código completo](./memory-management.c)

**Utilização:**

```c
#include <<sys/mman.h>
```

Essa biblioteca nos permite utilizar funções como `mmap()`, `munmap()`, `mprotect()` e `msync()` que são essenciais para o gerenciamento de memoria.

### mmap() e munmap()

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

A função `ex_mmap_munmap()` demonstra o uso de memória mapeada compartilhada entre um processo pai e seu filho. O código começa criando um arquivo de exemplo, mmapfile, e configura o tamanho do arquivo para 4 KB utilizando `ftruncate()`. Em seguida, a função `mmap()` é usada para mapear a memória do arquivo para o espaço de memória do processo, permitindo que ambos os processos (pai e filho) compartilhem essa região.

Após o mapeamento, a função fork() cria um processo filho. O processo pai escreve a string "Olá, processo filho!" na memória compartilhada, enquanto o processo filho, após uma breve espera (com sleep(1) para garantir que o pai escreva primeiro), lê e imprime o conteúdo da memória compartilhada. O processo pai aguarda o término do filho com wait(NULL).

Por fim, após a comunicação entre os processos, a memória mapeada é liberada com a chamada munmap() e o arquivo é fechado com close(fd).

Esse exemplo ilustra como utilizar mmap para criar uma região de memória compartilhada entre processos e como gerenciar essa memória com munmap. O processo pai atua como produtor (escrevendo na memória) e o filho como consumidor (lendo da memória compartilhada).

Para rodar o exemplo acima, execute `make mem` no terminal e selecione a opção `1`:

```bash
$ make mem
gcc memory-management.c -o mem.out && ./mem.out

==========================
[1] - mmap() e munmap()
[2] - brk()
Selecione um exemplo para executar: 1
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
 24.80    0.000582         582         1           wait4
 24.76    0.000581         581         1           execve
 11.04    0.000259         259         1           clone
  9.12    0.000214          23         9           mmap
  5.75    0.000135         135         1           ftruncate
  5.07    0.000119          14         8           write
  3.15    0.000074          37         2           read
  3.07    0.000072          24         3           openat
  2.43    0.000057          19         3           mprotect
  2.34    0.000055          27         2           munmap
  1.58    0.000037           9         4           fstat
  1.24    0.000029           9         3           close
  1.07    0.000025           8         3           brk
  1.02    0.000024          12         2           rt_sigprocmask
  0.72    0.000017           8         2           pread64
  0.60    0.000014          14         1         1 access
  0.38    0.000009           9         1         1 lseek
  0.34    0.000008           8         1           set_robust_list
  0.34    0.000008           8         1           prlimit64
  0.34    0.000008           8         1           getrandom
  0.30    0.000007           7         1           arch_prctl
  0.30    0.000007           7         1           set_tid_address
  0.26    0.000006           6         1           rseq
------ ----------- ----------- --------- --------- ----------------
100.00    0.002347          44        53         2 total
```

**Descrição das syscalls identificadas:**

`wait4`: Aguarda a mudança de estado de um ou mais processos filhos (por exemplo, que terminem ou sejam interrompidos) e pode coletar informações sobre seu status.

`mmap`: Mapeia um arquivo ou um dispositivo na memória do processo, criando uma região de memória que pode ser lida e/ou escrita diretamente.

`openat`: Abre um arquivo relativo a um descritor de diretório, permitindo operações de abertura com caminhos relativos a um diretório já aberto.

`mprotect`: Altera as permissões de acesso (como leitura, escrita e execução) de uma região de memória já mapeada.

`fstat`: Obtém informações (metadados) sobre um arquivo, a partir de um descritor de arquivo.

`read`: Lê dados de um descritor de arquivo e os armazena em um buffer na memória do processo.

`close`: Fecha um descritor de arquivo, liberando os recursos associados e invalidando o descritor.

`munmap`: Desfaz o mapeamento criado por mmap(), liberando a região de memória associada.

`brk`: Ajusta o final (break) do segmento de dados do processo, ou seja, altera o tamanho do heap.

`pread64`: Lê dados de um descritor de arquivo em uma posição específica, sem alterar o offset associado ao descritor.

`prlimit64`: Permite obter e definir limites de recursos (como tamanho máximo de arquivo, uso de memória, etc.) para um processo.

`getrandom`: Gera dados aleatórios, utilizando fontes de entropia do sistema.

`rt_sigpromask`: Gerencia a máscara de sinais do processo, permitindo bloquear ou desbloquear sinais específicos.

`arch_prctl`: Realiza operações específicas da arquitetura (como configurar registradores ou atributos de execução) em processos.

`set_tid_address`: Registra um endereço na memória onde o kernel poderá atualizar o ID da thread (usado em implementações de robust futex).

`set_robust_list`: Define uma lista robusta (robust list) para um thread, que ajuda a gerenciar bloqueios (mutexes) em casos de falha da thread.

`rseq`: Suporta sequências reiniciáveis (restartable sequences), permitindo que operações críticas sejam realizadas de forma atômica e eficiente em código de usuário.

`write`: Escreve dados de um buffer para um descritor de arquivo.

`access`: Verifica se o processo tem permissão para acessar um determinado arquivo (por exemplo, leitura ou escrita).

`execve`: Substitui o processo atual por um novo programa, carregando o executável especificado e iniciando sua execução.

`lseek`: Altera a posição do ponteiro de leitura/escrita em um arquivo aberto. Isso permite pular para uma posição específica, voltar ao início ou obter o tamanho do arquivo.

### brk()

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

A função `ex_brk()` manipula o heap de memória utilizando as funções `brk()` e `sbrk()`. Primeiramente, ela usa sbrk(0) para obter o endereço atual do break (limite do heap), que é a área de memória onde o processo pode alocar dinamicamente. Em seguida, a função move o break para frente utilizando brk(current_brk + 4096), o que aloca 4 KB de memória (expande o heap). Após essa expansão, o novo endereço do break é obtido com outra chamada a sbrk(0) e impresso. Por fim, a função usa brk(current_brk) para restaurar o break à sua posição original, liberando a memória alocada, e imprime o endereço após a liberação. Se ocorrer algum erro durante essas operações, a função imprime uma mensagem de erro com perror(). O código demonstra como expandir e liberar dinamicamente a memória do heap em sistemas que utilizam a técnica de break para gerenciamento de memória.

Para rodar o exemplo acima, execute `make mem` no terminal e selecione a opção `2`:

```bash
$ make mem
gcc memory-management.c -o mem.out && ./mem.out

==========================
[1] - mmap() e munmap()
[2] - brk()
Selecione um exemplo para executar: 2
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
 43.70    0.000746         746         1           execve
 13.18    0.000225          22        10           write
 10.95    0.000187          23         8           mmap
  8.38    0.000143          28         5           brk
  6.56    0.000112          56         2           read
  3.40    0.000058          19         3           mprotect
  2.40    0.000041          20         2           openat
  2.28    0.000039           9         4           fstat
  2.17    0.000037          37         1           munmap
  1.11    0.000019           9         2           pread64
  1.11    0.000019          19         1         1 access
  1.05    0.000018           9         2           close
  0.64    0.000011          11         1         1 lseek
  0.53    0.000009           9         1           arch_prctl
  0.53    0.000009           9         1           set_robust_list
  0.53    0.000009           9         1           prlimit64
  0.53    0.000009           9         1           getrandom
  0.47    0.000008           8         1           set_tid_address
  0.47    0.000008           8         1           rseq
------ ----------- ----------- --------- --------- ----------------
100.00    0.001707          35        48         2 total
```

## Processos

Para gerenciar processos em C, utilizamos a biblioteca `<unistd.h>`, que fornece funções essenciais para realizar chamadas de sistema relacionadas a processos.

### fork() e wait()

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

A função `ex_fork_wait()` cria um novo processo chamando `fork()`. Se `fork()` retornar 0, significa que o código está sendo executado no processo filho, que imprime "Processo filho finalizando" e termina. No processo pai (onde fork() retorna o ID do filho), a chamada wait(NULL) faz com que ele aguarde a finalização do processo filho antes de continuar. Após a espera, o pai imprime "Processo pai finalizou" e finaliza sua execução. Isso garante que o processo pai só termine depois que o filho já tiver concluído.

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
 65.00    0.000312         312         1           clone
 19.37    0.000093          11         8           write
  7.29    0.000035          17         2           rt_sigprocmask
  6.67    0.000032          32         1           wait4
  1.67    0.000008           8         1         1 lseek
  0.00    0.000000           0         2           read
  0.00    0.000000           0         2           close
  0.00    0.000000           0         4           fstat
  0.00    0.000000           0         8           mmap
  0.00    0.000000           0         3           mprotect
  0.00    0.000000           0         1           munmap
  0.00    0.000000           0         3           brk
  0.00    0.000000           0         2           pread64
  0.00    0.000000           0         1         1 access
  0.00    0.000000           0         1           execve
  0.00    0.000000           0         1           arch_prctl
  0.00    0.000000           0         1           set_tid_address
  0.00    0.000000           0         2           openat
  0.00    0.000000           0         1           set_robust_list
  0.00    0.000000           0         1           prlimit64
  0.00    0.000000           0         1           getrandom
  0.00    0.000000           0         1           rseq
------ ----------- ----------- --------- --------- ----------------
100.00    0.000480          10        48         2 total
```

### execve()

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

A função `ex_execve()` chama `execve("/bin/ls", args, NULL)`, que substitui o processo atual pelo comando `/bin/ls -l`, listando os arquivos do diretório atual em formato detalhado. Como `execve()` substitui a imagem do processo em execução, o código após essa chamada (`printf("Nunca serei printado.\n");`) nunca será executado, a menos que `execve()` falhe (por exemplo, se `/bin/ls` não existir), caso em que a execução continua e essa mensagem será impressa.

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
 33.44    0.001373         686         2           execve
 15.66    0.000643          17        37           mmap
  6.43    0.000264          14        18           openat
  5.48    0.000225           8        28           close
  4.04    0.000166           7        22           epoll_ctl
  3.14    0.000129          25         5           munmap
  2.92    0.000120           6        18           epoll_pwait2
  2.75    0.000113           7        16           read
  2.73    0.000112           5        22           fstat
  2.65    0.000109          10        10           mprotect
  1.90    0.000078          19         4           connect
  1.78    0.000073           4        18           write
  1.75    0.000072           8         9           brk
  1.56    0.000064          16         4           socket
  1.56    0.000064           6        10           llistxattr
  1.49    0.000061          10         6         2 recvfrom
  1.44    0.000059           9         6           getdents64
  1.19    0.000049          12         4           sendto
  0.97    0.000040           6         6           rt_sigprocmask
  0.90    0.000037          18         2         2 access
  0.88    0.000036           3        10           statx
  0.71    0.000029           7         4           pread64
  0.68    0.000028           7         4           lseek
  0.58    0.000024           8         3           futex
  0.54    0.000022          11         2           epoll_create1
  0.49    0.000020           5         4           newfstatat
  0.46    0.000019           9         2           timerfd_create
  0.44    0.000018           6         3           getrandom
  0.37    0.000015           7         2           timerfd_settime
  0.19    0.000008           8         1           getpid
  0.19    0.000008           4         2           arch_prctl
  0.19    0.000008           4         2           prlimit64
  0.17    0.000007           3         2           set_tid_address
  0.17    0.000007           3         2           set_robust_list
  0.15    0.000006           3         2           rseq
  0.00    0.000000           0         1           ioctl
  0.00    0.000000           0         6         4 prctl
------ ----------- ----------- --------- --------- ----------------
100.00    0.004106          13       299         8 total
```

`getdents64`: Lê entradas de diretórios (como nomes de arquivos) de forma eficiente, retornando dados em um formato específico (estrutura de diretório).

`ioctl`: Realiza operações de entrada/saída específicas de dispositivos, permitindo controle fino sobre dispositivos de hardware.

## E/S e Arquivos

Assim como para o gerenciamento de processos, gerenciar arquivos e I/O também utilizamos principalmente a biblioteca`<unistd.h>`.

### open()

A syscall `open()` abre um arquivo e retorna um descritor de arquivo (file descriptor – FD), que será usado para operações futuras.

```c
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

int open(const char *pathname, int flags, mode_t mode);
```

```c
void ex_open() {
	int fd = open("./example/io.open", O_CREAT | O_WRONLY, 0644);
    
	if (fd == -1) {
		perror("Erro ao abrir arquivo");
		return;
	}

	printf("Arquivo aberto com sucesso! FD: %d\n", fd);
	close(fd);
	return;
}
```

O exemplo acima (ou cria, se não existir) o arquivo `./example/io.open` com permissões `0644` (leitura e escrita para o dono, apenas leitura para outros) no modo somente escrita (`O_WRONLY`). Se a abertura falhar, imprime um erro com `perror()` e encerra o programa com código de erro 1. Caso contrário, exibe uma mensagem informando o descritor de arquivo (fd), fecha o arquivo com `close(fd)`, e finaliza a execução retornando 0.

Para rodar o exemplo acima, execute `make io` no terminal e selecione a opção `1`:

```bash
$ make io
gcc io.c -o io.out && ./io.out

==========================
[1] - open()
[2] - write()
[3] - read()
Selecione um exemplo para executar: 1
```

**Output:**

```
Executando...

Arquivo aberto com sucesso! FD: 3
```

**Strace (chamadas de sistema):**

```
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 26.97    0.000137          17         8           write
 13.98    0.000071          35         2           read
 12.99    0.000066          22         3           mprotect
 10.63    0.000054          18         3           openat
  9.06    0.000046           5         8           mmap
  6.30    0.000032          32         1           munmap
  4.72    0.000024           8         3           close
  3.15    0.000016           5         3           brk
  2.95    0.000015           3         4           fstat
  1.57    0.000008           8         1           getrandom
  1.38    0.000007           7         1         1 lseek
  1.38    0.000007           7         1           arch_prctl
  1.38    0.000007           7         1           prlimit64
  1.18    0.000006           6         1           set_tid_address
  1.18    0.000006           6         1           set_robust_list
  1.18    0.000006           6         1           rseq
  0.00    0.000000           0         2           pread64
  0.00    0.000000           0         1         1 access
  0.00    0.000000           0         1           execve
------ ----------- ----------- --------- --------- ----------------
100.00    0.000508          11        46         2 total
```

### write()

A syscall `write()` escreve dados em um arquivo a partir de um buffer.

```c
#include <unistd.h>

ssize_t write(int fd, const void *buf, size_t count);
```

```c
void ex_write() {
	int fd = open("./example/io.write", O_WRONLY | O_CREAT, 0644);
	if (fd == -1) {
		perror("Erro ao abrir arquivo");
		return;
	}

	char *texto = "Olá, mundo!\n";
	write(fd, texto, 13);

	close(fd);
	return;
}
```

O exemplo acima abre (ou cria, se não existir) o arquivo `./example/io.write` no modo escrita (`O_WRONLY`) com permissões `0644` (leitura e escrita para o dono, apenas leitura para outros). Se a abertura falhar, imprime um erro com `perror()` e encerra a função. Caso contrário, escreve a string `"Olá, mundo!\n"` no arquivo usando `write()`, garantindo que 13 bytes sejam gravados, e em seguida fecha o arquivo com `close(fd)`.

Para rodar o exemplo acima, execute `make io` no terminal e selecione a opção `2`:

```bash
$ make io
gcc io.c -o io.out && ./io.out

==========================
[1] - open()
[2] - write()
[3] - read()
Selecione um exemplo para executar: 2
```

**Output:**

*Este código não possui output.*

**Strace (chamadas de sistema):**

```
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 44.96    0.000558         558         1           execve
 13.70    0.000170          21         8           write
 10.96    0.000136          17         8           mmap
  6.04    0.000075          25         3           openat
  4.27    0.000053          17         3           mprotect
  3.79    0.000047          23         2           read
  2.66    0.000033           8         4           fstat
  2.50    0.000031          31         1           munmap
  2.34    0.000029           9         3           brk
  2.26    0.000028           9         3           close
  1.45    0.000018          18         1         1 access
  1.05    0.000013           6         2           pread64
  0.81    0.000010          10         1           arch_prctl
  0.64    0.000008           8         1           getrandom
  0.56    0.000007           7         1         1 lseek
  0.56    0.000007           7         1           prlimit64
  0.48    0.000006           6         1           set_tid_address
  0.48    0.000006           6         1           set_robust_list
  0.48    0.000006           6         1           rseq
------ ----------- ----------- --------- --------- ----------------
100.00    0.001241          26        46         2 total
```

### read()

A syscall `read()` lê um número específico de bytes de um arquivo para um buffer.

```c
#include <unistd.h>

ssize_t read(int fd, void *buf, size_t count);
```

```c
void ex_read() {
	char buffer[100];

	int fd = open("./example/io.write", O_RDONLY);
	if (fd == -1) {
		perror("Erro ao abrir arquivo");
		return;
	}

	ssize_t bytes_lidos = read(fd, buffer, sizeof(buffer) - 1);
	buffer[bytes_lidos] = '\0';  // Garante que seja uma string válida

	printf("Conteúdo do arquivo:\n%s", buffer);
    
	close(fd);
	return;
}
```

O exemplo acima abre o arquivo `./example/io.write` no modo somente leitura (`O_RDONLY`), e se a abertura falhar, exibe uma mensagem de erro usando `perror()`. Em seguida, lê até 99 bytes do arquivo para o buffer, garantindo que a string seja corretamente terminada com `\0` para evitar comportamento indefinido. O conteúdo lido é então impresso no terminal e, por fim, o arquivo é fechado com `close(fd)`.

Para rodar o exemplo acima, execute `make io` no terminal e selecione a opção `3`:
pp
```bash
$ make io
gcc io.c -o io.out && ./io.out

==========================
[1] - open()
[2] - write()
[3] - read()
Selecione um exemplo para executar: 3
```

**Output:**

```
Executando...

Conteúdo do arquivo:
Olá, mundo!
```

**Strace (chamadas de sistemas):**

```
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 47.02    0.000560         560         1           execve
 10.75    0.000128          16         8           write
 10.75    0.000128          16         8           mmap
  6.30    0.000075          25         3           read
  6.30    0.000075          25         3           openat
  3.86    0.000046          15         3           mprotect
  2.43    0.000029           7         4           fstat
  2.27    0.000027          27         1           munmap
  2.18    0.000026           8         3           brk
  2.02    0.000024           8         3           close
  1.34    0.000016           8         2           pread64
  1.18    0.000014          14         1         1 access
  0.59    0.000007           7         1         1 lseek
  0.59    0.000007           7         1           prlimit64
  0.59    0.000007           7         1           getrandom
  0.50    0.000006           6         1           arch_prctl
  0.50    0.000006           6         1           set_robust_listnn
  0.42    0.000005           5         1           set_tid_address
  0.42    0.000005           5         1           rseq
------ ----------- ----------- --------- --------- ----------------
100.00    0.001191          25        47         2 total
```

# Processos CPU-Bound e IO-Bound (parte 2)

Processos CPU-Bound e I/O-Bound são dois tipos de processos que se comportam de maneiras diferentes em relação ao uso de recursos do sistema, como o processador (CPU) e a entrada/saída (I/O).

A seguir, escolheremos uma das funções anteriores e, a partir do uso de algumas técnicas e ferramentas de análise, determinaremos se a função escolhida é CPU-Bound ou IO-Bound.

**IO-Bound:**

São processos que passam a maior parte do tempo esperando por operações de entrada/saída (I/O), como leitura e gravação de arquivos, acesso a bancos de dados ou comunicação de rede. O desempenho desses processos é limitado pela velocidade de acesso ao dispositivo de I/O e não pela capacidade de processamento da CPU. Aplicações de servidores web, programas que fazem backup ou qualquer outro processo que envolva operações frequentes de leitura e escrita em disco ou na rede.

**CPU-Bound:**

São processos que passam a maior parte do tempo realizando cálculos ou operações que exigem uso intenso da CPU. Eles não dependem tanto de operações de entrada/saída, como ler ou gravar dados de arquivos, mas sim de poder de processamento computacional. Programas de cálculo numérico, como simulações científicas ou criptografia, onde a principal limitação é o desempenho do processador.

## Processo IO-Bound

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

### Tempo de execução e uso da CPU

```bash
$ time ./mem.out

real	0m1.661s
user	0m0.001s
sys	0m0.002s
```

Utilizaremos uma [formula](https://man7.org/linux/man-pages/man1/time.1.html#:~:text=Percentage%20of%20the%20CPU%20that%20this%20job%20got%2C%20computed%20as%20(%25U%20%2B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%25S)%20/%20%25E.) para determinar a porcentagem de uso da CPU por meio do tempo de execução:

```
CPU_usage = (user + sys) / real * 100
```

Com isso, chegamos no resultado de **~18% de utilização da CPU**.

### Trocas de contexto

```bash
$ /usr/bin/time -v ./mem.out

...
Voluntary context switches: 2 # 2 trocas de contextos vuluntárias
Involuntary context switches: 0 # nenhuma troca de contexto involuntária
...
```

Algumas trocas de contextos voluntárias e nenhuma involuntárias, pode indicar que este processo é IO-Bound. Entretanto, ainda não é um fator determinante e devemos considerar outras variáveis.

### Strace

```
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 53.85    0.000238          23        10           write
 22.62    0.000100          20         5           brk
 16.52    0.000073          36         2           read
  3.39    0.000015           3         4           fstat
  2.04    0.000009           9         1         1 lseek
  1.58    0.000007           7         1           getrandom
  0.00    0.000000           0         2           close
  0.00    0.000000           0         8           mmap
  0.00    0.000000           0         3           mprotect
  0.00    0.000000           0         1           munmap
  0.00    0.000000           0         2           pread64
  0.00    0.000000           0         1         1 access
  0.00    0.000000           0         1           execve
  0.00    0.000000           0         1           arch_prctl
  0.00    0.000000           0         1           set_tid_address
  0.00    0.000000           0         2           openat
  0.00    0.000000           0         1           set_robust_list
  0.00    0.000000           0         1           prlimit64
  0.00    0.000000           0         1           rseq
------ ----------- ----------- --------- --------- ----------------
100.00    0.000442           9        48         2 total
```

Vamos totalizar a quantidade de chamadas de sistemas relacionadas a I/O:

```
10 chamadas de write
8 chamadas de mmap
2 chamadas de read
2 chamadas de close
1 chamada de lseek
1 chamada de munmap

Total: 24 chamadas de sistemas de I/O
```

Agora, a quantidade de chamadas de sistemas relacionadas a processamento de dados ou cálculo:

```
37 chamadas de mmap
5 chamadas de brk

Total: 42 chamadas de sistemas de CPU
```

Enquanto o processo realizou 24 chamadas de sistemas relacionadas a IO, 42 chamadas de sistemas relacionadas a CPU foram feitas. Entretando, o processo `mmap()` pode ser relacionado tanto a IO quanto a CPU. Como existem mais processos diferentes de IO, isso é um forte indício de que o processo que estamos tratando é IO-Bound.

## Resultado

Com isso, podemos dizer com segurança que o processo é IO-Bound.

## Processo CPU-Bound

```c
void ex_execve() {
	char *args[] = {"/bin/ls", "-l", NULL};
	execve("/bin/ls", args, NULL);  // Substitui o processo pelo comando ls
	printf("Nunca serei printado.\n"); // Só será executado se execve falhar
	return;
}
```

### Tempo de execução e uso da CPU

```
real	0m0.737s
user	0m0.000s
sys	0m0.008s
```

Utilizando a mesma fórmula anterior, chegamos no resultado de **~100% de utilização de CPU**. O que é um forte indício de que este processo é CPU-Bound.

### Trocas de contexto

```
Voluntary context switches: 6
Involuntary context switches: 3
```

Neste processo, tivemos consideravelmente mais trocas de contextos. Trocas de contextos involuntárias pode indicar que o processo é CPU-Bound se o sistema estiver tentando equilibrar o uso de CPU entre múltiplos processos, uma vez que processos CPU-Bound utilizam mais da CPU.

### Strace

```
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 31.10    0.001182         591         2           execve
 11.76    0.000447          12        37           mmap
  7.05    0.000268          14        18           openat
  5.79    0.000220          12        18           write
  4.84    0.000184           6        28           close
  4.76    0.000181          11        16           read
  3.92    0.000149          14        10           mprotect
  3.89    0.000148           6        22           fstat
  3.13    0.000119          23         5           munmapn
  2.87    0.000109          10        10           llistxattr
  2.66    0.000101           4        22           epoll_ctl
  2.21    0.000084           9         9           brk
  2.18    0.000083           4        18           epoll_pwait2
  2.13    0.000081           8        10           statx
  1.50    0.000057           9         6           getdents64
  1.10    0.000042          10         4           newfstatat
  0.97    0.000037           6         6         2 recvfrom
  0.89    0.000034          17         2         2 access
  0.84    0.000032           5         6         4 prctl
  0.82    0.000031           7         4           connect
  0.71    0.000027           6         4           lseek
  0.71    0.000027           6         4           sendto
  0.63    0.000024           6         4           socket
  0.50    0.000019           6         3           getrandom
  0.42    0.000016           4         4           pread64
  0.39    0.000015           2         6           rt_sigprocmask
  0.37    0.000014           7         2           timerfd_create
  0.37    0.000014           7         2           prlimit64
  0.32    0.000012          12         1           ioctl
  0.26    0.000010           5         2           timerfd_settime
  0.18    0.000007           3         2           arch_prctl
  0.18    0.000007           3         2           epoll_create1
  0.13    0.000005           1         3           futex
  0.13    0.000005           2         2           set_tid_address
  0.13    0.000005           2         2           set_robust_list
  0.13    0.000005           2         2           rseq
  0.00    0.000000           0         1           getpid
------ ----------- ----------- --------- --------- ----------------
100.00    0.003801          12       299         8 total
```

Novamente, vamos totalizar a quantidade de chamadas de sistemas relacionadas a I/O:

```
37 chamadas de mmap
28 chamadas de close
18 chamadas de write
16 chamadas de read
5 chamadas de munmap
4 chamadas de lseek
4 chamadas de pread64
1 chamada de ioctl

Total: 118 chamadas de sistemas de I/O
```

Agora, a quantidade de chamadas de sistemas relacionadas a processamento de dados ou cálculo:

```
37 chamadas de mmap
10 chamadas de mprotect
9 chamadas de brk
6 chamadas de getdents64
5 chamadas de munmap
2 chamadas de execve

Total: 69 chamadas de sistemas de CPU
```

Agora, temos 118 chamadas de processos relacionadas a IO contra 69 de CPU. 

## Resultado

De acordo com as analises feitas, podemos dizer que o processo é CPU-Bound.
