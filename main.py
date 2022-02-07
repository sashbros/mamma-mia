import requests
import json
import re

def fetch_price(coins):
    data = []
    for coin in coins:
        url = 'https://api.binance.com/api/v3/ticker/price?symbol=' + coin + 'USDT'
        coin_data = requests.get(url).json()
        data.append(coin_data)

    with open('data.json', 'w') as file:
        json.dump(data, file)


coins = ['BTC', 'ETH', 'SOL', 'DOGE']
fetch_price(coins)



# url = 'https://api.binance.com/api/v1/ticker/allPrices'

# data = requests.get(url).json()
# new_data = []
# for item in data:
#     if re.search('USDT$', item['symbol']):
#         coin_sym = item['symbol'][:-4]
#         if coin_sym in coins:
#             coin = dict()
#             coin['symbol'] = coin_sym
#             coin['price'] = item['price']
#             new_data.append(coin)

# with open('data.json', 'w') as file:
#     json.dump(new_data, file)