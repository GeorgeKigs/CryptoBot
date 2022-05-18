import websocket
import json


def on_open(_):
    print("Session has been opened")


def on_message(_, message):
    json_data = json.loads(message)
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


def on_agg_trd_msg(_, message):
    json_data = json.loads(message)
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


def on_trd_msg(_, message):
    json_data = json.loads(message)
    data = {
        "symbol": json_data["s"],
        "time": json_data["T"],
        "price": json_data["p"],
        "quantity": json_data["q"],
        "buyer": json_data["b"],
        "seller": json_data["a"],
    }
    print(data)


def on_close(_):
    print("Connection Closed")


def kindle_stick():
    conn = f"wss://stream.binance.com:9443/ws/btcusdt@kline_1m"

    ws = websocket.WebSocketApp(
        conn, on_open=on_open, on_close=on_close, on_message=on_message,)
    try:
        ws.run_forever()
    except KeyboardInterrupt:
        ws.close()


def stream_trades():
    conn = "wss://stream.binance.com:9443/ws/btcusdt@trade"
    ws = websocket.WebSocketApp(
        conn, on_message=on_trd_msg, on_open=on_open,
        on_close=on_close
    )
    ws.run_forever()


def stream_agg_trades():
    conn = "wss://stream.binance.com:9443/ws/btcusdt@aggTrade"
    ws = websocket.WebSocketApp(
        conn, on_message=on_agg_trd_msg, on_open=on_open,
        on_close=on_close
    )
    ws.run_forever()


kindle_stick()
