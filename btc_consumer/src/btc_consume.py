from src.model.tranactions import Transactions
from src.main_class import ReadKafka, main_logger
import json

logger = main_logger()


def write_db(**kwargs):
    logger.debug("Writing the transaction in the db")
    trans = Transactions(
        symbol=kwargs["symbol"],
        time_websocket=float(kwargs["time"]),
        volume=float(kwargs["volume"]),
        high=float(kwargs["high"]),
        new_high=kwargs["new_high"],
        low=float(kwargs["low"])
    )
    trans.save()


class BTC_Stream(ReadKafka):
    high = 0

    def handle_message(self, message):
        data = json.loads(message.value())
        print(data)

        if float(data["high"]) > self.high and "price" not in data:
            self.high = float(data["high"])
            data["new_high"] = self.high
            write_db(**data)
        else:
            logger.info(f"The price is lower than {self.high}")
            pass
