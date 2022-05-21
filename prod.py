from confluent_kafka import Producer
from configparser import ConfigParser

from misc import read_config, read_env


class WriteKafka:
    def __init__(self) -> None:

        self.configs = read_config()
        self.envs = read_env()
        self.prod = Producer(self.configs)

    def callback(self, err, msg):
        if err:
            print(err)
        else:
            print(msg)

    def write_data(self, value, key):

        self.prod.producer(
            self.envs["KAFKA_TOPIC"], value, key, callback=self.callback
        )
        self.prod.poll(1000)
        self.prod.flush()
