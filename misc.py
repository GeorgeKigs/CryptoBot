from configparser import ConfigParser
from dotenv import dotenv_values


def read_env() -> dict:
    values = dotenv_values()
    return values


def read_config() -> dict:
    """Read the Kafka configuration file.

    Returns:
        dict: bootstrap
    """
    config = ConfigParser()
    config.read("cons.ini")
    default = dict(config['default'])
    return default['bootstrap.servers']
