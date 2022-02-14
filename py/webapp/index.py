from flask import Flask, jsonify
from flask_sock import Sock
from ..config import config
import sqlite3
import _thread
import time

app = Flask(__name__)
sock = Sock()
sock.init_app(app)

connection = sqlite3.connect(config.sqlite_file(), check_same_thread=False)
cursor = connection.cursor()

def get_current():
    return cursor.execute("SELECT * FROM dht_values ORDER BY datetime DESC").fetchone()

current = get_current()

def update_current():
    while True:
        current = get_current()
        time.sleep(5)

_thread.start_new_thread(update_current, ())

@app.route("/data")
def data():
    values = cursor.execute("SELECT * FROM dht_values").fetchall()
    return jsonify(values)

@sock.route("/current")
def current(ws):
    while True:
        ws.send(current)
        time.sleep(5)