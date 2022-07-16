
from asyncio.log import logger
from dataclasses import dataclass
import websocket
from src.abstract import AbstractStreamInter
from src.prod import WriteKafka
from src.misc import main_logger
import json

logger = main_logger()


class KindleData(AbstractStreamInter):
    """Stream the Kindle data.
    Refreshes after 2000ms.
    """

    def __init__(self, symbol):
        trade = "kline_1m"

        super().__init__(symbol, trade)
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
            f"{__file__.split('/')[-1]} : {__name__} streaming has began {self.conn}")
        ws = websocket.WebSocketApp(
            self.conn,
            on_open=self.on_open,
            on_close=self.on_close,
            on_message=self.on_message
        )
        super().run(ws)

    def write_data(self, data: dict):
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
