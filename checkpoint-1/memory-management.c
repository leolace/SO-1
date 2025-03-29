#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <string.h>
#include <fcntl.h>

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

int main() {
  int opt = 0;

  printf("\n==========================\n");
  printf("[1] - mmap() e munmap()\n[2] - brk()\n");
  printf("Selecione um exemplo para executar: ");
  scanf("%d", &opt);

  switch(opt) {
  case 1:
    printf("Executando...\n\n");
    ex_mmap_munmap();
    break;
  case 2:
    printf("Executando...\n\n");
    break;
  default:
    printf("Opção inválida.\n");
    break;
  }
  


  return 0;
}
