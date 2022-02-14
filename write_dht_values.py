from datetime import datetime
from .config import config
import time
import sqlite3
import board
import adafruit_dht

INTERVAL = 5.0
TABLE_NAME = "dht_values"

# DHT22 sensor on GPIO PIN 2
dht_device = adafruit_dht.DHT22(board.D2, use_pulseio=False)

# initialize database table
connection = sqlite3.connect(config.sqlite_file())
cursor = connection.cursor()

def cleanup():
    dht_device.exit()
    connection.close()

def table_exists():
    cursor = connection.cursor()
    cursor.execute(f"SELECT count(name) FROM sqlite_master WHERE type='table' AND name='{TABLE_NAME}'")
    return cursor.fetchone()[0] == 1

if not table_exists():
    cursor.execute(f"""
        CREATE TABLE {TABLE_NAME}
        (datetime text, temperature_c real, humidity real)
    """)
    connection.commit()

# periodically write values to database
while True:
    try:
        temperature_c = dht_device.temperature
        humidity = dht_device.humidity
        print(f"{temperature_c}C, {humidity}% RH")
        cursor.execute(f"INSERT INTO {TABLE_NAME} values (?, ?, ?)", (datetime.now(), temperature_c, humidity))
        connection.commit()
    except RuntimeError as error:
        print(error.args[0])
        time.sleep(INTERVAL)
        continue
    except Exception as error:
        cleanup()
        raise error
    except KeyboardInterrupt:
        cleanup()
        pass
    time.sleep(INTERVAL)
