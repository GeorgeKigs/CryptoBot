from datetime import datetime
import twint
from telethon.sync import TelegramClient
import sys
import requests
import json

from src.misc import read_env, main_logger


logger = main_logger()


class GetStockExchange:
    """Get stock exchange data from different sources to analyse with the crypto 
    data.
    """
    # def __init__(self, configs: dict = None, config_file: str = None) -> None:
    #     if (not config_file and not configs):
    #         raise AttributeError("Add configs")
    #     if configs and "api_key" not in configs.keys():
    #         raise AttributeError("Add configs")
    #     if config_file:
    #         configs = self.__read_configs(config_file)

    #     self.api_key = configs["api_key"]

    # def __read_configs(self, file) -> dict:
    #     configs = read_env(file)
    #     return {'api_key': configs["API_KEY"]}

    # def get_stock_exchange(self, stock_exchange: str) -> dict:
    #     url = f"https://financialmodelingprep.com/api/v3/stock/list?apikey={self.api_key}"
    #     response = requests.get(url)
    #     if response.status_code == 200:
    #         return response.json()
    #     else:
    #         return {}


class GetTelegram:
    """Getting data from the telegram API
    """

    def authenticate(self) -> None:
        """Authenticating to the telegram API
        """
        api_id = read_env("TELEGRAM_API_ID")
        api_hash = read_env("TELEGRAM_API_HASH")
        phone = read_env("TELEGRAM_PHONE")
        self.client = TelegramClient(phone, api_id, api_hash)

    def get_channel(self, channel_name: str) -> None:
        """Getting the channel data
        """

        channel = self.client.get_entity(channel_name)
        return channel

    def get_channel_messages(self, channel_name: str) -> list:
        messages = []
        today = datetime.today().date().strftime("%Y-%m-%d")
        with self.client as client:
            for message in client.iter_messages(channel_name, reverse=True, offset_date=today):
                messages.append(message)

        return messages


class GetSubreddits:
    """Get data from the reddit api
    """

    def __init__(self) -> None:
        logger.info("Getting data from reddit")

    def authenticate(self) -> str:
        env = read_env()
        client_id = env["REDDIT_KEY"]
        client_secret = env["REDDIT_SECRET"]

        auth = requests.auth.HTTPBasicAuth(client_id, client_secret)

        auth_data = {'grant_type': 'password',
                     'username': env["REDDIT_USER"],
                     'password': env["REDDIT_PASS"]}

        headers = {'User-Agent': 'Streams/0.0.1'}

        res = requests.post('https://www.reddit.com/api/v1/access_token',
                            auth=auth, data=auth_data, headers=headers)
        token = res.json()['access_token']
        return token

    def get_subreddit(self, subreddit: str, token: str) -> list:
        # token = self.authenticate()
        headers = {**{'Authorization': f"bearer {token}"},
                   **{'User-Agent': 'Streams/0.0.1'}}
        params = {'limit': 5}
        res = requests.get(f"https://oauth.reddit.com/r/{subreddit}/new",
                           headers=headers, params=params)
        data = res.json()["data"]["children"]
        return data


class GetTweets:
    """Get data from the twitter API
    """

    def __init__(self):
        self.config = twint.Config()
        self.from_time = datetime.today().strftime('%Y-%m-%d')
        self.to_time = datetime.today().strftime('%Y-%m-%d')
        self.config.Since = self.from_time
        self.config.Until = self.to_time
        self.config.Store_json = True

    # def authenticate(self):
    #     return

    def get_user_tweets(self, username):
        self.config.Username = username
        self.config.Output = f'./data/users.json'
        self.config.Limit = 5
        twint.run.Search(self.config)
        return self.config.Store_object_tweets_list

    def get_news_tweets(self, keyword):
        self.config.Search = keyword
        self.config.Output = f'./data/news.json'
        twint.run.Search(self.config)
        return self.config.Store_object_tweets_list
