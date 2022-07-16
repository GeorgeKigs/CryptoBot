import mongoengine
import datetime


class Transactions(mongoengine.Document):
    symbol = mongoengine.StringField()
    time = mongoengine.DateTimeField(default=datetime.datetime.now())
    volume = mongoengine.FloatField()
    high = mongoengine.FloatField()
    low = mongoengine.FloatField()
    new_high = mongoengine.BooleanField()
    time_websocket = mongoengine.FloatField()

    meta = {'allow_inheritance': True}
