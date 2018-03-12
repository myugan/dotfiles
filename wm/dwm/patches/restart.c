#include <unistd.h>

void restart(const Arg *arg) {
    char *const argv[] = {"/usr/local/bin/dwm", NULL};

    execv(argv[0], argv);
}