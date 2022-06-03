from confluent_kafka import Producer
from configparser import ConfigParser

from misc import read_config, read_env


class WriteKafka:
    """Writes data to a Kafka topic.
    """

    def __init__(self) -> None:

        self.configs = read_config()
        self.envs = read_env()
        self.prod = Producer(self.configs)

    def callback(self, err, msg):
        if err:
            print(err)
        else:
            print(msg)

    def write_data(self, topic, value, key):

        self.prod.producer(
            topic, value, key, callback=self.callback
        )
        self.prod.poll(1000)
        self.prod.flush()


class ReadKafka:
    pass
