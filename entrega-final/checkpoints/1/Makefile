mem: memory-management.c
	gcc memory-management.c -o mem.out

process: process.c
	gcc process.c -o process.out

io: io.c
	gcc io.c -o io.out

io-bound: io-bound.c
	gcc io-bound.c -o io-bound.out

cpu-bound: io-bound.c
	gcc cpu-bound.c -o cpu-bound.out -lm

clean:
	rm -rf *.out
