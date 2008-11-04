import os

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

from org.ddth.game.gladiatus import TEMPLATE_DIRS

class DecisionHelper(webapp.RequestHandler):
    handlers = {};
    
    def register(self, module, handler):
        self.handlers[module] = handler;
    register = classmethod(register);
        
    def get(self, module):
        title = "Unknown";
        try:
            handler = DecisionHelper.handlers[module];
            if (handler):
                title = module;
        except:
            pass;

        context = {'title': title }
        path = os.path.join(TEMPLATE_DIRS, 'index.html')
        self.response.out.write(template.render(path, context))
    
    def post(self):
        try:
            handler = DecisionHelper.handlers[module];
            handler.handle(self, module);
        except:
            pass;
