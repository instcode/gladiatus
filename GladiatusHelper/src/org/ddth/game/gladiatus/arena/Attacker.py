from google.appengine.api import urlfetch
from google.appengine.api import apiproxy_stub_map
from google.appengine.api import urlfetch_stub

import sys, re, sched, time, urllib, getopt
from org.ddth.game.gladiatus.core.GladiatusBot import GladiatusBot

class Attacker(GladiatusBot):
    
    def strike(self, player, message):
        self.player = player
        self.message = message
        s = sched.scheduler(time.time, time.sleep)
        def loop():
            sleep = self.attack(self.player) - 2
            if (sleep == 3600 - 2):
                self.log("Attacked %s successfully... Take a rest in horse stable..." % (player))
                self.stable()
                self.send(player, message)
            else:
                self.log("Cannot attack %s! Will try again in next %s seconds!" % (player, sleep))

            if s.empty():
                s.enter(sleep, 1, loop, ())
        loop()
        while True:
            s.run()

if __name__ == "__main__":
    try:
        opts, args = getopt.getopt(sys.argv[1:], "u:p:v:m:", ["username=", "password=", "victim=", "message="])
        message = ""
        for opt, arg in opts:
            if opt in ("-u", "--username"):
                username = arg                  
            elif opt in ("-p", "--password"):
                password = arg
            elif opt in ("-v", "--victim"):
                victim = arg
            elif opt in ("-m", "--message"):
                message = arg

        apiproxy_stub_map.apiproxy = apiproxy_stub_map.APIProxyStubMap()
        apiproxy_stub_map.apiproxy.RegisterStub('urlfetch', urlfetch_stub.URLFetchServiceStub())
        
        attacker = Attacker("s1.gladiatus.vn", username, password);
        attacker.login()
        attacker.strike(victim, message);

    except getopt.GetoptError:
        print 'Usage: Attacker.py -u<username> -p<password> -v<victim>'
        print '-u, --username\t Username'
        print '-p, --password\t Password'
        print '-v, --victim\t Victim'
        print '-m, --message\t Message'
