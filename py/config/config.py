import os
import re
import yaml

POLL_INTERVAL_SUCCESS = 10.0
POLL_INTERVAL_FAIL = 2.0

with open(os.environ["DHT_CFG_FILE"], "r") as ymlfile:
    cfg = yaml.safe_load(ymlfile)

def sqlite_file():
    return cfg["sqlite"]["file"]

def exists(dict, keys):
    for key in keys:
        if not key in dict:
            return False
        dict = dict[key]
    return True

def sensor_poll_interval_success():
    if exists(cfg, ["sensor", "interval", "success"]):
        return cfg["sensor"]["interval"]["success"]
    return POLL_INTERVAL_SUCCESS

def sensor_poll_interval_fail():
    if exists(cfg, ["sensor", "interval", "fail"]):
        return cfg["sensor"]["interval"]["fail"]
    return POLL_INTERVAL_FAIL
