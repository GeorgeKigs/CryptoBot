from configparser import ConfigParser
from dotenv import dotenv_values
import logging


def read_env() -> dict:
    values = dotenv_values()
    return values


def set_logger_level(config):
    level = {
        "WARNING": logging.WARNING,
        "DEBUG": logging.DEBUG,
        "INFO": logging.INFO,
        "ERROR": logging.ERROR,
        "CRITICAL": logging.CRITICAL
    }
    return level[config]


# define the logger of the application
def main_logger():
    configs = read_env()
    '''
    Used to define the main logger of this service. 
    In case of any errors or stream data that the user might be interested in
    '''
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)

    # create the handlers of the application

    consoleHandler = logging.StreamHandler()
    fileHandler = logging.FileHandler(configs["LOGGER_FILE"])

    # set the levels of the application
    stream_level = set_logger_level(configs["LOGGER_STREAM_LEVEL"])
    file_level = set_logger_level(configs["LOGGER_FILE_LEVEL"])

    consoleHandler.setLevel(stream_level)
    fileHandler.setLevel(file_level)

    # set the formats of the applications
    console_form = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
    file_form = logging.Formatter(
        '%(asctime)s : %(name)s - %(levelname)s - %(message)s')

    consoleHandler.setFormatter(console_form)
    fileHandler.setFormatter(file_form)

    logger.addHandler(consoleHandler)
    logger.addHandler(fileHandler)

    return logger


def read_kafka_config() -> dict:
    """
    Read the Kafka configuration file.
    Returns:
        dict: bootstrap
    """
    env = read_env()
    config = ConfigParser()
    config.read(env["CONFIG_FILE"])
    default = dict(config['default'])
    return default
