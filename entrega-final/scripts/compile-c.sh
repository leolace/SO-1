cd ./checkpoints/1
make mem
make io
make process
make io-bound
make cpu-bound

cd ../2
make

cd ../3
make