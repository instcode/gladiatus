from google.appengine.api import urlfetch
from google.appengine.api import apiproxy_stub_map
from google.appengine.api import urlfetch_stub

import os, sys, re, sched, time, urllib, getopt
from org.ddth.game.gladiatus.core.GladiatusBot import GladiatusBot

class TrainingBot(GladiatusBot):
    def work(self, quest):
        self.where = 1
        self.training_point = 12
        s = sched.scheduler(time.time, time.sleep)
        def loop():
            self.stats(2)
            self.receive_quest()
            if quest > 0 and self.training_point >= 2:
                sleep = self.quest(self.where)
                self.where += 1
                if self.where > 7:
                    self.where = 1
                self.training_point -= 2
            else:
                sleep = self.stable()
                self.training_point += 1
            s.enter(sleep, 1, loop, ())
        loop()
        while True:
            s.run()
        pass
    
if __name__ == "__main__":
    try:
        username = ""
        password = ""
        quest = False
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


