#!/bin/bash
cat seedrandom.js > build.js
cat aes.js >> build.js
cat mode-ctr.js >> build.js
cat pad-nopadding.js >> build.js
cat x64-core.js >> build.js
cat sha512.js >> build.js
cat hmac.js >> build.js
cat fortuna.js >> build.js
cat bigint.js >> build.js
cat elliptic.js >> build.js
gcc -o jsmin jsmin.c
chmod +x jsmin
./jsmin < build.js > temp.js
rm build.js
rm jsmin
mv temp.js ../build.js