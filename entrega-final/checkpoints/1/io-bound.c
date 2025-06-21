#include <stdio.h>
#include <unistd.h>

int main()
{
  void *current_brk, *new_brk;

  // Obtém o endereço atual do break
  current_brk = sbrk(0);
  printf("Endereço inicial do break: %p\n", current_brk);

  // Move o break para frente, alocando 4096 bytes (4 KB)
  if (brk(current_brk + 4096) == -1)
  {
    printf("Erro ao expandir o heap");
    return 1;
  }

  new_brk = sbrk(0); // Obtém o novo endereço do break
  printf("Endereço após expansão: %p\n", new_brk);

  return 0;
}