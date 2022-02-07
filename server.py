from urllib import request
from flask import Flask, render_template, jsonify, request, redirect
import requests
import json

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


@app.route("/", methods=["GET", "POST"])
def index():
    coins = []
    if request.method == "POST":
        print("entered / ")
        coins_form = request.form.get("coins")
        print(coins_form)
        coins = coins_form

        rates = fetch_price(coins)
        return render_template('index.html', rates=rates)
    elif request.method == "GET":
        #coins = ['BTC', 'ETH', 'SOL', 'DOGE']
        print(coins)
        if len(coins)==0:
            coins = ["ADA"]
        rates = fetch_price(coins)
        return render_template('index.html', rates=rates)

@app.route("/getPrices")
def getPrices():
    coins = ['BTC', 'ETH', 'SOL', 'DOGE']
    rates = fetch_price(coins)
    return jsonify(rates)

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000)