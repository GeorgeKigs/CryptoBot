from src.defStreams import RawData, AggregateData, KindleData
import concurrent.futures


def def_coins() -> dict:
    exchanges = ["btc", "eth", "ada", "sol",
                 "xpr", "doge", "bnb", "ltc", "shib"]
    usd_symbols = [i+"usdt" for i in exchanges]
    length = len(usd_symbols)
    return {"length": length, "symbols": usd_symbols}


def start_stream(exc):
    trade = KindleData(exc)
    trade.stream_data()


if __name__ == "__main__":
    definitions = def_coins()
    with concurrent.futures.ThreadPoolExecutor(max_workers=definitions["length"]) as exec:
        exec.map(start_stream, definitions["symbols"])
