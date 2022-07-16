from model.tranactions import Transactions
from src.main_class import ReadKafka, main_logger
import json

logger = main_logger()


def write_db(**kwargs):
    logger.debug("Writing the transaction in the db")
    trans = Transactions(
        symbol=kwargs["symbol"],
        time=kwargs["time"],
        volume=kwargs["volume"],
        high=kwargs["high"],
        new_high=kwargs["new_high"],
        low=kwargs["low"]
    )
    trans.save()


class BTC_Stream(ReadKafka):
    high = 0

    def handle_message(self, message: str):
        data = json.loads(message)
        if data["high"] > high and "price" not in data:
            high = data["high"]
            data["new_high"] = high
            write_db(data)
        else:
            logger.error(f"The price is lower than {high}")
            pass
