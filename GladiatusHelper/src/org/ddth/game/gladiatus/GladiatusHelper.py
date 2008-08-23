import cgi
import os

from google.appengine.ext.webapp import template
from google.appengine.ext import db
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

from org.ddth.game.gladiatus.core.Gladiatus import Character
from org.ddth.game.gladiatus.core.Battle import simulate

class Greeting(db.Model):
    author = db.UserProperty()
    content = db.StringProperty(multiline=True)
    date = db.DateTimeProperty(auto_now_add=True)

class AuctionWatcher(webapp.RequestHandler):
    def get(self):
        greetings = db.GqlQuery("SELECT * FROM Greeting ORDER BY date DESC LIMIT 10")
        #greetings_query = Greeting.all().order('-date')
        #greetings = greetings_query.fetch(10)
    
        if users.get_current_user():
          url = users.create_logout_url(self.request.uri)
          url_linktext = 'Logout'
        else:
          url = users.create_login_url(self.request.uri)
          url_linktext = 'Login'
    
        template_values = {
          'greetings': greetings,
          'url': url,
          'url_linktext': url_linktext,
        }
        path = os.path.join(os.path.dirname(__file__), '../../../../index.html')
        self.response.out.write(template.render(path, template_values))

class Simulator(webapp.RequestHandler):
    def populate(self, player):
        try:
            level = int(self.request.get('level' + player));
            agility = int(self.request.get('agility' + player));
            armor = int(self.request.get('armour' + player));
            charisma = int(self.request.get('charisma' + player));
            skill = int(self.request.get('skill' + player));
            damage = [int(self.request.get('damage1' + player)), int(self.request.get('damage2' + player))];
        except:
            pass
        
        character = Character('gladiator', 0, 'gladiator', 0, skill, agility, 0, charisma, armor, 0, damage);
        
        return character;
    
    def post(self):
        # simulate?count=#level1=#&agility1=#&armour1=#&charisma1=#&skill1=#&damage11=#&damage21=#level2=#&agility2=#&armour2=#&charisma2=#&skill2=#&damage12=#&damage22=#
        count = int(self.request.get('count'));
        challenger = self.populate('1');
        defender = self.populate('2');
        result = simulate(challenger, defender, count);
        self.response.out.write('Win: ' + str(result[0]));
        
application = webapp.WSGIApplication(
                    [
                        ('/', AuctionWatcher),
                        ('/simulate', Simulator)
                    ],
                    debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()