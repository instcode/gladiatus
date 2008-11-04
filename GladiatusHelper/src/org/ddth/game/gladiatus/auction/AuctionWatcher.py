import os

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

from org.ddth.game.gladiatus.core.DecisionHelper import DecisionHelper
from org.ddth.game.gladiatus import TEMPLATE_DIRS

class AuctionWatcher(webapp.RequestHandler):
    def __init__(self):
        DecisionHelper.register('auction', self);

    def get(self):
        context = {
            'title': 'Auction Watcher',
            'auction_items': ''
        }
        path = os.path.join(TEMPLATE_DIRS, 'auction.html')
        self.response.out.write(template.render(path, context))
    
    def handle(self, dispatcher, module):
        pass;
