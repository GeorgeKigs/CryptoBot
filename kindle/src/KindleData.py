
from asyncio.log import logger
from dataclasses import dataclass
import websocket
from src.prod import WriteKafka
from src.misc import main_logger, read_env
import json


logger = main_logger()


class KindleData:
    """Stream the Kindle data.
    Refreshes after 2000ms.
    """

    def __init__(self, symbol):
        trade = "kline_1m"

        self.symbol = symbol
        self.env = read_env()
        self.producer = WriteKafka()
        self.conn = self.define_conn(self.symbol, trade)

    def define_conn(self, symbol, Trade):
        logger.info(
            f"{__file__.split('/')[-1]} :  defining web_sock_conn for {symbol}@{Trade}")
        return f"wss://stream.binance.com:9443/ws/{symbol}@{Trade}"

    def on_open(self, _):

        logger.debug(
            f"{__file__.split('/')[-1]} : {__name__} opened web_sock_conn for {self.conn}")

    def on_close(self, _, connection_status, msg):

        logger.debug(
            f"{__file__.split('/')[-1]} : {__name__} closed web_sock_conn for {self.conn}")

    def on_error(self, _, error):
        logger.error(
            f"{__file__.split('/')[-1]} : {__name__} error due to {error}")

    def on_message(self, _, message):
        json_data = json.loads(message)
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
        try:
            ws = websocket.WebSocketApp(
                self.conn,
                on_open=self.on_open,
                on_close=self.on_close,
                on_message=self.on_message
            )
            ws.run_forever()
        except Exception as e:
            self.close(ws)

    def write_data(self, data: dict):
        logger.debug(
            f"{__file__.split('/')[-1]} : {__name__} data has {data}")

        symbol = data["symbol"]
        topic = self.env["KAFKA_MAIN_TOPIC"]

        data = json.dumps(data)

        self.producer.write_data(topic, data, symbol)

    def close(self, web_socket: websocket.WebSocketApp):
        logger.debug(
            f"{__file__.split('/')[-1]} : {__name__} closed connection for {self.c}")

        web_socket.close()

    def __repr__(self) -> str:
        return f"Kindle Stick {self.symbol}"

    def __str__(self) -> str:
        return f"Streaming Binance Kindle Data from {self.symbol}"
