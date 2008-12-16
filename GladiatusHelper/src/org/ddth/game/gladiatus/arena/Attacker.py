from google.appengine.api import urlfetch
from google.appengine.api import apiproxy_stub_map
from google.appengine.api import urlfetch_stub

import sys, re, sched, time, urllib, getopt
from org.ddth.game.gladiatus.core.GladiatusBot import GladiatusBot

class Attacker(GladiatusBot):
    
    def strike(self, player):
        self.player = player
        s = sched.scheduler(time.time, time.sleep)
        def loop():
            if self.attack(self.player):
                self.stable()
                sleep = self.seconds("work")
            else:
                sleep = max(self.seconds("arena"), self.seconds("work"))
                if sleep == 0:
                    sleep = 5
            self.sleep(sleep, loop)

        loop()
        self.run()

if __name__ == "__main__":
    try:
        opts, args = getopt.getopt(sys.argv[1:], "u:p:v:", ["username=", "password=", "victim="])
        message = ""
        for opt, arg in opts:
            if opt in ("-u", "--username"):
                username = arg                  
            elif opt in ("-p", "--password"):
                password = arg
            elif opt in ("-v", "--victim"):
                victim = arg

        apiproxy_stub_map.apiproxy = apiproxy_stub_map.APIProxyStubMap()
        apiproxy_stub_map.apiproxy.RegisterStub('urlfetch', urlfetch_stub.URLFetchServiceStub())
        
        attacker = Attacker("s1.gladiatus.vn", username, password);
        attacker.login()
        attacker.strike(victim);

    except getopt.GetoptError:
        print 'Usage: Attacker.py -u<username> -p<password> -v<victim>'
        print '-u, --username\t Username'
        print '-p, --password\t Password'
        print '-v, --victim\t Victim'
