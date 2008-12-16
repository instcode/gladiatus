from google.appengine.api import urlfetch
from google.appengine.api import apiproxy_stub_map
from google.appengine.api import urlfetch_stub

import os, sys, re, sched, time, urllib, getopt, random, exceptions
from org.ddth.game.gladiatus.core.BeautifulSoup import BeautifulSoup

class GladiatusBot:
    def __init__(self, server, username, password):
        self.s = sched.scheduler(time.time, time.sleep)
        self.server = server
        self.username = username
        self.password = password
        self.cookies = ""
        self.sh = ""
        
        self.level = 0
        self.gold = 0
        self.ruby = 0
        self.centurion = False
        self.expedition_point = 0
        self.max_point = 12
        self.endings = {'arena': 0, 'work': 0, 'report': 0, 'tavern': 0, 'inventory': 0, 'auction': 0}
        self.victims = {}
    
    def sleep(self, duration, wake):
        self.log("Level: %s, Gold: %s, Ruby: %s" % (self.level, self.gold, self.ruby))
        self.log("Arena: %s, Work: %s, Expedition: %s" % (self.seconds("arena"), self.seconds("work"), self.seconds("report")))
        if duration <= 0:
            duration = max(self.seconds("work"), self.seconds("report"))
        self.s.enter(duration, 1, wake, ())
        self.log("Will wake up in %s seconds" % (duration))

    def run(self):
        self.s.run()
    
    def save(self, which, value):
        self.endings[which] = time.time() + value
    
    def seconds(self, which):
        return max(0, self.endings[which] - time.time())
    
    def format(secs):
        mins, secs = divmod(secs, 60)
        hours, mins = divmod(mins, 60)
        return '%02d:%02d:%02d' % (hours, mins, secs)

    def end(self, which):
        return time.strftime("%d/%m/%Y %H:%M:%S", time.localtime(self.endings[which]))
   
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
            if len(self.sh) > 0:
                self.overview(http_url, http_result)
            handler = service_descriptor['handler']
            if callable(handler):
                return handler(http_result)
        except KeyError:
            pass
        return True

    def overview(self, http_url, http_result):
        try:
            self.soup = BeautifulSoup(http_result.content)
            mod = re.search('mod=([^&]*)', http_url).group(1)
            self.gold = re.search('<span class="charvaluesSub" id="sstat_gold_val">([\.0-9]+)</span>', http_result.content).group(1)
            self.ruby = re.search('<span class="charvaluesSub" id="sstat_ruby_val">(\d+)</span>', http_result.content).group(1)
            self.level = re.search('<span class="charvaluesPre">Level:</span><span class="charvaluesSub">(\d+)</span>', http_result.content).group(1)
            m = re.search("<span id='bx0'[^>]*>(\d\d):(\d\d):(\d\d).*document.location=([^;]*);", http_result.content)
            if m is not None:
                second = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + int(m.group(3))
                d = re.search("'index.php\?mod=([^&]*)&", m.group(4))
                if (d is not None):
                    mod = d.group(1)
                self.save(mod, second)
        except:
            pass

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
                self.authorize()
            except:
                raise exceptions.Exception("Failed to log %s in server %s!" % (self.username, self.server));
        
        self.invoke({
                "http_method": "POST",
                "http_url": 'http://%s/game/index.php?mod=login' % (self.server),
                "http_form": {"user": self.username, "pass": self.password},
                "handler": handler
            })

    def authorize(self):
        """
        Description
            Check whether this bot has premium account or not
        """
        def handler(http_result):
            m = re.search('(\d+) ng.{1,3}y c.{1,3}n l.{1,3}i', http_result.content)
            if m is not None:
                self.centurion = True
                self.log('%s day(s) of centurion left.' % (m.group(1)))
            else:
                self.log('Not a centurion.')

        self.invoke({
                "http_method": "GET",
                "http_url": 'http://%s/game/index.php?mod=premium&submod=rubies&sh=%s' % (self.server, self.sh),
                "handler": handler
            })

    def stable(self):
        def handler(http_result):
            if self.seconds('work') > 0:
                self.log("Take a rest in horse stable...")
                return True
            return False

        return self.invoke({
                "http_method": "POST",
                "http_url": 'http://%s/game/index.php?mod=work&sh=%s' % (self.server, self.sh),
                "http_form": {"typ": "2", "az": "1", "dowork": "%C4%90i%21"},
                "handler": handler
            })
    
    def attack(self, player, bashing = False):
        def handler(http_result):
            if re.search(r'Ti.{1,4}p t.{1,4}c t.{1,4}i ph.{1,4}n Tin Nh.{1,4}n', http_result.content) is not None:
                self.log("Attacked %s successfully..." % (player))
                self.victims[player] = time.time() + 6*3600
                if bashing:
                    next = time.strftime("%d/%m/%Y %H:%M:%S", time.localtime(self.victims[player]))
                    self.log("Will try to attack %s again on %s" % (player, next))
                return True

            if re.search('b.{1,4}n th.{1,4}p h.{1,4}n 25 .{1,4}i.{1,4}m', http_result.content) is not None:
                self.log("Cannot attack %s because bot's HP is lower than 25.." % (player))
                self.save("arena", 15)
            elif re.search('K.{1,4} th.{1,4} c.{1,4}a b.{1,4}n v.{1,4}a tr.{1,4}i qua 1 cu.{1,4}c .{1,4}.{1,4}u', http_result.content) is not None:
                self.log("Cannot attack %s because your enemy has just been attacked..." % (player))
            elif re.search('K.{1,4} th.{1,4} c.{1,4}a b.{1,4}n qu.{1,4} y.{1,4}u .{1,4}u.{1,4}i', http_result.content) is not None:
                self.log("Cannot attack %s because your enemy is too weak..." % (player))
            else:
                self.log("Cannot attack %s because of ongoing task..." % (player))
            return False

        if self.victims.has_key(player):
            if bashing and time.time() <= self.victims[player]:
                return False

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

    def expedition(self, where = 0):
        """
        Mist Mountains: 1 - Harpy (Nguoi dan ba la loi), Medusa (Nguoi ran), Cerberus (Cho 3 dau), Minotaur (Qui dau trau)
        Dark Woods: 2 - Harpy, Medusa, Cerberus, Minotaur, Hog (?), Leopard (Bao), Bear (Gau), Wolf (Soi), Deserter (Ke dao ngu), Traditor (?), Rebel (Ke phien loan), Heretic (?)
        Barbarian Village: 3 - Barbarian (Ke man ro), Berserk (Ke dien loan), Vandal (Ke pha hoai), Deserter, Traditor, Rebel, Heretic"
        Bandit Camp: 4 - Bandit (Tho phi), Fled Slave (No le bo tron), Robber (Ke cuop), Out Law (Ke ngoai vong phap luat), Deserter, Traditor, Rebel, Heretic
        Ancient Temple: 5 - Guard (Bao ve), Body Guard (Linh gac), Mercenary (?), Constable (?), Deserter, Traditor, Rebel, Heretic
        Pirate Harbour: 6 - Pirate (Cuop bien), Smuggler (Ke buon lau), Deserter, Traditor, Rebel, Heretic
        Wolf Cave: 7 - Wolf, Deserter, Traditor, Rebel, Heretic
        """
        locations = ("Mist Mountains", "Dark Woods", "Barbarian Village", "Bandit Camp", "Ancient Temple", "Pirate Harbour", "Wolf Cave")
        if where > 0:
            def quest(http_result):
                analyze = re.search('mod=quest&submod=analyze', http_result.content)
                if analyze is not None:
                    return self.invoke({
                        "http_method": "POST",
                        "http_form": {"analyze": 1, "loc": where},
                        "http_url": 'http://%s/game/index.php?mod=quest&submod=analyze&sh=%s' % (self.server, self.sh),
                        "handler": quest
                    })
                elif self.seconds("report") > 0:
                    self.log("Training at %s location..." % (locations[where - 1]))
                    return True
                return False
            
            return self.invoke({
                "http_method": "GET",
                "http_url": 'http://%s/game/index.php?mod=location&loc=%d&d=1&sh=%s' % (self.server, where, self.sh),
                "handler": quest
            })
        else:
            def handler(http_result):
                points = re.search('<label for="mjz">[^:]*: (\d+) / (\d+)</label>', http_result.content)
                if points is not None:
                    self.expedition_point = int(points.group(1))
                    self.max_point = int(points.group(2))
                    self.log("Expedition point: %s / %s" % (self.expedition_point, self.max_point))
                else:
                    self.log("Cannot get the expedition points right now...")
            
            where = random.randint(1, 7);
            return self.invoke({
                    "http_method": "GET",
                    "http_url": 'http://%s/game/index.php?mod=location&loc=%d&sh=%s' % (self.server, where, self.sh),
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
            m = re.search('value="([^"]*)" name="dif3"', http_result.content)
            if m is not None:
                return self.invoke({
                    "http_method": "POST",
                    "http_url": 'http://%s/game/index.php?mod=tavern&sh=%s' % (self.server, self.sh),
                    "http_form": {"dif3": m.group(1)},
                    "handler": lambda http_result: self.log("Received quest successfully...") 
                })
            return True
    
        return self.invoke({
                "http_method": "GET",
                "http_url": 'http://%s/game/index.php?mod=tavern&sh=%s' % (self.server, self.sh),
                "handler": handler
            })

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
        
        content = "http://s1.gladiatus.vn/game/index.php?mod=report&beid=2085953&sh=705d15ac254dcd758185fcd90a3e6f56"
        m = re.search('mod=([^&]*)', content)
        print m.group(1)
        content = "http://s1.gladiatus.vn/game/index.php?beid=2085953&sh=705d15ac254dcd758185fcd90a3e6f56&mod=login"
        m = re.search('mod=([^&]*)', content)
        print m.group(1)
        #strftime('%H:%M.%S')

        #bot = GladiatusBot(server, username, password)
        #bot.login()
        #bot.stable()
        
    except getopt.GetoptError:
        print 'What''s up?'
