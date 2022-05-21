from confluent_kafka import Producer
from confluent_kafka import Consumer
from configparser import ConfigParser
from argparse import ArgumentParser, FileType

# parser = ArgumentParser()
# parser.add_argument('config_file', type=FileType('r'))
# args = parser.parse_args()

config_parser = ConfigParser()

config_parser.read("cons.ini")
config = dict(config_parser["default"])

producer = Producer(config)


def callback(err, msg):
    pass


producer.produce(topic, product, user_id, callback=callback)
producer.poll(1000)
producer.flush()
