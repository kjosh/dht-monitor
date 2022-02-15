from datetime import datetime
from config import config
import time
import sqlite3
import board
import adafruit_dht

# DHT22 sensor
dht_device = adafruit_dht.DHT22(getattr(board, config.sensor_data_pin()), use_pulseio=False)

# initialize database table
connection = sqlite3.connect(config.sqlite_file())
cursor = connection.cursor()
table_name = config.sqlite_table_name()

def cleanup():
    dht_device.exit()
    connection.close()

def table_exists():
    cursor = connection.cursor()
    cursor.execute(f"SELECT count(name) FROM sqlite_master WHERE type='table' AND name='{table_name}'")
    return cursor.fetchone()[0] == 1

if not table_exists():
    cursor.execute(f"""
        CREATE TABLE {table_name}
        (datetime text, temperature_c real, humidity real)
    """)
    connection.commit()

# periodically write values to database
poll_interval_success = config.sensor_poll_interval_success()
poll_interval_fail = config.sensor_poll_interval_fail()
while True:
    try:
        temperature_c = dht_device.temperature
        humidity = dht_device.humidity
        poll_time = datetime.now()
        print(f"{poll_time}: {temperature_c}C, {humidity}% RH")
        cursor.execute(f"INSERT INTO {table_name} values (?, ?, ?)", (poll_time, temperature_c, humidity))
        connection.commit()
    except (RuntimeError, sqlite3.OperationalError) as error:
        print(error.args[0])
        time.sleep(poll_interval_fail)
        continue
    except (Exception, KeyboardInterrupt) as error:
        cleanup()
        raise error
    time.sleep(poll_interval_success)
