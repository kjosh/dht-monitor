#!/bin/bash
if [ $# -lt 1 ]; then
	echo "Using default config location"
	export DHT_CFG_FILE=~/.dht-monitor.yaml
else
	echo "Using specified config location $1"
	export DHT_CFG_FILE=$1
fi
DIR="$(dirname "${BASH_SOURCE[0]}")"
DIR="$(realpath "${DIR}")"

echo "Running in ${DIR}"

export PIPENV_PIPFILE=${DIR}/Pipfile
source $(pipenv --venv)/bin/activate
# remove old data
python3 ${DIR}/py/cleanup_dht_values.py
# build React app
sudo yarn --cwd ${DIR}/site run build
# copy it to webserver dir
sudo rm -rf /var/www/html/static
sudo cp -r ${DIR}/site/build/* /var/www/html

# run flask server
export FLASK_APP=${DIR}/py/webapp/index.py
python3 ${DIR}/py/write_dht_values.py & flask run -h 0.0.0.0

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
