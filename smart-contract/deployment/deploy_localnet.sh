#!/bin/bash
docker build -t 'anivlly' --no-cache --progress=plain .
docker run -it 'anivlly'