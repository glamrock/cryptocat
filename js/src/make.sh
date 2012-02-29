#!/bin/bash
cat bigint.js > build.js
cat seedrandom.js >> build.js
cat crypto.js >> build.js
cat aes.js >> build.js
cat blockmodes.js >> build.js
cat hmac.js >> build.js
cat sha256.js >> build.js
cat sha512.js >> build.js
cat fortuna.js >> build.js
gcc -o jsmin jsmin.c
chmod +x jsmin
./jsmin < build.js > temp.js
rm build.js
rm jsmin
mv temp.js ../build.js