from google.appengine.ext import db

class GladiatusPlayer(db.Model):
    def __init__(self, id, username, password, session, secure_hash):
        self.user = db.StringProperty(required=True);
        self.password = db.StringProperty();
        self.id = db.StringProperty(required=True);
        self.session = db.StringProperty();
        self.secure_hash = db.StringProperty();

class GladiatusCustomer(db.Model):
    def __init__(self, id, username):
        self.id = db.StringProperty(required=True);
        self.user = db.StringProperty(required=True);
        self.gold = db.StringProperty();
        self.last_update = db.DateTimeProperty();
