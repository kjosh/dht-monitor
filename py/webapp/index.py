from flask import Flask, jsonify
from flask_sock import Sock
from ..config import config
import sqlite3
import json
import time

app = Flask(__name__)
sock = Sock(app)

connection = sqlite3.connect(config.sqlite_file(), check_same_thread=False)
cursor = connection.cursor()

current = None
def get_current():
    # TODO: cache value
    current = cursor.execute("SELECT * FROM dht_values ORDER BY datetime DESC").fetchone()
    return current

@app.route("/data")
def data():
    values = cursor.execute("SELECT * FROM dht_values").fetchall()
    return jsonify(values)

@sock.route("/current")
def current_data_socket(ws):
    last_sent = None
    while True:
        current = get_current()
        if not last_sent or last_sent[0] != current[0]:
            last_sent = current
            ws.send(json.dumps(current))            
        time.sleep(5)
