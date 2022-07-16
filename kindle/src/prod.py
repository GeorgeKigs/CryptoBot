# from confluent_kafka import Producer
from confluent_kafka import Producer
from src.misc import read_kafka_config, read_env


class WriteKafka:
    """Writes data to a Kafka topic.
    """

    def __init__(self) -> None:

        self.configs = read_kafka_config()
        self.prod = Producer(self.configs)

    def callback(self, err, msg):
        if err:
            print(err)
        else:
            print(msg)

    def write_data(self, topic, value, key):
        self.prod.produce(
            topic, value, key, on_delivery=self.callback
        )
        self.prod.poll(1000)
        self.prod.flush()
