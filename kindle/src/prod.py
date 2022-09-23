# from confluent_kafka import Producer
from confluent_kafka import Producer
from src.misc import read_kafka_config, read_env
from misc import main_logger

logger = main_logger()


class WriteKafka:
    """Writes data to a Kafka topic.
    """

    def __init__(self) -> None:

        self.configs = read_kafka_config()
        self.prod = Producer(self.configs)

    def callback(self, err, msg):
        if err:
            logger.error(
                f"{__file__.split('/')[-1]} : {__name__} . Error due to {err}")
        else:
            logger.debug(f"{msg} logged the following message")

    def write_data(self, topic, value, key):
        self.prod.produce(
            topic, value, key, on_delivery=self.callback
        )
        self.prod.poll(1000)
        self.prod.flush()
