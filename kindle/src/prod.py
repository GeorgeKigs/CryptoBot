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


# from confluent_kafka import SerializingProducer
# from confluent_kafka.serialization import StringSerializer
# from confluent_kafka.schema_registry.json_schema import JSONSerializer
# from confluent_kafka.schema_registry import SchemaRegistryClient

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
