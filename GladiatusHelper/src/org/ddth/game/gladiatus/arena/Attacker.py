from google.appengine.api import urlfetch
from google.appengine.api import apiproxy_stub_map
from google.appengine.api import urlfetch_stub

import sys, re, sched, time, urllib, getopt

class Protector:
    def __init__(self, username, password):
        self.username = username
        self.password = password
    
    def verify(self, content):
        if (re.search('"http://gladiatus.vn/game/index.php.mod=login"', content) is not None):
            form_fields = {
                "user": self.username,
                "pass": self.password,
            }
            form_data = urllib.urlencode(form_fields)
            result = urlfetch.fetch(url='http://s1.gladiatus.vn/game/index.php?mod=login',
                                    payload=form_data,
                                    method=urlfetch.POST,
                                    headers={'Content-Type': 'application/x-www-form-urlencoded'})
            try:
                self.sh = re.search('sh=([^&]*)&web_redirected=1', result.content).group(1)
                self.cookies = re.search('(Gladiatus=[^;,]*;) expire', result.headers['set-cookie']).group(1)
                # Do a redirect as if it's a normal user, well-behaved bot ;-)
                result = urlfetch.fetch(url=r'http://s1.gladiatus.vn/game/index.php?mod=overview&sh=' + self.sh + '&web_redirected=1',
                                        method=urlfetch.GET,
                                        headers={'Cookie': self.cookies});
                print "%s logged in successfully." % (self.username);
            except:
                print "Failed to log %s in!" % (self.username);
            return True
        return False
        
    def stable(self):
        form_fields = {
            "typ": "2",
            "az": "1",
            "dowork": "%C4%90i%21"
        }
        form_data = urllib.urlencode(form_fields)
        result = urlfetch.fetch(url='http://s1.gladiatus.vn/game/index.php?mod=work&sh=' + self.sh,
                                payload=form_data,
                                method=urlfetch.POST,
                                headers={'Content-Type': 'application/x-www-form-urlencoded', 'Cookie' : self.cookies})
        if (self.verify(result.content)):
            self.stable();
    
    def attack(self):
        form_fields = {
          "ujn": self.player,
        }
        form_data = urllib.urlencode(form_fields)
        result = urlfetch.fetch(url='http://s1.gladiatus.vn/game/index.php?mod=arena&sh=' + self.sh,
                                payload=form_data,
                                method=urlfetch.POST,
                                headers={'Content-Type': 'application/x-www-form-urlencoded', 'Cookie' : self.cookies})
        if (self.verify(result.content)):
            return self.attack()
        if re.search('mod=work&cancel=1', result.content) is not None:
            m = re.search("<span id='bx0'[^>]*>(\d\d):(\d\d):(\d\d)", result.content)
            ellapse = int(m.group(1)) * 3600 + int(m.group(2)) * 60 +  int(m.group(3))
            return ellapse - 1
        if re.search(r'Ti.{1,4}p t.{1,4}c t.{1,4}i ph.{1,4}n Tin Nh.{1,4}n', result.content) is not None:
            return 3600
        return 5
    
    def protect(self, player):
        self.player = player;
        self.verify('"http://gladiatus.vn/game/index.php?mod=login"')
        s = sched.scheduler(time.time, time.sleep)
        def loop():
            sleep = self.attack()
            if (sleep == 3600):
                print "Attacked %s successfully... Take a rest in horse stable..." % (player)
                self.stable()
            else:
                print "Cannot attack %s! Will try again in next %s seconds!" % (player, sleep)

            if s.empty():
                s.enter(sleep, 1, loop, ())
                s.run()
        loop()

if __name__ == "__main__":
    try:
        opts, args = getopt.getopt(sys.argv[1:], "u:p:v:", ["username=", "password=", "victim="])
        for opt, arg in opts:
            if opt in ("-u", "--username"):
                username = arg                  
            elif opt in ("-p", "--password"):
                password = arg
            elif opt in ("-v", "--victim"):
                victim = arg
    
        apiproxy_stub_map.apiproxy = apiproxy_stub_map.APIProxyStubMap()
        apiproxy_stub_map.apiproxy.RegisterStub('urlfetch', urlfetch_stub.URLFetchServiceStub())
        
        protector = Protector(username, password);
        protector.protect(victim);

    except getopt.GetoptError:
        print 'Usage: Protector.py -u<username> -p<password> -v<victim>'
        print '-u, --username\t Username'
        print '-p, --password\t Password'
        print '-v, --victim\t Victim'
