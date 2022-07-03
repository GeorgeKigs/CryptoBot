from model.tranactions import BuyTransactions
from consume import ReadKafka
from trade import trade
import binance.enums as enums
from binance.client import Client


def write_db(**kwargs):
    trans = BuyTransactions(
        symbol=kwargs["s"],
        time=kwargs["T"],
        price=kwargs["p"],
        quantity=kwargs["q"],
        seller=kwargs["a"]
    )
    trans.save()


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


class Buy_Stream(ReadKafka):
    def handle_message(self, message: dict):
        symbol = message["symbol"]
        quantity = message["quantity"]
        price = message["price"]
        trade(symbol, buy_ord_data, quantity, price)
