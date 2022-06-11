
from dataclasses import dataclass


@dataclass
class User:
    name: str
    number: int
    color: str


def user_to_dict(user, ctx):
    return dict(
        name=user.name,
        number=user.number,
        color=user.color
    )


def delivery_report(err, message):
    if err:
        print(err)
    else:
        print(message)


def main():
    schema_str = """
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "User",
      "description": "A Confluent Kafka Python User",
      "type": "object",
      "properties": {
        "name": {
          "description": "User's name",
          "type": "string"
        },
        "favorite_number": {
          "description": "User's favorite number",
          "type": "number",
          "exclusiveMinimum": 0
        },
        "favorite_color": {
          "description": "User's favorite color",
          "type": "string"
        }
      },
      "required": [ "name", "favorite_number", "favorite_color" ]
    }
    """
