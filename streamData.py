from defStreams import RawData, AggregateData, KindleData
import concurrent.futures
import asyncio


exchanges = ["btc", "eth", "ada", "sol", "xpr", "doge", "bnb", "ltc", "shib"]
usd_symbols = [i+"usdt" for i in exchanges]


def start_stream(exc):
    trade = KindleData(exc)
    trade.stream_data()


length = len(usd_symbols)
with concurrent.futures.ThreadPoolExecutor(max_workers=length) as exec:
    exec.map(start_stream, usd_symbols)
