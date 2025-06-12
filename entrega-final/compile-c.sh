cd ./checkpoints/1
make mem
make io
make process

cp -r mem.out io.out process.out example ../bin
