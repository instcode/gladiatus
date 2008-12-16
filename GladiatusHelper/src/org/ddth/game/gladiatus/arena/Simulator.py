import os

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

from org.ddth.game.gladiatus import TEMPLATE_DIRS

from org.ddth.game.gladiatus.core.GladiatusModel import Character
from org.ddth.game.gladiatus.arena.Battle import simulate

class Simulator(webapp.RequestHandler):
    def populate(self, player):
        try:
            id = self.request.get('gladiator' + player, default_value = 'gladiator');
            level = int(self.request.get('level' + player, default_value = '1'));
            hp = int(self.request.get('hitpoint' + player, default_value = '100000'));
            strength = int(self.request.get('strength' + player, default_value = '5'));
            agility = int(self.request.get('agility' + player, default_value = '5'));
            armor = int(self.request.get('armour' + player, default_value = '0'));
            charisma = int(self.request.get('charisma' + player, default_value = '5'));
            skill = int(self.request.get('skill' + player, default_value = '5'));
            constitution = int(self.request.get('constitution' + player, default_value = '5'));
            intelligence = int(self.request.get('intelligence' + player, default_value = '5'));
            resilience = int(self.request.get('resilience' + player, default_value = '0'));
            blocking = int(self.request.get('blocking' + player, default_value = '0'));
            critical = int(self.request.get('critical' + player, default_value = '10'));
            damage = [int(self.request.get('damage1' + player, default_value = '0')),
                      int(self.request.get('damage2' + player, default_value = '2'))];
            character = Character(id, id, level, hp, 0, strength, skill, agility, constitution, charisma, armor, intelligence, damage, resilience, blocking, critical)
        except:
            character = Character("gladiator", "gladiator", 1, 0, 0, 5, 5, 5, 5, 5, 0, 5, [0, 2], 0, 0, 10);
        return character;
    
    def get(self):
        context = {}
        path = os.path.join(TEMPLATE_DIRS, 'simulation.html')
        self.response.out.write(template.render(path, context))
        
    def post(self):
        version = self.request.get('version', default_value = '0.4.0');
        count = int(self.request.get('count'));
        if (count > 300):
            count = 300;                        
        challenger = self.populate('1');
        defender = self.populate('2');
        result = simulate(version, challenger, defender, count);
        self.response.out.write('%d|%d|%d' % result);
