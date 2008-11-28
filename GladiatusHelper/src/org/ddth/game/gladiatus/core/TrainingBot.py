from google.appengine.api import urlfetch
from google.appengine.api import apiproxy_stub_map
from google.appengine.api import urlfetch_stub

import os, sys, re, sched, time, urllib, getopt
from org.ddth.game.gladiatus.core.GladiatusBot import GladiatusBot

class TrainingBot(GladiatusBot):
    def where(self):
        self.location += 1
        if self.location > 7:
            self.location = 1
        return self.location
    
    def work(self, quest):
        self.location = 0
        def loop():
            sleep = 0
            # Receive quest if it's available
            self.receive_quest()
            # Try to get the number of expedition points left
            if self.ongoing[2] != 'report': 
                sleep = self.expedition(1, 0)
            if quest > 0 and self.expedition_point >= (self.max_point / 2):
                sleep = self.expedition(self.where(), 1)
            else:
                sleep = self.stable()
            self.sleep(sleep, loop)

        # Start working
        loop()
        self.run()
    
if __name__ == "__main__":
    try:
        username = ""
        password = ""
        quest = 0
        opts, args = getopt.getopt(sys.argv[1:], "s:u:p:q:", ["server=", "username=", "password=", "quest="])
        for opt, arg in opts:
            if opt in ("-s", "--server"):
                server = arg
            if opt in ("-u", "--username"):
                username = arg                  
            elif opt in ("-p", "--password"):
                password = arg
            elif opt in ("-q", "--quest"):
                quest = int(arg)

        apiproxy_stub_map.apiproxy = apiproxy_stub_map.APIProxyStubMap()
        apiproxy_stub_map.apiproxy.RegisterStub('urlfetch', urlfetch_stub.URLFetchServiceStub())
        
        bot = TrainingBot(server, username, password)
        bot.login()
        bot.work(quest)
        
    except getopt.GetoptError:
        print 'Usage: IdleBot.py -u<username> -p<password> -t<time>'
        print '-u, --username\t Username'
        print '-p, --password\t Password'


