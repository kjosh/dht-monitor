# DHT Monitor
Web interface to check the current and past temperature and humidity values read from a DHT22 sensor on a Raspberry Pi.

## Usage
`./bootstrap.sh` starts collecting data in dht_values.db and starts a flask web server. 

localhost:5000/data endpoint returns the collected temperature and humidity data.

## Wiring
Connect the data output of the DHT22 sensor to GPIO pin 2

## Dependencies
* pipenv (`sudo apt-get install pipenv`)
* libgpiod2 (`sudo apt-get install libgpiod2`)
