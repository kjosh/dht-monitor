import os
import yaml

with open(os.environ["DHT_CFG_FILE"], "r") as ymlfile:
    cfg = yaml.safe_load(ymlfile)

def sqlite_file():
    return cfg["sqlite"]["file"]
