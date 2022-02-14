#!/bin/bash
export FLASK_APP=./py/webapp/index.py
if [ $# -lt 1 ]; then
	echo "Using default config location"
	export DHT_CFG_FILE=~/.dht-monitor.yaml
else
	echo "Using specified config location $1"
	export DHT_CFG_FILE=$1
fi
source $(pipenv --venv)/bin/activate
python3 py/write_dht_values.py &
flask run -h 0.0.0.0
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
