import os
import yaml

POLL_INTERVAL_SUCCESS = 10.0
POLL_INTERVAL_FAIL = 2.0
TABLE_NAME = "dht_values"

with open(os.environ["DHT_CFG_FILE"], "r") as ymlfile:
    cfg = yaml.safe_load(ymlfile)

def read(dict, keys, default=None):
    value = dict
    for key in keys:
        if not key in value:
            if default:
                return default
            raise ValueError(keys)
        value = value[key]
    return value

def sqlite_file():
    return read(cfg, ["sqlite", "file"])

def sqlite_table_name():
    return TABLE_NAME

def sensor_data_pin():
    return read(cfg, ["sensor", "datapin"])

def sensor_poll_interval_success():
    return read(cfg, ["sensor", "interval", "success"], POLL_INTERVAL_SUCCESS)

def sensor_poll_interval_fail():
    return read(cfg, ["sensor", "interval", "fail"], POLL_INTERVAL_FAIL)
