from confluent_kafka import Producer, KafkaException
from confluent_kafka.admin import AdminClient, NewTopic
from src.misc import read_env, Logger, main_logger
import pandas

logger = main_logger()


class ConsoleData:
    def __init__(self) -> None:
        logger_cls = Logger()
        self.logger = logger_cls.get_logger(handler_type="STREAM")

    def write_data(self, msg):
        self.logger.info(msg)


class WriteFile:
    def __init__(self) -> None:
        self.df = pandas.DataFrame()


class WriteKafka:
    """Writes data to a Kafka topic.
    """

    def __init__(self, configs: dict = None, config_file: str = None) -> None:
        if (not config_file and not configs):
            raise AttributeError("Add configs")
        if configs and "bootstrap.servers" not in configs.keys():
            raise AttributeError("Add configs")
        if config_file:
            configs = self.__read_configs(config_file)

        self.prod = Producer(configs)

    def __read_configs(self, file) -> dict:
        configs = read_env(file)
        return {'bootstrap.servers': configs["KAFKA_SERVER"]}

    def check_connection(self) -> bool:
        topics = AdminClient.list_topics().topics
        if self.topic not in topics:
            return False
        return True

    def create_topic(self):
        try:
            admin = AdminClient(self.broker)
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

    def write_data(self, topic, value, key):
        self.prod.produce(
            topic, value, key, on_delivery=self.callback
        )
        self.prod.poll(1000)
        self.prod.flush()
