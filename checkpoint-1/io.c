#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>

void ex_open() {
	// Abre um arquivo no caminho especificado; Cria caso não exista e abre apenas para leitura; Permissão para o dono ler/escrever, outros apenas ler.
	int fd = open("./example/io.open", O_CREAT | O_WRONLY, 0644);
    
	if (fd == -1) {
		perror("Erro ao abrir arquivo");
		return;
	}

	printf("Arquivo aberto com sucesso! FD: %d\n", fd);
	close(fd);
	return;
}

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

int main() {
  int opt = 0;

  printf("\n==========================\n");
  printf("[1] - open()\n[2] - write()\n[3] - read()\n");
  printf("Selecione um exemplo para executar: ");
  scanf("%d", &opt);

  switch(opt) {
  case 1:
    printf("Executando...\n\n");
    ex_open();
    break;
  case 2:
    printf("Executando...\n\n");
		ex_write();
    break;
	case 3:
    printf("Executando...\n\n");
		ex_read();
    break;
  default:
    printf("Opção inválida.\n");
    break;
  }
  


  return 0;
}
