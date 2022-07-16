import mongoengine
import datetime
from src.misc import read_env, main_logger
logger = main_logger()


def start_connection():
    file = read_env()
    try:
        logger.info("establishing connection with mongodb")
        mongoengine.connect(db="Crypto_Trans",
                            host=file["MONGO_CONN_TEST"], alias='default')
    except Exception as e:
        # log the error as level critical
        logger.info("connection failed with mongodb")
        exit(1)


class Transactions(mongoengine.Document):
    symbol = mongoengine.StringField()
    time = mongoengine.DateTimeField(default=datetime.datetime.now())
    volume = mongoengine.FloatField()
    high = mongoengine.FloatField()
    low = mongoengine.FloatField()
    new_high = mongoengine.BooleanField()
    time_websocket = mongoengine.FloatField()

    meta = {'allow_inheritance': True,
            "collection": "btc_coll", "db_alias": "default"}
