from google.appengine.ext import db

class AuctionItem(db.Model):
    auction_id = db.IntegerProperty(required=True);
    username = db.StringProperty()
    description = db.StringProperty(multiline=True)
    date = db.DateTimeProperty(auto_now_add=True)
    price = db.IntegerProperty();
    afford = db.IntegerProperty();
    value = db.IntegerProperty();
