import abc
from pydoc_data.topics import topics
from confluent_kafka import Producer, KafkaException
from confluent_kafka.admin import AdminClient, NewTopic
from src.misc import read_env, Logger, main_logger
import pandas

logger = main_logger()


class WriteAbstract(abc.ABC):
    @abc.abstractmethod
    def write_data(self, data):
        """has to be implemented by the child class"""


class WritePubSub(WriteAbstract):
    """Google PubSub"""

    def write_data(self, data: dict) -> bool:
        """Write data to google pubsub"""
        pass


class WriteFile:
    def __init__(self) -> None:
        self.df = pandas.DataFrame()

    def append_data(self, data: dict) -> bool:
        pass

    def write_data(self, data: str = "csv") -> bool:
        pass


class WriteConsole(WriteAbstract):
    def __init__(self) -> None:
        logger_cls = Logger()
        self.logger = logger_cls.get_logger(handler_type="STREAM")

    def write_data(self, msg):
        self.logger.info(msg)


class WriteKafka(WriteAbstract):
    """Writes data to a Kafka topic.
    """

    def __init__(self, topic, configs: dict = None, config_file: str = None) -> None:
        self.topic = topic
        self.configs = self.__read_configs(configs, config_file)
        self.prod = Producer(self.configs)

    def check_connection(self):
        client = AdminClient(self.configs)
        result = client.list_topics()

        return True if result else False

    def __read_configs(self, configs, config_file) -> dict:
        if (not config_file and not configs):
            raise AttributeError("Add configs")
        if configs and "bootstrap.servers" not in configs.keys():
            raise AttributeError("Add configs")
        if config_file:
            configs = configs = read_env(config_file)
            return {'bootstrap.servers': configs["KAFKA_SERVER"]}
        else:
            return configs

    def check_topic(self) -> bool:
        client = AdminClient(self.configs)
        topics = client.list_topics(timeout=10)
        if self.topic not in topics.topics:
            return False
        return True

    def create_topic(self) -> bool:
        try:
            admin = AdminClient(self.configs)
            topic = [NewTopic(f"{self.topic}", num_partitions=1)]
            result = admin.create_topics(
                topic, operation_timeout=1000, request_timeout=1000)
            for topic, data in result.items():
                try:
                    data.result()
                    logger.info(f"{self.topic} has been created")
                    return True
                except KafkaException as e:
                    logger.info("Topic exists continue.")
                    return True
                except Exception as e:
                    logger.error(f"F error {e}")
                    return False

        except KafkaException as e:
            logger.error(f"K error {e}")
            return False
        except Exception as e:
            logger.error(f"E error {e}")
            return False

    def callback(self, err, msg):
        if err:
            logger.error(
                f"{__file__.split('/')[-1]} : {__name__} . Error due to {err}")
        else:
            logger.debug(f"{msg} logged the following message")

    def write_data(self, value, key):
        self.prod.produce(
            self.topic, value, key, on_delivery=self.callback
        )
        self.prod.poll(1000)
        self.prod.flush()
