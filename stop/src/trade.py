from binance.client import Client
from binance.exceptions import BinanceAPIException, BinanceOrderException

from misc import read_env

configs = read_env()


def init_connection(configs: dict = configs) -> Client:
    api_key: str = configs["BINANCE_API_KEY"]
    secret_key: str = configs["BINANCE_SECRET_KEY"]
    return Client(api_key=api_key, api_secret=secret_key)


def get_acc_bal(asset: str = "BTC"):
    client = init_connection(configs)
    client.API_URL = 'https://testnet.binance.vision/api'
    return client.get_asset_balance(asset)


def verifiy_data(quantity, price):
    # ! verify the symbols used
    if type(quantity) != int or type(price) != int:
        raise TypeError("Integers only")


def trade(symbol: str, result, quantity: int, price: int):
    client = init_connection(configs)

    try:
        verifiy_data(quantity, price)
        result(client, symbol, quantity, price)

    except TypeError as err:
        # introduce logging of the application
        raise
    except BinanceAPIException:
        raise
    except BinanceOrderException:
        raise
