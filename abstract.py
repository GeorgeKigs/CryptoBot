import abc
import websocket
import json


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

    def on_close(self, _, connection_status, msg):
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

    def on_error(self, _, error):
        print("Error has occurred")  # ! remember to log the data.

    @abc.abstractmethod
    def write_data(self, data):
        """Write the data that we stream"""
        pass

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
