from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)
connection = sqlite3.connect("dht_values.db", check_same_thread=False)

@app.route("/data")
def data():
    values = connection.cursor().execute("SELECT * FROM dht_values").fetchall()
    return jsonify(values)
