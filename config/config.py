import os
import yaml

with open(os.environ["DHT_CFG_FILE"], "r") as ymlfile:
    cfg = yaml.load(ymlfile)

def sqlite_file():
    return cfg["sqlite"]["file"]