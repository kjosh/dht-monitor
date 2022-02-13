from datetime import datetime
import time
import sqlite3
import board
import adafruit_dht

INTERVAL = 5.0

# DHT22 sensor on GPIO PIN 2
dht_device = adafruit_dht.DHT22(board.D2, use_pulseio=False)

# initialize database table
connection = sqlite3.connect(":memory:")
cursor = connection.cursor()
cursor.execute('''
    CREATE TABLE dht_values
    (datetime text, temperature_c real, humidity real)
''')
connection.commit()

# periodically write values to database
while True:
    try:
        temperature_c = dht_device.temperature
        humidity = dht_device.humidity
        cursor.execute("INSERT INTO dht_values values (?, ?, ?)", (datetime.now(), temperature_c, humidity))
        connection.commit()
    except RuntimeError as error:
        print(error.args[0])
        time.sleep(INTERVAL)
        continue
    except Exception as error:
        dht_device.exit()
        connection.close()
        raise error
    time.sleep(INTERVAL)