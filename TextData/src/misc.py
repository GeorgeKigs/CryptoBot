from dotenv import dotenv_values
import logging
# Read the .env file


def read_env() -> dict:
    values = dotenv_values()
    return values


def main_logger():
    env = read_env()
    logger = logging.getLogger(__name__)
    # Create handlers
    c_handler = logging.StreamHandler()
    f_handler = logging.FileHandler("logs/main.log")
    # Create formatters and add it to handlers
    c_format = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
    f_format = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    c_handler.setFormatter(c_format)
    f_handler.setFormatter(f_format)
    # Add handlers to the logger
    logger.addHandler(c_handler)
    logger.addHandler(f_handler)
    # Set the logging level
    logger.setLevel(env["LOG_LEVEL"])

    return logger
