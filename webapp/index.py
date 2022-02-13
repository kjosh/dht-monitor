from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/data')
def data():
    return jsonify({})
