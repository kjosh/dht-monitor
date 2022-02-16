# DHT Monitor
Web interface to check the current and past temperature and humidity values read from a DHT22 sensor on a Raspberry Pi.

## Usage
`./bootstrap.sh` starts collecting data in the configured sqlite database file and starts a flask web server. 

* localhost:5000/data endpoint returns collections of collected temperature and humidity data
* localhost:5000/current offers a WebSocket connection to receive the latest data

### Configuration
A configuration file is required and can either be specified as the bootstrap script's first argument or put at the default location `~/.dht-monitor.yaml`

**Example:**
```yaml
sqlite:
    file: /home/pi/dht/dht_values.db
sensor:
  datapin: D2 # PIN to poll data from, must be a valid board value
  interval: # intervals at which sensor is polled in seconds, optional section
    success: 15.0 # timeout after successful poll, default: 10.0
    fail: 3.0     # timeout after failed poll, default: 2.0
```

## Wiring
Connect the DHT22 sensor's data output to the GPIO PIN specified in sensor.datapin (see "Configuration").

## Dependencies
* pipenv (`sudo apt-get install pipenv`)
* libgpiod2 (`sudo apt-get install libgpiod2`)
