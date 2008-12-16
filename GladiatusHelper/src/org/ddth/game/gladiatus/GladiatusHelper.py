import cgi
import os

from google.appengine.ext import db
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

from org.ddth.game.gladiatus.arena.Simulator import Simulator
from org.ddth.game.gladiatus.auction.AuctionWatcher import AuctionWatcher
from org.ddth.game.gladiatus.core.DecisionHelper import DecisionHelper

from org.ddth.game.gladiatus import TEMPLATE_DIRS

class Home(webapp.RequestHandler):
    def get(self):
        template_values = {
        }
        path = os.path.join(TEMPLATE_DIRS, 'index.html')
        self.response.out.write(template.render(path, template_values))

application = webapp.WSGIApplication(
                    [
                        ('/', Home),
                        ('/auction.py', AuctionWatcher),
                        ('/simulate.py', Simulator),
                        ('/simulate', Simulator),
                        ('/ask/(.*).py', DecisionHelper),
                    ],
                    debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()