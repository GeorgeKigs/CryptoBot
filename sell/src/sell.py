from model.tranactions import SaleTransaction
from trade.consume import ReadKafka
from trade.trade import trade
from binance.client import Client
import binance.enums as enums


def write_db(**kwargs):
    trans = SaleTransaction(
        symbol=kwargs["s"],
        time=kwargs["T"],
        price=kwargs["p"],
        quantity=kwargs["q"],
        buyer=kwargs["b"],
    )
    trans.save()


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


class Sell_Stream(ReadKafka):
    def handle_message(self, message):
        symbol = message["symbol"]
        quantity = message["quantity"]
        price = message["price"]
        trade(symbol, sell_ord_trade, quantity, price)
