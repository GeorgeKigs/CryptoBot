
from asyncio.log import logger
from dataclasses import dataclass
import websocket
from src.abstract import AbstractStreamInter
from src.prod import WriteKafka
from src.misc import main_logger
import json

logger = main_logger()


@dataclass
class Kindle_Data:
    time: str
    symbol: str
    high: float
    low: float
    open: float
    volume: float
    close: float
    closed: str


def kindle_to_dict(data, ctx):
    return dict(
        time=data["time"],
        symbol=data["symbol"],
        high=data["high"],
        low=data["low"],
        open=data["open"],
        volume=data["volume"],
        close=data["close"],
        closed=data["closed"],
    )


def schema_kindle():
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
        "high": {
          "description": "Highest sale during the duration",
          "type": "float"
        },
		"low": {
          "description": "Lowest sale during the duration",
          "type": "float"
        },
		"open": {
          "description": "The amount the kindle data opened with",
          "type": "float"
        },
		"close": {
          "description": "The amount the kindle data closed with",
          "type": "float"
        },
		"volume": {
          "description": "The amount traded",
          "type": "float"
        },
		"closed": {
          "description": "Check the time",
          "type": "string"
        },
        
      },
      "required": [ "time","symbol","high","low","open","volume","close","closed" ]
    }
    """


class KindleData(AbstractStreamInter):
    """Stream the Kindle data.
    Refreshes after 2000ms.
    """

    def __init__(self, symbol):
        trade = "kline_1m"

        super().__init__(symbol, trade)

        schema_str = schema_kindle()
        serilization_func = kindle_to_dict

        self.producer = WriteKafka()

    def on_message(self, _, message):
        json_data = super().on_message(_, message)
        data = {
            "time": json_data["E"],
            "symbol": json_data["s"],
            "high": json_data["k"]["h"],
            "low": json_data["k"]["l"],
            "open": json_data["k"]["o"],
            "volume": json_data["k"]["v"],
            "close": json_data["k"]["c"],
            "closed": json_data["k"]["x"]
        }
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

    def write_data(self, data: Kindle_Data):
        logger.debug(
            f"{__file__.split('/')[-1]} : {__name__} data has {data}")
        symbol = data["symbol"]
        topic = self.env["KAFKA_MAIN_TOPIC"]
        data = json.dumps(data)
        self.producer.write_data(
            topic, data, symbol)

    def __repr__(self) -> str:
        return f"Kindle Stick {self.symbol}"

    def __str__(self) -> str:
        return f"Streaming Binance Kindle Data from {self.symbol}"
