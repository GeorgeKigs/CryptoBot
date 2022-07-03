
from dataclasses import dataclass
import websocket
from raw.abstract import AbstractStreamInter
from GetData.prod import WriteKafka


@dataclass
class Raw_Data:
    time: str
    symbol: str
    price: float
    quantity: float
    buyer: str
    seller: str


def raw_to_dict(data, ctx):
    return dict(
        time=data["time"],
        symbol=data["symbol"],
        price=data["price"],
        quantity=data["quantity"],
        buyer=data["buyer"],
        seller=data["seller"]
    )


def schema_raw():
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
			"buyer": {
				"description": "The id of the buyer",
				"type": "string"
			},
			"seller": {
				"description": "The id of the seller",
				"type": "string"
			},
		},
	"required": [ "time","symbol","high","low","open","volume","close","closed" ]
	}
	"""


class RawData(AbstractStreamInter):
    """Stream the aggregate data. 
    Data is sent in real-time.
    """

    def ___init__(self, symbol):
        trade = "trade"
        super().__init__(symbol, trade)

        schema_str = schema_raw()
        serilization_func = raw_to_dict

        self.producer = WriteKafka(schema_str, serilization_func)

    def on_message(self, _, message):
        json_data = super().on_message(_, message)
        data = Raw_Data(
            symbol=json_data["s"],
            time=json_data["T"],
            price=json_data["p"],
            quantity=json_data["q"],
            buyer=json_data["b"],
            seller=json_data["a"]
        )

        self.write_data(data)

    def stream_data(self):

        ws = websocket.WebSocketApp(
            self.conn, on_open=self.on_open,
            on_close=self.on_close,
            on_message=self.on_message
        )
        super().run(ws)

    def write_data(self, data: Raw_Data):
        symbol = data["symbol"]
        data.pop(symbol)
        self.producer.write_data(self.env["KAFKA_RAW_TOPIC"], data, symbol)

    def __repr__(self) -> str:
        return f"Raw {self.symbol}"

    def __str__(self) -> str:
        return f"Streaming Binance Raw trading Data from {self.symbol}"
