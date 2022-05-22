from abstract import AbstractStreamInter
import websocket
import json
from src.misc import read_env

from src.prod import WriteKafka


class AggregateData(AbstractStreamInter):
    """Stream the aggregate data.
    Data is streamed in real-time.
    """

    def __init__(self, symbol):
        #! get the trade vakue to the binance websocket
        trade = ''
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


class RawData(AbstractStreamInter):
    """Stream the aggregate data. 
    Data is sent in real-time.
    """

    def ___init__(self, symbol):
        trade = "Trade"
        super().__init__(symbol, trade)
        self.producer = WriteKafka()

    def on_message(self, _, message):
        json_data = super().on_message(_, message)
        data = {
            "symbol": json_data["s"],
            "time": json_data["T"],
            "price": json_data["p"],
            "quantity": json_data["q"],
            "buyer": json_data["b"],
            "seller": json_data["a"],
        }
        self.write_data(data)

    def stream_data(self):

        ws = websocket.WebSocketApp(
            self.conn, on_open=self.on_open,
            on_close=self.on_close,
            on_message=self.on_message
        )
        super().run(ws)

    def write_data(self, data: dict):
        symbol = data["symbol"]
        data.pop(symbol)
        self.producer.write_data(self.env["KAFKA_RAW_TOPIC"], data, symbol)

    def __repr__(self) -> str:
        return f"Raw {self.symbol}"

    def __str__(self) -> str:
        return f"Streaming Binance Raw trading Data from {self.symbol}"


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
        print(data)  # ! remember to log the info after we get the data
        self.write_data(data)

    def stream_data(self):

        ws = websocket.WebSocketApp(
            self.conn, on_open=self.on_open,
            on_close=self.on_close,
            on_message=self.on_message
        )
        super().run(ws)

    def write_data(self, data: dict):
        symbol = data["symbol"]
        data.pop(symbol)
        self.producer.write_data(self.env["KAFKA_KINDLE_TOPIC"], data, symbol)

    def __repr__(self) -> str:
        return f"Kindle Stick {self.symbol}"

    def __str__(self) -> str:
        return f"Streaming Binance Kindle Data from {self.symbol}"
