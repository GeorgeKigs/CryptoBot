from abc import ABC, abstractmethod
from confluent_kafka import DeserializingConsumer
from confluent_kafka.error import KafkaException
from confluent_kafka.schema_registry.json_schema import JSONDeserializer
from confluent_kafka.serialization import StringDeserializer

from misc import read_kafka_config


class ReadKafka(ABC):
    def __init__(self, schema_str, serilization_func, group_id="") -> None:
        self.configs = read_kafka_config()
        self.configs["auto.offset.reset"] = "earliest"
        self.configs["key.deserializer"] = StringDeserializer('utf-8')
        self.configs["value.serializer"] = JSONDeserializer(
            schema_str, serilization_func)

        self.configs["group.id"] = group_id

        self.running = True

    def switch(self) -> bool:
        return self.running

    def consume(self) -> DeserializingConsumer:
        return DeserializingConsumer(self.configs)

    @abstractmethod
    def handle_message(self, message) -> None:
        """Handles the buy and sell based 
        on the message we get."""


class HandleErrors:
    no_errors = 0

    def handle_timeout(self, topic):
        pass

    def handle_errors(self, topic, message):
        pass


def consume_loop(Kafka_Consumer: ReadKafka, topic):
    # topic to consume from

    consumer: DeserializingConsumer = Kafka_Consumer.consume()
    running = Kafka_Consumer.running
    consumer.subscribe([topic])
    errors = HandleErrors()

    try:
        while running:
            message = consumer.poll(timeout=1)
            if message is None:
                errors.handle_timeout(topic)
                continue
            if message.error():
                errors.handle_errors(topic, message.error())
                raise KafkaException(message.error())
            else:
                Kafka_Consumer.handle_message(message)
                consumer.commit(asynchronous=True)
    finally:
        consumer.close()
