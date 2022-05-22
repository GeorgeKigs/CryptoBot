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


def add_buy(**kwargs):
    trans = BuyTransactions(
        symbol=kwargs["s"],
        time=kwargs["T"],
        price=kwargs["p"],
        quantity=kwargs["q"],
        seller=kwargs["a"]
    )
    trans.save()


def add_sale(**kwargs):
    trans = SaleTransaction(
        symbol=kwargs["s"],
        time=kwargs["T"],
        price=kwargs["p"],
        quantity=kwargs["q"],
        buyer=kwargs["b"],
    )
    trans.save()
