import abc
import websocket
import json

from src.misc import read_env, main_logger

logger = main_logger()


class AbstractStreamInter(metaclass=abc.ABCMeta):
    """Abstract class that defines the data streams of the data.

    """

    def __init__(self, symbol, trade) -> None:
        self.symbol = symbol
        self.env = read_env()
        self.conn = self.define_conn(self.symbol, trade)

    def define_conn(self, symbol, Trade):
        """Defines the connection.

        Args:
            symbol (str): What exchange we want to get
            Trade (str): The type of data we want

        Returns:
            str: The connection String.
        """
        logger.info(
            f"{__file__.split('/')[-1]} :  defining web_sock_conn for {symbol}@{Trade}")

        return f"wss://stream.binance.com:9443/ws/{symbol}@{Trade}"

    def on_open(self, _):
        """Defines what happens if the data stream is opened.
        """
        # log data into the logger
        logger.info(
            f"{__file__.split('/')[-1]} :  init web_sock_conn for {self.conn}")

    def on_close(self, _, connection_status, msg):
        """Defines what happens if the data is closed.
        """
        # log data into logger
        logger.info(
            f"{__file__.split('/')[-1]} :  close web_sock_conn for {self.conn}")

    @abc.abstractmethod
    def on_message(self, _, message) -> dict:
        """Defines what happens when the data is recieved

        Args:
            _ : websocket connection    
            message (JSON): JSON object that is recieved from the data stream

        Returns:
            dict: Return a dict after Parsing the JSON data.
        """
        return json.loads(message)

    def on_error(self, _, error):
        logger.error(
            f"{__file__.split('/')[-1]} :  error {error} for {self.conn}")
        print("Error has occurred")  # ! remember to log the data.

    @abc.abstractmethod
    def write_data(self, data):
        """Write the data that we stream"""

    @abc.abstractmethod
    def stream_data(self):
        """Abstract method for how we stream the data.
        """

    def run(self, web_socket: websocket.WebSocketApp):
        """Start streaming the data"""
        try:
            web_socket.run_forever()
        except Exception as e:
            self.close(web_socket)

    def close(self, web_socket: websocket.WebSocketApp):
        """Close the webseocket"""
        logger.info(
            f"{__file__.split('/')[-1]} :  closing web_sock_conn for {self.conn}")
        web_socket.close()
