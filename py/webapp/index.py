from flask import Flask, jsonify, request
from flask_sock import Sock
from datetime import datetime, timedelta
from ..config import config
import sqlite3
import json
import time

app = Flask(__name__)
sock = Sock(app)

connection = sqlite3.connect(config.sqlite_file(), check_same_thread=False)

current = None
def get_current():
    # TODO: cache value
    current = connection.cursor().execute("SELECT * FROM dht_values ORDER BY datetime DESC").fetchone()
    return current

def arg_or_default(req, name, default):
    return req.args[name] if name in req.args else default

@app.route("/data", methods=["GET"])
def data():
    try:
        hours = int(arg_or_default(request, "h", 0))
        minutes = int(arg_or_default(request, "m", 0))
        seconds = int(arg_or_default(request, "s", 0))
        if hours == 0 and minutes == 0 and seconds == 0:
            minutes = 15
        fetch_after = datetime.now() - timedelta(hours=int(hours), minutes=int(minutes), seconds=int(seconds))
    except Exception:
        return "Bad request", 400
    values = connection.cursor().execute(f"SELECT * FROM dht_values WHERE datetime >= :fetch_after", {"fetch_after": fetch_after}).fetchall()
    return jsonify(values)

@sock.route("/current")
def current_data_socket(ws):
    last_sent = None
    while True:
        try:
            current = get_current()
            if not last_sent or last_sent[0] != current[0]:
                last_sent = current
                ws.send(json.dumps(current))
        except sqlite3.OperationalError:
            pass # Database locked, retry
        time.sleep(5)
