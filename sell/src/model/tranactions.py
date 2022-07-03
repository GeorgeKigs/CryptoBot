import mongoengine
import datetime


class Transactions(mongoengine.Document):
    symbol = mongoengine.StringField()
    time = mongoengine.DateTimeField(default=datetime.datetime.now())
    price = mongoengine.FloatField()
    quantity = mongoengine.FloatField()

    meta = {'allow_inheritance': True}


class BuyTransactions(Transactions):
    seller = mongoengine.IntField()


class SaleTransaction(Transactions):
    buyer = mongoengine.IntField()
