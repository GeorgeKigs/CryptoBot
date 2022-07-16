
from mongoengine import connect
from src.misc import read_env, main_logger

logger = main_logger()


def start_connection():
    file = read_env()
    try:
        logger.info("establishing connection with mongodb")
        connect(file["MONGO_CONN_TEST"])
    except Exception as e:
        # log the error as level critical
        exit(1)
