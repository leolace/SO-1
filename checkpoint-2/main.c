#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

typedef struct Node {
	int item;
	struct Node* next;
} Node;

Node* head = NULL; // começo da fila
Node* tail = NULL; // final da fila
int count = 0; // número de itens na fila

sem_t empty; // quantidade de espaços disponíveis
sem_t full;  // quantidade de itens disponíveis
pthread_mutex_t mutex; // protege acesso à fila

#define MAX_BUFFER_SIZE 10
#define NUM_PRODUCERS 3
#define NUM_CONSUMERS 2

void* producer(void* arg) {
	int value;
	while (1) {
		value = rand() % 100; // gera valor aleatório

		// tenta decrementar o valor do semaforo empty se > 0
		// se = 0, espera até que empty seja incrementado pelo consumidor
		sem_wait(&empty);

		// garante que apenas uma thread por vez pode modificar as variaveis head, tail e count
		pthread_mutex_lock(&mutex);

		Node* new_node = (Node*)malloc(sizeof(Node));
		new_node->item = value;
		new_node->next = NULL;

		// adiciona o novo item à fila
		if (tail == NULL) {
			head = new_node;
			tail = new_node;
		} else {
			tail->next = new_node;
			tail = new_node;
		}
		count++;

		printf("[->] Produtor produziu: %d (itens na fila: %d)\n", value, count);

		// libera o acesso à fila
		pthread_mutex_unlock(&mutex);
		sem_post(&full); // sinaliza que há um item disponível para ser consumido

		sleep(rand() % 2); // simula tempo de produção
	}
}

void* consumer(void* arg) {
	int value;
	while (1) {
		
		// tenta decrementar o valor do semaforo full se > 0
		// se = 0, espera até que full seja incrementado pelo produtor
		sem_wait(&full);

		// garante que apenas uma thread por vez pode modificar as variaveis head, tail e count
		pthread_mutex_lock(&mutex);

		if (head == NULL) {
			printf("Erro. Fila vazia.\n");
			pthread_mutex_unlock(&mutex);
			continue;
		}

		// remove o primeiro item da fila para ser consumido
		Node* temp = head;
		value = temp->item;
		head = head->next;
		if (head == NULL) {
			tail = NULL;
		}
		count--;

		free(temp);

		printf("[<-] Consumidor consumiu: %d (itens na fila: %d)\n", value, count);

		// libera o acesso à fila
		pthread_mutex_unlock(&mutex);
		sem_post(&empty); // sinaliza que há um espaço disponível para ser produzido

		sleep(rand() % 3); // simula o tempo de consumo
	}
}

int main() {
	pthread_t prod[NUM_PRODUCERS], cons[NUM_CONSUMERS];

	printf("======================\n");
	printf("Informações do programa:\nQuantidade de produtores: %d\nQuantidade de consumidores: %d\nTamanho maximo do buffer: %d\n", NUM_PRODUCERS, NUM_CONSUMERS, MAX_BUFFER_SIZE);
	printf("======================\n");

	sem_init(&empty, 0, MAX_BUFFER_SIZE);
	sem_init(&full, 0, 0);
	pthread_mutex_init(&mutex, NULL);

	// cria threads de produtores
	for (int i = 0; i < NUM_PRODUCERS; i++) {
		pthread_create(&prod[i], NULL, producer, NULL);
	}

	// cria threads de consumidores
	for (int i = 0; i < NUM_CONSUMERS; i++) {
		pthread_create(&cons[i], NULL, consumer, NULL);
	}

	for (int i = 0; i < NUM_CONSUMERS; i++) {
		pthread_join(cons[i], NULL);
	}

	for (int i = 0; i < NUM_PRODUCERS; i++) {
		pthread_join(prod[i], NULL);
	}

	sem_destroy(&empty);
	sem_destroy(&full);
	pthread_mutex_destroy(&mutex);

	return 0;
}

