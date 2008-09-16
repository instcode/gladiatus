import os

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

from org.ddth.game.gladiatus import TEMPLATE_DIRS

from org.ddth.game.gladiatus.core.Gladiatus import Character
from org.ddth.game.gladiatus.arena.Battle import simulate

class Simulator(webapp.RequestHandler):
    def populate(self, player):
        try:
            id = self.request.get('gladiator' + player, default_value = 'gladiator');
            level = int(self.request.get('level' + player));
            hp = int(self.request.get('hitpoint' + player, default_value = '10000'));
            agility = int(self.request.get('agility' + player));
            armor = int(self.request.get('armour' + player));
            charisma = int(self.request.get('charisma' + player));
            skill = int(self.request.get('skill' + player));
            damage = [int(self.request.get('damage1' + player)), int(self.request.get('damage2' + player))];
        except:
            id = "gladiator";
            level = 0;
            hp = 10000;
            agility = 0;
            armor = 0;
            charisma = 0;
            skill = 0;
            damage = [0, 2];
            pass
        character = Character(id, id, level, hp, 0, 0, skill, agility, 0, charisma, armor, 0, damage);
        return character;
    
    def get(self):
        context = {}
        path = os.path.join(TEMPLATE_DIRS, 'simulation.html')
        self.response.out.write(template.render(path, context))
        
    def post(self):
        version = self.request.get('version', default_value = '0.3.3');
        count = int(self.request.get('count'));
        challenger = self.populate('1');
        defender = self.populate('2');
        result = simulate(version, challenger, defender, count);
        self.response.out.write('%d|%d|%d' % result);
