import mongoengine
import datetime


class Transactions(mongoengine.Document):
    symbol = mongoengine.StringField()

    meta = {'allow_inheritance': True}


class Buy_Transactions(Transactions):
    pass


class Sell_Transaction(Transactions):
    pass
