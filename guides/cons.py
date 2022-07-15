from confluent_kafka import Consumer
from configparser import ConfigParser


config = ConfigParser()
config.read('cons.ini')
default = dict(config['default'])
default.update(config["consumer"])
consumer = Consumer(default)


# Subscribe to topic
topic = "all_data"
consumer.subscribe([topic])

# Poll for new messages from Kafka and print them.
try:
    while True:
        msg = consumer.poll(1.0)
        if msg == None:
            print("waiting")
        elif msg.error():
            print(f"ERROR: {msg.error()}")
        else:
            # Extract the (optional) key and value, and print.

            print(
                f"Consumed event from topic {msg.topic()}: key = {msg.key().decode('utf-8')} value = {msg.value().decode('utf-8')}")
except KeyboardInterrupt:
    pass
finally:
    # Leave group and commit final offsets
    consumer.close()
