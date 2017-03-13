import * as vfs from 'vinyl-fs';

vfs.src("**/*.*").pipe(vfs.dest("out1"))