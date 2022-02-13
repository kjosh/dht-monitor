#!/bin/bash
export FLASK_APP=./webapp/index.py
source $(pipenv --venv)/bin/activate
python3 write_dht_values.py &
flask run -h 0.0.0.0
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
