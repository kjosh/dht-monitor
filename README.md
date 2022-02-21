# DHT Monitor
Web interface to check the current and past temperature and humidity values read from a DHT22 sensor on a Raspberry Pi.

## Usage
`./bootstrap.sh` starts collecting data in the configured sqlite database file and starts a flask web server. 

* localhost:5000/data endpoint returns collections of collected temperature and humidity data
  * can be limited with h/m/s query parameters to the last X amount of time (e.g. "/data?m=3&s=30")
  * by default data collected in the last 15 minutes is returned
* localhost:5000/current offers a WebSocket connection to receive the latest data

### Configuration
A configuration file is required and can either be specified as the bootstrap script's first argument or put at the default location `~/.dht-monitor.yaml`

**Example:**
```yaml
sqlite:
  file: /home/pi/dht/dht_values.db
  cleanup: # optional section to remove old values from the database
    enabled: true # default: false
    # maximum age of entries to be kept in the database
    # the following config would clean up all entries dating back more than 36.5 hours (1d + 12h + 30m)
    delta:
      days: 1     # adds days to the time delta, default: 0
      hours: 12   # adds hours to the time delta, default: 0
      minutes: 30 # adds minutes to the time delta, default: 0
sensor:
  datapin: D2 # PIN to poll data from, must be a valid board value
  interval: # intervals at which sensor is polled in seconds, optional section
    success: 15.0 # timeout after successful poll, default: 10.0
    fail: 3.0     # timeout after failed poll, default: 2.0
```

## Wiring
Connect the DHT22 sensor's data output to the GPIO PIN specified in sensor.datapin (see "Configuration").

## Dependencies
Libraries and build tools which are not automatically installed by pipenv or yarn and must be installed before the software can be used.

### Libraries
* libgpiod2 (`sudo apt-get install libgpiod2`)

### Build tools
* pipenv (`sudo apt-get install pipenv`)
* yarn

## Attribution

### Favicons
The favicon graphics were created by Twemoji (https://twemoji.twitter.com/) and are licensed under CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
