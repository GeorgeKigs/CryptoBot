from src.model.tranactions import start_connection
from src.btc_consume import BTC_Stream
from src.main_class import consume_loop
from src.misc import main_logger


def main():
    logger.info("Initalizing the BTC Consumer")
    start_connection()
    stream = BTC_Stream()
    consume_loop(stream, 'bitcoin_topic')


if __name__ == "__main__":
    logger = main_logger()
    main()
