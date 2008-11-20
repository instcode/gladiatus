from google.appengine.api import urlfetch
from google.appengine.api import apiproxy_stub_map
from google.appengine.api import urlfetch_stub

import os, sys, re, sched, time, urllib, getopt, exceptions

class GladiatusBot:
    def __init__(self, server, username, password, centurion):
        self.server = server
        self.username = username
        self.password = password
        self.centurion = centurion
        self.cookies = ""
        self.sh = ""
    
    def log(self, message):
        print '[' + time.strftime("%Y-%m-%d %H:%M:%S") + ']: ' + message 

    def invoke(self, service_descriptor):
        """
        Description
            The invocation will try to log the bot in if it it's not, then make
            a blocking http-request to gladiatus server by using the information
            in the given service descriptor. 
        Parameters
            service_descriptor: A dictionary which contains the necessary request
                information, includes:
                    http_method : Should be in (GET, POST, HEAD, PUT, DELETE)
                    http_url    : Requesting url
                    http_form   : A dictionary which contains http form data
                    handler     : A handler if the request is 
        """
        http_method = service_descriptor['http_method']
        http_url = service_descriptor['http_url']
        try:
            http_form = urllib.urlencode(service_descriptor['http_form'])
        except:
            http_form = None

        http_result = urlfetch.fetch(url=http_url,
                                payload=http_form,
                                method=urlfetch._URL_STRING_MAP[http_method],
                                headers={'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': self.cookies})

        domain = '.'.join(self.server.split('.')[1:])
        # Re-login if needs
        if (re.search('"http://%s/game/index.php.mod=login"' % (domain), http_result.content) is not None):
            self.login()
            # Try to the execute service again
            return self.invoke(service_descriptor)
        try:
            handler = service_descriptor['handler']
            if callable(handler):
                return handler(http_result)
        except:
            pass
        return -1
    
    def login(self):
        """
        Description
            Login process.
        Parameters
            server: server where the bot account is located.
                Should be formed as "s1.gladitus.vn", "s2.gladitus.com"...  
        """
        def handler(http_result):
            try:
                self.sh = re.search('sh=([^&]*)&web_redirected=1', http_result.content).group(1)
                self.cookies = re.search('(Gladiatus=[^;,]*;) expire', http_result.headers['set-cookie']).group(1)
                # Do a redirect as if it's a normal user, well-behaved bot ;-)
                self.invoke({
                        "http_method": "GET",
                        "http_url": 'http://%s/game/index.php?mod=overview&sh=%s&web_redirected=1' % (self.server, self.sh),
                    })
                self.log("%s logged in %s successfully." % (self.username, self.server));
            except:
                raise exceptions.Exception("Failed to log %s in server %s!" % (self.username, self.server));
        
        self.invoke({
                "http_method": "POST",
                "http_url": 'http://%s/game/index.php?mod=login' % (self.server),
                "http_form": {"user": self.username, "pass": self.password},
                "handler": handler
            })

    def remain(self, content):
        #Horse: re.search('mod=work&cancel=1', content)
        m = re.search("<span id='bx0'[^>]*>(\d\d):(\d\d):(\d\d)", content)
        remaining = -1
        if m is not None:
            remaining = int(m.group(1)) * 3600 + int(m.group(2)) * 60 +  int(m.group(3))
            self.log("Remaining time is %s:%s:%s " % (m.group(1), m.group(2), m.group(3)))
        return remaining

    def stable(self):
        def handler(http_result):
            remaining = self.remain(http_result.content)
            if remaining >= 0:
                return remaining
            return 3600

        return self.invoke({
                "http_method": "POST",
                "http_url": 'http://%s/game/index.php?mod=work&sh=%s' % (self.server, self.sh),
                "http_form": {"typ": "2", "az": "1", "dowork": "%C4%90i%21"},
                "handler": handler
            })
    
    def attack(self, player):
        def handler(http_result):
            remaining = self.remain(http_result.content)
            if remaining >= 0:
                return remaining
            if re.search(r'Ti.{1,4}p t.{1,4}c t.{1,4}i ph.{1,4}n Tin Nh.{1,4}n', http_result.content) is not None:
                return 3600
            return 5

        return self.invoke({
                "http_method": "POST",
                "http_url": 'http://%s/game/index.php?mod=arena&sh=%s' % (self.server, self.sh),
                "http_form": {"ujn": player},
                "handler": handler
            })
    
    def send(self, player, message):
        if message == "":
            return

        return self.invoke({
                "http_method": "POST",
                "http_url": 'http://%s/game/index.php?mod=messages&sh=%s' % (self.server, self.sh),
                "http_form": {"data1": player, "betreff": message, "text": "", "submod": "new"},
                "handler": ""
            })
    
    def bid(self, item_id, price):
        pass
    
    def quest(self, where):
        """
        Mist Mountains: 1 - Harpy (Nguoi dan ba la loi), Medusa (Nguoi ran), Cerberus (Cho 3 dau), Minotaur (Qui dau trau)
        Dark Woods: 2 - Harpy, Medusa, Cerberus, Minotaur, Hog (?), Leopard (Bao), Bear (Gau), Wolf (Soi), Deserter (Ke dao ngu), Traditor (?), Rebel (Ke phien loan), Heretic (?)
        Barbarian Village: 3 - Barbarian (Ke man ro), Berserk (Ke dien loan), Vandal (Ke pha hoai), Deserter, Traditor, Rebel, Heretic"
        Bandit Camp: 4 - Bandit (Tho phi), Fled Slave (No le bo tron), Robber (Ke cuop), Out Law (Ke ngoai vong phap luat), Deserter, Traditor, Rebel, Heretic
        Acient Temple: 5 - Guard (Bao ve), Body Guard (Linh gac), Mercenary (?), Constable (?), Deserter, Traditor, Rebel, Heretic
        Pirate Harbour: 6 - Pirate (Cuop bien), Smuggler (Ke buon lau), Deserter, Traditor, Rebel, Heretic
        Wolf Cave: 7 - Wolf, Deserter, Traditor, Rebel, Heretic
        """
        locations = ("Mist Mountains", "Dark Woods", "Barbarian Village", "Bandit Camp", "Acient Temple", "Pirate Harbour", "Wolf Cave")
        def handler(http_result):
            ellapse = self.remain(http_result.content)
            if ellapse == -1:
                if centurion:
                    ellapse = 5 * 60
                else:
                    ellapse = 10 * 60
                self.log("Training at %s... Will wake up in 10 minutes next." % (locations[where - 1]))
            return ellapse

        return self.invoke({
                "http_method": "GET",
                "http_url": r'http://%s/game/index.php?mod=location&loc=%d&d=1&sh=%s' % (self.server, where, self.sh),
                "handler": handler
            })
        
    def stats(self, which):
        """
        Description
            Train a primary stat
        Parameters
            which: Which stat to be trained? Range of values
                1: Strength
                2: Skill
                3: Agility
                4: Constitution
                5: Charisma
        """
        stats = ("Strength", "Skill", "Agility", "Constitution", "Charisma")
        def handler(http_result):
            self.log("Trained [%s] stats successfully..." % (stats[which - 1]))
        
        return self.invoke({
                "http_method": "GET",
                "http_url": 'http://%s/game/index.php?mod=training&b=%d&sh=%s' % (self.server, which, self.sh),
                "handler": handler
            })
    
    def receive_quest(self):
        def handler(http_result):
            remaining = self.remain(http_result.content)
            if remaining <= 0:
                m = re.search('value="([^"]*)" name="dif3"', http_result.content)
                if m is not None:
                    self.log("Received quest successfully...")
                    return self.invoke({
                        "http_method": "POST",
                        "http_url": 'http://%s/game/index.php?mod=tavern&sh=%s' % (self.server, self.sh),
                        "http_form": {"dif3": m.group(1)}
                    })
            else:
                self.log("Remaining time until you get new quest is %s", remaining)
                return remaining
    
        return self.invoke({
                "http_method": "GET",
                "http_url": 'http://%s/game/index.php?mod=tavern&sh=%s' % (self.server, self.sh),
                "handler": handler
            })

    def view_auction(self):
        pass

if __name__ == "__main__":
    try:
        apiproxy_stub_map.apiproxy = apiproxy_stub_map.APIProxyStubMap()
        apiproxy_stub_map.apiproxy.RegisterStub('urlfetch', urlfetch_stub.URLFetchServiceStub())
        
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
        
        bot = GladiatusBot(server, username, password, False)
        bot.login()
        bot.attack("")
        
    except getopt.GetoptError:
        print 'What''s up?'


