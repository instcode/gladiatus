from google.appengine.ext import db

class AuctionItem(db.Model):
    auction_id = db.IntegerProperty(required=True);
    user = db.StringProperty()
    cookies = db.StringProperty()
    secure_hash = db.StringProperty()
    description = db.StringProperty(multiline=True)
    date = db.DateTimeProperty(auto_now_add=True)
