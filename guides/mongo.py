import mongoengine
import datetime

mongoengine.connect(host="mongodb://localhost:27017/pymongo_test")


class TestDocs(mongoengine.Document):
    name = mongoengine.StringField()
    dob = mongoengine.DateField(default=datetime.date.today())


user1 = TestDocs(name="gkn")
user1.save()
