#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_PROCESSES 10
#define MAX_PAGES 64
#define PAGE_SIZE 256
#define NUM_FRAMES 8
#define MEM_SECUNDARIA_SIZE 1024

typedef enum
{
  PRONTO,
  SUSPENSO
} Estado;

typedef struct
{
  int presente;
  int modificado;
  int quadro;
  int referenciado;
  int ultimo_acesso;
} EntradaPagina;

typedef struct
{
  int pid;
  int tamanho;
  Estado estado;
  int num_paginas;
  EntradaPagina tabela_paginas[MAX_PAGES];
  int em_swap[MAX_PAGES];
} Processo;

typedef struct
{
  int livre;
  int pid;
  int pagina;
} Quadro;

Processo processos[MAX_PROCESSES];
Quadro memoria_fisica[NUM_FRAMES];
int tempo_global = 0;
int num_processos = 0;
int ponteiro_relogio = 0;

// Encontra o índice de um processo pelo PID
int encontrar_processo(int pid)
{
  for (int i = 0; i < num_processos; i++)
  {
    if (processos[i].pid == pid)
      return i;
  }
  return -1;
}

// Suspende um processo, liberando suas páginas da memória física e marcando-as como em swap
void suspender_processo(int pid)
{
  int indice = encontrar_processo(pid);
  if (indice == -1)
    return;

  Processo *p = &processos[indice];
  printf(">>> Processo P%d suspenso (swap iniciado).\n", pid);
  p->estado = SUSPENSO;

  for (int i = 0; i < p->num_paginas; i++)
  {
    if (p->tabela_paginas[i].presente)
    {
      int quadro = p->tabela_paginas[i].quadro;
      memoria_fisica[quadro].livre = 1;
      memoria_fisica[quadro].pid = -1;
      memoria_fisica[quadro].pagina = -1;
      p->tabela_paginas[i].presente = 0;
      p->tabela_paginas[i].quadro = -1;
      p->em_swap[i] = 1;
    }
  }
}

// Reativa um processo suspenso, movendo suas páginas de volta para a memória física
void swap_in(Processo *p)
{
  if (p->estado == SUSPENSO)
  {
    printf("<<< Processo P%d reativado (swap-in).\n", p->pid);
    p->estado = PRONTO;
    for (int i = 0; i < p->num_paginas; i++)
    {
      if (p->em_swap[i])
      {
        p->em_swap[i] = 0;
      }
    }
  }
}

// Cria um novo processo com o PID e tamanho especificados
void criar_processo(int pid, int tamanho)
{
  if (num_processos >= MAX_PROCESSES)
  {
    printf("Máximo de processos atingido.\n");
    return;
  }
  Processo *p = &processos[num_processos++];
  p->pid = pid;
  p->tamanho = tamanho;
  p->estado = PRONTO;
  p->num_paginas = (tamanho + PAGE_SIZE - 1) / PAGE_SIZE;
  for (int i = 0; i < p->num_paginas; i++)
  {
    p->tabela_paginas[i].presente = 0;
    p->tabela_paginas[i].modificado = 0;
    p->tabela_paginas[i].quadro = -1;
    p->tabela_paginas[i].referenciado = 0;
    p->tabela_paginas[i].ultimo_acesso = 0;
    p->em_swap[i] = 0;
  }
  printf("Processo P%d criado (%d bytes, %d páginas).\n", pid, tamanho, p->num_paginas);
}

// Função para substituir uma página usando o algoritmo de relógio
// Retorna o índice do quadro onde a página foi substituída
int substituir_pagina()
{
  for (int i = 0; i < NUM_FRAMES; i++)
  {
    int idx = (ponteiro_relogio + i) % NUM_FRAMES;
    int pid = memoria_fisica[idx].pid;
    int pagina = memoria_fisica[idx].pagina;
    int p_idx = encontrar_processo(pid);
    if (p_idx == -1)
      continue;

    EntradaPagina *e = &processos[p_idx].tabela_paginas[pagina];

    if (e->referenciado)
    {
      e->referenciado = 0;
    }
    else
    {
      e->presente = 0;
      e->quadro = -1;
      if (e->modificado)
      {
        processos[p_idx].em_swap[pagina] = 1;
      }
      memoria_fisica[idx].livre = 1;
      ponteiro_relogio = (idx + 1) % NUM_FRAMES;
      return idx;
    }
  }
  return -1;
}

