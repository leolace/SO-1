#include <stdio.h>
#include <math.h>
#include <time.h>

int eh_primo(long n)
{
  if (n < 2)
    return 0;
  for (long i = 2; i <= sqrt(n); i++)
  {
    if (n % i == 0)
      return 0;
  }
  return 1;
}

int main()
{
  const long limite = 500000; // Aumente para mais carga de CPU
  long contador = 0;

  clock_t inicio = clock();

  for (long i = 2; i <= limite; i++)
  {
    if (eh_primo(i))
    {
      contador++;
    }
  }

  clock_t fim = clock();

  double tempo = (double)(fim - inicio) / CLOCKS_PER_SEC;

  printf("Total de primos até %ld: %ld\n", limite, contador);
  printf("Tempo de execução: %.2f segundos\n", tempo);

  return 0;
}
