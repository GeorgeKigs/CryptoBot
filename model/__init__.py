from mongoengine import connect

from misc import read_env


def start_connection():
    file = read_env()
    connect(file["MONGO_CONN_TEST"])
