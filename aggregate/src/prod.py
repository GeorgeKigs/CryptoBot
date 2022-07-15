from confluent_kafka import Producer
from src.misc import read_kafka_config, read_env
from src.misc import main_logger

logger = main_logger()


class WriteKafka:
    """Writes data into a Kafka topic"""

    def __init__(self) -> None:
        self.configs = read_kafka_config()
        self.prod = Producer(self.configs)

    def callback(self, err, msg):
        if err:
            # get a logger for the data in the service.
            logger.error(
                f"{__file__.split('/')[-1]} : {__name__} {err}")
        else:
            # log the messages using the debug mode
            logger.info(
                f"{__file__.split('/')[-1]} : {__name__} published successfully {msg}")

    def write_data(self, topic, value, key):
        logger.debug(
            f"{__file__.split('/')[-1]} : {__name__} writing data for {topic}")
        self.prod.produce(
            topic,
            value,
            key,
            on_delivery=self.callback
        )
        self.prod.poll(1000)
        self.prod.flush()


# class WriteKafka:
#     """Writes data to a Kafka topic.
#     """

#     def __init__(self, schema_str, serilization_func) -> None:

#         self.configs = read_kafka_config()

#         self.configs["key.serializer"] = StringSerializer('utf-8')

#         schema_reg = SchemaRegistryClient({"url": None})

#         self.configs["value.serializer"] = JSONSerializer(
#             schema_str, schema_reg, serilization_func)

#         self.prod = SerializingProducer(self.configs)

#     def callback(self, err, msg):
#         if err:
#             print(err)
#         else:
#             print(msg)

#     def write_data(self, topic, value, key):

#         self.prod.produce(
#             topic, value, key, on_delivery=self.callback
#         )
#         self.prod.poll(1000)
#         self.prod.flush()
