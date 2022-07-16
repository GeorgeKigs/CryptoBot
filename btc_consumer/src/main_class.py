from abc import ABC, abstractmethod
from confluent_kafka import Consumer
from src.misc import main_logger, read_kafka_config

logger = main_logger()


class ReadKafka(ABC):
    def __init__(self, group_id="") -> None:
        logger.info("establishing Kafka connection")

        self.configs = read_kafka_config()
        default = dict(self.config['default'])
        default.update(self.config["consumer"])
        self.consumer = Consumer(default)
        self.running = True

    def switch(self) -> bool:
        return self.running

    @abstractmethod
    def handle_message(self, message) -> None:
        """Handles the buy and sell based 
        on the message we get."""


class HandleErrors:
    no_errors = 0

    def handle_timeout(self, topic):
        logger.error(f'{topic} has not established any connection')

    def handle_errors(self, message):
        logger.error(f"consumer failed because {message}")


def consume_loop(Kafka_Consumer: ReadKafka, topic):
    # topic to consume from

    consumer: Consumer = Kafka_Consumer.consumer
    running = Kafka_Consumer.running
    consumer.subscribe([topic])
    errors = HandleErrors()

    try:
        while running:
            message = consumer.poll(1.0)
            if message is None:
                errors.handle_timeout(topic)

            elif message.error():
                errors.handle_errors(topic, message.error())
            else:
                Kafka_Consumer.handle_message(message)
    except Exception as e:
        errors.handle_errors(e)
    finally:
        consumer.close()
