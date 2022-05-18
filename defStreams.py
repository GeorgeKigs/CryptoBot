import websocket
import json

import abc


class AbstractStreamInter(metaclass=abc.ABCMeta):
    """Abstract class that defines the data streams of the data.

    """

    def define_conn(self, symbol, Trade):
        """Defines the connection.

        Args:
            symbol (str): What exchange we want to get
            Trade (str): The type of data we want

        Returns:
            str: The connection String.
        """
        return f"wss://stream.binance.com:9443/ws/{symbol}@{Trade}"

    def on_open(self, _):
        """Defines what happens if the data stream is opened.
        """
        print("Session has been opened")

    def on_close(self, _):
        """Defines what happens if the data is closed.
        """
        print("Connection Closed")

    @abc.abstractmethod
    def on_message(self, _, message):
        """Defines what happens when the data is recieved

        Args:
            _ : websocket connection    
            message (JSON): JSON object that is recieved from the data stream

        Returns:
            dict: Return a dict after Parsing the JSON data.
        """
        print("new Message")
        return json.loads(message)

    @abc.abstractmethod
    def stream_data(self):
        """Abstract method for how we stream the data.
        """
        pass

    def run(self, web_socket: websocket.WebSocketApp):
        """Start streaming the data"""
        try:
            web_socket.run_forever()
        except Exception as e:
            self.close(web_socket)

    def close(self, web_socket: websocket.WebSocketApp):
        """Close the webseocket"""
        web_socket.close()


class AggregateData(AbstractStreamInter):
    """Stream the aggregate data.
    Data is streamed in real-time.
    """

    def __init__(self, symbol, trade):
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

    def __repr__(self) -> str:
        return f"Aggregate data {self.symbol}"

    def __str__(self) -> str:
        return f"Aggregate Data from {self.symbol}"


class RawData(AbstractStreamInter):
    """Stream the aggregate data. 
    Data is sent in real-time.
    """

    def __init__(self, symbol):
        trade = "Trade"
        self.conn = super().define_conn(symbol, trade)

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
        print(data)

    def stream_data(self):

        ws = websocket.WebSocketApp(
            self.conn, on_open=self.on_open,
            on_close=self.on_close,
            on_message=self.on_message
        )
        super().run(ws)

    def __repr__(self) -> str:
        return f"Raw {self.symbol}"

    def __str__(self) -> str:
        return f"Streaming Binance Raw trading Data from {self.symbol}"


class KindleData(AbstractStreamInter):
    """Stream the Kindle data.
    Refreshes after 2000ms.
    """

    def __init__(self, symbol):
        self.symbol = symbol
        trade = "kline_1m"
        self.conn = super().define_conn(self.symbol, trade)

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
        print(data)

    def stream_data(self):

        ws = websocket.WebSocketApp(
            self.conn, on_open=self.on_open,
            on_close=self.on_close,
            on_message=self.on_message
        )
        super().run(ws)

    def __repr__(self) -> str:
        return f"Kindle Stick {self.symbol}"

    def __str__(self) -> str:
        return f"Streaming Binance Kindle Data from {self.symbol}"
