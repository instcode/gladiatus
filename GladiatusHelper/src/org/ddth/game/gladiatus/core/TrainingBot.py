from google.appengine.api import urlfetch
from google.appengine.api import apiproxy_stub_map
from google.appengine.api import urlfetch_stub

import os, sys, re, sched, time, urllib, getopt
from org.ddth.game.gladiatus.core.GladiatusBot import GladiatusBot

class Questing:
    def __init__(self, description, ends):
        print description
        m = re.search("T.m (\d) (.*)", description)
        if m is not None:
            print "Find %s" % (repr(m.group(2)))
        m = re.search("Gi.t (\d) (.*)", description)
        if m is not None:
            print "Kill %s %s" % (m.group(1), m.group(2))
        m = re.search("K.t th.c t.i:([^\t]*)\t", ends)
        if m is not None:
            print "Ends %s" % (m.group(1).encode('latin1')) 

class TrainingBot(GladiatusBot):
    def where(self):
        self.location += 1
        if self.location > 7:
            self.location = 1
        return self.location
        
    def check_quest(self):
        def handler(http_result):
            quest_desc = self.soup.findAll('div', {"style": "clear: both;" })[0]
            quest_status = quest_desc.findAll('td', {"valign": "top", "width": "50%"})[0]
            contents = quest_status.findAll("td", {"valign": "top"})[0].contents
            self.quest = Questing(contents[2], contents[4])
            return True
    
        return self.invoke({
                "http_method": "GET",
                "http_url": 'http://%s/game/index.php?mod=tavern&sh=%s' % (self.server, self.sh),
                "handler": handler
            })
        
    def work(self, quest):
        self.location = 0
        def loop():
            # Receive quest if it's available
            self.receive_quest()
            # Try to get the number of expedition points left
            self.expedition()

            sleep = max(self.seconds("report"), self.seconds("work"))
            if sleep == 0:
                if (self.expedition_point >= self.max_point - 1) or (quest > 0 and self.expedition_point >= (self.max_point / 2)):
                #if (self.expedition_point >= self.max_point - 1) or (quest > 0 and self.expedition_point >= 10):
                    self.expedition(self.where())
                else:
                    self.attack("tiramisu", True)
                    self.attack("mimosa", True)
                    self.attack("maskman", True)
                    self.stable()
                sleep = max(self.seconds("report"), self.seconds("work"))
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
        #bot.check_quest()
        bot.work(quest)
        
    except getopt.GetoptError:
        print 'Usage: IdleBot.py -u<username> -p<password> -t<time>'
        print '-u, --username\t Username'
        print '-p, --password\t Password'


