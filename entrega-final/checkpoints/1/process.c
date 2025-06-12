#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

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

void ex_execve() {
	char *args[] = {"/bin/ls", "-l", NULL};
	execve("/bin/ls", args, NULL);  // Substitui o processo pelo comando ls
	printf("Nunca serei printado.\n"); // Só será executado se execve falhar
	return;
}

int main() {
  int opt = 0;

  printf("\n==========================\n");
  printf("[1] - fork() e wait()\n[2] - execve()\n");
  printf("Selecione um exemplo para executar: ");
  scanf("%d", &opt);

  switch(opt) {
  case 1:
    printf("Executando...\n\n");
    ex_fork_wait();
    break;
  case 2:
    printf("Executando...\n\n");
		ex_execve();
    break;
  default:
    printf("Opção inválida.\n");
    break;
  }
  


  return 0;
}
