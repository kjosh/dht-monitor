import os
import re
import yaml

DEFAULT_POLL_INTERVAL = 10.0

with open(os.environ["DHT_CFG_FILE"], "r") as ymlfile:
    cfg = yaml.safe_load(ymlfile)

def sqlite_file():
    return cfg["sqlite"]["file"]

def sensor_poll_interval():
    if "sensor" in cfg and "interval" in cfg["sensor"]:
        return cfg["sensor"]["interval"]
    return DEFAULT_POLL_INTERVAL