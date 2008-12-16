from google.appengine.api import urlfetch
from google.appengine.api import apiproxy_stub_map
from google.appengine.api import urlfetch_stub

import sys, re, sched, time, urllib, getopt
from org.ddth.game.gladiatus.core.GladiatusBot import GladiatusBot

class Attacker():
    def __init__(self, usernames, passwords):
        attackers = [ GladiatusBot(username, password) for username, password in usernames, password]
        pass
    
    def language(self):
        fin = None
        fout = None
        try:
            fin = open("input.txt", "r")
            first = fin.readline()        # read line with "\n" at end, "" (False) on EOF
            print "First line:", line
            for line in fin:              # implements iterator interface (readline loop)
                fout.write(line)
        except IOError, e:
            print "Error in file IO: ", e

        if fin: fin.close()
        
    def load(self):
        fin = None
        fout = None
        try:
            fin = open("input.txt", "r")
            fout = open("output.txt", "w")
            first = fin.readline()        # read line with "\n" at end, "" (False) on EOF
            print "First line:", line
            for line in fin:              # implements iterator interface (readline loop)
                fout.write(line)
        except IOError, e:
            print "Error in file IO: ", e

        if fin: fin.close()
        if fout: fout.close()  

    def strike(self):
        pass

if __name__ == "__main__":
    try:
        apiproxy_stub_map.apiproxy = apiproxy_stub_map.APIProxyStubMap()
        apiproxy_stub_map.apiproxy.RegisterStub('urlfetch', urlfetch_stub.URLFetchServiceStub())
        
        usernames = ("ethereal", "wireshark")
        password = ("password", "password")
        attackers = Attackers("s1.gladiatus.vn", usernames, passwords);
        attackers.login()
        attackers.strike(victim);

    except getopt.GetoptError:
        print 'Usage: Attackers.py -ul<username-list> -pl<password-list> -vl<victim-list>'
        print '-ul, --usernames\t List of usernames'
        print '-pl, --passwords\t List of passwords'
        print '-vl, --victims\t List of victims'
