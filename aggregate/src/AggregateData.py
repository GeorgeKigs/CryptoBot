from src.prod import WriteKafka
from dataclasses import dataclass
import json
from src.abstract import AbstractStreamInter
import websocket
from src.misc import read_env, main_logger

logger = main_logger()


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
        self.env = read_env()
        self.producer = WriteKafka()
        self.conn = super().define_conn(symbol, trade)
        logger.info(
            f"{__file__.split('/')[-1]} : {__name__} {symbol} connected to Kafka")

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
        # print(data)
        logger.debug(
            f"{__file__.split('/')[-1]} : {__name__} streaming data {data}")

        self.write_data(data)

    def stream_data(self):
        logger.debug(
            f"{__file__.split('/')[-1]} : {__name__} streaming has began {self.c}")
        ws = websocket.WebSocketApp(
            self.conn,
            on_open=self.on_open,
            on_close=self.on_close,
            on_message=self.on_message
        )
        super().run(ws)

    def write_data(self, data: dict):
        # ? Write on a different topic? NO
        """this is used to write data to the Kafka topic"""
        topic = self.env["KAFKA_MAIN_TOPIC"]
        key = data.symbol
        value = json.dumps(data)

        self.producer.write_data(topic, value, key)

    def __repr__(self) -> str:
        return f"Aggregate data {self.symbol}"

    def __str__(self) -> str:
        return f"Aggregate Data from {self.symbol}"
