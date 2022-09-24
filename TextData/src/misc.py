from dotenv import dotenv_values
import os
import logging


def read_env(file: str = ".env") -> dict:
    if os.path.isfile(file):
        values = dotenv_values(dotenv_path=file)
        return values
    else:
        raise FileNotFoundError("Specify the .env file")


class Logger:
    def __init__(self) -> None:
        self.logger = logging.getLogger(__name__)

    def __stream_handler(self):
        c_handler = logging.StreamHandler()
        c_format = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
        c_handler.setFormatter(c_format)
        return c_handler

    def __file_handler(self, file):
        if file:
            f_handler = logging.FileHandler(file)
            f_format = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            f_handler.setFormatter(f_format)
            return f_handler
        else:
            raise ValueError("File has not been defined")

    def get_logger(self, handler_type: str, file: str | None = None):
        handler = {
            "STREAM": self.__stream_handler(),
            "FILE": self.__file_handler(file)
        }
        if handler_type == "BOTH":
            self.logger.addHandler(handler["FILE"])
            self.logger.addHandler(handler["STREAM"])

        elif handler_type in handler.keys():
            mode = handler[handler_type]
            self.logger.addHandler(mode)
        else:
            raise ValueError("Handler has not been defined")
        return self.logger


def main_logger():
    logger = Logger()
    env = read_env()
    if env == "PROD":
        return logger.get_logger(handler_type="FILE", file="logs/main.logs")
    if env == "DEV":
        return logger.get_logger(handler_type="STREAM")
    if env == "TEST":
        return logger.get_logger(handler_type="FILE", file="logs/test.logs")
