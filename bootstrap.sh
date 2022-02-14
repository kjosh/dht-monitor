#!/bin/bash
export FLASK_APP=./webapp/index.py
if [ $# -ge 1 ]; then
    export DHT_CFG_FILE=~/.dht-monitor.yaml
else
    export DHT_CFG_FILE=$1
fi
source $(pipenv --venv)/bin/activate
python3 write_dht_values.py &
flask run -h 0.0.0.0
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
