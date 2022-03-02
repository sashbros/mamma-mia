from urllib import request
from flask import Flask, render_template, jsonify, request, redirect
import requests
import json
from livereload import Server

app = Flask(__name__)

def fetch_price(coins):
    data = []
    for coin in coins:
        url = 'https://api.binance.com/api/v3/ticker/price?symbol=' + coin + 'USDT'
        coin_data = requests.get(url).json()
        data.append(coin_data)

    with open('data.json', 'w') as file:
        json.dump(data, file)
    
    return data

coins = ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA']

@app.route("/", methods=["GET", "POST"])
def index():
    rates = fetch_price(coins)
    return render_template('index.html', rates=rates)

@app.route("/getPrices")
def getPrices():
    rates = fetch_price(coins)
    return jsonify(rates)

if __name__ == "__main__":
    server = Server(app.wsgi_app)
    server.watch('./static/*')
    server.serve(port=8000)
    # app.run(host='127.0.0.1', port=8000)