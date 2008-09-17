from google.appengine.ext import db

class GladiatusPlayer(db.Model):
    def __init__(self, username, password, id, session, secure_hash):
        self.user = db.StringProperty(required=True);
        self.password = db.StringProperty();
        self.id = db.StringProperty(required=True);
        self.session = db.StringProperty();
        self.secure_hash = db.StringProperty();