from dataclasses import dataclass
from abstract import AbstractStreamInter
import websocket
from src.misc import read_env

from GetData.prod import WriteKafka


@dataclass
class Aggregate_Data:
    time: str
    symbol: str
    price: float
    quantity: float
    f_trade: str
    l_trade: str
    trader: str


def aggr_to_dict(data, ctx):
    return dict(
        time=data["time"],
        symbol=data["symbol"],
        price=data["price"],
        quantity=data["quantity"],
        trader=data["trader"],
        f_trade=data["f_trade"],
        l_trade=data["l_trade"]
    )


def schema_aggr():
    return """
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "User",
      "description": "A Confluent Kafka Python User",
      "type": "object",
      "properties": {

        "time": {
          "description": "Time the data was created",
          "type": "string"
        },
		"symbol": {
          "description": "The cryptocurrency symbol",
          "type": "string"
        },
        "price": {
          "description": "The price of the purchase",
          "type": "floar"
        },
        "quantity": {
          "description": "The quantity of the purchase",
          "type": "floar"
        },
        "trader": {
          "description": "The id of the buyer",
          "type": "string"
        },
        "f_trade": {
          "description": "The id of the seller",
          "type": "string"
        },
        "l_trade": {
          "description": "The id of the seller",
          "type": "string"
        },
      },
      "required": [ "time","symbol","high","low","open","volume","close","closed" ]
    }
    """


class AggregateData(AbstractStreamInter):
    """Stream the aggregate data.
    Data is streamed in real-time.
    """

    def __init__(self, symbol):
        #! get the trade vakue to the binance websocket
        trade = 'aggTrade'

        schema_str = schema_aggr()
        serilization_func = aggr_to_dict

        self.producer = WriteKafka(schema_str, serilization_func)

        self.conn = super().define_conn(symbol, trade)

    def on_message(self, _, message):
        json_data = super().on_message(_, message)
        data = {
            "symbol": json_data["s"],
            "time": json_data["T"],
            "price": json_data["p"],
            "quantity": json_data["q"],
            "f_trade": json_data["f"],
            "l_trade": json_data["l"],
            "trader": json_data["a"]
        }
        print(data)

    def stream_data(self):
        ws = websocket.WebSocketApp(
            self.conn, on_open=self.on_open,
            on_close=self.on_close,
            on_message=self.on_message
        )
        super().run(ws)

    def write_data(self, data: dict):
        # ? Write on a different topic?
        pass

    def __repr__(self) -> str:
        return f"Aggregate data {self.symbol}"

    def __str__(self) -> str:
        return f"Aggregate Data from {self.symbol}"