// Função para acessar a memória de um processo, realizando leitura ou escrita
void acesso_memoria(int pid, char tipo, int endereco_logico)
{
  int indice = encontrar_processo(pid);
  if (indice == -1)
  {
    printf("Processo P%d não encontrado.\n", pid);
    return;
  }
  Processo *p = &processos[indice];
  if (p->estado == SUSPENSO)
    swap_in(p);
  int pagina = endereco_logico / PAGE_SIZE;

  if (pagina >= p->num_paginas)
  {
    printf("Endereço fora dos limites para processo P%d.\n", pid);
    return;
  }

  EntradaPagina *entrada = &p->tabela_paginas[pagina];
  tempo_global++;

  if (!entrada->presente)
  {
    printf("[!] Falta de página em P%d página %d.\n", pid, pagina);
    int alocado = 0;
    for (int i = 0; i < NUM_FRAMES; i++)
    {
      if (memoria_fisica[i].livre)
      {
        memoria_fisica[i].livre = 0;
        memoria_fisica[i].pid = pid;
        memoria_fisica[i].pagina = pagina;
        entrada->presente = 1;
        entrada->quadro = i;
        entrada->referenciado = 1;
        entrada->ultimo_acesso = tempo_global;
        alocado = 1;
        printf("[+] Página %d de P%d alocada no quadro %d.\n", pagina, pid, i);
        break;
      }
    }
    if (!alocado)
    {
      int quadro = substituir_pagina();
      if (quadro == -1)
      {
        printf(">>> Nenhum quadro disponível. Swapping de processo necessário.\n");
        suspender_processo(memoria_fisica[ponteiro_relogio].pid);
        acesso_memoria(pid, tipo, endereco_logico);
        return;
      }
      memoria_fisica[quadro].livre = 0;
      memoria_fisica[quadro].pid = pid;
      memoria_fisica[quadro].pagina = pagina;
      entrada->presente = 1;
      entrada->quadro = quadro;
      entrada->referenciado = 1;
      entrada->ultimo_acesso = tempo_global;
      printf("Página %d de P%d alocada no quadro %d (após substituição).\n", pagina, pid, quadro);
    }
    return;
  }

  entrada->referenciado = 1;
  entrada->ultimo_acesso = tempo_global;
  if (tipo == 'W')
  {
    entrada->modificado = 1;
  }

  printf("P%d %s página %d (quadro %d).\n", pid, tipo == 'R' ? "leu" : "escreveu", pagina, entrada->quadro);
}

// Converte uma string binária para um valor decimal
int bin_para_decimal(const char *str)
{
  int valor = 0;
  for (int i = 0; str[i]; i++)
  {
    if (str[i] == '1')
      valor = (valor << 1) | 1;
    else if (str[i] == '0')
      valor = (valor << 1);
  }
  return valor;
}

// Processa uma linha do arquivo de entrada, interpretando o comando e executando a ação correspondente
void processar_linha(char *linha)
{
  char tipo;
  int pid;
  char argumento1[64];

  sscanf(linha, "P%d %c %s", &pid, &tipo, argumento1);

  if (tipo == 'C')
  {
    int tamanho = atoi(argumento1);
    criar_processo(pid, tamanho);
  }
  else if (tipo == 'R' || tipo == 'W')
  {
    int endereco = 0;
    char *bin = strchr(argumento1, '(');
    if (bin)
    {
      bin++;
      char *fecha = strchr(bin, ')');
      if (fecha)
        *fecha = '\0';
      endereco = bin_para_decimal(bin);
    }
    else
    {
      endereco = atoi(argumento1);
    }
    acesso_memoria(pid, tipo, endereco);
  }
  else if (tipo == 'P' || tipo == 'I')
  {
    printf("P%d executando instrução de %s.\n", pid, tipo == 'P' ? "CPU" : "I/O");
  }
  else
  {
    printf("Linha não reconhecida: %s", linha);
  }
}

// Inicializa a memória física, marcando todos os quadros como livres
void inicializar_memoria()
{
  for (int i = 0; i < NUM_FRAMES; i++)
  {
    memoria_fisica[i].livre = 1;
    memoria_fisica[i].pid = -1;
    memoria_fisica[i].pagina = -1;
  }
}

// Exibe as tabelas de páginas de todos os processos
void mostrar_tabelas_paginas()
{
  for (int i = 0; i < num_processos; i++)
  {
    Processo *p = &processos[i];
    printf("\nTabela de Páginas do Processo P%d (%s):\n", p->pid, p->estado == PRONTO ? "PRONTO" : "SUSPENSO");
    printf("Página | Presente | Modificado | Quadro | Referenciado | Swap\n");
    for (int j = 0; j < p->num_paginas; j++)
    {
      EntradaPagina *e = &p->tabela_paginas[j];
      printf("%6d | %8d | %10d | %6d | %13d | %4d\n", j, e->presente, e->modificado, e->quadro, e->referenciado, p->em_swap[j]);
    }
  }
}

// Exibe o estado atual da memória física
void mostrar_memoria_fisica()
{
  printf("\nEstado da Memória Física:\n");
  printf("Quadro | Livre | PID | Página\n");
  for (int i = 0; i < NUM_FRAMES; i++)
  {
    printf("%6d | %5d | %3d | %6d\n", i, memoria_fisica[i].livre, memoria_fisica[i].pid, memoria_fisica[i].pagina);
  }
}

// Lê o arquivo de entrada, processa as linhas, e exibe o estado final das tabelas de páginas e da memória física
void ler_arquivo(const char *nome)
{
  FILE *f = fopen(nome, "r");
  if (!f)
  {
    perror("Erro ao abrir arquivo");
    exit(1);
  }

  char linha[256];
  while (fgets(linha, sizeof(linha), f))
  {
    if (linha[0] == '#' || linha[0] == '\n')
      continue;
    processar_linha(linha);
  }

  fclose(f);
  mostrar_tabelas_paginas();
  mostrar_memoria_fisica();
}

int main(int argc, char *argv[])
{
  if (argc < 2)
  {
    printf("Uso: %s arquivo_entrada.txt\n", argv[0]);
    return 1;
  }

  inicializar_memoria();
  ler_arquivo(argv[1]);

  return 0;
}
