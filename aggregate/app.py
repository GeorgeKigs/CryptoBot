import logging
import concurrent.futures
from src.AggregateData import AggregateData
from src.misc import main_logger

logger = main_logger()


def def_coins() -> dict:
    exchanges = ["btc", "eth", "ada", "sol",
                 "xpr", "doge", "bnb", "ltc", "shib"]
    usd_symbols = [i+"usdt" for i in exchanges]
    length = len(usd_symbols)
    return {"length": length, "symbols": usd_symbols}


def start_stream(exc):
    # log the data into the logger
    logger.info(
        f"{__file__.split('/')[-1]} : Streaming init for: {exc}")
    trade = AggregateData(exc)
    trade.stream_data()


if __name__ == "__main__":
    definitions = def_coins()
    with concurrent.futures.ThreadPoolExecutor(max_workers=definitions["length"]) as exec:
        exec.map(start_stream, definitions["symbols"])
