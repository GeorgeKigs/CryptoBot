'''
Getting the data from the classes used in GetData
'''

from src.GetData import GetSubreddits, GetTelegram, GetTweets
from src.misc import main_logger
from src.writeData import WriteKafka, WritePubSub, WriteFile, WriteConsole, WriteAbstract
import concurrent.futures


def kafka_setup(topic, configs=None, config_file=None) -> WriteAbstract:
    kafka_inst = WriteKafka(topic, configs, config_file)

    if kafka_inst.check_connection():
        if kafka_inst.create_topic():
            return kafka_inst
    return False


def choose_data_sources(dest: str, **kwargs) -> WriteAbstract:
    desitnation = {
        "kafka": kafka_setup(),
        "pubsub": WritePubSub(),
        "file": WriteFile(),
        "console": WriteConsole()
    }
    return desitnation[dest]


def get_data(lists, DataClass, DataDest: WriteAbstract) -> None:

    with concurrent.futures.ThreadPoolExecutor() as executor:
        for subreddit in lists:
            future = executor.submit(DataClass, subreddit)
            for future in concurrent.futures.as_completed(future):
                DataDest.write_data(future.result())


def main(dest) -> None:
    """
    Consolidate the data.
    """
    data_dest = choose_data_sources(dest)

    popular_subreddits = []
    subreddits = GetSubreddits()
    subreddits.authenticate()
    get_data(popular_subreddits, subreddits.get_subreddit, data_dest)

    popular_channels = []
    tel_bot = GetTelegram()
    tel_bot.authenticate()
    get_data(popular_channels, tel_bot.get_channel_messages, data_dest)

    popular_users = []
    twitter_bots = GetTweets()
    get_data(popular_users, twitter_bots.get_subreddit, data_dest)


if __name__ == "__main__":
    logger = main_logger()
