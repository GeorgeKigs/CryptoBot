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
    env = read_env()
    config = ConfigParser()
    config.read(env["CONFIG_FILE"])
    default = dict(config['default'])
    return default['bootstrap.servers']
