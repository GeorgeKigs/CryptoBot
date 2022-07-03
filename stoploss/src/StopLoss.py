from dataclasses import dataclass
from consume import ReadKafka
from trade import init_connection
import binance.enums as enums


@dataclass
class SetStopLoss:
    stop_loss_price: int
    stop_loss_quantity: int
    take_profit_price: int
    take_profit_quantity: int
    symbol: str


def write_db(order):
    pass


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
    write_db(order)


class StopLoss(ReadKafka):
    def handle_message(self, message):
        symbol = message["symbol"]
        stop_loss_cls = SetStopLoss(
            stop_loss_price=message["stop_loss_price"],
            stop_loss_quantity=message["stop_loss_price"],
            take_profit_price=message["stop_loss_price"],
            take_profit_quantity=message["stop_loss_price"],
            symbol=message["stop_loss_price"]
        )

        stop_loss(symbol, stop_loss_cls)
