from dataclasses import dataclass
from binance.client import Client
import binance.enums as enums
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


def buy_ord_data(client: Client, symbol, quantity, price):
    order: dict = client.create_test_order(
        params=enums.SIDE_BUY,
        symbol=symbol,
        type=enums.ORDER_TYPE_LIMIT,
        timeInForce=enums.TIME_IN_FORCE_GTC,
        quantity=quantity,
        price=price
    )
    write_db(order)


def sell_ord_trade(client: Client, symbol, quantity, price):
    order = client.create_test_order(
        side=enums.SIDE_SELL,
        symbol=symbol,
        type=enums.ORDER_TYPE_LIMIT,
        timeInForce=enums.TIME_IN_FORCE_GTC,
        quantity=quantity,
        price=price,
    )
    write_db(order)


# def choose(order: str):
#     order = order.lower()
#     if order == "sell":
#         return sell_ord_trade
#     else:
#         return buy_ord_data


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


@dataclass
class SetStopLoss:
    stop_loss_price: int
    stop_loss_quantity: int
    take_profit_price: int
    take_profit_quantity: int
    symbol: str


def stop_loss(symbol, instance: SetStopLoss):
    client = init_connection()
    order = client.create_oco_order(
        side=enums.SIDE_SELL,
        symbol=symbol,
        stopLimitTimeInForce=enums.TIME_IN_FORCE_GTC,
        price=instance.take_profit_price,
        quantity=instance.take_profit_quantity,
        stopPrice=instance.stop_loss_price,
        stopLimitPrice=instance.stop_loss_price
    )


def write_db(order):
    pass
